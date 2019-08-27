import { TranslatorURL } from '@config/sprite';
import { TranslatorSprite, TranslatorObject } from '@type/sprite';
export default class BingTranslatorSprite implements TranslatorSprite {
    platform: string = 'bing';
    home: string = TranslatorURL.BING;
    getDetail({ page, data }): Promise<TranslatorObject> {
        return new Promise(async(resolve, reject) => {
            try {
                const { content } = data;
                await page.goto(data.url || data, { waitUntil: 'domcontentloaded' });
                await page.waitFor(1000);
                await page.select('select#tta_srcsl', 'en');
                await page.select('select#tta_tgtsl', 'zh-Hans');
                await page.waitFor(1000);
                await page.click('#tta_input');
                await page.waitFor(1000);
                await page.keyboard.type(content, {delay: 50});
                await page.waitFor(5000);
                const result = await page.$eval('#tta_output', e => e.value);
                resolve({
                    language: 'en',
                    origin: content,
                    target: result
                });
            } catch (err) {
                reject(new Error(err));
            }
        });
    }
}