import Sprites from '@sprite/search/index';
import { initCluster, validFilter } from '@task/common';
import SpriteLogger from '@logger/index';
import { CustomConfig, SearchObject, SearchResult } from '@type/sprite';
import { CrawlStep } from '@config/sprite';

const spriteLogger = new SpriteLogger('search', {
    meta: { service: 'search' }
});

const l = console.log;
const searchTask = async (keyword: string, platforms: string[], config: CustomConfig = {}): Promise<SearchResult[]> => {
    const existPlatforms = validFilter(platforms, Object.keys(Sprites));
    if (!existPlatforms.length) { return []; }
    // const allPlatforms = Object.keys(Sprites);
    // const existPlatforms = platforms.filter(p => {
    //     return allPlatforms.indexOf(p) !== -1;
    // });
    // if (!existPlatforms.length) {
    //     return undefined;
    // }
    l('searchTask start...');
    const cluster = await initCluster(config);

    const results: SearchResult[] = [];
    for (const targetPlatform of existPlatforms) {
        let result: SearchObject[];
        const searchSprite = new Sprites[targetPlatform]();
        const { home: url, platform } = searchSprite;
        // let results: SearchObject[];
        spriteLogger.crawl(platform, CrawlStep.LIST, url);
        cluster.queue(url, async ({ page, data }) => {
            try {
                const inputData = {
                    url: data,
                //   keyword:  "saito asuka"
                    keyword
                };
                const res = await searchSprite.getList({ page, data: inputData }) as SearchObject[];
                // l(res)
                result = res;
                if (!result || !result.length) {
                    spriteLogger.none(platform);
                } else {
                    results.push({ platform, keyword, data: result });
                }
            } catch (err) {
                l(err);
                spriteLogger.error(platform, err.message);
            } finally {
                spriteLogger.crawl(platform, CrawlStep.END);
            }
        });
    }
    await cluster.idle();
    await cluster.close();
    l('searchTask end');
    return results;
};
export default searchTask;