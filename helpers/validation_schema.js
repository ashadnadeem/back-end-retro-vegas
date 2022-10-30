const JOI = require('@hapi/joi');

const authSchema = JOI.object({
    email: JOI.string().email().required(),
    password: JOI.string().min(6).required(),
});

module.exports = {
    authSchema,
};