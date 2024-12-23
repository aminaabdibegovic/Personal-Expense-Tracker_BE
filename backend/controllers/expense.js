const { expenseValidation } = require('./validation');
const Expense = require('../models/Expenses'); 


const createExpense = async (user_id,title,amount,category,expense_date) => {
      const error = expenseValidation({user_id,title,amount,category,expense_date});
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
        })
        throw new Error(errorMessages.join(';'));
      }
      try{
         const expense = await Expense.create({user_id,title,amount,category,expense_date});
         return expense;
        } catch (err) {
          throw new Error('Error creating expense : ' + err.message);
        }
};

const ListAllExpenses = async (id) => {
     try{
        const expenses = await Expense.findAll({ where: {user_id : id } });
        return  expenses;
     }catch(err){
        throw new Error('Error listing all expense : ' + err.message);
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

module.exports = { createExpense, ListAllExpenses, deleteExpense, updateExpense};
