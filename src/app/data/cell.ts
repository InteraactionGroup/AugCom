export class Image {
  id: string;
  path: string;
  contentType: string;
  width: number;
  height: number;
}

export class Grille {
  rows: number;
  cols: number;
  order: string[][];
}

export class Bouton {
  id: string;
  extCboardLabelKey: string;
  label: string;
  backgroundColor: string;
  imageId: string;
  loadBoard: {path: string };
  alternativeFroms: {form: string, formInfo: string[]}[];
}
