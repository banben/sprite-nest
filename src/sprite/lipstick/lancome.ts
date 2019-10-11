import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export default class LancomeLipstickSprite implements LipstickSprite {
    brand: string = 'lancome';
    home: string = LipstickURL.LANCOME;
    getList({ page, data }): Promise<LipstickObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const productResults: LipstickObject[] = [];
                const mainUrl = this.home;
                await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
                await page.waitForSelector('.list-product');
                const productList = await page.$('.list-product');
                const productHandles = await productList.$$('.plp-slide');
                for (let i = 0; i < productHandles.length; i++) {
                    const nameHandle = await productHandles[i].$('.goods-tit a');
                    const eNameHandle = await productHandles[i].$('.goods-introudce');
                    const priceHandle = await productHandles[i].$('.goods-price span');
                    const name = await page.evaluate(e => e.innerHTML, nameHandle);
                    const e_name = await page.evaluate(e => e.textContent, eNameHandle);
                    const price = await page.evaluate(e => e.innerHTML, priceHandle);
                    const url = await page.evaluate(e => e.href, nameHandle);
                    productResults.push({
                        brand: this.brand,
                        name: name.trim(),
                        e_name: e_name.trim(),
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
                await page.waitForSelector('.e-changecolor');
                const swatches = await page.$('.e-changecolor ul');
                const liHandles = await swatches.$$('li');
                for (let i = 0; i < liHandles.length; i++) {
                    const colorHandle = await liHandles[i].$('.colorblock');
                    const textHandle = await liHandles[i].$$('a span');
                    const colorHex = await page.evaluate(e => e.style.backgroundColor, colorHandle);
                    const text = await page.evaluate(e => e.textContent, textHandle[1]);
                    const color = {
                        color_hex: colorHex,
                        color_text: text
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
