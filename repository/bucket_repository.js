const pool = require('./database_connection');
const dbQuery = require('./db_queries');

/**
 * Create a new bucket in the database.
 */
const createBucketRepository = async (bucketName, userId) => {
    try {
        let addBucket = await pool.query(dbQuery.createBucket, [
            userId, bucketName
        ]);
        return addBucket?.rows[0] ?? undefined;
    } catch (error) {
        return undefined;
    }
}

/**
 * Get a specific bucket by its ID and user ID.
 */
const getBucketRepository = async (bucketId, userId) => {
    try {
        let getBucket = await pool.query(dbQuery.getBucket, [
            userId, bucketId
        ]);
        return getBucket?.rows ?? undefined;
    } catch (error) {
        return undefined;
    }
}

/**
 * Get all buckets for a specific user.
 */
const getAllBucketRepository = async (userId) => {
    try {
        let getBucket = await pool.query(dbQuery.getAllBucket, [
            userId
        ]);
        return getBucket?.rows ?? undefined;
    } catch (error) {
        return undefined;
    }
}

/**
 * Delete a bucket and its associated files, handling transactions.
 */
const deleteBucketRepository = async (bucketId, userId) => {
    let client = await pool.connect();
    try {
        await client.query('BEGIN');
        let deleteFiles = await client.query(dbQuery.deleteBucketFiles, [bucketId]);
        let deleteBucket;
        if (deleteFiles.rows) {
            deleteBucket = await client.query(dbQuery.deleteBucket, [userId, bucketId]);
        }
        await client.query('COMMIT');
        return deleteBucket?.rows ? true : undefined;
    } catch (error) {
        await client.query('ROLLBACK');
        return undefined;
    } finally {
        client.release();
    }
}
const updateDbBucket = async (newBucket, oldBucket) => {
    try {
        let getBucket = await pool.query(dbQuery.updateBucket, [
            newBucket, oldBucket
        ]);
        return getBucket?.rows ?? undefined;
    } catch (error) {
        return undefined;
    }
}
module.exports = {
    createBucketRepository,
    getBucketRepository,
    deleteBucketRepository,
    getAllBucketRepository,
    updateDbBucket
};
