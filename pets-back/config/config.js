require("dotenv").config();

const createConfig = () => ({
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  dialect: "postgres",

  // Выполненные migrations записываются в SequelizeMeta.
  migrationStorage: "sequelize",
  migrationStorageTableName: "SequelizeMeta",


  logging: false,
});

module.exports = {
  development: createConfig(),
  test: createConfig(),
  production: createConfig(),
};