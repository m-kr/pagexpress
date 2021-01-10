## Pagexpress
### Build page in the same way as building constructions from Lego 🧱
Application allows creating JSON with page structure which could be used the sam offline as online as a headless CMS. 
Project built on NodeJS + VueJS tech-stack.

### .env file config
Specify environment variables in .env file located in root directory. Example config
```
DB_HOST=0.0.0.0
DB_PORT=27017
DB_USER=root
DB_PASS=root           
APP_PORT=4000
API_URL=http://127.0.0.1:4000/v1
PAGEXPRESS_JWT_PRIVATE_KEY=mysecretword
```

### Run
Docker mongodb image
```shell script
docker-compose up
```

Nodejs server
```shell script
cd server
npm i
npm run dev
```

Client server
```shell script
cd client
npm i
npm run dev
```
