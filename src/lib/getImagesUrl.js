//imports:
import axios from 'axios';
import cheerio from 'cheerio';
import { getUrl } from './getAnimeId.js';


async function getImagesUrl(keyword, type) { // return -> string[]
  const url = await getUrl(keyword, type);
  const result = await axios({
    url: url['url'].concat('/pics'),
    method: 'GET'
  })
    .then(res => {
      const $ = cheerio.load(res.data);
      const imagesArray = [];
       $('.picSurround').each((i, el) => {
        let tmp = $(el).html();
        let imgUrl = tmp
        .split('"')
        .find(val => val.indexOf(`images/${type}`) > -1);
        return imagesArray.push(imgUrl);
      });
      return imagesArray;
    });
  return result
}

export {
  getImagesUrl
}