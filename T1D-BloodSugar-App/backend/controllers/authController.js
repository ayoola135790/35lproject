const { userFunctions } = require('../db/database');


exports.signup = async (req, res) => {
 try {
   const { name, identifier, password, confirmPassword } = req.body;
  
   console.log('Signup request received:', { name, identifier });
  
   if (!name || !identifier || !password) {
     return res.status(400).json({ success: false, error: 'All fields are required' });
   }
  
   if (password !== confirmPassword) {
     return res.status(400).json({ success: false, error: 'Passwords do not match' });
   }
  
   let userData = { name, password };
  
   if (identifier.includes('@')) {
     userData.email = identifier;
     console.log('Using email as identifier:', identifier);
   } else if (/^\+?\d{10,15}$/.test(identifier)) {
     userData.phone = identifier;
     console.log('Using phone as identifier:', identifier);
   } else {
     userData.username = identifier;
     console.log('Using username as identifier:', identifier);
   }
  
   const result = await userFunctions.createUser(userData);
  
   if (result.success) {
     res.status(201).json({ success: true, message: 'User registered successfully' });
   } else {
     res.status(400).json({ success: false, error: result.error });
   }
 } catch (error) {
   console.error('Signup error:', error);
   res.status(500).json({ success: false, error: 'Server error' });
 }
};


exports.login = async (req, res) => {
 try {
   const { identifier, password } = req.body;
  
   console.log('Login request received with identifier:', identifier);
  
   if (!identifier || !password) {
     return res.status(400).json({ success: false, error: 'All fields are required' });
   }
  
   const result = await userFunctions.verifyUser(identifier, password);
  
   if (result.success) {
     console.log('Login successful for user:', result.user.id);
     res.status(200).json({
       success: true,
       message: 'Login successful',
       user: {
         id: result.user.id,
         name: result.user.name
       }
     });
   } else {
     console.log('Login failed:', result.error);
     res.status(401).json({ success: false, error: result.error });
    }
} catch (error) {
  console.error('Login error:', error);
  res.status(500).json({ success: false, error: 'Server error' });
}
};


exports.forgotPassword = async (req, res) => {
try {
  const { identifier } = req.body;
 
  if (!identifier) {
    return res.status(400).json({ success: false, error: 'Username is required' });
  }
 
  const result = await userFunctions.findUserByIdentifier(identifier);
 
  if (result.success) {
    res.status(200).json({
      success: true,
      message: 'User found, proceed to reset password',
      userId: result.user.id
    });
  } else {
    res.status(404).json({ success: false, error: 'User not found' });
  }
} catch (error) {
  console.error('Forgot password error:', error);
  res.status(500).json({ success: false, error: 'Server error' });
}
};


exports.resetPassword = async (req, res) => {
try {
  const { username, newPassword } = req.body;
 
  if (!username || !newPassword) {
    return res.status(400).json({ success: false, error: 'Username and new password are required' });
  }
 
  const result = await userFunctions.updateUserPassword(username, newPassword);
  
  if (result.success) {
    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } else {
    res.status(400).json({ success: false, error: result.error });
  }
} catch (error) {
  console.error('Reset password error:', error);
  res.status(500).json({ success: false, error: 'Server error' });
}
};

