/**
 * A Grid (aka Board)
 */
export class Grid {
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
  Type: 'empty' | 'button' |  FolderGoTo;
  PartOfSpeech: string;
  VisibilityLevel: number;
  x: number;
  y: number;
  cols: number;
  rows: number;

  style: {id: string} | Style;

  ElementFormsList: ElementForm[];
  InteractionsList: Interaction[];

  dragAndResizeEnabled: boolean;


  constructor(elementId: string, elementType , elementPartOfSpeech: string,
              color: string, borderColor: string, visibilityLevel , elementsForms: ElementForm[], interactionList: Interaction[] ) {

    this.ID = elementId;
    this.Type = elementType;
    this.PartOfSpeech = elementPartOfSpeech;
    this.style = new Style(color, borderColor, 'black');
    this.VisibilityLevel = visibilityLevel;
    this.ElementFormsList = elementsForms;
    this.InteractionsList = interactionList;
    this.y = 0;
    this.x = 0;
    this.rows =1;
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
  Name : string;
  ElementIDsList: string[];
  NumberOfCols: number;
  NumberOfRows: number;
  GapSize: number;
  BackgroundColor: string
}

export class Dictionary {
  dictionary : { id: string, FR: string, EN: string }[]
}

export class Style {
  BackgroundColor: string;
  BorderColor: string;
  BorderWidth: string;
  BorderRadius: string;
  TextColor: string;

  constructor(backgroundColor: string, borderColor: string, textColor: string){
    this.BackgroundColor = backgroundColor;
    this.BorderColor = borderColor;
    this.TextColor = textColor;
    this.BorderRadius = '10px';
    this.BorderWidth = '3px';
  }

}

export class Configuration {
  dwellTime: boolean = false;
  imageAndTextVisibilityPicto = 'default'; // can be 'default' 'imageOnly' and 'textOnly'
  imagePositionPicto = 'down'; // can take 'down', 'left', 'right' if imageAndTextVisibiliy is 'default'
  textStylePicto = 'default'; // default is taking the font style of the application while other styles applyies only to pictograms
  imageAndTextVisibilityRepo = 'default'; // can be 'default' 'imageOnly' and 'textOnly'
  imagePositionRepo = 'down'; // can take 'down', 'left', 'right' if imageAndTextVisibiliy is 'default'
  textStyleRepo = 'default'; // default is taking the font style of the application while other styles applyies only to pictograms
  language = 'FR';
  DEFAULT_STYLE_BACKGROUNDCOLOR_VALUE = 'lightgrey';
  DEFAULT_STYLE_BORDERCOLOR_VALUE = 'black';
  DEFAULT_STYLE_TEXTCOLOR_VALUE = 'black';
  public DWELL_TIME_VALUE = 500;
  longpressTimeOut = 1000;
  doubleClickTimeOut = 200;
  dwellTimeActivated = false;
  currentVoice = '@';
}
