const bcrypt = require('bcryptjs');

/**
 * Hashes a string using a salt of 10.
 * @param {String} input value to hash.
 */
async function hash(input) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(input, salt);

    return hash;
}

/**
 * Check if a given input matches a hash.
 * @param {String} input input value (example: password).
 * @param {String} hash compare hash.
 */
async function hashMatches(input, hash) {
    return await bcrypt.compare(input, hash);
}

module.exports.hash = hash;
module.exports.hashMatches = hashMatches;