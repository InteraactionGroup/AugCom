/**
 * the description of a mulberry element from the mulberry library
 */
import {ImageParlerPicto, ImageSclera} from "./types";

export class MulBerryObject {
  id: number;
  symbol: string;
  grammar: string;
  category: string;
  rated: number;
  tags: string;
}

/**
 * the description of a mulberry element from the mulberry library
 */
export class ArasaacObject {
  wordList: string[];
}

/**
 * the description of a Sclera element from the Sclera library
 */
export class ScleraObject {
  name: string;
  description: string;
  author: string;
  imageExtension: string;
  url: string;
  customDictionary: boolean;
  images: ImageSclera[];
}

/**
 * the description of a Sclera element from the Sclera library
 */
export class ParlerPictoObject {
  name: string;
  description: string;
  author: string;
  imageExtension: string;
  url: string;
  customDictionary: boolean;
  images: ImageParlerPicto[];
}
