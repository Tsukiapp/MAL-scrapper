import cheerio from 'cheerio';
import axios from 'axios';
import { NewsPreviewType, NewDetailsType } from '../DTO/news.dto';

/** @deprecated this function is deprecated please use the new version of this package, check the readme on github https://github.com/Tsukiapp/MAL-scrapper/readme.md */
async function getNewsPreview(): Promise<NewsPreviewType[]> {
  const result: NewsPreviewType[] = await axios({
    url: 'https://myanimelist.net/rss/news.xml', //gets rss news
    method: 'GET'
  })
    .then(res => {
      const $ = cheerio.load(res.data);
      const news: NewsPreviewType[] = [];
      $('item').each((i, el):void => {
         news.push({
          ID: i,
          newsID: $(el).find('guid').text().split('/')[4].split('?')[0], // extracting news IDs:
          newsTitle: $(el).find('title').text(),
          newsDescription: $(el).find('description').text() ,
          newsThumbnail: <string>$(el).find('description').next().html(),
          newsDate:$(el).find('pubDate').text()
        });
      });
      return news;
    });
  return result;
}


/** @deprecated this function is deprecated please use the new version of this package, check the readme on github https://github.com/Tsukiapp/MAL-scrapper/readme.md */
async function getNewsDetails(newsPreviewUrl: typeof getNewsPreview, id: string): Promise<NewDetailsType> {
  const url = await newsPreviewUrl();
  let newsUrl;

  for ( let i: number = 0; i < url.length; i++ ){ // checking ID:
    if (url[i]['newsID'] === id) {
       newsUrl =  url[i]['newsID']
    }
  }
  const result: NewDetailsType = await axios({
    url: 'https://myanimelist.net/news/'.concat(newsUrl),
    method: 'GET'
  })
    .then(res => {
      const $ = cheerio.load(res.data);
      return {
        contentTitle: $('.news-container > h1').text(),
        contentImage: <string>$('.news-container > .content.clearfix >  img').attr('src'),
        contentDescription: $('.news-container > .content.clearfix').text()
      }
    });
  return result;
  }
  

export {
  getNewsDetails,
  getNewsPreview
}