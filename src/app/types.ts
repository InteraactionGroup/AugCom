/**
 * A Grid (aka Board)
 */
export class Grid {
  GridID: string;
  ElementList: Element[];
  ImageList: Image[];
  GridType: string;
  gridColsNumber: number;
  gridRowsNumber: number;
  Style: {ElementType: string, Link: string}[];

  constructor(gridId, elemList, imageList, actionList, gridType, gridCol, gridRow, style) {
    this.GridID = gridId;
    this.ElementList = elemList;
    this.ImageList = imageList;
    this.GridType = gridType;
    this.gridColsNumber = Number(gridCol);
    this.gridRowsNumber = Number(gridRow);
    this.Style = style;
  }

}

/**
 * an element of the Board
 */
export class Element {
  ElementID: string;
  ElementFolder: string;
  ElementType: string;
  ElementPartOfSpeech: string;
  ElementForms: ElementForm[];
  ImageID: string;
  InteractionsList: { InteractionID: string, ActionList: Action[] }[];
  Color: string; // to delete later
  BorderColor: string; // to delete later
  Visible: boolean;
}

/**
 * a vignette for the dialog bar
 */
export class Vignette {
  VignetteLabel: string;
  VignetteImageUrl: any;
  VignetteColor: string;
}

/**
 * an image of the Board
 */
export class Image {
  ImageID: string;
  ImageLabel: string;
  ImagePath: string;
}

/**
 * the action of an interaction of an element of the board
 */
export class Action {
  ActionID: string;
  Action: string;
}

/**
 * an element variant form of an element of the board
 */
export class ElementForm {
  DisplayedText: string;
  VoiceText: string;
  LexicInfos: any[];
}

