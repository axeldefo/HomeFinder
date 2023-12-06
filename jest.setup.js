const mockingoose = require('mockingoose');

// Charger le modèle mongoose
const User = require('./models/users/index');

// Activer Mockingoose
mockingoose(User);

