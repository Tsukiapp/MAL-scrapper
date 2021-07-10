// imports:
import axios from 'axios';
import cheerio from 'cheerio';
import { AnimeInfoType } from './DTO/animeInfo.dto.js';
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

export default async function getAnimeInfo(keyword: string, type: string):Promise< AnimeInfoType> {
  const url = await getUrl(keyword, type);
  const result: AnimeInfoType = await axios({
    url: url['url'],
    method: 'GET',
  })
    .then(async res => {
      const $ = cheerio.load(res.data);
      const characters: Object[] = [];
      $('.detail-characters-list.clearfix')
        .find('.ac.borderClass > .picSurround')
        .each((i, el) => {
          const tag: string = <string>$(el).find('a').attr('href')
          if (typeof $(el).find('a').attr('href') != undefined && tag.includes('https://myanimelist.net/character')) {

            characters.push({
              name: <string>$(el).find('img').attr('data-src'),
              img: <string>$(el).find('img').attr('alt')
            });

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