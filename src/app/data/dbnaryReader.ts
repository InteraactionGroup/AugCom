import * as rdflib from 'rdflib';

export class DBnaryDictionnaryVerbElement {
  type = "verb";
  label;
  number;
  person;
  tense;
  verbForm;
  writtenRep;

  constructor( label, number, person, tense, verbForm, writtenRep){
    this.label = label;
    this.number= number;
    this.person =person;
    this.tense =tense;
    this.verbForm= verbForm;
    this.writtenRep= writtenRep;
  }
}

export class DBnaryDictionnaryNounElement {
  type = "noun";
  label;
  number;
  gender;
  writtenRep;

  constructor(label,number,gender,writtenRep){
    this.label=label;
    this.number=number;
    this.gender=gender;
    this.writtenRep= writtenRep;
  }
}

export class DBnaryReader {


  constructor() {
  }

  etreVerb1 = new DBnaryDictionnaryVerbElement("etre","singulier","first","present","indicatif","suis");
  etreVerb2 = new DBnaryDictionnaryVerbElement("etre","singulier","second","present","indicatif","es");
  avoirVerb = new DBnaryDictionnaryVerbElement("avoir","singulier","second","present","indicatif","as");
  etreNoun1 = new DBnaryDictionnaryNounElement("etre","singulier","masculin","etre");
  etreNoun2 = new DBnaryDictionnaryNounElement("etre","pluriel","masculin","etres");
  avoirNoun = new DBnaryDictionnaryNounElement("avoir","singulier","masculin","avoir");

  dbnaryDictionnary: any[] = [this.etreVerb1, this.etreVerb2,this.etreNoun1,this.etreNoun2,this.avoirNoun,this.avoirVerb];

  getWord(searchedWord :string) : {typelist: any[], wordlist: any[]}  {
    let tempWordList = [];
    let tempTypeList = [];
    this.dbnaryDictionnary.forEach(function(value){
      if (value.label === searchedWord){
        tempWordList.push(value);
        if(tempTypeList.indexOf(value.type)==-1){
          tempTypeList.push(value.type);
        }
      }
    })
    return {typelist: tempTypeList, wordlist: tempWordList};
  }

  gettypeof(b){
    return  b.type;
  }


}


