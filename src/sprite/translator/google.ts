import { TranslatorURL } from '@config/sprite';
import { TranslatorSprite, TranslatorObject } from '@type/sprite';
export default class GoogleTranslatorSprite implements TranslatorSprite {
    platform: string = 'google';
    home: string = TranslatorURL.GOOGLE;
    getDetail({ page, data }): Promise<TranslatorObject> {
        return new Promise(async(resolve, reject) => {
            const l = console.log;
            let result;
            const platform = 'google';
            try {
                const { content } = data;
                await page.goto(data.url || data, { waitUntil: 'domcontentloaded' });
                await page.waitFor(1000);
                await page.evaluate(content => {
                    const textarea = document.querySelector('textarea#source') as HTMLTextAreaElement;
                    textarea.value = content;
                }, content);
                await page.waitFor(3000);
                result = await page.$eval('.text-wrap.tlid-copy-target', e => e.textContent);
                resolve({
                    language: 'en',
                    origin: content,
                    target: result
                });
            } catch (err) {
                l(err);
                reject(new Error(err));
            }
        });
    }
}