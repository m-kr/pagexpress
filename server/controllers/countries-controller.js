const { Country, countryValidationSchema } = require('../models/Country');

const getCountries = async (req, res) => {
  const { countryId } = req.params;

  try {
    if (countryId) {
      const singleCountry = await Country.findById(countryId);

      if (!singleCountry) {
        throw new Error('Country not exist');
      }

      res.send(singleCountry);
    } else {
      const countries = await Country.find();

      res.send(countries);
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const createCountry = async (req, res) => {
  const { error } = countryValidationSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const country = new Country(req.body);
    await country.save();
    res.send(country._id);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateCountry = async (req, res) => {
  const { error } = countryValidationSchema.validate(req.body);
  const { countryId } = req.params;

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const country = await Country.findOneAndUpdate({ _id: countryId }, req.body);
    res.send(country);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const deleteCountry = async (req, res) => {
  const { countryId } = req.params;

  try {
    await Country.findByIdAndRemove(countryId);
    res.send(countryId);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

module.exports = {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
};
