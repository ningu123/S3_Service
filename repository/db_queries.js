// User queries
const addUser = `insert into usermanagement(access_key, user_name, expiry) values($1, $2, $3) returning access_key as "acceessKey"`;
const getUser = `select user_id as "userId" from usermanagement where access_key=$1 AND expiry=true`;

// Bucket queries
const createBucket = "insert into buckets(user_id, bucket_name) values($1, $2) returning bucket_id";
const getBucket = `select bucket_name as "bucketName" from buckets where user_id=$1 and bucket_id=$2`;
const getAllBucket = `select bucket_name as "bucketName", bucket_id as "bucketId" from buckets where user_id=$1`;
const deleteBucket = `delete from buckets where user_id=$1 and bucket_id=$2 returning user_id`;
const getBucketId = `select bucket_id as "bucketId" from buckets where bucket_name=$1 and user_id=$2`;
const updateBucket = `update buckets set bucket_name=$1 where bucket_name=$2 returning bucket_name`

// File queries
const addFile = `insert into files(bucket_id, file_name, path, type) values($1, $2, $3, $4) returning file_name as "fileName"`;
const getFiles = `select file_name as "fileName" from files where bucket_id=$1`;
const deleteFiles = "delete from files where file_name =$1 returning bucket_id";
const deleteBucketFiles = "delete from files where bucket_id=$1 returning bucket_id";
const getFilePath = "select path from files where file_name=$1";

module.exports = {
    // User
    addUser,
    getUser,

    // Buckets
    createBucket,
    getBucket,
    getAllBucket,
    deleteBucket,
    getBucketId,
    updateBucket,

    // Files
    addFile,
    getFiles,
    deleteFiles,
    deleteBucketFiles,
    getFilePath,
};
