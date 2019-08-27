import rgbHex from 'rgb-hex';
import * as convert from 'color-convert';
import splashy from 'splashy';

import { getStringHash } from './node';
import { LipstickObject } from  '@type/sprite';
// const convert = require('color-convert')
// const splashy = require('splashy')()

// const uuidv4 = require('uuid/v4')
const l = console.log;
const parseColor = async (obj: LipstickObject[]): Promise<LipstickObject[]> => {
    if (!obj) return [];
    const data: LipstickObject[] = [];
    for (let i = 0, len = obj.length; i < len; i = i + 1) {
        const e = obj[i];
        const price = !e.price ? '0' : e.price.replace(/[^0-9.]/ig, '');
        // const productID = getStringHash(e.name, 'md5');
        // e.productID = productID;
        e.price = price;
        if (e.colors && e.colors.length > 0) {
            if (!e.colors[0].color_image) {
                for (const c of e.colors) {
                    const hex = c.color_hex ? Array.isArray(c.color_hex) ? rgbHex(c.color_hex) : c.color_hex : '';
                    c.color_hex = hex;
                    c.color_rgb = hex ? convert.hex.rgb(hex) : [];
                    c.color_hsl = hex ? convert.hex.hsl(hex) : [];
                }
            } else {
                for (const c of e.colors ) {
                    try {
                        const imgUrl = c.color_image;
                        const palette = await splashy(imgUrl);
                        const dominantColor = palette[0];
                        // l('dominantColor', dominantColor);
                        if (dominantColor !== undefined) {
                            c.color_hex = dominantColor;
                            c.color_rgb = convert.hex.rgb(dominantColor);
                            c.color_hsl = convert.hex.hsl(dominantColor);
                        }
                    } catch (err) {
                        l(err);
                    }
                }
            }
        }
        data.push(e);
    }
    return data;
};

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

export default parseColor;
