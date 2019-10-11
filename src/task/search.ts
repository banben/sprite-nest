import Sprites from '@sprite/search/index';
import { initCluster, validFilter } from '@task/common';
import SpriteLogger from '@logger/index';
import { CustomConfig, SearchObject, SearchResult } from '@type/sprite';
import { CrawlStep } from '@config/sprite';

const spriteLogger = new SpriteLogger('search', {
    meta: { service: 'search' }
});

const searchTask = async (keyword: string, platforms: string[], config: CustomConfig = {}): Promise<SearchResult[]> => {
    const existPlatforms = validFilter(platforms, Object.keys(Sprites));
    if (!existPlatforms.length) { return []; }
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
                spriteLogger.error(platform, err.message);
            } finally {
                spriteLogger.crawl(platform, CrawlStep.END, url);
            }
        });
    }
    await cluster.idle();
    await cluster.close();
    return results;
};
export default searchTask;