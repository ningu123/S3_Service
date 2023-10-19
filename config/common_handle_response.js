const common_respone = require("./common_response");

/*
 * Function to handle common responses.
 */
const handleCommonResponse = async ({ successCb, res }) => {
    try {
        return await successCb(({ data }) =>
            res.set("Connection", "close").status(200).json(data)
        );
    } catch (error) {
        console.log(error);
        return res
            .set("Connection", "close")
            .status(200)
            .send(
                common_respone.responseCb(
                    common_respone.headerCb({ code: 602 }),
                    common_respone.bodyCb({
                        val: error?.message
                    })
                )
            );
    }
};

/*
 * Function to handle field validation errors.
 */
const fieldValidationResponse = (res, errors) => {
    let errorList = [];
    errors.array().map(a => {
        delete a.type;
        delete a.value;
        delete a.location;
        errorList.push(a);
    });
    res
        .set("Connection", "close")
        .status(200)
        .send({
            header: {
                code: 601,
            },
            body: { value: errorList }
        });
};

module.exports = {
    handleCommonResponse,
    fieldValidationResponse,
};
