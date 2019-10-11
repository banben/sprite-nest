import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export default class ArmaniLipstickSprite implements LipstickSprite {
    brand: string = 'armani';
    home: string = LipstickURL.ARMANI;
    getList({ page, data }): Promise<LipstickObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const productResults: LipstickObject[] = [];
                await page.goto(data.url || data, { waitUntil: 'domcontentloaded' });
                await page.waitForSelector('.search_result_items');
                const productList = await page.$('.search_result_items');
                const productHandles = await productList.$$('.product_tile_wrapper');
                for (let i = 0; i < productHandles.length; i = i + 1) {
                    const eNameHandle = await productHandles[i].$('.product_name');
                    const nameHandle = await productHandles[i].$('.product_description a');
                    const priceHandle = await productHandles[i].$('.product_price');
                    const urlHandle = await productHandles[i].$('.product_image_wrapper');
                    const e_name = await page.evaluate(e => e.innerHTML, eNameHandle);
                    const name = await page.evaluate(e => e.innerHTML, nameHandle);
                    const price = await page.evaluate(e => e.dataset.pricevalue, priceHandle);
                    const url = await page.evaluate(e => e.href, urlHandle);
                    productResults.push({
                        brand: this.brand,
                        name,
                        e_name,
                        url,
                        price,
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
                await page.goto(data.url || data, { waitUntil: 'domcontentloaded' });
                await page.waitForSelector('.swatches');
                const swatches = await page.$('.swatches');
                const liHandles = await swatches.$$('li');
                for (let i = 0; i < liHandles.length; i = i + 1) {
                    try {
                        let color_image, color_hex, color_text;
                        const imageHandle = await liHandles[i].$('.swatch_image_color');
                        let textHandle = await liHandles[i].$('.swatch_text_color');
                        if (!textHandle) {
                            textHandle = await liHandles[i].$('.swatch');
                            color_hex = await page.evaluate(e => e.style.backgroundColor, imageHandle);
                            color_text = await page.evaluate(e => e.title, textHandle);
                        } else {
                            color_image = await page.evaluate(e => e.src, imageHandle);
                            color_text = await page.evaluate(e => e.innerHTML, textHandle);
                        }

                        const color = {
                            color_hex: color_hex || '#',
                            color_text,
                            color_image: color_image || undefined,
                        };
                        productColors.push(color);
                    } catch (err) {
                       console.log(err);
                    }
                }
                console.log(`has ${productColors.length} colors`);
                resolve(productColors);
            } catch (err) {
                reject(new Error(err));
            }
        });
    }
}
