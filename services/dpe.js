const Dpe = require('../models/dpe');

exports.readAllDpe = async () => {
  return await Dpe.find({});
};


exports.readDpe = async (cp, DPE, GES) => {
    try {
        const result = await Dpe.find({
            "Code_postal_(BAN)": cp,
            "Etiquette_DPE": DPE,
            "Etiquette_GES": GES
        });

        return result;
    } catch (error) {
        console.error('readDpe error:', error);
        throw error;
    }
};
