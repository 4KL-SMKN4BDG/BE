import bcrypt from 'bcrypt';

const SALT_ROUND = 10;

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, SALT_ROUND).then(function (hash) {
        return hash;
    });
};

export const compare = async (password: string, hash: string) => {
    return bcrypt.compare(password, hash).then(function (result) {
        return result;
    });
};