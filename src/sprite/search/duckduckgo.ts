import { SearchEngineURL } from '@config/sprite';
import { SearchSprite, SearchObject } from '@type/sprite';
export default class DuckDuckGoSearchSprite implements SearchSprite {
    platform: string = 'duckduckgo';
    home: string = SearchEngineURL.DUCKDUCKGO;
    getList({ page, data }): Promise<SearchObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const searchResults: SearchObject[] = [];
                const { keyword, url, offset } = data;
                const keywordParam = 'q=' + keyword;
                if (!offset) {
                    const fullURL = url + keywordParam;
                    await page.goto(fullURL, {waitUntil: 'domcontentloaded'});
                } else {
                    // next page: submit form in next button input
                    const forms = await page.$$('.nav-link form');
                    await page.evaluate(form => form.submit(), forms.pop());
                }
                await page.waitFor(1000);
                const sections = await page.$$('.result__body');
                const titles = await page.$$('.result__body .result__a');
                const urls = await page.$$('.result__body .result__url');
                const contents = await page.$$('.result__body .result__snippet');
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
