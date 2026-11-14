const { Sequelize } = require('sequelize');

// Se existir DATABASE_URL (Render), usamos PostgreSQL.
// Caso contrário, usamos o MySQL local configurado pelas variáveis DB_*.
let sequelize;

if (process.env.DATABASE_URL) {
  console.log('Banco: PostgreSQL (DATABASE_URL)');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions:
      process.env.DB_SSL === 'true'
        ? { ssl: { require: true, rejectUnauthorized: true } }
        : {},
  });
} else {
  console.log(`Banco: MySQL (${process.env.DB_HOST}:${process.env.DB_PORT})`);
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
      logging: false,
    }
  );
}

module.exports = sequelize;
