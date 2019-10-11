import Sprites from '@sprite/translator/index';
import { initCluster, validFilter } from '@task/common';
import { CustomConfig, TranslatorObject, TranslatorResult } from '@type/sprite';
import { CrawlStep } from '@config/sprite';
import SpriteLogger from '@logger/index';
const spriteLogger = new SpriteLogger('translator', {
    meta: { service: 'translator' }
});

const translatorTask = async (content: string, platforms: string[], config: CustomConfig = {}): Promise<TranslatorResult[]> => {
    // platforms =  platforms.map(p => titleCase(p))
    const existPlatforms = validFilter(platforms, Object.keys(Sprites));
    if (!existPlatforms.length) { return []; }
    const cluster = await initCluster(config);
    const results: TranslatorResult[] = [];
    for (const targetPlatform of existPlatforms) {
        let result: TranslatorObject;
        // const translator = Sprites[targetPlatform];
        const translatorSprite = new Sprites[targetPlatform]();
        const { home: url, platform } = translatorSprite;
        spriteLogger.crawl(platform, CrawlStep.LIST, url);
        cluster.queue(url, async ({ page, data }) => {
            try {
                const inputData = {
                    url: data,
                    content
                };
                const res = await translatorSprite.getDetail({ page, data: inputData }) as TranslatorObject;
                result = res;
                if (!result) {
                    spriteLogger.none(platform);
                } else {
                    results.push({ platform, content, data: result });
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

export default translatorTask;
