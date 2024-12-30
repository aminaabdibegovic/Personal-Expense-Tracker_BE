const { expenseValidation } = require('./validation');
const Expense = require('../models/Expenses'); 
const { Op } = require('sequelize');


const createExpense = async (user_id,title,amount,category,expense_date) => {
      const {error, value} = expenseValidation({user_id,title,amount,category,expense_date});
      if (error){
        const errorMessages = error.details.map((err) => {
            switch (err.context.key) {
                case 'title':
                  return 'Title can only contain letters.';
                case 'amount ':
                  return 'Amount must have exactly two decimal places';
                case 'category':
                    return 'Password cannot be longer than 15 characters.';
                case 'expenseDate' : 
                    return 'The date must be a valid date format.'
                default:
                  return 'Invalid input';
              }
        })}
       else { console.log('Validation successful')};
      try{
         const expense = await Expense.create({user_id,title,amount,category,expense_date});
         return expense;
        } catch (err) {
          throw new Error('Error creating expense : ' + err.message);
        }
};

const ListAllExpenses = async (id,startDate,endDate,category) => {
      const where = {user_id :id};
      console.log(startDate,endDate);
      if (startDate || endDate) {
        where.expense_date = {}; 
      }
      console.log(startDate,endDate,category);
      if (startDate) {
        where.expense_date[Op.gte] = startDate; 
      }
      if (endDate) {
        where.expense_date[Op.lte] = endDate; 
      }
      if (category) {
        where.category = category; 
      }
     try{
        const expenses = await Expense.findAll({ where });
        return  expenses;
     }catch(err){
        throw new Error('Error listing all expense : ' + err.message);
     }
};

const getExpenseCategories = async(id) => {
     try {
        const categories = await Expense.findAll({
            attributes: ['category'], 
            where: {
                user_id: id 
              },
              group: ['category'], 
          });
        return categories;
    }catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

const updateExpense = async (id, values) => {
    try {
      const [updatedRows] = await Expense.update(values, {
        where: { id: id },
      });
      return updatedRows; 
    } catch (err) {
      throw new Error(err.message); 
    }
  };
  

const deleteExpense = async(id) =>{
    try{
        const deletedExpense = await Expense.destroy({ where: { id } });
        return deletedExpense;}
    catch(err){
      throw new Error(err.message);
    } 
};

module.exports = { createExpense, ListAllExpenses, deleteExpense, updateExpense, getExpenseCategories};
