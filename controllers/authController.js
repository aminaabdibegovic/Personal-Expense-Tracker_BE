const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation } = require('./validation');
const User = require('../models/Users');

const salt = bcrypt.genSaltSync(10);

// Register function
const registerUser = async (email, username, password) => {
  const { error } = registerValidation({ email, username, password });

  if (error) {
    const firstError = error.details[0];
    let errorMessage = '';

    switch (firstError.context.key) {
      case 'username':
        errorMessage =
          'Username must be between 3 and 20 characters long and can only contain letters and numbers.';
        break;
      case 'email':
        errorMessage = 'Invalid email format.';
        break;
      case 'password':
        if (firstError.type === 'string.min') {
          errorMessage = 'Password must be at least 8 characters long.';
        } else if (firstError.type === 'string.max') {
          errorMessage = 'Password cannot be longer than 15 characters.';
        } else {
          errorMessage = 'Password is required and should be between 8 and 15 characters.';
        }
        break;
      default:
        errorMessage = 'Invalid input.';
    }

    throw new Error(errorMessage);
  }

  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    throw new Error('Username is already taken.');
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
const loginUser = async (username, password) => {
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
    // eslint-disable-next-line no-undef
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );
  return token;
};

const getUsername = async (id) => {
  const user = await User.findOne({ where: { id } });
  if (!user) throw Error('User with this id isn`t found');
  return user;
};

module.exports = { registerUser, loginUser, getUsername };
