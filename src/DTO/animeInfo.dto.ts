import { ImageType } from "./getImages.dto";

export type AnimeInfoType = {
  title: string;
    score: number;
    description: string;
    coverImage: string;
    thumbnailImage: string;
    images: ImageType;
    characters: Object[];
}