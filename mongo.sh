mongodump 
docker-compose exec -T mongo mongodump --uri="mongodb://root:root@0.0.0.0:27017/local?authSource=admin" --gzip --archive="./dump/db_bak.gz"
docker cp $(docker-compose ps -q mongo):dump/db_bak.gz ./dump/

mongorestore
docker cp dump/db_bak.gz $(docker-compose ps -q mongo):./dump/
docker-compose exec -T mongo mongorestore --uri="mongodb://root:root@0.0.0.0:27017/local?authSource=admin" --gzip --archive="./dump/db_bak.gz"

