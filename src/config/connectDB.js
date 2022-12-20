require('dotenv').config();
const { Sequelize } = require('sequelize');
// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(
  process.env.DB_DATABASE_NAME, 
  process.env.DB_USERNAME, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    port:process.env.DB_PORT,
    dialect: 'postgres',
    oracle:process.env.DDB_DATABASE_URL,
    logging:false,
    dialectOption:{
      ssl:{
        require:true,
        rejectUnauthorized:false
      }
    }
});

let connectDB = async()=> {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}
module.exports =connectDB;
