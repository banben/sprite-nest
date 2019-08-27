import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export default class CpbLipstickSprite implements LipstickSprite {
    brand: string = 'cpb';
    home: string = LipstickURL.CPB;
    getList({ page, data }): Promise<LipstickObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const productResults: LipstickObject[] = [];
                const mainUrl = data.url || data;
                await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
                await page.waitFor('.goods-area');
                const productList = await page.$('.goods-area');
                const productHandles = await productList.$$('li[data-filter-words="lipstick"]');
                for (let i = 0; i < productHandles.length; i++) {
                    const nameHandle = await productHandles[i].$('.goods-name');
                    const urlHandle = await productHandles[i].$('.goods-link');
                    const name = await page.evaluate(e => e.innerHTML, nameHandle);
                    const url = mainUrl + await page.evaluate(e => e.getAttribute('href'), urlHandle);
                    productResults.push({
                        brand: this.brand,
                        name: name.trim(),
                        description: '',
                        url,
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
                await page.goto(data.url || data, { waitUntil: 'domcontentloaded' });
                await page.waitForSelector('.main-area');
                const swatches = await page.$('.select-gather');
                const liHandles = await swatches.$$('.select-list');
                for (let i = 0; i < liHandles.length; i++) {
                    const imageHandle = await liHandles[i].$('.select-img img');
                    const textHandle = await liHandles[i].$('.select-text');
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
