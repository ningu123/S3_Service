/**
 * Function to construct a response object.
 */
const responseCb = (header, body) => {
    return !body
        ? {
            "header": header,
        }
        : {
            "header": header,
            "body": body,
        };
}

/**
 * Function to create a header object.
 */
const headerCb = ({ code }) => {
    return {
        "code": code,
    };
}

/**
 * Function to create a body object with a value.
 */
const bodyCb = ({ val }) => {
    return {
        "value": !val ? null : val,
    };
}

module.exports = {
    headerCb,
    bodyCb,
    responseCb
};
