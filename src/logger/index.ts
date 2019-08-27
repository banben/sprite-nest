import winston, { format } from 'winston';
import { Format } from 'logform';
import { CrawlStep } from '@config/sprite';
const { combine, prettyPrint, timestamp, json, colorize } = format;

interface Logger {
    logger: winston.Logger;
    format: Format;
    type: string;
    category?: string;
}

export default class SpriteLogger implements Logger {
    logger: winston.Logger;
    type = 'Sprite';
    category: string;
    // format = combine(timestamp(), json(), prettyPrint(), colorize());
    format = combine(timestamp(), json());
    constructor(category, option?) {
        const { meta } = option;
        this.category = category;
        this.logger = winston.createLogger({
            level: 'info', // Log only if info.level less than or equal to this level
            format: this.format,
            defaultMeta: meta,
            transports: [
                new winston.transports.File({ filename: 'error.log', level: 'error' }),
                new winston.transports.File({ filename: 'combined.log' })
            ]
        });

        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.simple()
                )
            }));
        }
    }

    crawl(name: string, step: number, url: string = ''): void {
        const { type, category } = this;
        const prefix = `${type}::${category}::${name}`;
        switch (step) {
            case CrawlStep.LIST:
                this.logger.log({
                    level: 'info',
                    message: `${prefix}: Start list crawling`,
                    url
                });
                break;
            case CrawlStep.DETAIL:
                this.logger.log({
                    level: 'info',
                    message: `${prefix}: Start detail crawling`,
                    url,
                });
                break;
            case CrawlStep.END:
                this.logger.info(`${prefix}: End all crawling`);
        }
    }

    none(name: string): void {
        const { type, category } = this;
        this.logger.error(`${type}::${category}::${name}: No data crawled`);
    }

    error(name: string, message: string): void {
        const { type, category } = this;
        this.logger.error(`${type}::${category}::${name} ${message}`);
    }
}
