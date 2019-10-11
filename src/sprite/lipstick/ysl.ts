import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export default class YslLipstickSprite implements LipstickSprite {
    brand: string = 'ysl';
    home: string = LipstickURL.YSL;
    getList({ page, data }): Promise<LipstickObject[]> {
    return new Promise(async(resolve, reject) => {
        try {
            const productResults: LipstickObject[] = [];
            const mainUrl = this.home;
            await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
            const productList = await page.$('.list-product');
            const productHandles = await productList.$$('.plp-slide');
            for (let i = 0; i < productHandles.length; i++) {
                const eNameHandle = await productHandles[i].$('.goods-tit a');
                const nameHandle = await productHandles[i].$('.goods-introudce a');
                const priceHandle = await productHandles[i].$('.goods-price span');
                const e_name = await page.evaluate(e => e.innerHTML, eNameHandle);
                const name = await page.evaluate(e => e.innerHTML, nameHandle);
                const price = await page.evaluate(e => e.textContent, priceHandle);
                const url = await page.evaluate(e => e.href, nameHandle);
                productResults.push({
                    brand: this.brand,
                    name: name.trim(),
                    e_name,
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
                await page.waitForSelector('.product-color-select');
                const swatches = await page.$('.product-color-select .overview ul');
                const liHandles = await swatches.$$('li');
                for (let i = 0; i < liHandles.length; i++) {
                    const imageHandle = await liHandles[i].$('span img');
                    const textHandle = await liHandles[i].$$('span');
                    const image = await page.evaluate(e => e.src, imageHandle);
                    const text = await page.evaluate(e => e.innerHTML, textHandle[1]);
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
