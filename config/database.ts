import { Dialect } from "sequelize";
import { Sequelize } from "sequelize-typescript";

const database: string = process.env.DATABASE as string;
const username = process.env.USER;
const password = process.env.PASSWORD;
const dialect = process.env.DIALECT as Dialect;
const host = process.env.HOST;

console.log({ database: process.env.DATABASE, username: process.env.USER, password, host, dialect });

const sequelize = new Sequelize({
  database,
  username,
  password,
  host,
  dialect,
  port: 5433
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.sync();
    // await sequelize.sync({ force: true });
    // await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const db = sequelize;
