import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export default class UrbandecayLipstickSprite implements LipstickSprite {
    brand: string = 'urbandecay';
    home: string = LipstickURL.URBANDECAY;
    getList({ page, data }): Promise<LipstickObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const productResults: LipstickObject[] = [];
                const mainUrl = data.url || data;
                await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
                await page.waitFor(2000);
                await page.goto(mainUrl, {waitUntil: 'domcontentloaded'}); // trick for redirect
                await page.waitForSelector('.search_result_items');
                const productList = await page.$('.search_result_items');
                const productHandles = await productList.$$('.product_tile_wrapper');
                for (let i = 0; i < productHandles.length; i++) {
                    const eNameHandle = await productHandles[i].$('.product_name');
                    const priceHandle = await productHandles[i].$('.product_price');
                    const urlHandle = await productHandles[i].$('.product_image_wrapper');
                    const e_name = await page.evaluate(e => e.innerHTML, eNameHandle);
                    const price = await page.evaluate(e => e.dataset.pricevalue, priceHandle);
                    const url = await page.evaluate(e => e.href, urlHandle);
                    productResults.push({
                        brand: this.brand,
                        name: e_name.trim(),
                        e_name: e_name.trim(),
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
                await page.waitForSelector('.swatches');
                const swatches = await page.$('.swatches');
                const liHandles = await swatches.$$('li');
                for (let i = 0; i < liHandles.length; i++) {
                    const imageHandle = await liHandles[i].$('.swatch_image_color');
                    const image = await page.evaluate(e => e.src, imageHandle);
                    const text = await page.evaluate(e => e.getAttribute('alt'), imageHandle);
                    const color = {
                        color_hex: '#',
                        color_text: text,
                        color_image: image
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
