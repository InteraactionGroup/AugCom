export class CSVRecord {
  public mot: string;
  public ligne: number;
  public colonne: number;
  public page: string;
  public id: number;
}

export class WordsCSV {
  public mot: string;
  public ligne: number;
  public colonne: number;
  public page: string;
  public wordID: string;
}

export class ButtonLinksCSV {
  public from: string;
  public to: string;
}

export class PageLinksCSV {
  public from: string;
  public to: string;
}

export class BackLinksCSV {
  public from: string;
  public backID: string;
  public to: string;
}

