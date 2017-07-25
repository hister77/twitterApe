import Jimp from 'jimp';
import utils from './utils';
import config from './../config';


export default class Image {

  constructor(msg, header) {
    this.sourceFile = '';
    this.outFile = config.outMediaPath;
    this.image = {};
    this.font = config.font;
    this.msg = msg;
    this.header = header;
  }
  makeBanner() {
    return utils.rollFile()
      .then((path) => {
        this.sourceFile = path;
        return Jimp.read(this.sourceFile);
      })
      .then((image) => {
        this.image = image;
        return Jimp.loadFont(Jimp[this.font]);
      })
      .then((font) => {
        const position = Math.floor((this.image.bitmap.height - font.info.size) / config.imgMeta.y);
        const padding = font.info.size + font.info.padding[0];
        this.image.print(font, 20, position - padding, this.header);
        this.msg.forEach((v, i) => this.image.print(font, 20, position + (padding * i), v));
        return this.image.write(this.outFile);
      })
      .then(() => Promise.resolve(this.outFile));
  }

}

