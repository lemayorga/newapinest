import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { testConnection } from './database/database.provider';
import { colours } from './core/colours';
import { Envs } from './config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    setupSwagger(app);
    
    useContainer(app.select(AppModule),  { fallback: true , fallbackOnErrors: true});
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    
    const port = Envs.APP_PORT;
    await app.listen(port, () => console.log(colours.BgBlack, colours.FgBlue, `App listening at http://localhost:${port}`, colours.reset) );
    await  testConnection();
  }catch(error){
    console.error(colours.BgBlack, colours.FgRed,{ err: error }, colours.reset);
    process.exit();
  }
}
bootstrap();
