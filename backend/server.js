const Users = require('./models/Users'); // Import User modela
const Expenses = require('./models/Expenses');
const express = require('express');

//connection check
/*sequelize.authenticate().then(() => {
    console.log("Connection successful!");
}).catch((err) => {
    console.log("Error connection to database!");
});

console.log("Next task");
*/
const app = express();
// Ruta za ispisivanje "Hello World"
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Pokretanje servera
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});


Users.sync().then((data) => {
     console.log("Table Users successfulyy created.");
  }).catch((err) => {
    console.log("Something went wrong");
});

Expenses.sync().then((data) => {
  console.log("Table Expenses successfulyy created.");
}).catch((err) => {
 console.log("Something went wrong");
});