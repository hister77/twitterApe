import winston from 'winston';
import TwitterApe from './index';

const monkey = new TwitterApe();

setInterval(() => {
  monkey.bannerify()
    .then(() => winston.info('Done.'))
    .catch(err => winston.info(err));
}, monkey.interval);

