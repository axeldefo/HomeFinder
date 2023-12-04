// Auth controller

const express = require('express');
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
      const result = await authService.login(email, password);

      // Si tout se passe bien, renvoyer une réponse avec le statut 200
      res.status(200).json(result);
  } catch (error) {
      console.error('Login error:', error);

      // Gérer les erreurs ici et renvoyer la réponse appropriée
      res.status(401).json({ error: 'Login failed' });
  }
};
exports.refresh = async (req, res) => {
    console.log("refresh");
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);
    res.status(result.status).json(result.data);
  } catch (error) {
    console.error('Refresh error:', error);
    res.status(500).json({ error: 'Refresh failed' });
  }
};
