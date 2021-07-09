import getAnimeInfo from "./src/getAnimeInfo.js";
import getSeasonalInfo from './src/getSeasonalInfo.js';

let result = await  getAnimeInfo('when they cry', 'anime');
console.log(result)
export {
  getAnimeInfo,
  getSeasonalInfo
}