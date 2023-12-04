const axios = require('axios');
const fs = require('fs').promises;
const DpeModel = require('../models/dpe');
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


const apiUrlBase = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines';
const pageSize = 1000;

async function fetchData() {
  try {
    let currentPage = 1;
    let allResults = [];
    let a=true;
    // Boucle pour récupérer toutes les pages
    while (a) {
        const apiUrl = `${apiUrlBase}?size=${pageSize}&page=${currentPage}&q_mode=simple&qs=(Date_r%C3%A9ception_DPE:[2023%5C-10%5C-01+TO+%5C*])&finalizedAt=2023-11-13T15:27:21.465Z&select=N%C2%B0_d%C3%A9partement_(BAN),Date_r%C3%A9ception_DPE,Date_%C3%A9tablissement_DPE,Date_visite_diagnostiqueur,Etiquette_GES,Etiquette_DPE,Ann%C3%A9e_construction,Surface_habitable_logement,Adresse_(BAN),Code_postal_(BAN)&&N%C2%B0_d%C3%A9partement_%28BAN%29_eq=72`;

        const response = await axios.get(apiUrl);

        // Assurez-vous que response.data.results est défini
        if (!response.data.results) {
        console.error('Structure des données inattendue:', response.data);
        throw new Error('Les données ne sont pas dans le format attendu.');
        }
        console.log(`Page ${currentPage} récupérée, ${response.data.results.length} résultats`, response.data.results.length);
        // Filtrer les résultats pour supprimer les lignes où _score est null
        const filteredResults = response.data.results
        .map(({ _score, ...cleanedRow }) => cleanedRow);

        for (const result of filteredResults) {
            const dpe = new DpeModel(result);
            await dpe.save();
        }
        // Ajouter les résultats à la liste globale
        allResults.push(...filteredResults);
        // Si le nombre d'éléments récupérés dans cette page est inférieur à pageSize, cela signifie que c'est la dernière page
        if (response.data.results.length < pageSize) {
            a=false;
        }
        console.log(a);
        // Passez à la page suivante
        currentPage++;
    }
        console.log(allResults.length);
        // Enregistrer dans un fichier local (par exemple, results.json)
        await fs.writeFile('./results.json', JSON.stringify(allResults, null, 2));

        // Ajouter les éléments dans la base de données MongoDB
        //await DpeModel.create(allResults);

    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

const DpeModel = require('../models/dpe');  // Assurez-vous que le chemin est correct

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
// Appeler la fonction pour récupérer les données
fetchData();