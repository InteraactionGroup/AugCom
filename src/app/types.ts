/**
 * A Grid (aka Board)
 */
export class Grid {
  ID: string;
  Type: string;
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

/**
 * an element of the Board
 */
export class GridElement {
  ID: string;
  Type: string;
  PartOfSpeech: string;
  Color: string; // to delete later
  BorderColor: string; // to delete later
  VisibilityLevel: number;

  ElementFormsList: ElementForm[];
  InteractionsList: Interaction[];


  constructor(elementId, elementType, elementPartOfSpeech,
              color, borderColor, visibilityLevel, elementsForms, interactionList) {

    this.ID = elementId;
    this.Type = elementType;
    this.PartOfSpeech = elementPartOfSpeech;
    this.Color = color;
    this.BorderColor = borderColor;
    this.VisibilityLevel = visibilityLevel;
    this.ElementFormsList = elementsForms;
    this.InteractionsList = interactionList;
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
  ID: string;
  ActionList: Action[];
}

/**
 * the action of an interaction of an element of the board
 */
export class Action {
  ID: string;
  Action: string;
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
  ElementIDsList: string[];
}
