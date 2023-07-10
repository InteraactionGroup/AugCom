/**
 * A Grid (aka Board)
 */

export class Grid {
  //metadata
  author: string = 'someone';
  software: string = 'AugCom';
  libraryUsed: string[] = [];
  licence: string = '';
  owner: string = 'someone';
  translators: string = "";
  creationDate: string;
  modificationDate: string;

  //grid properties
  ID: string;
  Type: 'Grid';
  NumberOfCols: number;
  NumberOfRows: number;
  GapSize: number;

  ElementList: GridElement[];
  ImageList: Image[];
  PageList: Page[];

  BackgroundColor: string;



  constructor(gridId, gridType, gridCol, gridRow, elemList, imageList, pageList) {
    this.ID = gridId;
    this.Type = gridType;
    this.NumberOfCols = Number(gridCol);
    this.NumberOfRows = Number(gridRow);
    this.ElementList = elemList;
    this.ImageList = imageList;
    this.PageList = pageList;
  }

}

export class FolderGoTo {
  GoTo: string;

  constructor(goto) {
    this.GoTo = goto;
  }
}

/**
 * an element of the Board
 */
export class GridElement {
  ID: string;
  Type: 'empty' | 'button' | FolderGoTo;
  PartOfSpeech: '-nom-' | '-nom-pr-' | 'nom de famille' | '-adv-' | 'prénom' | '-adj-' | 'variante typographique' | '-verb' | 'pronom' | 'locution-phrase' | 'interjection' | 'onomatopée' | 'pronom démonstratif' | 'adjectif indéfini' | 'pronom indéfini' | 'pronom personnel' | 'conjonction' | 'adjectif numéral' | 'préposition' | 'article partitif' | 'adverbe interrogatif' | 'conjonction de coordination' | 'pronom interrogatif' | 'pronom relatif' | 'pronom possessif' | 'erreur' | 'locution phrase' | 'proverbe' | 'adverbe relatif' | 'nom scientifique' | 'adjectif exclamatif' | 'adjectif interrogatif' | 'adjectif possessif' | 'adjectif démonstratif' | 'patronyme' | 'article défini' | 'interj' | 'locution' | 'article indéfini' | string;
  VisibilityLevel: number;
  x: number;
  y: number;
  cols: number;
  rows: number;

  style: { id: string } | Style;

  ElementFormsList: ElementForm[];
  InteractionsList: Interaction[];

  dragAndResizeEnabled: boolean;


  constructor(elementId: string, elementType, elementPartOfSpeech: string,
    color: string, borderColor: string, visibilityLevel, elementsForms: ElementForm[], interactionList: Interaction[]) {

    this.ID = elementId;
    this.Type = elementType;
    this.PartOfSpeech = elementPartOfSpeech;
    this.style = new Style(color, borderColor, 'black');
    this.VisibilityLevel = visibilityLevel;
    this.ElementFormsList = elementsForms;
    this.InteractionsList = interactionList;
    this.y = 0;
    this.x = 0;
    this.rows = 1;
    this.cols = 1;
    this.dragAndResizeEnabled = true;
  }
}

/**
 * an element generated of the Board
 */
export class GridElementGenerated {
  ID: string;
  Type: 'empty' | 'button' | FolderGoTo;
  PartOfSpeech: '-nom-' | '-nom-pr-' | 'nom de famille' | '-adv-' | 'prénom' | '-adj-' | 'variante typographique' | '-verb' | 'pronom' | 'locution-phrase' | 'interjection' | 'onomatopée' | 'pronom démonstratif' | 'adjectif indéfini' | 'pronom indéfini' | 'pronom personnel' | 'conjonction' | 'adjectif numéral' | 'préposition' | 'article partitif' | 'adverbe interrogatif' | 'conjonction de coordination' | 'pronom interrogatif' | 'pronom relatif' | 'pronom possessif' | 'erreur' | 'locution phrase' | 'proverbe' | 'adverbe relatif' | 'nom scientifique' | 'adjectif exclamatif' | 'adjectif interrogatif' | 'adjectif possessif' | 'adjectif démonstratif' | 'patronyme' | 'article défini' | 'interj' | 'locution' | 'article indéfini' | string;
  VisibilityLevel: number;
  x: number;
  y: number;
  cols: number;
  rows: number;

  style: { id: string } | Style;

  ElementFormsList: ElementForm[];
  InteractionsList: Interaction[];

  dragAndResizeEnabled: boolean;


  constructor(elementId: string, elementType, elementPartOfSpeech: string,
    color: string, borderColor: string, visibilityLevel, elementsForms: ElementForm[], interactionList: Interaction[], numberX: number, numberY: number) {

    this.ID = elementId;
    this.Type = elementType;
    this.PartOfSpeech = elementPartOfSpeech;
    this.style = new Style(color, borderColor, 'black');
    this.VisibilityLevel = visibilityLevel;
    this.ElementFormsList = elementsForms;
    this.InteractionsList = interactionList;
    this.y = numberY;
    this.x = numberX;
    this.rows = 1;
    this.cols = 1;
    this.dragAndResizeEnabled = true;
  }
}

/**
 * a vignette for the dialog bar
 */
export class Vignette {
  Label: string;
  ImagePath: any;
  Color: string;
  BorderColor: string;
}

/**
 * an image of the Board
 */
export class Image {
  ID: string;
  OriginalName: string;
  Path: string;
}

export class Interaction {
  ID: string; // 'click' | 'longPress' | 'doubleClick';
  ActionList: Action[];
}

/**
 * the action of an interaction of an element of the board
 */
export class Action {
  ID: string;
  Options: string[];
}

/**
 * an element variant form of an element of the board
 */
export class ElementForm {
  DisplayedText: string;
  VoiceText: string;
  LexicInfos: any[];
  ImageID: string;
}

export class Page {
  ID: string;
  Name: string;
  ElementIDsList: string[];
  NumberOfCols: number;
  NumberOfRows: number;
  GapSize: number;
  BackgroundColor: string
}

export class Dictionary {
  dictionary: { id: string, FR: string, EN: string }[]
}

export class Style {
  BackgroundColor: string;
  BorderColor: string;
  BorderWidth: string;
  BorderRadius: string;
  FontFamily: string;
  TextColor: string;

  constructor(backgroundColor: string, borderColor: string, textColor: string) {
    this.BackgroundColor = backgroundColor;
    this.BorderColor = borderColor;
    this.TextColor = textColor;
    this.FontFamily = 'Arial';
    this.BorderRadius = '10px';
    this.BorderWidth = '3px';
  }

}

export class Configuration {
  'DWELL_TIME_ENABLED': boolean;
  'PICTO_IMAGE_AND_TEXT_VISIBILITY_VALUE': string;
  'PICTO_IMAGE_POSITION_VALUE': string;
  'PICTO_TEXT_STYLE_VALUE': string;
  'REPO_IMAGE_AND_TEXT_VISIBILITY_VALUE': string;
  'REPO_IMAGE_POSITION_VALUE': string;
  'REPO_TEXT_STYLE_VALUE': string;
  'LANGUAGE_VALUE': string;
  'DEFAULT_STYLE_BACKGROUNDCOLOR_VALUE': string;
  'DEFAULT_STYLE_BORDERCOLOR_VALUE': string;
  'DEFAULT_STYLE_TEXTCOLOR_VALUE': string;
  'DEFAULT_STYLE_FONTFAMILY_VALUE': string;
  'DWELL_TIME_TIMEOUT_VALUE': number;
  'LONGPRESS_TIMEOUT_VALUE': number;
  'DOUBLE_CLICK_TIMEOUT_VALUE': number;
  'CURRENT_VOICE_VALUE': string;
  'MAIN_COLOR_0_VALUE': string;
  'MAIN_COLOR_1_VALUE': string;
  'MAIN_COLOR_2_VALUE': string;
  'MAIN_COLOR_3_VALUE': string;
  'MAIN_COLOR_4_VALUE': string;
  'SIZE_FONT_VALUE': string;
  'SIZE_ICON_VALUE': string;
  'VOLUME': number;
  'RATE': number;
  'PITCH': number;
  'HEADER': string | ArrayBuffer;
  'HEADER_BUTTON': boolean;
  'HEADER_CHOICE': string;
  'FOOTER': string | ArrayBuffer;
  'FOOTER_BUTTON': boolean;
  'FOOTER_CHOICE': string

}

export class User {
  id: number;
  name: string;
  base64image: string;
  gridsID: string[] = ['gridExample'];
  constructor(name, base64image, id?) {
    if (id == null) {
      this.id = Math.floor(Math.random() * 10000000000) + Date.now();
    } else {
      this.id = id;
    }
    this.name = name;
    this.base64image = base64image;
  }
}

export class ImageSclera {
  nm: string;
  id: string;
  kws: Kws;
}

export class ImageParlerPicto {
  nm: string;
  id: string;
  kws: Kws;
}

export class ImagearasaacLCC {
  nm: string;
  id: string;
  kws: Kws;
}

export class ImageMulberry {
  nm: string;
  id: string;
  kws: Kws;
}

export class ImageFontawesome {
  nm: string;
  id: string;
  kws: Kws;
}

export class Kws {
  fr: string[];
}
