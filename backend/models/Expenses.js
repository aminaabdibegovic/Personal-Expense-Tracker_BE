const Sequelize = require('sequelize');
const Users = require('./Users')

const sequelize = new Sequelize('PExpenseT', 'postgres' ,'amina3011', {
    dialect : 'postgres'
})

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
         category: Sequelize.DataTypes.STRING(50),
         allowNull: false,
     },
     expense_date:{
        type: Sequelize.DataTypes.DATE,
        allowNull: false, 
     },
     created_at: {
         type: Sequelize.DataTypes.DATE, 
         defaultValue: Sequelize.DataTypes.NOW, 
         allowNull: false,
     },
 });

module.exports=Expenses;  