import JWT from 'jsonwebtoken';
import createError from 'http-errors';

export function signAccessToken(userId) {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: '1h',
            issuer: 'BasicAPI Demo Team',
            audience: userId,
        };
        
        JWT.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err.message);
                reject(createError.InternalServerError());
            }
            resolve(token);
        });
    });
}
export function verifyAccessToken(req, res, next) {
    if (!req.headers['authorization'])
        return next(Unauthorized());
    const authHeader = req.headers['authorization'];
    const bearerToken = authHeader.split(' ');
    const token = bearerToken[1];
    const secret = process.env.ACCESS_TOKEN_SECRET;
    JWT.verify(token, secret, (err, payload) => {
        if (err) {
            const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message;
            return next(createError.Unauthorized(message));
        }
        req.payload = payload;
        next();
    });
}
export function signRefreshToken(userId) {
    return new Promise((resolve, reject) => {
        const payload = {};
        const secret = process.env.REFRESH_TOKEN_SECRET;
        const options = {
            expiresIn: '5m',
            issuer: 'BasicAPI Demo Team',
            audience: userId,
        };
        JWT.sign(payload, secret, options, (err, token) => {
            if (err) {
                console.log(err.message);
                reject(createError.InternalServerError());
            }
            resolve(token);
        });
    });
}
export function verifyRefreshToken(refreshToken) {
    return new Promise((resolve, reject) => {
        const secret = process.env.REFRESH_TOKEN_SECRET;
        JWT.verify(refreshToken, secret, (err, payload) => {
            if (err)
                return reject(createError.Unauthorized());
            // Extract the userId from the payload
            const userId = payload.aud;
            resolve(userId);
        });
    });
}