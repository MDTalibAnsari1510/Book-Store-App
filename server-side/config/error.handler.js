export const errorHandler = (err, req, res, next) => {
    let errMsg = '';
    if (err?.errors) {
        const keys = Object.keys(err.errors);
        console.log('==keys=========error ====',keys)
        if (keys && keys.length && err.errors[keys[0]] && err.errors[keys[0]].message) {
            errMsg = err.errors[keys[0]].message;
        }
    }
    let response = {};
    response = {
        status: err?.code || 500,
        message: errMsg || err?.message,
        success: false,
        errors: err,
        stack: err?.stack
    };

    res.status(response.status)
        .json(response)
        .end();
};