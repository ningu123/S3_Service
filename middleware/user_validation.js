const { body } = require('express-validator');
const { response_code } = require('../config/app_config.json');
const userRepository = require('../repository/user_repository');
const responseBody = require('../config/common_response');
let name = /^[a-zA-Z ]{1,15}$/;

/**
 * Middleware to verify the user's access key.
 */
async function verifyAccessKey(req, res, next) {
    const accessKey = await userRepository.verifyAccessKey(req.query.accessKey);
    if (accessKey) {
        req.userId = accessKey.userId;
        next();
    } else {
        res.status(200).send(
            responseBody.responseCb(
                responseBody.headerCb({ code: response_code.unauthorize }),
                responseBody.bodyCb({ val: "Unauthorized access" })
            )
        );
    }
}

/**
 * Function to validate user credentials in a request body.
 * It checks if the userName is provided and matches a regular expression pattern.
 */
function checkUserCredential() {
    return [
        body("userName").custom((val) => {
            if (val == undefined || !(name.test(val))) {
                throw new Error("User Name mandatory");
            }
            return true;
        })
    ];
}

module.exports = {
    checkUserCredential,
    verifyAccessKey
};
