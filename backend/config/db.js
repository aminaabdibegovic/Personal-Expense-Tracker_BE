//connection check
const Sequelize = require('sequelize');

const sequelize = new Sequelize('PExpenseT', 'postgres' ,'amina3011', {
    dialect : 'postgres'
})

sequelize.authenticate().then(() => {
    console.log("Connection successful!");
}).catch((err) => {
    console.log("Error connection to database!");
});

console.log("Next task");
module.exports = sequelize;
