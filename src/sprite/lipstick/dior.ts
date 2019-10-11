import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export default class DiorLipstickSprite implements LipstickSprite {
    brand: string = 'dior';
    home: string = LipstickURL.DIOR;
    getList({ page, data }): Promise<LipstickObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const productResults = [] as LipstickObject[];
                const mainUrl = data.url || data;
                await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
                await page.waitForSelector('.catalog');
                const productList = await page.$('.catalog');
                const productHandles = await productList.$$('.product');
                for (let i = 0; i < productHandles.length; i = i + 1) {
                    const nameHandle = await productHandles[i].$('.product-title span');
                    const descriptionHandle = await productHandles[i].$('.product-subtitle');
                    const priceHandle = await productHandles[i].$('.price-line');
                    const urlHandle = await productHandles[i].$('a.product-link');
                    const name = await page.evaluate(e => e.innerHTML, nameHandle);
                    const description = await page.evaluate(e => e.textContent, descriptionHandle);
                    const price = await page.evaluate(e => e.innerHTML, priceHandle);
                    const url = await page.evaluate(e => e.href, urlHandle);
                    productResults.push({
                        brand: this.brand,
                        name: name.trim(),
                        description: description.trim(),
                        url,
                        price: price.trim(),
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
                const liHandles = await swatches.$$('span.swatch');
                for (let i = 0; i < liHandles.length; i++) {
                    const imageHandle = await liHandles[i].$('.image img');
                    const textHandle = await liHandles[i].$('label');
                    const image = await page.evaluate(e => e.src, imageHandle);
                    const text = await page.evaluate(e => e.textContent, textHandle);
                    const color = {
                        color_hex: '#',
                        color_text: text,
                        color_image: image
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
