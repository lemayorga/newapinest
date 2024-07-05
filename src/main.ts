import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { testConnection } from './database/database.provider';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    setupSwagger(app);
    
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
