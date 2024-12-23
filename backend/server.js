const Users = require('./models/Users'); 
const Expenses = require('./models/Expenses');
const express = require('express');
const cookieParser = require('cookie-parser');


const app = express();
app.use(express.json());
app.use(cookieParser()); // da bi mi cookie bio dostupan svugdje


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
const expenseRouter = require('./routes/expense');

app.use('/login', loginRouter);
app.use('/register', registracijaRouter);
app.use('/expense', expenseRouter);

module.exports = app; 
