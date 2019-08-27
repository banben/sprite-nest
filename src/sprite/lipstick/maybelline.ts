import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export default class MaybellineLipstickSprite implements LipstickSprite {
    brand: string = 'maybelline';
    home: string = LipstickURL.MAYBELLINE;
    getList({ page, data }): Promise<LipstickObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const productResults: LipstickObject[] = [];
                const mainUrl = data.url || data;
                await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
                await page.waitFor('.product-content-grid__grid');
                await page.click('.product-content-grid__load-more');
                await page.waitFor(1000);
                const productList = await page.$('.product-content-grid__grid');
                const productHandles = await productList.$$('.product-content-grid__grid-item');
                for (let i = 0; i < productHandles.length; i++) {
                    const nameHandle = await productHandles[i].$('.content-card__name a');
                    const descriptionHandle = await productHandles[i].$('.content-card__product-description');
                    const urlHandle = await productHandles[i].$('.content-card__shelf');
                    const name = await page.evaluate(e => e.innerHTML, nameHandle);
                    const description = await page.evaluate(e => e.innerHTML, descriptionHandle);
                    const url = await page.evaluate(e => e.href, urlHandle);
                    productResults.push({
                        brand: this.brand,
                        name: name.trim(),
                        description: description.trim(),
                        url: url,
                        price: '',
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
                await page.waitForSelector('.product-info__shades-list');
                const swatches = await page.$('.product-info__shades-list');
                const liHandles = await swatches.$$('.product-info__shade');
                // const priceHandle = await page.$('.product-info__price')
                // productResults[pIndex].price = await page.evaluate(e => e.textContent, priceHandle)
                for (let i = 0; i < liHandles.length; i++) {
                    const colorHandle = await liHandles[i].$('.product-info__shade-swatch');
                    const textHandle = await liHandles[i].$('.product-info__shade-title');
                    const colorHex = await page.evaluate(e => e.dataset.color, colorHandle);
                    const text = await page.evaluate(e => e.innerHTML, textHandle);
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
