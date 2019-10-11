import Sprites from '@sprite/lipstick/index';
import { initCluster, validFilter } from '@task/common';
import SpriteLogger from '@logger/index';
import { CustomConfig, LipstickObject, LipstickResult } from '@type/sprite';
import { CrawlStep } from '@config/sprite';

const spriteLogger = new SpriteLogger('lipstick', {
    meta: { service: 'lipstick' }
});

const lipstickTask = async (brands: string[], config: CustomConfig = {}): Promise<LipstickResult[]> => {

    const existBrands = validFilter(brands, Object.keys(Sprites));
    if (!existBrands.length) { return []; }
    const cluster = await initCluster(config);

    const results: LipstickResult[] = [];
    for (const targetBrand of existBrands) {
        let result: LipstickObject[];
        const lipstickSprite = new Sprites[targetBrand]();
        // lipstickOperation.deleteMany({brand: lipstick.brand})
        const { home: url, brand } = lipstickSprite;

        spriteLogger.crawl(brand, CrawlStep.LIST, url);
        cluster.queue(url, async ({ page, data }) => {
            try {
                const res = await lipstickSprite.getList({ page, data }) as LipstickObject[];
                result = res;
                res.map((obj, index) => {
                    spriteLogger.crawl(brand, CrawlStep.DETAIL, obj.url);
                    cluster.queue({ index, url: obj.url  }, async({ page, data }) => {
                        try {
                            const colors = await lipstickSprite.getDetail({ page, data }) as any[];
                            // l(`has ${colors.length || 0} colors`)
                            result[index].colors = colors;

                            if (!result || !result.length) {
                                spriteLogger.none(brand);
                            } else {
                                results.push({ brand, data: result });
                            }
                        } catch (err) {
                            spriteLogger.error(brand, err.message);
                        } finally {
                            spriteLogger.crawl(brand, CrawlStep.END, obj.url);
                        }
                    });
                });
            } catch (err) {
                spriteLogger.error(brand, err.message);
            }
        });
    }
    await cluster.idle();
    await cluster.close();
    return results;
};

export default lipstickTask;
// export const lipstickScheduleJob = (brands: string[]) => {
//     // schedule.scheduleJob({ second: 30 }, lipstickTask);
//     lipstickTask(brands)
// }
