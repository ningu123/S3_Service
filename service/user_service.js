const commonHandleFunction = require('../config/common_handle_response');
const responseBody = require('../config/common_response');
const { response_code } = require('../config/app_config.json');
const { validationResult } = require('express-validator');
const userRepository = require('../repository/user_repository');


async function registerUser(req, res) {
    const validationError = validationResult(req);
    
    if (!validationError.isEmpty()) {
        // If there are validation errors, respond with the error details.
        return commonHandleFunction.fieldValidationResponse(res, validationError);
    } else {
        commonHandleFunction.handleCommonResponse({
            successCb: async (successCb) => {
                try {
                    let addedUserResult = await userRepository.addUserRepository(req.body.userName);

                    if (addedUserResult) {
                        // Respond with success details.
                        successCb({
                            data: responseBody.responseCb(
                                responseBody.headerCb({ code: response_code.success }),
                                responseBody.bodyCb({ val: addedUserResult })
                            )
                        });
                    } else {
                        // Respond with an error if user registration fails.
                        successCb({
                            data: responseBody.responseCb(
                                responseBody.headerCb({ code: response_code.error_dbissue_serverissue }),
                                responseBody.bodyCb({ val: "Something Went Wrong" })
                            )
                        });
                    }
                } catch (error) {
                    // Handle any unexpected errors.
                    console.error('Error registering user:', error);
                    res.status(500).send('Internal Server Error');
                }
            },
            res: res,
        });
    }
}

module.exports = {
    registerUser
};
