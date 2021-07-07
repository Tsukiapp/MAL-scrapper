// imports:
import axios from 'axios';
import cheerio from 'cheerio';
import { getSeasonalImagesUrl } from './lib/getImagesUrl.js';

/*
Id: number (autogenerated is not the anime's ID),
link: string,
title: string,
producer: string,
images, string[],
genre: sring,
description: string,
score: string but can parsed into number -> maybe later,
members: string
*/
export default async function getSeasonalInfo() { 
  const result = await axios({
    url: 'https://myanimelist.net/anime/season'
  })
    .then(res => {
      const $ = cheerio.load(res.data);

      const animesPerSeason = [];
      $('div.seasonal-anime-list.js-seasonal-anime-list.js-seasonal-anime-list-key-1.clearfix')
        .find('.seasonal-anime')
        .each((i, el) => {

        if (i < 50 ) {
          const image = $(el).find('.image > a').html();
            console.log($(el).html())
          return animesPerSeason.push({
            id: i,
            link:  $(el).find('.title > a').attr('href'),
            title: $(el).find('.h2_anime_title').text(),
            producer:$(el).find('.producer > a').text(),
            images: getSeasonalImagesUrl(image),
            genre:$(el).find('.genre > a').attr('title'),
            description: $(el).find('.preline').text(),
            score: $(el).find('.score').text(),
            members:  $(el).find('.member').text()
          });
       }
        });
      return animesPerSeason;
    });
  return result
}



//div.seasonal-anime-list.js-seasonal-anime-list.js-seasonal-anime-list-key-1.clearfix  