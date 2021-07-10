import getAnimeInfo from "./src/getAnimeInfo.js";
import {getNewsDetails, getNewsPreview} from "./src/getNews.js";
import getSeasonalInfo from './src/getSeasonalInfo.js';

let response1 = getNewsPreview();
let response = await getNewsDetails(getNewsPreview, '63683619');
console.log(response);

export {
  getAnimeInfo,
  getSeasonalInfo,
  getNewsPreview,
  getNewsDetails
}