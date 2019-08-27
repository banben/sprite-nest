import Sprites from '@sprite/sns/index';
import { initCluster } from '@task/common';
import SpriteLogger from '@logger/index';
import { AccountType, CustomConfig, SNSObject, SNSResult } from '@type/sprite';
import { CrawlStep } from '@config/sprite';
const spriteLogger = new SpriteLogger('sns', {
    meta: { service: 'sns' }
});
const l = console.log;

const snsTask = async (target: string, account: AccountType, platform: string, config: CustomConfig = {}) => {
    const snsSprite = new Sprites[platform]();
    l('snsTask start...');
    const cluster = await initCluster(config);
    const results: SNSResult = {
        platform,
        target,
        data: []
    };
    // for (let sns of Sprites) {
    const { home: url } = snsSprite;
    // let results: SearchObject[];
    spriteLogger.crawl(platform, CrawlStep.LIST, url);
    cluster.queue(url, async ({ page, data }) => {
        try {
            const inputData = {
                url: data,
                isLarge: true,
                account,
                target
            };
            const res = await snsSprite.getList({ page, data: inputData }) as SNSObject[];
            l('get results in task');
            results.data = res;
        } catch (err) {
            l(err);
            spriteLogger.error(platform, err.message);
        }
    });

    await cluster.idle();
    spriteLogger.crawl(platform, CrawlStep.END);
    // }
    await cluster.close();
    l('snsTask end');
    return results;
};

export default snsTask;
// export const snsScheduleJob = () => {
//     // schedule.scheduleJob({ second: 30 }, lipstickTask);
//     snsTask()
// }
