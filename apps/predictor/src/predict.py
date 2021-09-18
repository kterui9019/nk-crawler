import pickle
import pandas as pd
import category_encoders as ce

data = pd.read_csv('/root/src/target.csv')

# 馬番は予測には不要
df = data.drop('horse_number', axis=1)

list_cols = ['sex', 'jockey_id', 'trainer_id', 'start_time', 'cource', 'direction', 'weather', 'going', 'field', 'conditions', 'class', 'race_weight', 'r2_jockey_id', 'r2_trainer_id', 'r2_name', 'r2_start_time', 'r2_cource', 'r2_direction', 'r2_weather', 'r2_going', 'r2_field', 'r2_conditions', 'r2_class', 'r2_race_weight']
ce_oe = ce.OrdinalEncoder(cols=list_cols,handle_unknown='impute')
df = ce_oe.fit_transform(df)

# 年月日を別カラムに分ける
df['year'] = pd.to_datetime(df['date']).dt.year
df['month'] = pd.to_datetime(df['date']).dt.month
df['day'] = pd.to_datetime(df['date']).dt.day

df['r2_year'] = pd.to_datetime(df['r2_date']).dt.year
df['r2_month'] = pd.to_datetime(df['r2_date']).dt.month
df['r2_day'] = pd.to_datetime(df['r2_date']).dt.day

df = df.drop(['date', 'r2_date'], axis=1)

with open('/root/src/model.pickle', mode='rb') as fp:
	model = pickle.load(fp)

# result = [model.predict(df), data['horse_number']]
data['predict'] = model.predict(df)
data = data.sort_values('predict', ascending=False)
data.to_csv('root/src/result.csv', columns=['horse_number', 'predict'], index=False)