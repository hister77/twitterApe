import path from 'path';
import fs from 'fs';
import { transliterate as tr } from 'transliteration';
import config from './../config';

const utils = {

  rollFile() {
    const ext = ['.jpg', '.jpeg', '.bmp', '.png'];

    const extImage = file => ext.includes(path.extname(file));

    const rollIndex = arr => arr[Math.floor(Math.random() * arr.length)];

    let count = 0;

    const isImageFile = (thisPath, done) => {
      fs.stat(thisPath, (err, stats) => {
        if (err) return done(err);
        if (!(stats.isDirectory() || stats.isFile())
          || (stats.isFile() && !extImage(thisPath))) return rollPath(null, done);
        if (stats.isDirectory()) {
          if (count >= 10) return done(new RangeError('Couldn\'t find any valid files. '));
          count += 1;
          return rollPath(thisPath, done);
        }
        return done(null, thisPath);
      });
    };

    const rollPath = (subPath, done) => {
      const basePath = subPath || rollIndex(config.paths);
      fs.readdir(basePath, (err, paths) => {
        if (err) done(err);
        if (paths.length === 0) {
          if (count >= 10) return done(new RangeError('Could\'t find non-empty directiories'));
          count += 1;
          return rollPath(null, done);
        }
        return isImageFile(path.resolve(basePath, rollIndex(paths)), done);
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

