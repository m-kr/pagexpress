const { Country, countryValidationSchema } = require('../models/Country');
const { BadRequest, NotFound } = require('../utils/errors');

const getCountries = async (req, res, next) => {
  const { countryId } = req.params;

  try {
    const query = countryId ? Country.findById(countryId) : Country.find();
    const data = await query.exec();

    if (countryId && !data) {
      throw new NotFound('Country not exist');
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createCountry = async (req, res, next) => {
  const { error } = countryValidationSchema.validate(req.body);

  if (error) {
    throw new BadRequest(error.details[0].message);
  }

  try {
    const country = new Country(req.body);
    await country.save();
    res.send(country._id);
  } catch (err) {
    next(err);
  }
};

const updateCountry = async (req, res, next) => {
  const { error } = countryValidationSchema.validate(req.body);
  const { countryId } = req.params;

  if (error) {
    throw new BadRequest(error.details[0].message);
  }

  try {
    const country = await Country.findOneAndUpdate({ _id: countryId }, req.body);
    res.json(country);
  } catch (err) {
    next(err);
  }
};

const deleteCountry = async (req, res, next) => {
  const { countryId } = req.params;

  try {
    await Country.findByIdAndRemove(countryId);
    res.send(countryId);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
};
