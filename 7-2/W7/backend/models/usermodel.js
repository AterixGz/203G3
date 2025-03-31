// const db = require('../config/db');

// const User = {
//     findByUsername: (username, callback) => {
//         db.query('SELECT * FROM users WHERE username = ?', [username], callback);
//     }
// };

// module.exports = User;\

const db = require('../config/db');

const User = {
    findByEmail: (email, callback) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], callback);
    },
    create: (username, email, password, callback) => {
        db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
            [username, email, password], callback);
    }
};

module.exports = User;
