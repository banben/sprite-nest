import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export default class TomfordLipstickSprite implements LipstickSprite {
    brand: string = 'tomford';
    home: string = LipstickURL.TOMFORD;
    getList({ page, data }): Promise<LipstickObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const productResults: LipstickObject[] = [];
                const mainUrl = data.url || data;
                await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
                const productList = await page.$('.tiles-container');
                const productHandles = await productList.$$('.grid-tile');
                for (let i = 0; i < productHandles.length; i++) {
                    const eNameHandle = await productHandles[i].$('.product-name a.name-link');
                    const priceHandle = await productHandles[i].$('.product-pricing .product-sales-price');
                    const e_name = await page.evaluate(e => e.textContent, eNameHandle);
                    const price = await page.evaluate(e => e.textContent, priceHandle);
                    const url = await page.evaluate(e => e.href, eNameHandle);
                    productResults.push({
                        brand: this.brand,
                        name: e_name.trim(),
                        e_name: e_name.trim(),
                        url: url,
                        price: price.replace(/[^0-9]/ig, ''),
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
                await page.waitForSelector('.swatches');
                const swatches = await page.$('.swatches');
                const liHandles = await swatches.$$('li');
                for (let i = 0; i < liHandles.length; i++) {
                    const swatchHandle = await liHandles[i].$('a.swatchanchor');
                    // const textHandle = await liHandles[i].$('a.swatchanchor')
                    const image = await page.evaluate(e => e.dataset.img, swatchHandle);
                    const text = await page.evaluate(e => e.textContent, swatchHandle);
                    const color = {
                        color_hex: '#',
                        color_text: text,
                        color_image: 'https:' + image
                    };
                    productColors.push(color);
                }
                console.log(`has ${productColors.length} colors`);
                resolve(productColors);
            } catch (err) {
                reject(new Error(err));
            }
        });
    }
}
