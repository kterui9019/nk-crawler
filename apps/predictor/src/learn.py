import pandas as pd
import category_encoders as ce
import datetime as dt
import datetime as dt
import lightgbm as lgb
import pickle
from sklearn.model_selection import train_test_split

pd.set_option('display.max_rows', 500)
data = pd.read_csv('/root/src/dataset.tsv', delimiter='\t')

# 序数をカテゴリに付与して変換
list_cols = ['sex', 'jockey_id', 'trainer_id', 'start_time', 'cource', 'direction', 'weather', 'going', 'field', 'conditions', 'class', 'race_weight', 'r2_jockey_id', 'r2_trainer_id', 'r2_name', 'r2_start_time', 'r2_cource', 'r2_direction', 'r2_weather', 'r2_going', 'r2_field', 'r2_conditions', 'r2_class', 'r2_race_weight']
ce_oe = ce.OrdinalEncoder(cols=list_cols,handle_unknown='impute')
df = ce_oe.fit_transform(data)

# 年月日を別カラムに分ける

df['year'] = pd.to_datetime(df['date']).dt.year
df['month'] = pd.to_datetime(df['date']).dt.month
df['day'] = pd.to_datetime(df['date']).dt.day

df['r2_year'] = pd.to_datetime(df['r2_date']).dt.year
df['r2_month'] = pd.to_datetime(df['r2_date']).dt.month
df['r2_day'] = pd.to_datetime(df['r2_date']).dt.day

df = df.drop(['date', 'r2_date'], axis=1)

# 3位以内を1とし、それ以上の順位は0とする
df = df.assign(target = (df['order'] <= 3).astype(int))

train_set, test_set = train_test_split(df, test_size=0.2, random_state=0)

x_train = train_set.drop(['target', 'order'], axis=1)
y_train = train_set['target']

x_test = test_set.drop(['target', 'order'], axis=1)
y_test = test_set['target']

lgb_train = lgb.Dataset(x_train, y_train)
lgb_eval = lgb.Dataset(x_test, y_test, reference=lgb_train)

params = {
    'objective': 'binary',
    'metric': 'auc'
}

model = lgb.train(params, train_set=lgb_train, valid_sets=lgb_eval, verbose_eval=10)

with open('/root/src/model.pickle', mode='wb') as fp:
	pickle.dump(model, fp)