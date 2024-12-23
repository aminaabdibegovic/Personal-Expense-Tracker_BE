const Sequelize = require('sequelize');
const Users = require('./Users')
const sequelize = require('../config/db'); // Import konekcije

//const sequelize = new Sequelize('PExpenseT', 'postgres' ,'amina3011', {
  //  dialect : 'postgres'
//})

const Expenses = sequelize.define('Expenses',{
    id:{
     type : Sequelize.DataTypes.INTEGER,
     primaryKey : true, 
     autoIncrement: true,
    },
    user_id:{
     type : Sequelize.DataTypes.INTEGER,
     references:{
         model: Users,
         key: 'id',
     },
     allowNull: false,
    },
     title:{
         type: Sequelize.DataTypes.STRING(100),
         allowNull : false,
     },
     amount:{
         type: Sequelize.DataTypes.DECIMAL(10,2),
         allowNull: false,
     },
    category: {
        type : Sequelize.DataTypes.STRING(50),
         allowNull: false,
     },
     expense_date:{
        type: Sequelize.DataTypes.DATEONLY,
        allowNull: false, 
     },
     created_at: {
         type: Sequelize.DataTypes.DATE, 
         defaultValue: Sequelize.DataTypes.NOW, 
         allowNull: false,
     },
 });

module.exports=Expenses;  