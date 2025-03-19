const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",
  database: "pet_hospital",
  synchronize: true,
  logging: true,
  entities: [__dirname + "/entity/*.js"],
  subscribers: [],
  migrations: [],
});

module.exports = AppDataSource;
