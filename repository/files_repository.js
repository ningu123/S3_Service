const pool = require('./database_connection');
const dbQuery = require('./db_queries');

/**
 * Get the ID of a bucket by its name and user ID.
 */
const getBucketId = async (bucketName, userId) => {
    try {
        let getUser = await pool.query(dbQuery.getBucketId, [
            bucketName, userId
        ]);
        return getUser?.rows[0] ?? undefined;
    } catch (error) {
        return undefined;
    }
}

/**
 * Upload a file to the database.
 */
const uploadFilesRepository = async (bucketId, filename, path, type) => {
    try {
        let addFile = await pool.query(dbQuery.addFile, [
            bucketId, filename, path, type
        ]);
        return addFile?.rows[0] ?? undefined;
    } catch (error) {
        return undefined;
    }
}

/**
 * Get all files in a specific bucket.
 */
const getAllFilesRepository = async (userId, bucketName) => {
    try {
        let bucketId = await getBucketId(bucketName, userId);
        let getFile = await pool.query(dbQuery.getFiles, [
            bucketId.bucketId
        ]);
        return getFile?.rows ?? undefined;
    } catch (error) {
        return undefined;
    }
}

/**
 * Delete a file by its ID.
 */
const deleteFilesRepository = async (fileId) => {
    try {
        let getFile = await pool.query(dbQuery.deleteFiles, [
            fileId
        ]);
        return getFile?.rows ?? undefined;
    } catch (error) {
        return undefined;
    }
}

/**
 * Get the path of a file by its ID.
 */
const getPath = async (fileId) => {
    try {
        let getFile = await pool.query(dbQuery.getFilePath, [
            fileId
        ]);
        return getFile?.rows[0] ?? undefined;
    } catch (error) {
        return undefined;
    }
}

module.exports = {
    getBucketId,
    uploadFilesRepository,
    getAllFilesRepository,
    deleteFilesRepository,
    getPath
};
