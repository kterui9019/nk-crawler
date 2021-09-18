(ns jdbc.main
(:require [clojure.java.jdbc :as j])
(:require [clojure.java.io :as io])
)

(def mysql-db {:subprotocol "mysql"
               :subname "//127.0.0.1:3306/umacopy?useSSL=false"
               :user "root" 
               })

(defn toCsv [histories]
  (with-open [w (io/writer  "../../out/horseRaceHistory.csv" :append true)]
    (doseq [{:keys [horse-id race-id before-race-id]} histories]
      (.write w (str (java.util.UUID/randomUUID) "," horse-id "," race-id "," before-race-id "\n")))))

(defn create-race-history [horse-races]
  (->> (reduce
        #(conj %1 {:horse-id (:horse-id %2) :race-id (:race-id %2) :before-race-id (:race-id (last %1))})
        []
        horse-races)
       (drop 1)))

(defn get-all-horse-races []
  (j/query mysql-db [(str "SELECT rr.horse_id as `horse-id`, r.id as `race-id` 
			FROM raceResult rr
				INNER JOIN race r ON r.id = rr.race_id
			ORDER BY r.date")]))

(defn build-history-by-horse-id [horse-races]
  (when (< 1 (count horse-races))
    (-> (create-race-history horse-races)
        (toCsv))))

(defn -main [& _]
  (io/delete-file "../../out/horseRaceHistory.csv" true)
  (->> (get-all-horse-races)
       (group-by :horse-id)
       (vals)
       (run! #(build-history-by-horse-id %))))