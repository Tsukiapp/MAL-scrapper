//imports:
import axios from 'axios';
import cheerio from 'cheerio';
import { getUrl } from './getAnimeId.js';
import { AnimeType } from '../DTO/getAnimeId.dto';
import { ImageType } from '../DTO/getImages.dto';
//! TODO: improve this function to avoid using two, to achieve the same result: getting the same image

async function getImagesUrl(keyword: string, type: string): Promise<ImageType> { // return -> string[]
  const url: AnimeType = await getUrl(keyword, type); // gets url
  
  const result: ImageType = await axios({ // makes the request
    url: url['url'].concat('/pics'),
    method: 'GET'
  })
    .then(res => {
      const $ = cheerio.load(res.data); // load raw HTML to cheerio
      const imagesArray: ImageType = []; 
       $('.picSurround').each((i, el):void => { // loop over all tags with that class
        let tmp: string = <string>$(el).html() ; // process the images and return an array
        let imgUrl: string = <string>tmp 
        .split('"')
        .find(val => val.indexOf(`images/${type}`) > -1);
         imagesArray.push(imgUrl);
      });
      return imagesArray;
    });
  return result
}

function getSeasonalImagesUrl(tag: any): string[] { // return -> string[]
  let result:string[] = []
  result.push( // process the images and return an array
    tag.split('"')
    .find(val => val.indexOf('images/anime') > -1));
  return result;
}

export {
  getImagesUrl,
  getSeasonalImagesUrl
}