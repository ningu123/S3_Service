const { body } = require('express-validator');
let name = /^[a-zA-Z0-9]{1,25}$/;

/**
 * Function to validate bucket credentials in a request body.
 * It checks if the bucketName is provided and matches a regular expression pattern.
 */
function checkBucketCredential() {
    return [
        body("bucketName").custom((val) => {
            if (val == undefined || !(name.test(val))) {
                throw new Error("Enter Bucket Name");
            }
            return true;
        })
    ];
}

module.exports = {
    checkBucketCredential
};
