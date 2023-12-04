// dpe model

const mongoose = require('mongoose');

const DpeSchema = new mongoose.Schema({
  "N°_département_(BAN)": { type: Number},
  "Date_réception_DPE": { type: String, required: true },
  "Date_établissement_DPE": { type: String, required: true },
  "Date_visite_diagnostiqueur": { type: String, required: true },
  "Etiquette_GES": { type: String, required: true },
  "Etiquette_DPE": { type: String, required: true },
  "Année_construction": { type: Number },
  "Surface_habitable_logement": { type: Number},
  "Adresse_(BAN)": { type: String},
  "Code_postal_(BAN)": { type: Number},
});


const collectionName = 'depmini72'; // Nom de la collection dans la base de données

// Créez le modèle en utilisant le schéma défini et le nom de la collection
const DpeModel = mongoose.model(collectionName, DpeSchema);

module.exports = DpeModel;