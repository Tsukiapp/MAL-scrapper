// imports:
import axios from 'axios';
import cheerio from 'cheerio';
import parseScore from './lib/parseScore.js';
import { getUrl } from './lib/getAnimeId.js';
import { getImagesUrl } from './lib/getImagesUrl.js';
/* getAnimeInfo: get searched anime info such as ->
title: strig
score: number
description: string
coverImage: string,
thumbnailImage: string,
images: string[]
!TODO: staff, episodes
31
*/

async function getAnimeInfo(keyword, type) {
  const url = await getUrl(keyword, type);
  const result = await axios({
    url: url['url'],
    method: 'GET',
  })
    .then(async res => {
      const $ = cheerio.load(res.data);
      const title = $('.title-name').text();
      const score = parseScore($('.score-label.score-8').text());
      const description = $('p[itemprop="description"]').text();
      const coverImage = url['image_url'];
      const thumbnailImage = url['thumbnail_url'];
      const images = await getImagesUrl(keyword, type);

      return {
        title,
        score,
        description,
        coverImage,
        thumbnailImage,
        images,
      }
    });
  return result;
}

export default getAnimeInfo;
// $('tr').children().find('div').children('div').find('a').html();