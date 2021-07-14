import axios from 'axios';
import cheerio from 'cheerio';
import { getTopAnimeType } from './DTO/getTopAnime.dto';

export default async function getTopAnime(){
  const result: getTopAnimeType[] = await axios({
    url: 'https://myanimelist.net/topanime.php'
  })
    .then(res => {
      const $ = cheerio.load(res.data);
      const topAnime: getTopAnimeType[] = [];
      $('.title.al.va-t.word-break').each((i, el) => {
        topAnime.push({
          thumbnailImage: <string>$(el).find('.hoverinfo_trigger.fl-l.ml12.mr8').children().attr('data-srcset')?.split(',')[1],
          url: <string>$(el).find('.detail > .di-ib.clearfix > h3 > a').attr('href'),
          title: <string>$(el).find('.detail > .di-ib.clearfix > h3 > a').text(),
          stats: <string>$(el).find('.detail').find('.information.di-ib.mt4').text().trim()
        });
      });
      return topAnime;
    });
  return result;
};
