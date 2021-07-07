//imports:
import axios from 'axios';
import cheerio from 'cheerio';
import { getUrl } from './getAnimeId.js';

//! TODO: improve this function to avoid using two, to achieve the same result: getting the same image

async function getImagesUrl(keyword, type) { // return -> string[]
  const url = await getUrl(keyword, type); // gets url
  const result = await axios({ // makes the request
    url: url['url'].concat('/pics'),
    method: 'GET'
  })
    .then(res => {
      const $ = cheerio.load(res.data); // load raw HTML to cheerio
      const imagesArray = []; 
       $('.picSurround').each((i, el) => { // loop over all tags with that class
        let tmp = $(el).html(); // process the images and return an array
        let imgUrl = tmp
        .split('"')
        .find(val => val.indexOf(`images/${type}`) > -1);
        return imagesArray.push(imgUrl);
      });
      return imagesArray;
    });
  return result
}

function getSeasonalImagesUrl(tag) { // return -> string[]
  let result = []
  result.push( // process the images and return an array
    tag.split('"')
    .find(val => val.indexOf('images/anime') > -1));
  return result;
}
export {
  getImagesUrl,
  getSeasonalImagesUrl
}