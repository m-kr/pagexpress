mongodump
docker-compose exec -T mongo mongodump --uri="mongodb://root:root@0.0.0.0:27017/local?authSource=admin" --archive=dump.gz
docker cp $(docker-compose ps -q mycontainer):dump.gz .  

mongorestore
docker-compose exec -T mongo mongorestore --uri="mongodb://root:root@0.0.0.0:27017/local?authSource=admin" --archive --gzip < dump/dump.gz

