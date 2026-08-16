const openDBConnection = require('../models/sqlDb');
const Trip = require('../models/sqlTrip');

// Get a list of all trips in the database.
const tripsList = async (req, res) => {
    const q = await Trip.getTrips();

    if (!q) {
        return res
            .status(404)
            .json(err);
    }
    else {
        return res
            .status(200)
            .json(q);
    }
};

// Get a single trip by its code
const tripsFindByCode = async (req, res) => {
    const q = await Trip.getTripByCode(req.params.tripCode);

    if (!q) {
        return res
            .status(404)
            .json(err);
    }
    else {
        return res
            .status(200)
            .json(q);
    }
};

const tripsAddTrip = async (req, res) => {
    const newTrip = new Trip(
        req.body.code,
        req.body.name,
        req.body.length,
        req.body.start,
        req.body.resort,
        req.body.perPerson,
        req.body.image,
        req.body.description
    );

    const q = await newTrip.saveNewTrip();

    if (!q) {
        return res.status(400).json(err);
    } else {
        return res.status(201).json(q);
    }
};

const tripsUpdateTrip = async (req, res) => {
    console.log(req.params);
    console.log(req.body);

    const trip = new Trip(
        req.body.code,
        req.body.name,
        req.body.length,
        req.body.start,
        req.body.resort,
        req.body.perPerson,
        req.body.image,
        req.body.description
    );

    const q = await trip.updateTrip(req.params.tripCode);

    if (!q) { // Database returned no data
        return res
            .status(400)
            .json(err);
    } else { // Return resulting updated trip
        return res
            .status(201)
            .json(q);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip
};


