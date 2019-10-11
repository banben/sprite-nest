import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export default class CovergirlLipstickSprite implements LipstickSprite {
    brand: string = 'covergirl';
    home: string = LipstickURL.COVERGIRL;
    getList({ page, data }): Promise<LipstickObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const productResults: LipstickObject[] = [];
                const mainUrl = this.home;
                await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
                await page.waitFor('.product-grid');
                const productList = await page.$('.product-grid');
                const productHandles = await productList.$$('.ProductTile');
                for (let i = 0; i < productHandles.length; i = i + 1) {
                    const eNameHandle = await productHandles[i].$('.pdp-link a');
                    const e_name = await page.evaluate(e => e.textContent, eNameHandle);
                    const url = await page.evaluate(e => e.href, eNameHandle);
                    productResults.push({
                        brand: this.brand,
                        url,
                        e_name,
                        name: e_name,
                        price: '',
                        colors: [],
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
                await page.waitForSelector('.ProductDetails__attribute');
                const swatchHandle = await page.$('.ProductDetails__attribute');
                const swatchHandles = await swatchHandle.$$('.Swatch');
                for (let i = 0; i < swatchHandles.length; i = i + 1) {
                    const textHandle = await swatchHandles[i].$('.color-value');
                    const imageHandle = await textHandle.$('.Swatch__image');
                    const image = await page.evaluate(e => e.src, imageHandle);
                    const text = await page.evaluate(e => e.dataset.attrDisplayName, textHandle);
                    const color = {
                        color_hex: '#',
                        color_text: text,
                        color_image: image,
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
