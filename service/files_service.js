const commonHandleFunction = require('../config/common_handle_response');
const responseBody = require('../config/common_response');
const { response_code } = require('../config/app_config.json');
const filesRepository = require('../repository/files_repository');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { createBucketRepository } = require('../repository/bucket_repository');

/**
 * Upload files and handle the response.
 */
function uploadFiles(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: async (successCb) => {
            let filename = req.file.filename;
            let filePath = req.file.destination + filename;
            let uploadedFile = await filesRepository.uploadFilesRepository(req.bucketId, filename, filePath, req.file.mimetype);
            successCb({
                data: responseBody.responseCb(
                    responseBody.headerCb({ code: uploadedFile ? response_code.success : response_code.error_dbissue_serverissue }),
                    responseBody.bodyCb({ val: uploadedFile || "Something went wrong" })
                )
            });
        },
        res: res,
    });
}

/**
 * Get all files and handle the response.
 */
function getALLFiles(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: async (successCb) => {
            if (req.query.bucketName) {
                let files = await filesRepository.getAllFilesRepository(req.userId, req.query.bucketName);
                if (files) {
                    successCb({
                        data: responseBody.responseCb(
                            responseBody.headerCb({ code: files.length > 0 ? response_code.success : response_code.no_data_found }),
                            responseBody.bodyCb({ val: files.length > 0 ? files : "No Data Found" })
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
                        responseBody.bodyCb({ val: "Enter the bucket Name" })
                    )
                });
            }
        },
        res: res,
    });
}

/**
 * Delete files and handle the response.
  */
function deleteFiles(req, res) {
    return commonHandleFunction.handleCommonResponse({
        successCb: async (successCb) => {
            let rootBucket = "Buckets";
            let bucketPath = `${rootBucket}/${req.body.bucketName}`;
            let filePath = `${bucketPath}/${req.body.fileName}`;
            if (fs.existsSync(rootBucket) && fs.existsSync(bucketPath) && fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                let files = await filesRepository.deleteFilesRepository(req.body.fileName);
                successCb({
                    data: responseBody.responseCb(
                        responseBody.headerCb({ code: files ? response_code.success : response_code.error_dbissue_serverissue }),
                        responseBody.bodyCb({ val: files ? "File deleted successfully" : "Something went wrong" })
                    )
                });
            } else {
                successCb({
                    data: responseBody.responseCb(
                        responseBody.headerCb({ code: response_code.no_data_found }),
                        responseBody.bodyCb({ val: "No Data Found" })
                    )
                });
            }
        },
        res: res,
    });
}

/**
 * Create a multer middleware for single file uploads.
 */
const singleupload = () => {
    let imageUpload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                const bucketName = req.query.bucketName;
                const uploadPath = `Buckets/${bucketName}/`;
                fs.mkdirSync(uploadPath, { recursive: true });
                cb(null, uploadPath);
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + path.extname(file.originalname));
            },
        }),
        limits: { fileSize: 50000000 },
        fileFilter: function (req, file, cb) {
            cb(null, true);
        },
    });
    return imageUpload;
}

/**
 * Check if the specified bucket exists and retrieve its ID.
 */
async function checkBucket(req, res, next) {
    if (fs.existsSync(`Buckets/${req.query.bucketName}`)) {
        let bucketId = await filesRepository.getBucketId(req.query?.bucketName, req.userId);
        let id = !bucketId || await createBucketRepository(req.query.bucketName, req.userId);
        req.bucketId = bucketId ? bucketId.bucketId : id?.bucket_id;
        next();
    } else {
        res.status(200).send(
            responseBody.responseCb(
                responseBody.headerCb({ code: response_code.no_data_found }),
                responseBody.bodyCb({ val: "Bucket Not exist" })
            )
        );
    }
}

module.exports = {
    getALLFiles,
    deleteFiles,
    singleupload,
    checkBucket,
    uploadFiles,
};
