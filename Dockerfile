# Esta línea especifica la imagen base para la imagen Docker. En este caso, estamos usando una imagen runtime oficial de Node.js con la versión 18.
FROM node:18-bullseye as BUILDER

ENV NODE_ENV development

# Create app-node directory
# Esta línea establece el directorio de trabajo dentro del contenedor a /app-node
# Aquí es donde copiaremos el código de nuestra aplicación y donde se # ejecutará la aplicación. 
WORKDIR /app-node

# Bundle app source
# Copia el resto del código de tu aplicación al contenedor 
COPY . .

# Instala las dependencias de la aplicación 
RUN npm install 
RUN npm uninstall bcrypt
RUN npm install bcrypt
EXPOSE 3000

#------------------------------
FROM node:18-bullseye as PRODUCTION

ENV NODE_ENV production
WORKDIR /app-node

COPY --from=BUILDER  /app-node/package.json ./
COPY --from=BUILDER  /app-node/dist ./dist
COPY --from=BUILDER  /app-node/node_modules ./node_modules


# Start the server 
# Define el comando para ejecutar tu aplicación 
CMD [ "npm", "start" ]


