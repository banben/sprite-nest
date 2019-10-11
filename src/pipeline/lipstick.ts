// import { LipstickObject } from '../../config/interface';
import parseColor from '@util/parseColor';
import { connectMongo, LipstickOperation } from '@db/opera';
import { DB_CONFIG } from '@config/index';
import { LipstickObject } from '@type/sprite';

export const colorParse = async (data: LipstickObject[]): Promise<LipstickObject[]> => {
    const parsed = await parseColor(data);
    return parsed;
};

const mongoUri = DB_CONFIG.MongoURI;
export const dataSync = async (data: LipstickObject[]): Promise<boolean> => {
    const results = data;
    const lipstickOperation = new LipstickOperation();
    connectMongo(mongoUri, err => {
        if (!err) return;
        console.log(err);
        process.exit(0);
    });
    try {
        for (let i = 0; i < results.length; i ++) {
            await lipstickOperation.save(results[i]);
        }
    } catch (e) {
        return false;
    }
    return true;
};
// export default lipstickPipe;
