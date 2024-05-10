import { IsString, IsNumber , validateSync, IsEnum} from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Environment } from './enviroments';

class EnvironmentVariables {

  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsString({ message: 'Invalid AP_NAME' })
  AP_NAME: string;

  @IsString({ message: 'Invalid AP_VERSION' })
  AP_VERSION: string;

  @IsString({ message: 'Invalid APP_TITLE' })
  APP_TITLE: string;

  // **** DataBase
  @IsString({ message: 'Invalid DB_USER' })
  DB_USER: string;
  
  @IsString({ message: 'Invalid DB_PASSWORD' })
  DB_PASSWORD: string;

  @IsString({ message: 'Invalid DB_HOST' })
  DB_HOST: string;

  @IsString({ message: 'Invalid DB_NAME' })
  DB_NAME: string;

  @IsNumber()
  DB_PORT: number;


  // **** User default
  @IsString({ message: 'Invalid DEFAULT_USER' })
  DEFAULT_USER: string;

  @IsString({ message: 'Invalid DEFAULT_USER_EMAIL' })
  DEFAULT_USER_EMAIL: string;

  @IsString({ message: 'Invalid DEFAULT_USER_PASSWORD' })
  DEFAULT_USER_PASSWORD: string;

  
  // **** Security
  @IsString({ message: 'Invalid ALGORITHM' })
  ALGORITHM: string;

  @IsString({ message: 'Invalid JWT_SECRET_KEY' })
  JWT_SECRET_KEY: string;

  @IsString({ message: 'Invalid JWT_REFRESH_SECRET_KEY' })
  JWT_REFRESH_SECRET_KEY: string;

  @IsString({ message: 'Invalid JWT_REFRESH_SECRET' })
  JWT_REFRESH_SECRET: string;

  @IsString({ message: 'Invalid ACCESS_TOKEN_EXPIRE_MINUTES' })
  ACCESS_TOKEN_EXPIRE_MINUTES: string;

  @IsString({ message: 'Invalid REFRESH_TOKEN_EXPIRE_MINUTES' })
  REFRESH_TOKEN_EXPIRE_MINUTES: string;

  // **** Mail
  @IsString({ message: 'Invalid MAIL_HOST' })
  MAIL_HOST: string;

  @IsString({ message: 'Invalid MAIL_USER' })
  MAIL_USER: string;

  @IsString({ message: 'Invalid MAIL_PASSWORD' })
  MAIL_PASSWORD: string;

  @IsString({ message: 'Invalid MAIL_FROM' })
  MAIL_FROM: string;

  @IsNumber()
  MAIL_PORT: number;

  @IsString({ message: 'Invalid MAIL_TRANSPORT' })
  MAIL_TRANSPORT: string;
}

export const EnvCofigName = {
  AP_NAME: 'AP_NAME',
  AP_VERSION: 'AP_VERSION',
  APP_TITLE: 'APP_TITLE',
  APP_DESCRIPTION: 'APP_DESCRIPTION',
  APP_PORT: 'APP_PORT',
  
  DB_USER: 'DB_USER',
  DB_PASSWORD: 'DB_PASSWORD',
  DB_HOST: 'DB_HOST',
  DB_NAME: 'DB_NAME',
  DB_PORT: 'DB_PORT',

  DEFAULT_USER: 'DEFAULT_USER',
  DEFAULT_USER_EMAIL: 'DEFAULT_USER_EMAIL',
  DEFAULT_USER_PASSWORD: 'DEFAULT_USER_PASSWORD',

  ALGORITHM: 'ALGORITHM',
  JWT_SECRET_KEY: 'JWT_SECRET_KEY',
  JWT_REFRESH_SECRET: 'JWT_REFRESH_SECRET',
  JWT_REFRESH_SECRET_KEY: 'JWT_REFRESH_SECRET_KEY',
  ACCESS_TOKEN_EXPIRE_MINUTES: 'ACCESS_TOKEN_EXPIRE_MINUTES',
  REFRESH_TOKEN_EXPIRE_MINUTES: 'REFRESH_TOKEN_EXPIRE_MINUTES',

  MAIL_HOST: 'MAIL_HOST',
  MAIL_USER: 'MAIL_USER',
  MAIL_PASSWORD: 'MAIL_PASSWORD',
  MAIL_FROM: 'MAIL_FROM',
  MAIL_PORT: 'MAIL_PORT',
  MAIL_TRANSPORT: 'MAIL_TRANSPORT'
}


export const validate = (config: Record<string, unknown>) => {
  
    // `plainToClass` to converts plain object into Class
    const validatedConfig = plainToClass(
      EnvironmentVariables, 
      config, {
        enableImplicitConversion: true,
    });
   
    // `validateSync` method validate the class and returns errors
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });
  
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  };