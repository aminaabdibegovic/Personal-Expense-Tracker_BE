const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
require('dotenv').config();
const {createExpense, ListAllExpenses, deleteExpense, updateExpense} = require('../controllers/expense'); 


router.post('/createexpense', async(req, res) => {
     try{
      const{title,amount,category,expense_date} = req.body;
      const token = req.cookies.token;

      if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
     }

      const decoded = jwt.verify(token,process.env.JWT_SECRET ); 
      const user_id = decoded.id;
      const expense = await createExpense(user_id,title,amount,category,expense_date);
      return res.status(201).json('Expense created successfuly'); 
   }
     catch(err){
        return res.status(400).json({ message: 'Error creating expense', error: err.message });
     }
});

router.get('/listAllExpenses', async(req, res) => {
   try{
      const token = req.cookies.token;

      if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
     }

      const decoded = jwt.verify(token,process.env.JWT_SECRET ); 
      const user_id = decoded.id;
      const expense = await ListAllExpenses(user_id);
      res.status(201).json(expense); 
   }
   catch(err){
      return res.status(500).json({ message: 'Error listing all expenses', error: err.message });
   }
});

router.put('/update/:id', async (req, res) =>{
   const id = parseInt(req.params.id); // 
   const values = req.body;
   try{
     const updatedRows = await updateExpense(id,values);
     if (updatedRows > 0) {
      return res.status(200).json({ message: 'Expense successfully updated' });
    } else {
      return res.status(404).json({ message: 'Expense not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Error updating expense', error: err.message });
  }
});

router.delete('/delete/:id', async (req, res) =>{
      const id = parseInt(req.params.id); 
      try{
         const deletedExpense = await deleteExpense(id);
         if (deletedExpense > 0) {
            res.status(200).json({ message: 'Expense deleted successfully' });
          } else {
            res.status(404).json({ message: 'Expense not found' });
          }
    }catch(err){
        res.status(500).json({ error: 'Error deleting expense: ' + err.message });
    }
});
module.exports = router;
