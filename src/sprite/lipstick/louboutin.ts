import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export class LouboutinLipstickSprite implements LipstickSprite {
    brand: string = 'louboutin';
    home: string = LipstickURL.LOUBOUTIN;
    getList({ page, data }): Promise<LipstickObject[]> {
    return new Promise(async(resolve, reject) => {
        try {
            const productResults: LipstickObject[] = [];
            const mainUrl = data.url || data;
            await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
            const productList = await page.$('.category-main');
            const productHandles = await productList.$$('.product');
            for (let i = 0; i < productHandles.length; i++) {
                const nameHandle = await productHandles[i].$('.product-infos .title a');
                const name = await page.evaluate(e => e.textContent, nameHandle);
                const url = await page.evaluate(e => e.href, nameHandle);
                productResults.push({
                    brand: this.brand,
                    name: name.trim(),
                    description: '',
                    url: url,
                    price: '0',
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
