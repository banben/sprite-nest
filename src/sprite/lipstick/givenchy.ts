import { LipstickURL } from '@config/sprite';
import { LipstickObject, LipstickSprite, LipstickColor } from '@type/sprite';
export default class GivenchyLipstickSprite implements LipstickSprite {
    brand: string = 'givenchy';
    // home: string = 'https://www.givenchybeauty.com/fr/en/makeup/lips/lipstick';
    home: string = LipstickURL.GIVENCHY;
    getList({ page, data }): Promise<LipstickObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const productResults: LipstickObject[] = [];
                const mainUrl = this.home;
                await page.goto(mainUrl, { waitUntil: 'domcontentloaded' });
                const eh = await page.$('.giv-RedirectModal');
                if (eh) {
                    const close = await page.$('#modaal-close');
                    await close.click();
                }
                const productList = await page.$('.search-result-items');
                const productHandles = await productList.$$('.giv-ProductTile');
                for (let i = 0; i < productHandles.length; i++) {
                    const nameHandle = await productHandles[i].$('.giv-ProductTile-name');
                    const urlHandle = await productHandles[i].$('.giv-ProductTile-link');
                    const name = await page.evaluate(e => e.innerHTML, nameHandle);
                    const url = await page.evaluate(e => e.href, urlHandle);
                    productResults.push({
                        brand: this.brand,
                        name: name.trim(),
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
                const eh = await page.$('.giv-RedirectModal');
                if (eh) {
                    const close = await page.$('#modaal-close');
                    await close.click();
                }
                await page.waitForSelector('.giv-ProductVariations-colorSelect-contentSwatch');
                // const descriptionHandle = await page.$('.giv-ProductContent-productSubName')
                // productResults[pIndex].description = await page.evaluate(e => e.innerHTML, descriptionHandle)
                const swatches = await page.$('.giv-ProductVariations-colorSelect-contentSwatch');
                const liHandles = await swatches.$$('.selectable');
                for (let i = 0; i < liHandles.length; i++) {
                    const colorHandle = await liHandles[i].$('.giv-ProductVariations-swatchImage-oneColor-itemOne');
                    const colorHex = await page.evaluate(e => e.style.backgroundColor, colorHandle);
                    const textHandle = await liHandles[i].$('.giv-ProductVariations-colorSelect-contentSwatch-swatchText');
                    const text = await page.evaluate(e => e.textContent, textHandle);
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

// givenchy().then(res => {
//   pipe.write(res)
//   let filename = __dirname + "/crawled_data/givenchy.json";
//   fs.writeFileSync(filename, JSON.stringify(res));
//   pipe.write('-------------${brand}: scraping ending-------------')
// })

// export default givenchy
