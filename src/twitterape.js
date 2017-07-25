import Twitter from 'twitter';
import fs from 'fs';
import moment from 'moment';
import _ from 'lodash';
import winston from 'winston';
import utils from './utils';
import Image from './image';
import config from './../config';

export default class TwitterApe extends Twitter {

  constructor() {
    super(config.twitter);
    this.interval = config.interval;
    this.rates = {};
    this.lastTrends = [];
    this.currentTrends = [];
  }

  bannerify() {
    const updateBanner = () => updateDesc()
      .then(getRates('blocks'))
      .then((rates) => {
        this.rates = rates;
        return getTrends();
      })
      .then((trends) => {
        this.currentTrends = utils.arrify(trends[0].trends, true);
        const equal = _.isEqual(this.lastTrends, this.currentTrends);
        this.lastTrends = this.currentTrends.slice(0);
        if (!equal) return composeImage();
        return Promise.reject('Trends hasn\'t updated. Nothing to be done.').catch(err => winston.info(err));
      });

    const updateDesc = () => {
      const date = moment().format('MMMM Do YYYY, h:mm a');
      return this.post('account/update_profile', { description: date });
    };

    const getRates = params => this.get('application/rate_limit_status', params);

    const toBase64 = file => new Promise((resolve, reject) => {
      fs.readFile(file, 'base64', (err, data) => {
        if (err) return reject(err);
        return resolve(data);
      });
    });

    const composeImage = () => {
      const header = `Trending (${moment().format('h:mm a  D/M/YYYY')}, Poland):`;
      const img = new Image(this.currentTrends, header);
      return img.makeBanner()
        .then(imgPath => toBase64(imgPath))
        .then((base64) => {
          winston.info('Uploading banner...');
          return uploadImage(base64);
        });
    };

    const uploadImage = base64 => this.post('account/update_profile_banner', { banner: base64 });

    const getTrends = () => this.get('trends/place', { id: config.trends.woeid });

    return updateBanner();
  }


}
