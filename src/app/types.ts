/**
 * A Grid (aka Board)
 */
export class Grid {
  ID: string;
  Type: 'Grid';
  NumberOfCols: number;
  NumberOfRows: number;

  ElementList: GridElement[];
  ImageList: Image[];
  PageList: Page[];

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
  Color: string; // to delete later
  BorderColor: string; // to delete later
  VisibilityLevel: number;
  x: number;
  y: number;
  cols: number;
  rows: number;

  ElementFormsList: ElementForm[];
  InteractionsList: Interaction[];

  dragAndResizeEnabled: boolean;


  constructor(elementId: string, elementType , elementPartOfSpeech: string,
              color: string, borderColor: string, visibilityLevel , elementsForms: ElementForm[], interactionList: Interaction[] ) {

    this.ID = elementId;
    this.Type = elementType;
    this.PartOfSpeech = elementPartOfSpeech;
    this.Color = color;
    this.BorderColor = borderColor;
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
}

export class Dictionary {
  dictionary : { id: string, FR: string, EN: string }[]
}
