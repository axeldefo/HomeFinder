//user model

'use strict';


const mongoose = require('mongoose');
const SearchModel = require("../search/index");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedSearches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'adm-searches' }] // Référence aux résultats de recherche sauvegardés
});

// Méthode statique pour sauvegarder une recherche et son résultat
UserSchema.statics.saveSearchResult = async function (userEmail, result, title) {
  const user = await this.findOne({ email: userEmail });
  if (!user) {
    throw new Error('User not found');
  }
  // Obtenez le nombre actuel de recherches sauvegardées par l'utilisateur
  let searchCount = await SearchModel.findOne().sort({ searchNumber: -1 }).limit(1);

  searchCount = searchCount ? searchCount.searchNumber + 1 : 1;


  console.log(searchCount);
  const search = new SearchModel({
    user: user._id,
    searchNumber: searchCount,
    result,
    title, // Ajout de l'intitulé de la recherche
  });
  
  const savedSearch = await search.save();

  user.savedSearches.push(savedSearch._id);
  await user.save();

  return savedSearch;
};

// Méthode statique pour retrouver l'ensemble des résultats de recherches précédentes
UserSchema.statics.getAllSearchResults = async function (userEmail) {
  const user = await this.findOne({ email: userEmail }).populate('savedSearches');
  if (!user) {
    throw new Error('User not found');
  }

  return user.savedSearches;
};

// Méthode statique pour supprimer un résultat de recherche
UserSchema.statics.deleteSearchResult = async function (userEmail, searchNumber) {
  const user = await this.findOne({ email: userEmail }).populate('savedSearches');
  if (!user) {
    throw new Error('User not found');
  }

 
  // Recherche le résultat de recherche par le numéro de recherche
  const searchResult = user.savedSearches.filter(search => search.searchNumber === searchNumber);
  if (searchResult.length === 0) {
    throw new Error('Search result not found');
  }

  user.savedSearches.pull(searchResult[0]._id);
  await user.save();

  await SearchModel.findByIdAndDelete(searchResult[0]._id);

  return 'Search result deleted successfully';
};

// Fonction pour relancer une recherche en utilisant le numéro de recherche
UserSchema.statics.relaunchSearch = async function (searchNumber, userEmail) {
  try {
    // Récupérer l'utilisateur
    const user = await this.findOne({ email: userEmail }).populate('savedSearches');
    if (!user) {
      throw new Error('User not found');
    }

    // Rechercher le résultat de recherche par le numéro
    const searchResult = user.savedSearches.filter(search => search.searchNumber === searchNumber);
    if (!searchResult) {
      throw new Error('Search result not found');
    }

    // Remove the search result from the user's saved searches
  user.savedSearches.pull(searchNumber);
  await user.save();

  // Delete the search result document
  await SearchModel.findByIdAndDelete(searchNumber);
    // Analyser le titre pour extraire les paramètres
    const { cp, DPE, GES, superficie, date } = extractSearchParamsFromTitle(searchResult[0].title);
    const title = searchResult[0].title;

    return { cp, DPE, GES, superficie, date, title }; // Vous pouvez ajouter d'autres informations nécessaires
  } catch (error) {
    console.error('relaunchSearch error:', error);
    throw error;
  }
};


function extractSearchParamsFromTitle (title)  {
 
      const matches = title.match(/code postal = (\d+), DPE = (\w+), GES = (\w+)(?:, superficie = (\d+))?(?:, date = (\d+))?/);
      if (matches) {
          return {
              cp: matches[1],
              DPE: matches[2],
              GES: matches[3],
              superficie: matches[4],
              date: matches[5]
          };
      }

  return {};
}


module.exports = mongoose.model('adm-users', UserSchema); // Préfixe 'adm-' pour la collection

