var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('../api/routes/index');
var helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./Swaggerdesrciption.json');

var app = express();
app.use(helmet());

// Définir le moteur de template Pug

app.set('views', path.join(__dirname, '../front/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, '../front/views')));

app.use('/api/v1', indexRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
});


// app.js ou index.js

const axios = require('axios');

// Désactiver les logs de requête et de réponse d'axios
axios.interceptors.request.use(request => {
    // Faites quelque chose avec la requête avant l'envoi (si nécessaire)
    return request;
}, error => {
    // Faites quelque chose avec les erreurs de requête (si nécessaire)
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    // Faites quelque chose avec la réponse avant de la renvoyer (si nécessaire)
    return response;
}, error => {
    // Faites quelque chose avec les erreurs de réponse (si nécessaire)
    return Promise.reject(error);
});

// Définir le niveau de journalisation sur 'none'
axios.defaults.logging = 'none';

// À partir de maintenant, axios ne devrait plus afficher les logs dans la console

// Importez vos autres dépendances et modules ici
// ...

// Votre code d'application commence ici
// ...

module.exports = app;
