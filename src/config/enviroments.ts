import { join } from "path";

export enum Environment {
    Development = "development",
    Production = "prod",
    Test = "test",
}

export function getEnvPath(): string {
  //  evaluateChangeArgEnv();
    const filename: string = `.env${(process.env.NODE_ENV ? ("."  + process.env.NODE_ENV) : "")}`; 
    const filePath: string = join(process.cwd(), 'environment', filename);
    return filePath;
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