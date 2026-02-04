import jwt from 'jsonwebtoken';
import fs from 'fs';

const privateKey = fs.readFileSync('secrets/private.pem', 'utf8');

export const generateAccessToken = async (user: any) => {
    const payload = {
        userId: user.id,
        nomorInduk: user.nomorInduk,
    };

    return jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '60m',
    });
};

export const generateRefreshToken = async (user: any) => {
    const payload = {
        userId: user.id,
        nomorInduk: user.nomorInduk,
    };

    return jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '3d',
    });
};

export const generateResetPasswordToken = async (userId: any) => {
    const payload = {
        userId: userId,
    };

    return jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '30m'
    })
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, privateKey, {
        algorithms: ['RS256'],
    })
}