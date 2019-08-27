import mongoose from 'mongoose';
import { LipstickModel } from '@db/model';
import { LipstickObject } from '@type/sprite';
export const connectMongo = (uri: string, callback: (err) => void, options?): void => {
    mongoose.connect(uri, options, callback);
};

export class LipstickOperation {
    async save(document: LipstickObject): Promise<any> {
        // update document in collection
        const { name } = document;
        const doc = await LipstickModel.findOne({ name });
        if (!doc) {
            (new LipstickModel(document)).save();
        } else {
            await LipstickModel.updateOne({ name }, document);
        }
    }
    deleteMany(options): void {
        LipstickModel.deleteMany(options);
    }
}
