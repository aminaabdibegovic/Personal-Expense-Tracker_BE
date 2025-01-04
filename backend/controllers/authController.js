const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const { registerValidation } = require('./validation');
const User = require('../models/Users'); 

const salt = bcrypt.genSaltSync(10);

// Register function
const registerUser = async (email, username, password) => {
  const {error}  = registerValidation({email, username, password });
  if (error) {
    const errorMessages = error.details.map((err) => {
      switch (err.context.key) {
        case 'username':
          return 'Username must be between 3 and 20 characters long and can only contain letters and numbers.';
        case 'email':
          return 'Invalid email format.';
        case 'password':
          if (err.type === 'string.min') {
            return 'Password must be at least 8 characters long.';
          } else if (err.type === 'string.max') {
            return 'Password cannot be longer than 15 characters.';
          }
          return 'Password is required and should be between 8 and 15 characters.';
        default:
          return 'Invalid input';
      }
    });
    throw new Error(errorMessages.join(';'));
    //  return res.status(400).json({ errors: errorMessages }); ovo bi trebalo zbog vracanja greski na front?
  }
  try {
    const hash = bcrypt.hashSync(password, salt);
    const user = await User.create({ email, username, password: hash });
    return user;
  } catch (err) {
    throw new Error('Error registering user: ' + err.message);
  }
};
// Log function 
const loginUser = async (username,password) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       throw new Error('Invalid password');
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    return token;}
    catch(err){
      throw err;
    }
};

const getUsername = async(id) => {
  console.log("finding username")
  const username = await User.findOne({ where: { id } });
  if(!username) 
      throw Error('User with this id isn`t found')
  return username;
}

module.exports = { registerUser, loginUser,getUsername };

