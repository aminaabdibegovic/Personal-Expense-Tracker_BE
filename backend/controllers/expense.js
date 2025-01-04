const { expenseValidation } = require('./validation');
const Expense = require('../models/Expenses'); 
const { Op, where } = require('sequelize');
const { Sequelize } = require('sequelize'); // Dodaj ovo na početku ako već nije dodano
const sequelize = require('../config/db');



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
      if (startDate || endDate) {
        where.expense_date = {}; 
      }
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

const totalSumByCategory = async (id,year,month) => {
  try {
    if (!year || !month) {
      return { categories: [], amounts: [] };
    }
    const result = await Expense.findAll({
      attributes: [
        "category",
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total_amount"],
      ],
      where: {
        user_id: id, 
        [Sequelize.Op.and]: [
          Sequelize.where(
            Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM expense_date")),
            year
          ),
          Sequelize.where(
            Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM expense_date")),
            month
          ),
        ],
      },
      group: ["category"],
    });
    const categories = result.map(item => item.dataValues.category);
    const amounts = result.map(item => item.dataValues.total_amount);
    return { categories, amounts };
  } catch (err) {
    return { error: err.message };  
  }
}

const totalSumByMonth = async (id,year) => {
   try{
    if (!year) {
      return { months: [], amounts: [] };
    }
    const result = await Expense.findAll({
      attributes: [
        [Sequelize.fn("EXTRACT", Sequelize.literal("MONTH FROM expense_date")), "month"], 
        [Sequelize.fn("SUM", Sequelize.col("amount")), "total_amount"]
      ],
      where: {
        user_id: id,
        [Sequelize.Op.and]: [
          Sequelize.where(Sequelize.fn("EXTRACT", Sequelize.literal("YEAR FROM expense_date")), year)  
        ]
      },
      group: [Sequelize.literal('EXTRACT(MONTH FROM expense_date)')],  
      order: [Sequelize.literal('EXTRACT(MONTH FROM expense_date)')]  
    });    
    const months = result.map(item => item.dataValues.month);
    const amounts = result.map(item => item.dataValues.total_amount);
    return {months, amounts};
   }
   catch(err){
     return err;
}}

const getYearsFromExpenseDate = async (id) => {
  try {
    const result = await Expense.findAll({
      attributes: [
        [Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM expense_date')), 'year'], // Ekstrakcija mjeseca
      ],
      where: { user_id: id }, // Filtriranje po korisničkom ID-u
      group: [Sequelize.literal('EXTRACT(YEAR FROM expense_date)')], // Grupisanje po mjesecima
      order: [Sequelize.literal('EXTRACT(YEAR FROM expense_date)')], // Redoslijed mjeseci
    });

    // Mapiraj rezultat u niz brojeva (jedinstveni mjeseci)
    const years = result.map(item => item.dataValues.year);
    return years;
  } catch (err) {
    return { error: err.message };
  }
};


const getMonthsFromExpenseDate = async (id) => {
  try {
    const result = await Expense.findAll({
      attributes: [
        [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM expense_date')), 'month'], // Ekstrakcija mjeseca
      ],
      where: { user_id: id }, // Filtriranje po korisničkom ID-u
      group: [Sequelize.literal('EXTRACT(MONTH FROM expense_date)')], // Grupisanje po mjesecima
      order: [Sequelize.literal('EXTRACT(MONTH FROM expense_date)')], // Redoslijed mjeseci
    });
    const months = result.map(item => item.dataValues.month);
    return months;
  } catch (err) {
    return { error: err.message };
  }
};

const getSumThisMonth = async(id,month) => {
  try{
    const result = await Expense.findOne({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'total_sum']
      ],
      where: {
        user_id: id,
        [Sequelize.Op.and]: [Sequelize.where(
          Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM expense_date')), month),
          Sequelize.where(
            Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM expense_date')), 
            Sequelize.literal('EXTRACT(YEAR FROM NOW())')
          )],
      }
    });
    return(result.dataValues.total_sum);
  }
   catch(err){
    return err.message;
   }
}

module.exports = { createExpense, ListAllExpenses, deleteExpense, updateExpense, getExpenseCategories, totalSumByCategory, 
  totalSumByMonth, getYearsFromExpenseDate, getMonthsFromExpenseDate, getSumThisMonth};
