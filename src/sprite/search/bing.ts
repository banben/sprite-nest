import { SearchEngineURL } from '@config/sprite';
import { SearchSprite, SearchObject } from '@type/sprite'; // const l = console.log
export default class BingSearchSprite implements SearchSprite {
    platform: string = 'bing';
    home: string = SearchEngineURL.BING;
    getList({ page, data }): Promise<SearchObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const searchResults: SearchObject[] = [];
                const { keyword, offset, url } = data;
                const keywordParam = 'q=' + keyword;
                const offsetParam = !isNaN(offset) ? 'first=' + offset + '&' : '';
                const addr = url + offsetParam + keywordParam;
                await page.goto(addr, {waitUntil: 'domcontentloaded'});
                await page.waitFor(1000);
                const sections = await page.$$('.b_algo');
                const titles = await page.$$('.b_algo h2 a');
                const urls = await page.$$('.b_algo h2 a');
                const displayUrls = await page.$$('.b_algo .b_caption .b_attribution cite');
                const contents = await page.$$('.b_algo .b_caption p');
                for (let i = 0; i < sections.length; i++) {
                    const title = await page.evaluate(e => e.innerHTML, titles[i]);
                    const url = await page.evaluate(e => e.href, urls[i]);
                    const displayUrl = await page.evaluate(e => e.innerHTML, displayUrls[i]);
                    const content = await page.evaluate(e => e.innerHTML, contents[i]);
                    searchResults.push({
                        title,
                        url,
                        displayUrl,
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
