// Modèle pour les résultats de recherche

const mongoose = require('mongoose');

const SearchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'adm-users' }, // Référence à l'utilisateur
  searchNumber: { type: Number, required: true }, // Numéro de recherche
  result: { type: mongoose.Schema.Types.Mixed, required: true }, // Résultat de la recherche (peut être ajusté selon le type de résultat)
  title: { type: String, required: true }, // Intitulé de la recherche
});


module.exports = mongoose.model('adm-searches', SearchSchema);


