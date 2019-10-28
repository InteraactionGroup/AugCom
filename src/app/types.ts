
export class Grid {
  GridID: string;
  ElementList: Element[];
  ImageList: Image[];
  ActionList: Action[];
  InteractionList: Interaction[];
  GridType: string;
  Style: {ElementType: string, Link: string}[];

  constructor(gridId, elemList, imageList, actionList, interList, gridType, style){
    this.GridID = gridId;
    this.ElementList = elemList;
    this.ImageList = imageList;
    this.ActionList = actionList;
    this.InteractionList = interList;
    this.GridType = gridType;
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

export class Image {
  ImageID: string;
  ImageLabel: string;
  ImagePath: string;
}

export class Action {
  ActionID: string;
  ActionType: string;
}

export class Interaction {
  InteractionID: string;
  InteractionType: string;
}

export class ElementForm {
  DisplayedText: string;
  VoiceText: string;
  LexicInfos: string[];
}

