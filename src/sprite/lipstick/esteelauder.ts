import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export default class EsteelauderLipstickSprite implements LipstickSprite {
    brand: string = 'esteelauder';
    home: string = LipstickURL.ESTEELAUDER;
    getList({ page, data }): Promise<LipstickObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const productResults: LipstickObject[] = [];
                const mainUrl = data.url || data;
                await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
                await page.waitForSelector('.mpp__product-grid');
                const productList = await page.$('.mpp__product-grid');
                const productHandles = await productList.$$('.mpp__product');
                for (let i = 0; i < productHandles.length; i++) {
                    const eNameHandle = await productHandles[i].$('.product_brief__header');
                    const nameHandle = await productHandles[i].$('.product_brief__sub-header');
                    const priceHandle = await productHandles[i].$('.product_brief__price');
                    const urlHandle = await productHandles[i].$('.product_brief__image-container');
                    const e_name = await page.evaluate(e => e.innerHTML, eNameHandle);
                    const name = await page.evaluate(e => e.innerHTML, nameHandle);
                    const price = await page.evaluate(e => e.innerHTML, priceHandle);
                    const url = await page.evaluate(e => e.href, urlHandle);
                    productResults.push({
                        brand: this.brand,
                        name,
                        e_name,
                        description: '',
                        url: url,
                        price: price,
                        colors: []
                    });
                }
                resolve(productResults);
            } catch (err) {
                reject(new Error(err));
            }
        });
    }
    getDetail({ page, data }): Promise<LipstickColor[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const productColors: LipstickColor[] = [];
                const mainUrl = data.url || data;
                await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
                await page.waitForSelector('.shade-list');
                const swatches = await page.$('.shade-list');
                const liHandles = await swatches.$$('.swatches--single');
                for (let i = 0; i < liHandles.length; i++) {
                    const colorHandle = await liHandles[i].$('.swatch__container .swatch--1');
                    const textHandle = await liHandles[i].$('a');
                    const colorHex = await page.evaluate(e => e.style.backgroundColor, colorHandle);
                    const text = await page.evaluate(e => e.name, textHandle);
                    const color = {
                        color_hex: colorHex,
                        color_text: text
                    };
                    productColors.push(color);
                }
                resolve(productColors);
            } catch (err) {
                reject(new Error(err));
            }
        });
    }
}
