## Tiny Headless CMS

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
