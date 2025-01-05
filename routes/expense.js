const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
require('dotenv').config();
const { Op } = require('sequelize');  
const {createExpense, ListAllExpenses, deleteExpense, updateExpense, getExpenseCategories, totalSumByCategory, 
   totalSumByMonth, getMonthsFromExpenseDate, getYearsFromExpenseDate, getSumThisMonth} = require('../controllers/expense'); 
const { cp } = require('fs');


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

router.get('/getExpenseCategories', async(req,res) => {
   try{
      const token = req.cookies.token;
       
      if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
   }
   const decoded = jwt.verify(token,process.env.JWT_SECRET ); 
   const user_id = decoded.id;
   const categories = await getExpenseCategories(user_id);
   res.status(201).json(categories);
   }catch(err){
      return res.status(500).json({ message: 'Error getting expense categories', error: err.message });
   }
})

router.get('/listAllExpenses', async(req, res) => {
   try{
      const token = req.cookies.token;
      const {startDate, endDate,selectedCategory} = req.query; 
      if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
     }
      const decoded = jwt.verify(token,process.env.JWT_SECRET ); 
      const user_id = decoded.id;
      const expense = await ListAllExpenses(user_id,startDate,endDate,selectedCategory);
      res.status(201).json(expense); 
   }
   catch(err){
      return res.status(500).json({ message: 'Error listing all expenses', error: err.message });
   }
});

router.put('/update/:id', async (req, res) =>{
    const id = parseInt(req.params.id); 
    const values = req.body;
    try{
    const token = req.cookies.token;
     
    if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
    }
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
         const token = req.cookies.token;
     
        if (!token) {
           return res.status(401).json({ message: 'No token, authorization denied' });
        }
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
const getMonthNumber = (monthName) => {
   switch (monthName.toLowerCase()) {
     case 'january':
       return 1;
     case 'february':
       return 2;
     case 'march':
       return 3;
     case 'april':
       return 4;
     case 'may':
       return 5;
     case 'june':
       return 6;
     case 'july':
       return 7;
     case 'august':
       return 8;
     case 'september':
       return 9;
     case 'october':
       return 10;
     case 'november':
       return 11;
     case 'december':
       return 12;
     default:
       throw new Error('Invalid month name');
   }
 };
router.get('/getTotalSumByCategory', async(req,res) => {
   try{
      const token = req.cookies.token;
      if(!token)
         return res.status(401).json({message:'No token, authorization denied'});
      const decoded = jwt.verify(token,process.env.JWT_SECRET ); 
      const user_id = decoded.id;
      const {year,month} = req.query;
      const month2 = getMonthNumber(month);
      const {categories,amounts} = await totalSumByCategory(user_id,year,month2);
      return res.status(200).json({ categories, amounts });
   }catch(err){
      return res.status(500).json({ message: err.message });
   }
 })

 router.get('/getTotalSumByMonth', async(req,res) => {
    try{
      const token = req.cookies.token;
      if(!token) 
         return res.status(401).json({message:'No token, authorization denied'});
      const decoded = jwt.verify(token,process.env.JWT_SECRET); 
      const user_id = decoded.id;
      const {year} = req.query; //here error was
      const {months,amounts} = await totalSumByMonth(user_id,year);
      return res.status(200).json({months,amounts});
    }
    catch(err){
    return err ;
    }
 })

 router.get('/getYearsFromExpenseDate', async(req,res)=>{
   try{
      const token = req.cookies.token;
      if(!token)
         return res.status(401)({message: 'No token, authorization denied'})
      const decoded = jwt.verify(token,process.env.JWT_SECRET); 
      const user_id = decoded.id;
      const response = await getYearsFromExpenseDate(user_id);
      return res.status(200).json(response);
   }
   catch(err){
      return err;
   }
 })

 router.get('/getMonthsFromExpenseDate', async(req,res)=>{
   try{
      const token = req.cookies.token;
      if(!token)
         return res.status(401)({message: 'No token, authorization denied'})
      const decoded = jwt.verify(token,process.env.JWT_SECRET); 
      const user_id = decoded.id;
      const response = await getMonthsFromExpenseDate(user_id);
      return res.status(200).json(response); 
   }
   catch(err){
      return err;
   }
 })
/*
router.get('/getSumThisMonth', async (req,res) => {
   try{
      const token = req.cookies.token;
      if(!token) 
         return res.status(401)({message:'No token,authorization denied'})
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
      const user_id = decoded.id;
      const {month} = req.query;
      const month2 = getMonthNumber(month)
      const sum = await getSumThisMonth(user_id,month2);
      console.log("sum", sum)
      return res.status(200).json(sum);
     }
      catch(err){
         return err;
      }
}) 
*/
module.exports = router;
