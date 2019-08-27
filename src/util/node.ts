import * as crypto from 'crypto';

export const getStringHash = (data: string, algorithm: string) => {
    const hash = crypto.createHash(algorithm);
    hash.update(data);
    const hashString = hash.digest('hex');
    return hashString;
};
