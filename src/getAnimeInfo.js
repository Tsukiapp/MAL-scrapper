// imports:
import axios from 'axios';
import cheerio from 'cheerio';
import { getUrl } from './lib/getAnimeId.js';
import { getImagesUrl } from './lib/getImagesUrl.js';
import parseScore from './lib/parseScore.js';
/* getAnimeInfo: get searched anime info such as ->
title: string
score: string
description: string
coverImage: string,
thumbnailImage: string,
images: string[],
characters: Object[]
!TODO:  episodes

*/

export default async function getAnimeInfo(keyword, type) {
  const url = await getUrl(keyword, type);
  const result = await axios({
    url: url['url'],
    method: 'GET',
  })
    .then(async res => {
      const $ = cheerio.load(res.data);
      const characters = []
      $('.detail-characters-list.clearfix')
        .find('.ac.borderClass > .picSurround')
        .each((i, el) => {
          if ($(el).find('a').attr('href').includes('https://myanimelist.net/character')) {

            const characterImage = $(el).find('img').attr('data-src');
            const characterName = $(el).find('img').attr('alt');
            characters.push({ name: characterName, img: characterImage });

          }                                                                      
      });
      return {
        title: $('.title-name').text(),
        score: parseScore($('.score-label.score-8').text()),
        description: $('p[itemprop="description"]').text(),
        coverImage: url['image_url'],
        thumbnailImage: url['thumbnail_url'],
        images: await getImagesUrl(keyword, type),
        characters: characters
      }
    });
  return result;
}
// $('tr').children().find('div').children('div').find('a').html();