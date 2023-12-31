// Description: Service pour les opérations liées au DPE

const Dpe = require('../models/dpe');
const axios = require('axios');
const UserModel = require('../models/users');
const cheerio = require('cheerio');
const moment = require('moment');
//dotenv
require('dotenv').config();

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


exports.readAllDpe = async () => {

    const results = await Dpe.find({});
    
    return results;
};


const readDpe = async (cp, DPE, GES ) => {
    try {
        const result = await Dpe.find({
            "Code_postal_(BAN)": cp,
            "Etiquette_DPE": DPE,
            "Etiquette_GES": GES
        }).limit(10);

        
        return result;
    } catch (error) {
        console.error('readDpe error:', error);
        throw error;
    }
};

const readDpePlus = async (cp, DPE, GES, superficie, date) => {
    try {
        let title = `Recherche de la géolocalisation : code postal = ${cp}, DPE = ${DPE}, GES = ${GES}`;
        const query = {
            "Code_postal_(BAN)": cp,
            "Etiquette_DPE": DPE,
            "Etiquette_GES": GES,
        };

         // Ajouter la condition pour la superficie si elle est fournie
        if (superficie !== undefined) {

            title = title + `, superficie = ${superficie}`;
            const superficieNum = parseFloat(superficie);

            const superficieMin = superficieNum *(1 - 0.2);
            const superficieMax = superficieNum *(1 + 0.2);
            console.log('superficieMax:', superficieMax, superficieMin);
            query["Surface_habitable_logement"] = { $gte: superficieMin, $lte: superficieMax };
        }

        // Ajouter la condition pour la date si elle est fournie
        if (date !== undefined) {
            title = title + `, date = ${date}`;
            const dateObj = new Date(date);

            // Calculer les dates 10 jours avant et après la date fournie
            const startDate = new Date(dateObj);
            startDate.setDate(startDate.getDate() - 2);

            const endDate = new Date(dateObj);
            endDate.setDate(endDate.getDate() + 2);

            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);

            // Utiliser les dates formatées dans la requête
            query.$or = [
                { "Date_réception_DPE": { $gte: formattedStartDate, $lte: formattedEndDate } },
                { "Date_établissement_DPE": { $gte: formattedStartDate, $lte: formattedEndDate } },
                { "Date_visite_diagnostiqueur": { $gte: formattedStartDate, $lte: formattedEndDate } }
            ];
        }

         // Exécuter la requête avec le tri par rapport a la valeur de superficie
         // Exécuter la requête
         //console.log(query);
        let results = await Dpe.find(query);
        console.log(results.length);
        // Trier les résultats par proximité avec la superficie fournie
        if (superficie !== undefined) {
            results = results.sort((a, b) => {
                const diffA = Math.abs(a.Surface_habitable_logement - superficie);
                const diffB = Math.abs(b.Surface_habitable_logement - superficie);
                return diffA - diffB;
            });
        }

        
        return {results, title};
    } catch (error) {
        console.error('readDpe error:', error);
        throw error;
    }
};

exports.readDpePlus = async (cp, DPE, GES, superficie, date, email) => {
    try {
        let title = `Recherche par : code postal = ${cp}, DPE = ${DPE}, GES = ${GES}`;
        const query = {
            "Code_postal_(BAN)": cp,
            "Etiquette_DPE": DPE,
            "Etiquette_GES": GES,
        };

          // Ajouter la condition pour la superficie si elle est fournie
          if (superficie !== undefined) {

            title = title + `, superficie = ${superficie}`;
            const superficieNum = parseFloat(superficie);

            const superficieMin = superficieNum *(1 - 0.2);
            const superficieMax = superficieNum *(1 + 0.2);
            console.log('superficieMax:', superficieMax, superficieMin);
            query["Surface_habitable_logement"] = { $gte: superficieMin, $lte: superficieMax };
        }

        // Ajouter la condition pour la date si elle est fournie
        if (date !== undefined) {
            title = title + `, date = ${date}`;
            const dateObj = new Date(date);

            // Calculer les dates 10 jours avant et après la date fournie
            const startDate = new Date(dateObj);
            startDate.setDate(startDate.getDate() - 10);

            const endDate = new Date(dateObj);
            endDate.setDate(endDate.getDate() + 10);

            const formattedStartDate = formatDate(startDate);
            const formattedEndDate = formatDate(endDate);

            // Utiliser les dates formatées dans la requête
            query.$or = [
                { "Date_réception_DPE": { $gte: formattedStartDate, $lte: formattedEndDate } },
                { "Date_établissement_DPE": { $gte: formattedStartDate, $lte: formattedEndDate } },
                { "Date_visite_diagnostiqueur": { $gte: formattedStartDate, $lte: formattedEndDate } }
            ];
        }
        console.log(query);

         // Exécuter la requête avec le tri par rapport a la valeur de superficie
         // Exécuter la requête
         
        let results = await Dpe.find(query);
        console.log(results.length);
        // Trier les résultats par proximité avec la superficie fournie
        if (superficie !== undefined) {
            results = results.sort((a, b) => {
                const diffA = Math.abs(a.Surface_habitable_logement - superficie);
                const diffB = Math.abs(b.Surface_habitable_logement - superficie);
                return diffA - diffB;
            });
        }

        await UserModel.saveSearchResult(email, results, title);
        return results;
    } catch (error) {
        console.error('readDpe error:', error);
        throw error;
    }
}
exports.readDpe = async (cp, DPE, GES, email) => {
    try {
        const result = await Dpe.find({
            "Code_postal_(BAN)": cp,
            "Etiquette_DPE": DPE,
            "Etiquette_GES": GES
        }).limit(10);

        const title = `Recherche par : code postal = ${cp}, DPE = ${DPE}, GES = ${GES}`;
        
        await UserModel.saveSearchResult(email, result, title);
        return result;
    } catch (error) {
        console.error('readDpe error:', error);
        throw error;
    }
}

exports.getGeolocation = async (cp, DPE, GES, email) => {
    try {
        const results = await readDpe(cp, DPE, GES);

        // Traitez chaque élément de la collection
        const coordinatesCollection = await Promise.all(results.map(async (item) => {
            const address = item['Adresse_(BAN)'];

            // Séparez les parties de l'adresse
            const addressParts = address.split(' ');

            // Assurez-vous que les indices sont corrects en fonction de votre structure d'adresse
            const street = addressParts.slice(0, -2).join(' '); // Inclut le premier et exclut les deux derniers éléments
            const postalcode = parseInt(addressParts[addressParts.length - 2]);
            const city = addressParts.slice(addressParts.indexOf(postalcode.toString()) + 1).join(' '); // Prend tout après le code postal

                // Appel à l'API de géolocalisation
                const response = await axios.get(process.env.GEOLOC, {
                    params: {
                        street: street,
                        city: city,
                        postalcode: postalcode,
                        format: 'geojson'
                    }
                });

                // Vérifiez si la réponse contient des caractéristiques avant d'extraire les coordonnées
                if (response.status === 200 && response.data.features && response.data.features.length > 0) {
                    const coordinates = response.data.features[0].geometry.coordinates;
                    const latitude = coordinates[1];
                    const longitude = coordinates[0];
                    return { latitude, longitude };
                } else {
                    throw new Error('Aucune coordonnée trouvée pour l\'adresse spécifiée.');
                }
            }));

            
        const title = `Recherche de la géolocalisation : code postal = ${cp}, DPE = ${DPE}, GES = ${GES}`;
        
        await UserModel.saveSearchResult(email, coordinatesCollection, title);

        return coordinatesCollection;
    } catch (error) {
        console.error('getGeolocation error:', error);
        throw error;
    }
};

//geolocation avec readDpePlus
exports.getGeolocationPlus = async (cp, DPE, GES, superficie, date, email) => {
    
    try {
        const {results, title} = await readDpePlus(cp, DPE, GES, superficie, date);
    
        // Traitez chaque élément de la collection
        const coordinatesCollection = await Promise.all(results.map(async (item) => {
            const address = item['Adresse_(BAN)'];

            // Utilisez une expression régulière pour extraire la partie numérique (code postal)
            const postalCodeMatch = address.match(/\b\d{5}\b/);
            const postalCode = postalCodeMatch ? parseInt(postalCodeMatch[0]) : null;
            
            // Utilisez la partie numérique pour diviser l'adresse en street et city
            const addressParts = postalCodeMatch ? address.split(postalCodeMatch[0]) : [address];
            const street = addressParts[0].trim();
            const city = addressParts[1].trim();
            
            console.log("street:", street, "city:", city, "postalCode:", postalCode);
            
                // Appel à l'API de géolocalisation
                const response = await axios.get(process.env.GEOLOC, {
                    params: {
                        street: street,
                        city: city,
                        postalcode: postalCode,
                        format: 'geojson'
                    }
                });
              
                // Vérifiez si la réponse contient des caractéristiques avant d'extraire les coordonnées
                if (response.status === 200 && response.data.features && response.data.features.length > 0) {
                    const coordinates = response.data.features[0].geometry.coordinates;
                    const latitude = coordinates[1];
                    const longitude = coordinates[0];
                    return { latitude, longitude };
                } else {
                    throw new Error('Aucune coordonnée trouvée pour l\'adresse spécifiée.');
                }
            }));

            await UserModel.saveSearchResult(email, coordinatesCollection, title);
        return coordinatesCollection;
    } catch (error) {
        console.error('getGeolocation error:', error);
        throw error;
    }
};


exports.relaunchSearch = async (searchNumber, userEmail) => {
    try {
      const user = await UserModel.relaunchSearch(searchNumber, userEmail);
  
      const { cp, DPE, GES, superficie, date, title} = user;
  
      const isSearchBy = title.includes('Recherche par');
      const isSearchGeo = title.includes('Recherche de la géolocalisation');
  
      if (isSearchGeo) {
        return exports.getGeolocationv2(cp, DPE, GES, superficie, date, userEmail);
      } else if (isSearchBy) {
        return exports.readDpev2(cp, DPE, GES, superficie, date, userEmail);
      }
    } catch (error) {
      console.error('relaunchSearch error:', error);
      throw error;
    }
  };



exports.extractDataFromSite = async (url, email) => {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Accept-Language': 'en-US,en;q=0.9',
            },
        });

        const html = response.data;
        const $ = cheerio.load(html);

        // Extraction du DPE
        const dpe = $('.i-gauge--dpe .i-gauge-current').text();

        // Extraction du GES
        const ges = $('.i-gauge--ges .i-gauge-current').text();

        // Extraction du code postal
        const postalCode = parseInt($('.id-title-location').text().match(/\((\d+)\)/)[1]);

        // Extraction de la surface
        const surface = parseInt($('.id-spec dd').text());

        // Extraction de la date
        const dateElement = $('div._title:contains("Diagnostics") small');
        const dateMatch = dateElement.text().match(/(\d{2}\/\d{2}\/\d{4})/);
        const rawDate = dateMatch ? dateMatch[1] : null;

        // Formater la date au format "yyyy-mm-dd" avec moment.js
        const formattedDate = rawDate ? moment(rawDate, 'DD/MM/YYYY').format('YYYY-MM-DD') : null;
       console.log(formattedDate,ges,dpe,surface,postalCode);
        // Envoyez la réponse JSON
        result = await exports.getGeolocationPlus(postalCode, dpe, ges, surface, formattedDate, email);
       console.log(result);
      return result;
        
    } catch (error) {
        console.error('Extraction error:', error);
        throw error;
    }
};
