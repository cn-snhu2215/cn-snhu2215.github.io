const openDBConnection = require('./sqlDb');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class User {
    constructor(email, name, hash, salt, role) {

            this.userID = null;
            this.email = email;
            this.name = name;
            this.hash = hash;
            this.salt = salt;
            this.role = role;
        
    }

    // Method to set the password
    setPassword = function (password) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt,
            1000, 64, 'sha512').toString('hex');
    };

    // Method to compare entered password against stored hash
    validPassword = function (password) {
        var hash = crypto.pbkdf2Sync(password,
            this.salt, 1000, 64, 'sha512').toString('hex');
        return this.hash === hash;
    };

    // Method to generate a JSON Web Token for the current record
    generateJWT = function () {
         return jwt.sign(
            { // Payload for our JSON Web Token
                _id: this._id,
                email: this.email,
                name: this.name,
            },
            process.env.JWT_SECRET, //SECRET stored in .env file
            { expiresIn: '1h' }); //Token expires an hour from creation
    };

    static async findbyEmail(email) {
        const db = await openDBConnection();

        const row = await db.get('SELECT * FROM Users WHERE email = ?', [email]);

        if (!row) return null;

        return new User(row);
    }

    async saveNewUser() {
        const db = await openDBConnection();

        const result = await db.run(`INSERT INTO Users(email, name, hash, salt, role)` +  
            `VALUES(?, ?, ?, ?, ?)`, [this.email, this.name, this.hash, this.salt, this.role]);

        if (!result) return null;

        // Get the userID from the newly created db record
        this.userID = result.lastID;
        return this;
    }
}

module.exports = User;