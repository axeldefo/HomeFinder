# HomeFinder
Version: 0.0.0

Homefinder est une application Node.js destinée à faciliter la recherche de logements en fournissant des fonctionnalités avancées de recherche immobilière. Cette application propose plusieurs fonctionnalités pour aider les utilisateurs à trouver des propriétés qui correspondent à leurs critères spécifiques.
Fonctionnalités principales

    Recherche: Utilisez des critères tels que le code postal, les étiquettes DPE/GES
    Recherche avancée: Utilisez des critères tels que le code postal, les étiquettes DPE/GES, la superficie et la date pour affiner votre recherche immobilière.

    Extraction de données: Récupérez automatiquement des informations sur les propriétés à partir du site 'Immonot pour obtenir des détails précis sur les performances énergétiques, les émissions de gaz à effet de serre, etc.

    Géolocalisation: Obtenez les coordonnées géographiques des propriétés pour une visualisation facile sur une carte. (mode avancé également disponible)

    Sauvegarde de recherches: Enregistrez vos recherches préférées pour les relancer ultérieurement.

Technologies clés utilisées

    Express.js pour le développement du serveur.
    MongoDB avec Mongoose pour la gestion de la base de données.
    Swagger pour la documentation de l'API.
    Puppeteer pour l'extraction de données à partir de sites web.
    Axios pour les requêtes HTTP.
    Moment.js pour le formatage des dates.
    Jest pour les test.
    Et d'autres bibliothèques populaires pour diverses fonctionnalités.

Comment lancer l'application
npm install

node app.js

L'application sera ensuite accessible à l'adresse http://localhost:3000.



Pour lancer le batch de mise à jour de la base de données: node ./BATCH/batch.js
    La date à partir de laquelle on charge les informations est à modifier dans le fichier code.

Pour effectuer les tests (et avoir les statistiques):
npx jest --coverage  --config jest.config.js 
