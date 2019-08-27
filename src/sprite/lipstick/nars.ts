import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export default class NarsLipstickSprite implements LipstickSprite {
    brand: string = 'nars';
    home: string = LipstickURL.NARS;
    getList({ page, data }): Promise<LipstickObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const productResults: LipstickObject[] = [];
                const mainUrl = data.url || data;
                await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
                await page.waitForSelector('.search-result-container');
                const productList = await page.$('.search-result-container');
                const productHandles = await productList.$$('.product-columns');
                for (let i = 0; i < productHandles.length; i++) {
                    const nameHandle = await productHandles[i].$('.name-link');
                    const priceHandle = await productHandles[i].$('.price-sales');
                    const name = await page.evaluate(e => e.innerHTML, nameHandle);
                    const price = await page.evaluate(e => e.textContent, priceHandle);
                    const url = await page.evaluate(e => e.href, nameHandle);
                    const sameProduct = productResults.findIndex(e => {
                        return e.name === name;
                    });
                    if (sameProduct > -1) continue;
                    productResults.push({
                        brand: this.brand,
                        name,
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
                const swatches = await page.$('.swatches');
                const liHandles = await swatches.$$('li');
                for (let i = 0; i < liHandles.length; i++) {
                    const colorHandle = await liHandles[i].$('.swatch-block');
                    const textHandle = await liHandles[i].$('.hide');
                    const colorHex = await page.evaluate(e => e.style.backgroundColor, colorHandle);
                    const text = await page.evaluate(e => e.getAttribute('alt'), textHandle);
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

