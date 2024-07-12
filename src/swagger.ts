import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Envs } from "./config";

export function setupSwagger(app: INestApplication) {
    const options = new DocumentBuilder()
        .setTitle(Envs.APP_TITLE)
        .setDescription(Envs.APP_DESCRIPTION)
        .setVersion(Envs.AP_VERSION)
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
}