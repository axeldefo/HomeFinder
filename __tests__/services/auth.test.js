const app = require('../../app');
const bcrypt = require('bcrypt');
const mockingoose = require('mockingoose');
const authService = require('../../services/auth');
const User = require('../../models/users');
const UserServices = require('../../services/users');
// Test de service d'authentification
describe('Authentication Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockingoose.resetAll(); // Réinitialiser tous les modèles mockés avant chaque test
  });

  // Test d'inscription
  describe('registerUser', () => {
    it('should register a new user', async () => {
      const mockUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      mockingoose(User).toReturn({}, 'save'); // Mock la méthode save du modèle User
      const result = await authService.registerUser(mockUser.name, mockUser.email, mockUser.password);

      expect(result.status).toBe(201);
      expect(result.data.message).toBe('User registered successfully');
    });

    it('should handle existing user', async () => {
      const mockUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      mockingoose(User).toReturn({ status: 400, data: { error: 'email already exists' } }, 'findOne');

      const result = await authService.registerUser(mockUser.name, mockUser.email, mockUser.password);

      expect(result.status).toBe(400);
      expect(result.data.error).toBe('email already exists');
    });

    it('should handle registration failure', async () => {
      const mockUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
      };

      mockingoose(User).toReturn(new Error('Registration failed'), 'save'); // Simuler une erreur lors de l'enregistrement

      const result = await authService.registerUser(mockUser.name, mockUser.email, mockUser.password);

      expect(result.status).toBe(500);
      expect(result.data.error).toBe('Registration failed');
    });
  });

  // Test de connexion
  describe('login', () => {
    it('should login with valid credentials', async () => {
      const mockUser = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: bcrypt.hashSync('password123', 10),
      };

      mockingoose(User).toReturn(mockUser, 'findOne'); // Mock la recherche d'utilisateur

      const result = await authService.login('john.doe@example.com', 'password123');

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should handle invalid credentials', async () => {
      mockingoose(User).toReturn(null, 'findOne'); // Mock une recherche d'utilisateur qui renvoie null
  
      try {
        await authService.login('john@example.com', 'password123');
      } catch (error) {
        // Modifier ici pour comparer le message d'erreur
        expect(error.message).toBe('invalid credentials');
      }
    });
  });

 // Test de rafraîchissement du token
describe('refreshToken', () => {
  it('should refresh the access token', async () => {
    const mockUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
    };

    // Mock la fonction getUser pour retourner mockUser
    jest.spyOn(UserServices, 'getUser').mockResolvedValue(mockUser);

    // Mock la fonction generateAccessToken pour retourner la chaîne "newToken123"
    jest.spyOn(authService, 'generateAccessToken').mockReturnValue('newToken123');

    try {
      const result = await authService.refreshToken('oldRefreshToken');
      expect(result).toBe('newToken123');
    } catch (error) {
      console.error(error);
    }
  });

  it('should handle invalid refresh token', async () => {
    // Mock la fonction getUser pour retourner null
    jest.spyOn(UserServices, 'getUser').mockResolvedValue(null);

    try {
      await authService.refreshToken('invalidRefreshToken');
    } catch (error) {
      // Modifier ici pour comparer le message d'erreur
      expect(error.message).toBe('Invalid refresh token');
    }
  });
});
});