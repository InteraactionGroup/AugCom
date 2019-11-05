
export class Grid {
  GridID: string;
  ElementList: Element[];
  ImageList: Image[];
  GridType: string;
  GridInfo: number;
  Style: {ElementType: string, Link: string}[];

  constructor(gridId, elemList, imageList, actionList, gridType, gridinfo, style) {
    this.GridID = gridId;
    this.ElementList = elemList;
    this.ImageList = imageList;
    this.GridType = gridType;
    this.GridInfo = gridinfo;
    this.Style = style;
  }

}

export class Element {
  ElementID: string;
  ElementFolder: string;
  ElementType: string;
  ElementForms: ElementForm[];
  ImageID: string;
  InteractionsList: { InteractionID: string, ActionList: Action[] }[];
  Color: string; // to delete later
}

export class Vignette {
  VignetteLabel: string;
  VignetteImageUrl: any;
  VignetteColor: string;
}

export class Image {
  ImageID: string;
  ImageLabel: string;
  ImagePath: string;
}

export class Action {
  ActionID: string;
  Action: string;
}

export class ElementForm {
  DisplayedText: string;
  VoiceText: string;
  LexicInfos: any[];
}

