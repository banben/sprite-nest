import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export default class MaquillageLipstickSprite implements LipstickSprite {
    brand: string = 'maquillage';
    home: string = LipstickURL.MAQUILLAGE;
    getList({ page, data }): Promise<LipstickObject[]> {
    return new Promise(async(resolve, reject) => {
        try {
            const productResults: LipstickObject[] = [];
            const mainUrl = data.url || data;
            await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
            const productList = await page.$('.ProductList');
            const productHandles = await productList.$$('.ProductList__item');
            for (let i = 0; i < productHandles.length; i++) {
                const eNameHandle = await productHandles[i].$('.ProductList__itemName');
                const descriptionHandle = await productHandles[i].$('.ProductList__itemDescription');
                const urlHandle = await productHandles[i].$('.ProductList__itemLink');
                const e_name = await page.evaluate(e => e.innerHTML, eNameHandle);
                const description = await page.evaluate(e => e.innerHTML, descriptionHandle);
                const url = await page.evaluate(e => e.href, urlHandle);
                productResults.push({
                    brand: this.brand,
                    name: e_name.trim(),
                    e_name: e_name.trim(),
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
                const swatches = await page.$('.ProductPageHeader__textBlock');
                const colorsHandles = await swatches.$$('.ColorSwatches__colorGroup .ColorSwatches__color');
                const textHandles = await swatches.$$('.ColorSwatches__preview');
                for (let i = 0; i < colorsHandles.length; i++) {
                    const colorHandle = await colorsHandles[i].$('.ColorSwatches__colorLabel');
                    const textHandle = await textHandles[i].$('.ColorSwatches__previewName');
                    const colorHex = await page.evaluate(e => e.style.backgroundColor, colorHandle);
                    const id = await page.evaluate(e => e.innerHTML, colorHandle);
                    let text = await page.evaluate(e => e.innerHTML, textHandle);
                    if (id === text) { text = 'LIMITED COLOR'; }
                    const color = {
                        color_hex: colorHex,
                        color_text: id + '-' + text
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
