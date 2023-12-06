const request = require('supertest');
const express = require('express');
const authController = require('../../../api/controllers/auth');
const mockingoose = require('mockingoose');
const authService = require('../../../services/auth');

const app = express();

app.post('/api/v1/auth/register', authController.register);
app.post('/api/v1/auth/login', authController.login);
app.post('/api/v1/auth/refresh', authController.refresh);

describe('Auth Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockingoose.resetAll();
  });

  it('should register a new user', async () => {
    // Espionnez la fonction du service pour la fonction spécifique
    jest.spyOn(authService, 'registerUser').mockResolvedValue({
      status: 201,
      data: { message: 'User registered successfully' },
    });

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'John Doe', email: 'john@example.com', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User registered successfully' });
  });

  it('should handle registration failure', async () => {
    // Espionnez la fonction du service pour la fonction spécifique
    jest.spyOn(authService, 'registerUser').mockResolvedValue({
      status: 500,
      data: { error: 'Registration failed' },
    });

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'John Doe', email: 'john@example.com', password: 'password123' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Registration failed' });
  });

  it('should log in a user', async () => {
    // Espionnez la fonction du service pour la fonction spécifique
    jest.spyOn(authService, 'login').mockResolvedValue({
      accessToken: 'token123',
      refreshToken: 'refreshToken123',
    });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'john@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ accessToken: 'token123', refreshToken: 'refreshToken123' });
  });

  it('should handle login failure', async () => {
    // Espionnez la fonction du service pour la fonction spécifique
    jest.spyOn(authService, 'login').mockRejectedValue(new Error('Login failed'));

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'john@example.com', password: 'password123' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Login failed' });
  });

  it('should refresh the token', async () => {
    // Espionnez la fonction du service pour la fonction spécifique
    jest.spyOn(authService, 'refreshToken').mockResolvedValue({ accessToken: 'newToken123' });

    const response = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: 'oldRefreshToken' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ accessToken: 'newToken123' });
  });

  it('should handle refresh token failure', async () => {
    // Espionnez la fonction du service pour la fonction spécifique
    jest.spyOn(authService, 'refreshToken').mockRejectedValue(new Error('Refresh failed'));

    const response = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: 'oldRefreshToken' });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Refresh failed' });
  });

  afterAll(() => {
    mockingoose.resetAll();
  });
});
