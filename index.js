import getAnimeInfo from "./src/getAnimeInfo.js";

let response = await getAnimeInfo('jujutsu kaisen', 'anime');
console.log(response);