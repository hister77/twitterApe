import path from 'path';
import fs from 'fs';
import { transliterate as tr } from 'transliteration';
import config from './../config';

const utils = {

  rollFile() {
    const rollIndex = arr => arr[Math.floor(Math.random() * arr.length)];

    const isFile = (thisPath, done) => {
      fs.stat(thisPath, (err, stats) => {
        if (err) done(err);
        if (stats.isDirectory()) rollPath(thisPath, done);
        else if (stats.isFile()) done(null, thisPath);
      });
    };

    const rollPath = (subPath, done) => {
      const basePath = subPath || rollIndex(config.paths);
      fs.readdir(basePath, (err, paths) => {
        if (err) throw err;
        isFile(path.resolve(basePath, rollIndex(paths)), done);
      });
    };

    return new Promise((resolve, reject) =>
      rollPath(null, (err, file) => (err ? reject(err) : resolve(file))));
  },

  arrify(array, hashtag = false) {
    return array.slice(0, config.imgMeta.rows)
      .reduce((memo, v) => {
        if (hashtag) memo.push(tr(v.name));
        else memo.push(tr(v.name.replace(/^#{1}/, '')));
        return memo;
      }, []);
  },

  stringify(array) {
    return array.slice(0, 5)
      .reduce((memo, v) => memo.concat(' ', v.replace(/^#+/, '')), '')
      .trim();
  },

};

export default utils;

