
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
  <a href="https://www.postgresql.org/" target="blank"><img src="https://www.svgrepo.com/show/303301/postgresql-logo.svg" width="200" alt="Postgresql Logo" /></a>
   <a href="https://sequelize.org/" target="blank"><img src="https://brandslogos.com/wp-content/uploads/images/large/sequelize-logo-vector.svg" width="160" alt="Sequelize Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar
```
npm install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```
4. Clonar el archivo __.env.template__ y renombrar la copa a __.env__

5. Llenar las variables de entorno defindas
en el __.env__

6. Levantar la base de datos
```
docker-compose up -d
```

7. Ejecutar las migraciones
```
npm run migrate up
npm run migrate up NODE_ENV=dev|test|prod
```
8. Ejecutar los seeders
```
npm run migrate seed
```

9. Ejecutar la aplicación en dev:
```
npm run start:dev
```
<!-- 10. Reconstruir la base de datos 
```
 Ejecutar script src\database\scripts\*.sql
``` -->
# Crear un nuevo archivo migracion
```
npm run  migrate:create --name="migration.{{nombre_definir}}.ts"
```
# Crear un nuevo archivo seed
```
npm run  seed:create --name="seed.{{nombre_definir}}.ts"
```
# Construir la imagen
```
docker compose build 
```

# Ejecutar el docker file
```
   docker build -t nestjs-app .

   docker run --rm -it -p 3000:3000 nestjs-app
```

# Ejecutar el docker file
```
   docker build -t nestjs-app .

   docker run --rm -it -p 3000:3000 nestjs-app
```

# Ejecutar test
```
npm run test
```


## Stack usado
* Postgres
* Nest js
* Sequelize 
* Handlebars