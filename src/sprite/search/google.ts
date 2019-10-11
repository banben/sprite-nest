import { SearchEngineURL } from '@config/sprite';
import { SearchSprite, SearchObject } from '@type/sprite';
export default class GoogleSearchSprite implements SearchSprite {
    platform: string = 'google';
    home: string = SearchEngineURL.GOOGLE;
    getList({ page, data }): Promise<SearchObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const searchResults: SearchObject[] = [];
                const { keyword, offset, url } = data;
                const langParam = 'hl=en-US&';
                const keywordParam = 'q=' + keyword;
                const offsetParam = offset ? '&start=' + offset : '';
                const addr = url + langParam + keywordParam + offsetParam;
                await page.goto(addr, {waitUntil: 'domcontentloaded'});
                await page.waitFor(1000);
                const sections = await page.$$('.srg .g');
                const titles = await page.$$('.srg .r h3');
                const urls = await page.$$('.srg .r a');
                const contents = await page.$$('.srg .s .st');
                // l(sections.length)
                for (let i = 0; i < sections.length; i++) {
                    const title = await page.evaluate(e => e.innerHTML, titles[i]);
                    const url = await page.evaluate(e => e.href, urls[i]);
                    const content = await page.evaluate(e => e.innerHTML, contents[i]);
                    searchResults.push({
                        title,
                        url,
                        displayUrl: url,
                        content
                    });
                }
                resolve(searchResults);
            } catch (err) {
                reject(new Error(err));
            }
        });
    }
}
