import { join } from "path";
import * as dotenv from 'dotenv';
import { EnvironmentVariables } from "./environment.validation";

dotenv.config({ path: getEnvPath() });

export enum Environment {
    Development = "development",
    Production = "prod",
    Test = "test",
}

export const Envs  = {
    NODE_ENV :  getEnviroment(`${process.env.NODE_ENV}`),
    AP_NAME :  `${process.env.AP_NAME}`,
    APP_TITLE :  `${process.env.APP_TITLE}` || 'API',
    AP_VERSION :  `${process.env.AP_VERSION}` || '1.0',
    APP_DESCRIPTION :  `${process.env.APP_DESCRIPTION}` || 'API Documentation',
    APP_PORT: +`${process.env.APP_POR}` || 3000,

    DIALECT:  `${process.env.DIALECT}`,
    DB_HOST:  `${process.env.DB_HOST}`,
    DB_PORT :  +`${process.env.DB_PORT}`,
    DB_NAME :  `${process.env.DB_NAME}`,    
    DB_USER :  `${process.env.DB_USER}`,
    DB_PASSWORD :  `${process.env.DB_PASSWORD}`,

    DEFAULT_USER :  `${process.env.DEFAULT_USER}`,
    DEFAULT_USER_EMAIL :  `${process.env.DEFAULT_USER_EMAIL}`,
    DEFAULT_USER_PASSWORD :  `${process.env.DEFAULT_USER_PASSWORD}`,
  
    ALGORITHM :  `${process.env.ALGORITHM}`,
    JWT_SECRET_KEY :  `${process.env.JWT_SECRET_KEY}`,
    JWT_REFRESH_SECRET_KEY :  `${process.env.JWT_REFRESH_SECRET_KEY}`,
    ACCESS_TOKEN_EXPIRE_MINUTES :  `${process.env.ACCESS_TOKEN_EXPIRE_MINUTES}`,
  
    MAIL_HOST :  `${process.env.MAIL_HOST}`,
    MAIL_USER :  `${process.env.MAIL_USER}`,
    MAIL_PASSWORD :  `${process.env.MAIL_PASSWORD}`,
    MAIL_FROM :  `${process.env.MAIL_FROM}`,  
    MAIL_PORT :  +`${process.env.MAIL_PORT}`,
    MAIL_TRANSPORT :  `${process.env.MAIL_TRANSPORT}`
  
} as EnvironmentVariables;



export function getEnvPath(): string {
    const filename: string = `.env${(process.env.NODE_ENV ? ("."  + process.env.NODE_ENV) : "")}`.replace('.development',''); 
    const filePath: string = join(process.cwd(), 'environment', filename);
    return filePath;
}

function getEnviroment  (NodeEnv: string)  {
    NodeEnv = NodeEnv || 'dev';
    if(['test', 'testing' ].includes(NodeEnv)) return Environment.Test;  
    if(['prod', 'production' ].includes(NodeEnv)) return Environment.Production;  
    return Environment.Development;
  }
                                               


function  evaluateChangeArgEnv() {
    const args = process.argv.slice(2)

    if(args.length <= 0)
        return;
    
    for(let arg of args){
        const [key, value] = arg.split('=');

        if(key.includes('NODE_ENV')){

            let valuesEnviroments = (Object.values(Environment)  as string[]);
            if(!valuesEnviroments.map(valEnv => (valEnv == 'development' ? 'dev' : valEnv)).includes(value)){
                process.stderr.write("Usage: NODE_ENV [dev|test|prod] [options-commands]\n");
                process.exit(0);
            }

            const newEnv = (value as unknown) as Environment; 
            process.env["NODE_ENV"] = newEnv;
            console.log(`Set NODE_ENV: ${process.env.NODE_ENV}`);
        }
    }
}