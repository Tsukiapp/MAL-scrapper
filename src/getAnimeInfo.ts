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
export default class getAnime {
  private _keyword: string;
  private _type: string;

  constructor(keyword: string, type: string) {
    this._keyword = keyword;
    this._type = type;

  }
  async getAnimeInfo(): Promise<AnimeInfoType | unknown> {
    try {
      const url = await getUrl(this._keyword, this._type);
      const result = await axios({
        url: url['url'],
        method: 'GET',
      });
        const $ = cheerio.load(result.data);
        const characters: Object[] = [];
        $('.detail-characters-list.clearfix')
          .find('.ac.borderClass > .picSurround')
          .each((i, el) => {
            const tag: string = <string>$(el).find('a').attr('href');
            if (typeof $(el).find('a').attr('href') != undefined && tag.includes('https://myanimelist.net/character')) {
              characters.push({
                name: <string>$(el).find('img').attr('alt'),
                img:  <string>$(el).find('img').attr('data-src')
              });
  
            }                                                                      
        });
        return {
          title: $('.title-name').text(),
          score: parseScore($('.score-label.score-8').text()),
          description: $('p[itemprop="description"]').text(),
          coverImage: url['image_url'],
          thumbnailImage: url['thumbnail_url'],
          images: await getImagesUrl(this._keyword, this._type),
          characters: characters
        }
    } catch (error) {
      return error;
    }
      }
    
  }
