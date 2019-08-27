#  Sprite Nest

Crawl contents of specific types from web easily and flexibly.

## Usage

### Basic Usage

```js
import SpriteNest from 'sprite-nest'
// or
// const SpriteNest = require('sprite-nest').default

const { Crawlers } = SpriteNest

const keyword = 'ishihara satomi'

Crawlers.search(keyword, ['google', 'baidu', 'duckduckgo']).then(res => {
  console.log(`result of searching ${keyword}: `, res)
});
```

### Use with Config

```js
import SpriteNest from 'sprite-nest'
const { Crawlers } = SpriteNest

const sentence = 'good morning'

Crawlers.translator(sentence, ['google', 'baidu', 'bing'], {
  cluster: {
    maxConcurrency: 3,
    monitor: true,
  },
  pptr: {
    headless: false
  }
}).then(res => {
  console.log(`result of translating ${keyword}: `, res)
})
```

### Use Sprite and Puppeteer

`Crawler` has some wrapped task. And `Sprite` is the class which has inner functions with puppeteer operation, how to custom it depends on you.

```js
import SpriteNest from 'sprite-nest'
import puppeteer from 'puppeteer'

const { Sprites } = SpriteNest;

const UseInnerSprite = async () => {
    const armaniSprite = new Sprites.LipStick.armani()
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const data = {
      url: armaniSprite.home
    }
    const res = await armaniSprite.getList({ page, data })
    console.log('result data is: ', res)
}

UseInnerSprite()
```

## API

### Overview

Sprite ----(Puppeteer / Puppteer-core + puppeteer-cluster)----> Task --(Pipeline / Util)---> Job

### Main 

`Crawlers` \<Object\>
  * `lipstick` \<Function\>
  * `search` \<Function\>
  * `sns` \<Function\>
  * `translator` \<Function\>

#### `Crawlers.lipstick(brands, config)`

* `brands` <string[]>
* `config` <?CustomConfig>

#### `Crawlers.search(keyword, platforms, config)`

* `keyword` \<string\>
* `platforms` <string[]>
* `config` <?CustomConfig>

#### `Crawlers.sns(target, account, platform, config)`

* `target` \<string\>
* `account` \<Object\>
  * `username` \<string\>
  * `password` \<string\>
* `brands` <string[]>
* `config` <?CustomConfig>

#### `Crawlers.translator(content, platforms, config)`

* `content` \<string\>
* `platforms` <string[]>
* `config` <?CustomConfig>

### Sprites

Every sprite may has `getList()` or `getDetail()` method, depends on its type.

#### Lipstick

- [x] armani
- [x] covergirl
- [ ] cpb
- [x] dior
- [x] esteelauder
- [x] givenchy
- [ ] guerlian
- [x] lancome
- [ ] louboutin
- [x] mac
- [x] maquillage
- [x] maybelline
- [ ] nars
- [ ] sephora
- [x] tomford
- [x] urbandecay
- [x] ysl

#### Search

- [x] baidu
- [x] bing
- [x] duckduckgo
- [x] google

#### Translator

- [x] baidu
- [x] bing
- [x] google

#### SNS

- [x] weibo 

## Todo

- [ ] testing
- [ ] custom sprite constructor

## Other Feature

* mongoose
  Bind [mongoose](https://github.com/Automattic/mongoose) schema and ts type to presist data in MongoDB
* logger
  Using [winstom](https://github.com/winstonjs/winston) create a custom logger to record info from task.
