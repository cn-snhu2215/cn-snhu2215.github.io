const openDBConnection = require('../models/sqlDb');

class Trip {
    constructor(code, name, length, start, resort, perPerson, image, description) {
        
            this.tripID = null;
            this.code = code;
            this.name = name;
            this.length = length;
            this.start = start;
            this.resort = resort;
            this.perPerson = perPerson;
            this.image = image;
            this.description = description;
        
    }

    static async getTrips() {
        const db = await openDBConnection();
        const rows = await db.all('SELECT * FROM Trips');
        return rows.map(row => new Trip(row.code, row.name, row.length, row.start, row.resort, row.perPerson, row.image, row.description));
    }

    static async getTripByCode(code) {
        const db = await openDBConnection();
        const row = await db.get('SELECT * FROM Trips WHERE code = ?', [code]);

        if (!row) return null;

        return new Trip(row.code, row.name, row.length, row.start, row.resort, row.perPerson, row.image, row.description);
    }

    async saveNewTrip() {
        const db = await openDBConnection();

        const result = await db.run(`INSERT INTO Trips(code, name, length, start, resort, perPerson, image, description)` +  
            `VALUES(?, ?, ?, ?, ?, ?, ?, ?)`, [this.code, this.name, this.length, this.start, this.resort, this.perPerson, this.image, this.description]);

        if (!result) return null;

        // Get the tripID from the newly created db record
        this.tripID = result.lastID;
        return this;
    }

    async updateTrip(tripCode) {
        const db = await openDBConnection();

        const result = await db.run(`UPDATE Trips SET code = ?, name = ?, length = ?, start = ?, resort = ?, perPerson = ?, image = ?, description = ?` + 
            `WHERE code = ?`, [this.code, this.name, this.length, this.start, this.resort, this.perPerson, this.image, this.description, tripCode]
        );

        if (!result) return null;

        this.tripID = result.lastID;
        return this;
    }
}

module.exports = Trip;