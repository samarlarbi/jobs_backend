import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import * as dotenv from 'dotenv';



dotenv.config();
console.log(process.env.DATABASE);
export const pgConfig: PostgresConnectionOptions = {
  type: 'postgres',
  url:  process.env.DATABASE,
  port: 5432, 
  entities: [__dirname + "/**/*.entity.{ts,js}"],
  synchronize: true,
  
};