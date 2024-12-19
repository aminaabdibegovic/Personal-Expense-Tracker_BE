const Users = require('./models/Users'); 
const Expenses = require('./models/Expenses');
const express = require('express');


const app = express();
app.use(express.json());


const port = 3000;

const startServer = async () => {
  try {
    await Users.sync();
    console.log("Table Users successfully created.");
    await Expenses.sync();
    console.log("Table Expenses successfully created.");
    
    //running server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.log("Something went wrong:", err.message);
  }
};

startServer();

const loginRouter = require('./routes/login');
const registracijaRouter = require('./routes/register');

app.use('/login', loginRouter);
app.use('/register', registracijaRouter);

module.exports = app; 
