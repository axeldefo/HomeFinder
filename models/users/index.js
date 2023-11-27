'use strict';

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedSearches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'adm-searches' }] // Référence aux résultats de recherche sauvegardés
});


module.exports = mongoose.model('adm-users', UserSchema); // Préfixe 'adm-' pour la collection
