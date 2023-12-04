//  User controller

'use strict';
const UserModel = require('../../models/users'); 
const userService = require("../../services/users");
const debug = require('debug')('backend:api:users');
const dpeService = require('../../services/dpe');

exports.getMe = async (req, res, next) => {
        var email = req.user.email;
        console.log(email);
        
    console.log(req.user)
        const user = await userService.getUser(email);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
};


exports.getAllSearchResults = async (req, res, next) => {
    try {
      const userEmail = req.user.email;
      const searchResults = await UserModel.getAllSearchResults(userEmail);
      res.status(200).json(searchResults);
    } catch (error) {
      console.error('getAllSearchResults error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.deleteSearchResult = async (req, res, next) => {
    try {
      const userEmail = req.user.email; 
      const searchId = parseInt(req.params.id); 
      console.log(searchId);
      const result = await UserModel.deleteSearchResult(userEmail, searchId);
      res.status(200).json({ message: result });
    } catch (error) {
      console.error('deleteSearchResult error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.relaunchSearch = async (req, res) => {
    const { searchNumber } = req.params;
    const userEmail  = req.user.email; 
    
    try {
      const result = await dpeService.relaunchSearch(parseInt(searchNumber), userEmail);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in relaunchSearch controller:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };