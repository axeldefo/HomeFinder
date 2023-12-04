//  DPE controller

'use strict';

const Service = require('../../services/dpe');
const debug = require('debug')('backend:ctrl:dpe');


exports.getAll = async (req, res, next) => {
  debug('get all');
 try{
    
    const dpe = await Service.readAllDpe();

    if(dpe){
        res.status(200).json(dpe);
    }else
      return res.status(404).json({message: 'no dpe found'});
    }
    catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.readDpe = async (req, res, next) => {
    const cp = req.query.codep;
    const DPE = req.query.dpe;
    const GES = req.query.ges;
    var email = req.user.email;
 
    try{
        const dpe = await Service.readDpe(cp, DPE, GES, email);
        if(dpe){
            res.status(200).json(dpe);
        }else
          return res.status(404).json({message: 'no dpe found'});
        }
        catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        }
};

exports.readDpePlus = async (req, res, next) => {
  const cp = req.query.codep;
  const DPE = req.query.dpe;
  const GES = req.query.ges;
  const superficie = req.query.superficie;
  const date = req.query.date;
  var email = req.user.email;

  try{
      const dpe = await Service.readDpePlus(cp, DPE, GES, superficie, date, email);
      if(dpe){
          res.status(200).json(dpe);
      }else
        return res.status(404).json({message: 'no dpe found'});
      }
      catch (error) {
      res.status(500).json({ error: 'Internal server error' });
      }
};



exports.getGeolocation = async (req, res, next) => {
    debug('get geolocation');

    const cp = req.query.codep;
    const DPE = req.query.dpe;
    const GES = req.query.ges;
     var email = req.user.email;

    try {
        const result = await Service.getGeolocation(cp, DPE, GES, email);
        res.status(200).json(result);
    } catch (error) {
        console.error('Geolocation error:', error);
        res.status(500).json({ error: 'Geolocation failed' });
    }
}

exports.getGeolocationPlus = async (req, res, next) => {
    debug('get geolocation');

    const cp = req.query.codep;
    const DPE = req.query.dpe;
    const GES = req.query.ges;
    const superficie = req.query.superficie;
    const date = req.query.date;
    var email = req.user.email;

    try {
        const result = await Service.getGeolocationPlus(cp, DPE, GES, superficie, date, email);
        res.status(200).json(result);
    } catch (error) {
        console.error('Geolocation error:', error);
        res.status(500).json({ error: 'Geolocation failed' });
    }
}

exports.getDataFromSite = async (req, res, next) => {
    debug('get data from immonot');

    const url = req.query.url;
    var email = req.user.email;

    try {
        const result = await Service.extractDataFromSite(url, email);
        res.status(200).json(result);
        console.log(result);
    } catch (error) {
        console.error('Immonot failed error:', error);
        res.status(500).json({ error: 'Immonot failed failed' });
    }
}