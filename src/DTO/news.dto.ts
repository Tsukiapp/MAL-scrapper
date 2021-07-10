 type NewsPreviewType = {
  ID: number,
  newsID: string,
  newsTitle: string,
  newsDescription: string,
  newsThumbnail: string,
  newsDate: string
}

type NewDetailsType = {
  contentTitle: string,
  contentImage: string,
  contentDescription: string
}

export {
  NewsPreviewType,
  NewDetailsType
}