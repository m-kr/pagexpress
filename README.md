## Pagexpress - build page structure the same as building constructions from Lego 🧱
Application allows creating JSON with page structure which could be used the sam offline as online as a headless CMS. 
Project built on NodeJS + VueJS tech-stack.

### Run
Docker mongodb image
```shell script
docker-compose up
```

Nodejs server
```shell script
npm i
npm start
```

### Endpoints
API is located on the localhost:3000/v1, with entry REST points:
* /page-structure/ _{GET}_
* /pages/ _{CRUD}_
* /fields/ _{CRUD}_
* /components/ _{CRUD}_
