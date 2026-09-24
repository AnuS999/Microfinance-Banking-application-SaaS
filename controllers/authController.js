const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Name and Email are required',
      });
    }

    const newUserPayload = {
      _id: '6ab2c9aab69cd8a5cedf3a59',
      name: name || 'Anurodh Singh',
      email,
      tenantId: 'DEFAULT',
      role: 'ORG_ADMIN',
    };

    const secretKey = process.env.JWT_SECRET || 'super_secret_jwt_key_2026';
    const token = jwt.sign(newUserPayload, secretKey, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: newUserPayload,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const userPayload = {
      _id: '6ab2c9aab69cd8a5cedf3a59',
      name: 'Anurodh Singh',
      email: 'anurodhsingh955@gmail.com',
      tenantId: 'DEFAULT',
      role: 'ORG_ADMIN',
    };

    const secretKey = process.env.JWT_SECRET || 'super_secret_jwt_key_2026';
    const token = jwt.sign(userPayload, secretKey, { expiresIn: '7d' });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userPayload,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  register,
  login,
};