// imports:
import axios, { AxiosPromise, AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import { getUrl } from './lib/getAnimeId.js';
import { getImagesUrl } from './lib/getImagesUrl.js';
import parseScore from './lib/parseScore.js';
import { AnimeInfoType } from './DTO/animeInfo.dto.js';
import { NewsPreviewType, NewDetailsType } from './DTO/news.dto';
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
export default class Anime {
  private _keyword: string;
  private _type: string;

  constructor(keyword: string, type: string) {
    this._keyword = keyword;
    this._type = type;

  }
  public async getAnimeInfo(): Promise<AnimeInfoType | Error> {
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
              img: <string>$(el).find('img').attr('data-src')
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
    } catch (error: any) {
      return Error(error)
    }
  }
  
  async getNewsPreview(): Promise<NewsPreviewType[]> {
      const result: AxiosResponse<any> = await axios({
        url: 'https://myanimelist.net/rss/news.xml', //gets rss news
        method: 'GET'
      });
      const $ = cheerio.load(result.data);
      const news: NewsPreviewType[] = [];
      $('item').each((i, el): void => {
        news.push({
          ID: i,
          newsID: $(el).find('guid').text().split('/')[4].split('?')[0], // extracting news IDs:
          newsTitle: $(el).find('title').text(),
          newsDescription: $(el).find('description').text(),
          newsThumbnail: <string>$(el).find('description').next().html(),
          newsDate: $(el).find('pubDate').text()
        });
      });
      return news;
    
  
  }
  
  
  async getNewsDetails(id: string): Promise<NewDetailsType | Error> {
    try {
      const url: NewsPreviewType[] = await this.getNewsPreview();
      let newsUrl;
      for (let i: number = 0; i < url.length; i++) { // checking ID:
        if (url[i]['newsID'] === id) {
          newsUrl = url[i]['newsID']; // assign ID to newsUrl variable
        }
      }
      const result: AxiosResponse<any> = await axios({
        url: 'https://myanimelist.net/news/'.concat(newsUrl),
        method: 'GET'
      });
      const $ = cheerio.load(result.data);
      return {
        contentTitle: $('.news-container > h1').text(),
        contentImage: <string>$('.news-container > .content.clearfix >  img').attr('src'),
        contentDescription: $('.news-container > .content.clearfix').text()
      }
    } catch (error: any) {
      return new Error(error)
    }
    
  }
}

