const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.buckets = require("./buckets.model")(sequelize, Sequelize);
db.balls = require("./balls.model")(sequelize, Sequelize);
db.bucket_balls = require("./bucketballs.model")(sequelize, Sequelize);

db.buckets.belongsToMany(db.balls, {through: db.bucket_balls})
db.balls.belongsToMany(db.buckets, {through: db.bucket_balls })

module.exports = db;