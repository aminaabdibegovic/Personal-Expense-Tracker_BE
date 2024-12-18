
const Sequelize = require('sequelize');

const sequelize = new Sequelize('PExpenseT', 'postgres' ,'amina3011', {
    dialect : 'postgres'
})
const Users = sequelize.define('Users', {
    id: {
        type: Sequelize.DataTypes.INTEGER,   
        primaryKey: true,         
        autoIncrement: true,   //auto-increment
      },
    username:{
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    email:{
        type: Sequelize.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password:{
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
    },
    created_at: {
        type: Sequelize.DataTypes.DATE, 
        defaultValue: Sequelize.DataTypes.NOW, 
        allowNull: false,
      },
    });

 module.exports=Users;