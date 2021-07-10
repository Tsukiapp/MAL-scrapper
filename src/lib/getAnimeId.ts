// imports:
import axios, {AxiosResponse} from 'axios';
import { AnimeType } from '../DTO/getAnimeId.dto'

/* getId function: get basic info such as ->
 id: number, 
 name: string, 
 image_url: string, 
 items{ score: number, status: string, aired: string, start_year: string }

 from a search based on a keyword and returns an object.

*/

async function getUrl(keyword:string , type: string): Promise<AnimeType> { // keyword: to search by keyword, type: could be either 'anime' or 'manga'

  const response: AxiosResponse<AnimeType> = await axios({
    url: `/search/prefix.json?type=${type}&keyword=${keyword.replace(' ', '%20')}&v=1`, // replace every spcae ' ' with a %20 to (space key encoded)
    method: 'get',
    baseURL: `https://myanimelist.net`
  });

  const result:AnimeType = { ...response.data['categories'][0]['items'][0] };
  delete result['es_score'];
  delete result['payload'];
  return result;
}

export {
  getUrl
}
