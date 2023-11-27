const e = require('express');
const authService = require('../../services/auth');

exports.register = async (req, res) => {
    console.log("register");
  try {
    const { name, email, password } = req.body;
    const result = await authService.registerUser(name, email, password);
    console.log(email);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
    console.log("login");
  try {
    const { email, password } = req.body;
    const result = await authService.authenticateUser(email, password);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Refresh token failed' });
  }
};
