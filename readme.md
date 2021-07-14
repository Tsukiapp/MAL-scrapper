
<h1 align="center">
  <br>
  <a href="https://github.com/Tsukiapp" alt="Tsuki Mal scrapper" width="200"></a>
  <br>
  🌌 MAL-Scrapper 🌌
  <br>
</h1>

<h4 align="center"> Simple MAL-Scrapper </h4>

<p align="center">
  <a href="#Features"> Features 🦾 </a> •
  <a href="#how-to-use">How To Use 📖</a> •
  <a href="#download">Download 💾 </a> •
  <a href="#license">License  </a> •
</p>



## Features 🦾

* ✅ Fetch info about anime
  - Search animes and extract their information instantly, direct from myanimelist.
* ✅ Fecth seasonal animes
  - Fetch the top 50 animes in this season.
* ✅ Get news
  - Fetch the latest news from myanimelist, preview and full detailed.
* ✅ Fetch top animes
  - Fetch the top 50 animes. 


## How To Use 📖
```javascript
//index.js:
import {
    getAnimeInfo, 
    getNewsDetails, 
    getNewsPreview, 
    getSeasonalInfo,
    getTopAnime
 } from "Tsukiapp-mal-scrapper"; 

//getAnimeInfo(keyword: string, type: string)
// -> type could be either: 'anime' and 'manga'
let AnimeInformation = await getAnimeInfo('jujutsu kaisen', 'anime'); //async function
console.log(animeInformation);
/*
return -> {
  title: string
  score: string
  description: string
  coverImage: string,
  thumbnailImage: string,
  images: string[],
  characters: Object[]
}
*/

//getNewsDetails(newsPreviewUrl: getNewsPreview, id: string)
// -> id must be the ID of the new and getNewsPreview function as a parameter:
let newDetailed = await getNewsDetails(getNewsPreview, '63779601');
console.log(newDetailed);
/*
return -> {
  contentTitle: string,
  contentImage: string,
  contentDescription: string
}
*/

//getNewsPreview()
let newPreview = await getNewsPreview();
console.log(newPreview);

/*
return -> [{
  ID: number,
  newsID: string,
  newsTitle: string,
  newsDescription: string,
  newsThumbnail: string,
  newsDate: string
}] 
*/

//getSeasonalInfo()
let seasonalAnime = await getSeasonalInfo();
console.log(seasonalAnime)
/*
return -> [{
  Id: number (autogenerated is not the anime's ID),
  link: string,
  title: string,
  producer: string,
  images, string[],
  genre: sring,
  description: string,
  score: string but can parsed into number -> maybe later,
  members: string
}]
*/

let topAnime = await getTopAnime();
console.log(topAnime);
/*
return -> [{
  thumbnailImage: string,
  url: string,
  title: string,
  stats: string
}]
*/
```

## Download 💾


To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/Tsukiapp/MAL-scrapper.git

# Go into the repository
$ cd MAL-scrapper

# Install dependencies
$ npm install

# Build
$ npm run build

# Run the app
$ npm run start

```


## Credits 📚

This software uses the following open source packages:

- [Axios](https://axios-http.com/)
- [Node.js](https://nodejs.org/)
- [Cheerio](https://cheerio.js.org/)
- [Typescript](https://www.typescriptlang.org/)


## License 🔐
### The source code of this project is under the [MIT license](https://github.com/Tsukiapp/MAL-scrapper/blob/main/LICENSE) 

---

> GitHub [@Tsukiapp](https://github.com/Tsukiapp) &nbsp;&middot;&nbsp;
<br>
> Github [@alejandro0619](https://github.com/alejandro0619) &nbsp;&middot;&nbsp;


