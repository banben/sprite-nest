import { SearchEngineURL } from '@config/sprite';
import { SearchSprite, SearchObject } from '@type/sprite';
// const l = console.log
export default class BaiduSearchSprite implements SearchSprite {
    platform: string = 'baidu';
    home: string = SearchEngineURL.BAIDU;
    getList({ page, data }): Promise<SearchObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const searchResults: SearchObject[] = [];
                const { keyword, offset, url } = data;
                const keywordParam = 'wd=' + keyword;
                const offsetParam = !isNaN(offset) ? '&pn=' + offset : '';
                const addr = url + keywordParam + offsetParam;
                await page.goto(addr, { waitUntil: 'domcontentloaded' });
                await page.keyboard.type(keyword, {delay: 100});
                await page.keyboard.press('Enter');
                await page.waitFor(2000);
                const sections = await page.$$('.result');
                const titles = await page.$$('.result .t a');
                const urls = await page.$$('.result .t a');
                const contents = await page.$$('.result .c-abstract');
                for (let i = 0; i < sections.length; i++) {
                    const title = await page.evaluate(e => e.innerHTML, titles[i]);
                    const url = await page.evaluate(e => e.href, urls[i]);
                    const displayUrl = await page.evaluate(e => e.innerHTML, urls[i]);
                    const content = await page.evaluate(e => e.innerHTML, contents[i]);
                    const cont = content.split('</span>').length > 1 ? content.split('</span>')[1] : content;
                    searchResults.push({
                        title,
                        url,
                        displayUrl,
                        content: cont
                    });
                }
                resolve(searchResults);
            } catch (err) {
                reject(new Error(err));
            }
        });
    }
}
