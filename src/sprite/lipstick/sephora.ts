import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export default class SephoraLipstickSprite implements LipstickSprite {
    brand: string = 'sephora';
    home: string = LipstickURL.SEPHORA;
    getList({ page, data }): Promise<LipstickObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const productResults: LipstickObject[] = [];
                const mainUrl = this.home;
                await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
                await page.waitForSelector('[data-comp="ProductGrid"]');
                const productList = await page.$('[data-comp="ProductGrid"]');
                const productHandles = await productList.$$('[data-lload] > div');
                for (let i = 0; i < productHandles.length; i++) {
                    const nameHandle = await productHandles[i].$('[data-at="sku_item_name"]');
                    const priceHandle = await productHandles[i].$('[data-at="sku_item_price_list"]');
                    const urlHandle = await productHandles[i].$('[data-comp="ProductItem"]');
                    const name = await page.evaluate(e => e.innerHTML, nameHandle);
                    const price = await page.evaluate(e => e.textContent, priceHandle);
                    const url = await page.evaluate(e => e.href, urlHandle);
                    productResults.push({
                        brand: this.brand,
                        name: name,
                        description: '',
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
                const swatches = await page.$('[role="listbox"]');
                const liHandles = await swatches.$$('[data-comp="ProductSwatchItem"]');
                for (let i = 0; i < liHandles.length; i++) {
                    const imageHandle = await liHandles[i].$('img');
                    const textHandle = await liHandles[i].$('[data-at="selected_swatch"]');
                    const image = await page.evaluate(e => e.src, imageHandle);
                    const text = await page.evaluate(e => e.getAttribute('aria-label'), textHandle);
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

