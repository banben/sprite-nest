import mongoose, { Schema, Document } from 'mongoose';
import { LipstickObject } from '@type/sprite';
export interface Lipstick extends Document, LipstickObject {}

export const LipstickSchema: Schema = new Schema({
  brand: { type: String, required: true },
  name: { type: String, unique: true },
  e_name: String,
  description: String,
  url: { type: String, required: true },
  price: Number,
  colors: [{
    color_text: String,
    color_hex: String,
    color_image: String,
    color_rgb: [Number],
    color_hsl: [Number]
  }]
});

export const LipstickModel = mongoose.model<Lipstick>('Lipstick', LipstickSchema);
