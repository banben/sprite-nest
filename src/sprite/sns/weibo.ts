import { SNSURL } from '@config/sprite';
import { SNSSprite, SNSObject } from '@type/sprite';
export default class WeiboSNSSprite implements SNSSprite {
    platform: string = 'weibo';
    home: string = SNSURL.WEIBO;
    getList({ page, data }): Promise<SNSObject[]> {
        return new Promise(async(resolve, reject) => {
            try {
                const snsResults: SNSObject[] = [];
                const { account, isLarge, url, target } = data;
                await page.goto(url, {waitUntil: 'domcontentloaded'});
                await page.waitForSelector('#loginWrapper', {
                    visible: true
                });

                // login
                await page.evaluate(account => {
                    const loginEl =  document.querySelector('#loginName') as HTMLInputElement;
                    loginEl.value = account.username;
                    const passwordEl = document.querySelector('#loginPassword') as HTMLInputElement;
                    passwordEl.value = account.password;
                }, account);
                await page.click('#loginAction');
                await page.waitForNavigation({waitUntil: 'domcontentloaded'});
                await page.waitFor(5000);
                // blogger mainpage
                await page.goto(target, {waitUntil: 'domcontentloaded'});
                await page.waitForSelector('.tab_wrap');

                // blogger albums
                await page.evaluate(() => {
                    const tab = document.querySelectorAll('.tb_tab .tab_link')[1] as HTMLAnchorElement;
                    tab.click();
                });

                await page.waitForSelector('.photo_album_list');
                const albumsUrl = await page.$$eval('.tab_li a', els => els[els.length - 1].href);
                await page.goto(albumsUrl, {waitUntil: 'domcontentloaded'});
                await page.waitForSelector('.m_user_albumlist li .img_wrap a');

                const albumHandles = await page.$$('.m_user_albumlist li');
                const albumUrls: string[] = [];
                for (let i = 0; i < albumHandles.length; i++) {
                    try {
                        const albumHandle = await albumHandles[i].$('.img_wrap a');
                        const albumUrl = await page.evaluate(e => e.href, albumHandle) as string;
                        albumUrls.push(albumUrl);
                    } catch (err) {
                        console.log(err);
                    }
                }
                // get photos
                for (let i = 0, len = albumUrls.length; i < len; i++) {
                    let photoUrls = [];
                    await page.goto(albumUrls[i], {waitUntil: 'domcontentloaded'});
                    await page.waitFor(1000);
                    /*  list mode  */
                    await page.waitForSelector('.m_pages');
                    await page.waitForSelector('.photoList');
                    let pageNum = 1;
                    while (await page.$('.M_btn_c.next')) {
                        let photos = await page.$$eval('.photoList .photo img', e => e.map(p => p.src));
                        photos = photos.map(url => {
                            if (isLarge) {
                                const uArr = url.split('/');
                                uArr[3] = 'large';
                                url = uArr.join('/');
                            }
                            return url;
                        });
                        photoUrls = photoUrls.concat(photos);
                        let btnHandle = await page.$('.M_btn_c.next')
                        await btnHandle.click()
                        await page.waitFor(3000)
                        await page.waitForSelector('.m_pages')
                        await page.waitForSelector('.photoList')
                        pageNum = pageNum + 1
                    }
                    snsResults.push({
                        albumUrl: albumUrls[i],
                        photos: photoUrls
                    });
                }
                resolve(snsResults);
            } catch (err) {
                reject(new Error(err));
            }
        });
    }
}
