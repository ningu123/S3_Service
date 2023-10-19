const pool = require('./database_connection');
const dbQuery = require('./db_queries');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate a secret key of the specified size.
 */
const generateSecretKey = (size) => {
    const numBytes = Math.ceil(size / 2);
    const randomBytes = uuidv4(null, Buffer.alloc(numBytes));
    const key = randomBytes.toString('hex').slice(0, size);
    return key.toUpperCase();
};

/**
 * Add a user to the database.
 */
const addUserRepository = async (userName) => {
    try {
        let accessKey = userName && generateSecretKey(32);
        let addUser = await pool.query(dbQuery.addUser, [
            accessKey, userName, true
        ]);
        return addUser?.rows[0] ?? undefined;
    } catch (error) {
        console.log(error.message);
        return undefined;
    }
};

/**
 * Verify an access key by querying the database.
 */
const verifyAccessKey = async (accessKey) => {
    try {
        let getUser = await pool.query(dbQuery.getUser, [
            accessKey
        ]);
        return getUser?.rows[0] ?? undefined;
    } catch (error) {
        return undefined;
    }
};

module.exports = {
    addUserRepository,
    verifyAccessKey
};
