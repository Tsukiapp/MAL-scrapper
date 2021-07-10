import cheerio from 'cheerio';
import axios from 'axios';

async function getNewsPreview() {
  const result = await axios({
    url: 'https://myanimelist.net/rss/news.xml', //gets rss news
    method: 'GET'
  })
    .then(res => {
      const $ = cheerio.load(res.data);
      const news = [];
      $('item').each((i, el) => {
        return news.push({
          ID: i,
          newsID: $(el).find('guid').text().split('/')[4].split('?')[0], // extracting news IDs:
          newsTitle: $(el).find('title').text(),
          newsDescription: $(el).find('description').text() ,
          newsThumbnail: $(el).find('description').next().html(),
          newsDate:$(el).find('pubDate').text()
        });
      });
      return news;
    });
  return result;
}


async function getNewsDetails(URL, id) {
  const url = await URL();
  let newsUrl;

  for ( let i = 0; i < url.length; i++ ){ // checking ID:
    if (url[i]['newsID'] === id) {
      newsUrl =  url[i]['newsID']
    }
  }
  const result = await axios({
    url: 'https://myanimelist.net/news/'.concat(newsUrl),
    method: 'GET'
  })
    .then(res => {
      const $ = cheerio.load(res.data);

      return {
        contentTitle: $('.news-container > h1').text(),
        contentImage: $('.news-container > .content.clearfix > img').attr('src'),
        contentDescription: $('.news-container > .content.clearfix').text()
      }
    });
  return result;
  }
  


//getNewsPreview().then(res => console.log(res))
export {
  getNewsDetails,
  getNewsPreview
}