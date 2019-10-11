import { TranslatorURL } from '@config/sprite';
import { TranslatorSprite, TranslatorObject } from '@type/sprite';
export default class BaiduTranslatorSprite implements TranslatorSprite {
    platform: string = 'baidu';
    home: string = TranslatorURL.BAIDU;
    getDetail({ page, data }): Promise<TranslatorObject> {
        return new Promise(async(resolve, reject) => {
            try {
                const { content } = data;
                await page.goto(data.url || data, { waitUntil: 'domcontentloaded' });
                await page.waitFor(1000);
                await page.click('.trans-input-wrap');
                // input initial letter to trigger lang detection
                await page.keyboard.type(content[0]);
                await page.waitFor(1000);
                await page.keyboard.type(content, {delay: 50});
                await page.click('.inner #translate-button');
                await page.waitFor(1000);
                const result = await page.$$eval('.ordinary-output.target-output', e => e.map(el => el.textContent).join(' '));
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
