// imports:
import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import { getUrl } from './getAnimeId.js';
import { getImagesUrl } from './getImagesUrl.js';
import parseScore from './parseScore.js';
import { AnimeInfoType } from '../DTO/animeInfo.dto.js';
import { NewsPreviewType, NewDetailsType } from '../DTO/news.dto';
import { getSeasonalImagesUrl } from './getImagesUrl.js';
import { SeasonalInfoType } from '../DTO/seasonal.dto';
import { getTopAnimeType } from '../DTO/getTopAnime.dto';

export default class AnimeClass {

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
  public async getAnimeInfo(keyword:string, type: string): Promise<AnimeInfoType | Error> {
    try {
      const url = await getUrl(keyword, type);
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
        images: await getImagesUrl(keyword, type),
        characters: characters
      }
    } catch (error: any) {
      return Error(error)
    }
  }
  
  public async getNewsPreview(): Promise<NewsPreviewType[]> {
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
  
  
  public async getNewsDetails(id: string): Promise<NewDetailsType | Error> {
    try {
      const url: NewsPreviewType[] = await this.getNewsPreview();
      let newsUrl: string = "";
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
  public async getTopAnime(): Promise<getTopAnimeType[]> {
    const result: AxiosResponse<any> = await axios({
      url: 'https://myanimelist.net/topanime.php'
    });
        const $ = cheerio.load(result.data);
        const topAnime: getTopAnimeType[] = [];
        $('.title.al.va-t.word-break').each((i, el) => {
          topAnime.push({
            // Sanitize url string.
            thumbnailImage: <string>$(el).find('.hoverinfo_trigger.fl-l.ml12.mr8').children().attr('data-srcset')?.split(',')[1].replace(/\s2x$/, ''),
            url: <string>$(el).find('.detail > .di-ib.clearfix > h3 > a').attr('href'),
            title: <string>$(el).find('.detail > .di-ib.clearfix > h3 > a').text(),
            stats: <string>$(el).find('.detail').find('.information.di-ib.mt4').text().trim()
          });
        });
        return topAnime;
  }

  public async getSeasonalInfo(): Promise<SeasonalInfoType[] | Error> { 
    try {
      const result: AxiosResponse<any> = await axios({
        url: 'https://myanimelist.net/anime/season'
      });
          const $ = cheerio.load(result.data);
          const animesPerSeason:SeasonalInfoType[] = [];
          $('div.seasonal-anime-list.js-seasonal-anime-list.js-seasonal-anime-list-key-1.clearfix')
            .find('.seasonal-anime')
            .each((i, el): void => {
    
            if (i < 50 ) {
              const image = $(el).find('.image > a').html();
               animesPerSeason.push({
                ID: i,
                link:  <string> $(el).find('.title > a').attr('href') ,
                title:  <string> $(el).find('.h2_anime_title').text(),
                producer:  <string> $(el).find('.producer > a').text(),
                images: getSeasonalImagesUrl(image),
                genre: <string> $(el).find('.genre > a').attr('title'),
                description: <string> $(el).find('.preline').text(),
                score: <string> $(el).find('.score').text(),
                members: <string> $(el).find('.member').text()
              });
           }
            });
          return animesPerSeason;
    } catch (error: any) {
      return new Error(error);
    }
  }
}

