const commonHandleFunction = require('../config/common_handle_response');
const responseBody = require('../config/common_response');
const { response_code } = require('../config/app_config.json');
const { validationResult } = require('express-validator');
const bucketRepository = require('../repository/bucket_repository');
const fs = require('fs');
const path = require('path');
const { getBucketId } = require('../repository/files_repository');

/**
 * Create a new bucket and handle the response.
 */
function createBucket(req, res) {
    const validationError = validationResult(req);

    return !validationError.isEmpty()
        ? commonHandleFunction.fieldValidationResponse(res, validationError)
        : commonHandleFunction.handleCommonResponse({
            successCb: async (successCb) => {
                let rootBucket = "Buckets";
                let bucketPath = `${rootBucket}/${req.body.bucketName}`;

                if (fs.existsSync(rootBucket)) {
                    if (fs.existsSync(bucketPath)) {
                        successCb({
                            data: responseBody.responseCb(
                                responseBody.headerCb({ code: response_code.duplication }),
                                responseBody.bodyCb({ val: "Bucket already exists" })
                            )
                        });
                    } else {
                        fs.mkdirSync(bucketPath);
                        let addedUserResult = await bucketRepository.createBucketRepository(req.body.bucketName, req.userId);
                        successCb({
                            data: responseBody.responseCb(
                                responseBody.headerCb({ code: response_code.success }),
                                responseBody.bodyCb({ val: addedUserResult ? "Bucket created successfully" : "Something went wrong" })
                            )
                        });
                    }
                } else {
                    fs.mkdirSync(rootBucket);
                    fs.mkdirSync(bucketPath);
                    let addedUserResult = await bucketRepository.createBucketRepository(req.body.bucketName, req.userId);
                    successCb({
                        data: responseBody.responseCb(
                            responseBody.headerCb({ code: response_code.success }),
                            responseBody.bodyCb({ val: addedUserResult ? "Bucket created successfully" : "Something went wrong" })
                        )
                    });
                }
            },
            res: res,
        });
}

/**
 * Get a specific bucket and handle the response.
 */
function getBucket(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: async (successCb) => {
            let bucket = await bucketRepository.getBucketRepository(req.query.bucketId, req.userId);

            if (bucket) {
                successCb({
                    data: responseBody.responseCb(
                        responseBody.headerCb({ code: bucket.length > 0 ? response_code.success : response_code.no_data_found }),
                        responseBody.bodyCb({ val: bucket.length > 0 ? bucket : "No Data Found" })
                    )
                });
            } else {
                successCb({
                    data: responseBody.responseCb(
                        responseBody.headerCb({ code: response_code.error_dbissue_serverissue }),
                        responseBody.bodyCb({ val: "Something went wrong" })
                    )
                });
            }
        },
        res: res,
    });
}

/**
 * Get all buckets and handle the response.
 */
function getALLBuckets(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: async (successCb) => {
            let buckets = await bucketRepository.getAllBucketRepository(req.userId);

            if (buckets) {
                successCb({
                    data: responseBody.responseCb(
                        responseBody.headerCb({ code: buckets.length > 0 ? response_code.success : response_code.no_data_found }),
                        responseBody.bodyCb({ val: buckets.length > 0 ? buckets : "No Data Found" })
                    )
                });
            } else {
                successCb({
                    data: responseBody.responseCb(
                        responseBody.headerCb({ code: response_code.error_dbissue_serverissue }),
                        responseBody.bodyCb({ val: "Something went wrong" })
                    )
                });
            }
        },
        res: res,
    });
}

/**
 * Delete a bucket and handle the response.
 */
function deleteBucket(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: async (successCb) => {
            let rootBucket = "Buckets";
            let bucketPath = `${rootBucket}/${req.body.bucketName}`;

            if (fs.existsSync(rootBucket)) {
                if (fs.existsSync(bucketPath)) {
                    const files = fs.readdirSync(bucketPath);

                    for (const file of files) {
                        const filePath = path.join(bucketPath, file);
                        fs.unlinkSync(filePath);
                    }

                    fs.rmdirSync(bucketPath);
                    let bucketId = await getBucketId(req.body.bucketName, req.userId);
                    let buckets = await bucketRepository.deleteBucketRepository(bucketId?.bucketId, req.userId);

                    if (buckets) {
                        successCb({
                            data: responseBody.responseCb(
                                responseBody.headerCb({ code: response_code.success }),
                                responseBody.bodyCb({ val: "Bucket deleted successfully" })
                            )
                        });
                    } else {
                        successCb({
                            data: responseBody.responseCb(
                                responseBody.headerCb({ code: response_code.error_dbissue_serverissue }),
                                responseBody.bodyCb({ val: "Something went wrong" })
                            )
                        });
                    }
                } else {
                    successCb({
                        data: responseBody.responseCb(
                            responseBody.headerCb({ code: response_code.no_data_found }),
                            responseBody.bodyCb({ val: "No Data Found" })
                        )
                    });
                }
            }
        },
        res: res,
    });
}

function updateBucket(req, res) {
    const validationError = validationResult(req);

    return !validationError.isEmpty()
        ? commonHandleFunction.fieldValidationResponse(res, validationError)
        : commonHandleFunction.handleCommonResponse({
            successCb: async (successCb) => {
                let rootBucket = "Buckets";
                let bucketPath = `${rootBucket}/${req.body.bucketName}`;
                let newFolderName = `${rootBucket}/${req.body.newBucketName}`
                if (fs.existsSync(rootBucket) && fs.existsSync(bucketPath)) {
                    fs.rename(bucketPath, newFolderName, async (err) => {
                        if (err) {
                            successCb({
                                data: responseBody.responseCb(
                                    responseBody.headerCb({ code: response_code.success }),
                                    responseBody.bodyCb({ val: "Something went wrong" })
                                )
                            });
                        } else {
                            let dbBucketUpdate = await bucketRepository.updateDbBucket(req.body.newBucketName,req.body.bucketName);
                            successCb({
                                data: responseBody.responseCb(
                                    responseBody.headerCb({ code: response_code.success }),
                                    responseBody.bodyCb({ val: dbBucketUpdate ? " Bucket renamed successfully" : "Something went wrong" })
                                )
                            });
                            console.log('Folder renamed successfully.');
                        }
                    });
                } else {
                    successCb({
                        data: responseBody.responseCb(
                            responseBody.headerCb({ code: response_code.success }),
                            responseBody.bodyCb({ val: "No Bucket Found" })
                        )
                    });
                }
            },
            res: res,
        });
}

module.exports = {
    createBucket,
    getBucket,
    getALLBuckets,
    deleteBucket,
    updateBucket,
};
