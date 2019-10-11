import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export default class MacLipstickSprite implements LipstickSprite {
    brand: string = 'mac';
    home: string = LipstickURL.MAC;
    getList({ page, data }): Promise<LipstickObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const productResults: LipstickObject[] = [];
                const mainUrl = this.home;
                await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
                await page.waitFor('.grid--mpp');
                const productList = await page.$('.grid--mpp');
                const productHandles = await productList.$$('.grid--mpp__item');
                for (let i = 0; i < productHandles.length; i++) {
                    const nameHandle = await productHandles[i].$('.product__subline');
                    const eNameHandle = await productHandles[i].$('.product__description-short');
                    const priceHandle = await productHandles[i].$('.product__price--standard');
                    const urlHandle = await productHandles[i].$('.product__image-medium-link');
                    const name = await page.evaluate(e => e.innerHTML, nameHandle);
                    const e_name = await page.evaluate(e => e.innerHTML, eNameHandle);
                    const price = await page.evaluate(e => e.innerHTML, priceHandle);
                    const url = await page.evaluate(e => e.href, urlHandle);
                    productResults.push({
                        brand: this.brand,
                        name,
                        e_name,
                        description: '',
                        url,
                        price,
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
                await page.waitForSelector('.shade-picker__colors');
                const swatches = await page.$('.shade-picker__colors');
                const liHandles = await swatches.$$('.shade-picker__color');
                for (let i = 0; i < liHandles.length; i++) {
                    const wrapperHandle = await liHandles[i].$('.shade-picker__color-wrapper .shade-picker__color-chip');
                    const colorHex = await page.evaluate(e => e.style.backgroundColor, wrapperHandle);
                    const text = await page.evaluate(e => e.title, wrapperHandle);
                    const color = {
                        color_hex: colorHex,
                        color_text: text
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
