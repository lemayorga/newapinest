import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { testConnection } from './database/database.provider';
import { useContainer } from 'class-validator';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Commun API')
      .setDescription('API with nestjs')
      .setVersion('1.0')
      // .setBasePath('api')
      .build();
    
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  
    useContainer(app.select(AppModule),  { fallback: true , fallbackOnErrors: true});
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    
    const port = process.env.APP_PORT || 3000;
    await app.listen(port, () => console.log(`App listening at http://localhost:${port}`) );
    await  testConnection();

  }catch(error){
    console.error({ err: error });
    process.exit();
  }
}
bootstrap();
