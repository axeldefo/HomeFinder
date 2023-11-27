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

    try{
        const dpe = await Service.readDpe(cp, DPE, GES);
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
    try {
        const result = await Service.getGeolocation(cp, DPE, GES);
        res.status(result.status).json(result.data);
    } catch (error) {
        console.error('Geolocation error:', error);
        res.status(500).json({ error: 'Geolocation failed' });
    }
    }