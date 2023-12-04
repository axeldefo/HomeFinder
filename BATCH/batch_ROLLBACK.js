const DpeModel = require('../models/dpe');  // Assurez-vous que le chemin est correct

//dotenv.config();
require('dotenv').config();

const mongoose = require('mongoose');

const databaseURI = process.env.MONGO_URI;

async function connectToDatabase() {
  try {
    await mongoose.connect(databaseURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connecté à la base de données MongoDB');
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error.message);
  }
}

// Appel de la fonction pour se connecter à la base de données
connectToDatabase();



async function supprimerDPE() {
  try {
    // Utilisez deleteMany pour supprimer les documents qui correspondent au critère
    const result = await DpeModel.deleteMany({
      Date_établissement_DPE: { $gte: '2023-10-01' }
    });

    console.log(`${result.deletedCount} documents supprimés`);
  } catch (error) {
    console.error('Erreur lors de la suppression des documents:', error.message);
  } finally {
    // Assurez-vous de fermer la connexion après l'opération
    await mongoose.connection.close();
  }
}

// Appelez la fonction pour supprimer les documents
supprimerDPE();