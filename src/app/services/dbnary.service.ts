import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import {ResultJson1, ResultJson2} from '../sparqlJsonResults';

@Injectable({
  providedIn: 'root'
})
export class DbnaryService {

  public static PartOfSpeechQuerry = 1;
  public static FormsOfWord = 2;
  public static FormsOfVerb = 3;

  private sparkqlData = null;
  public word;
  public wordList = [];
  public typeList = [];

  public newList = [];

  searchStarted = 0;

  constructor(private http: HttpClient) {
  }

  startsearch(i: number) {
    this.searchStarted = i;
  }
  getWordPartOfSpeech(word: string, list) {

    const query = ['SELECT DISTINCT ?po WHERE {' +
    '?t ontolex:canonicalForm/ontolex:writtenRep "' + word + '"@fr;' +
    'dbnary:partOfSpeech ?po.' +
    '}'].join(' ');
    this.sparkql(query, list, DbnaryService.PartOfSpeechQuerry );

  }

  getOtherFormsOfThisPartOfSpeechWord(word: string, pos: string, list) {

    const query = [
      'SELECT DISTINCT ?ofo ?of ?p ?n ?g ?t ?vFM WHERE {{\n' +
      '?mot ontolex:canonicalForm/ontolex:writtenRep "' + word + '"@fr.\n' +
      '?mot dbnary:partOfSpeech "' + pos + '".\n' +
      '?mot ontolex:otherForm ?of.\n' +
      '?of ontolex:writtenRep ?ofo.\n' +
      'OPTIONAL {?of lexinfo:person ?p.}\n' +
      'OPTIONAL {?of lexinfo:number ?n.}\n' +
      'OPTIONAL {?of lexinfo:gender ?g.}\n' +
      'OPTIONAL {?of lexinfo:tense ?t.}\n' +
      'OPTIONAL {?of lexinfo:verbFormMood ?vFM.}\n' +
      '}UNION{\n' +
      '?mot ontolex:canonicalForm/ontolex:writtenRep "' + word + '"@fr.\n' +
      '?mot dbnary:partOfSpeech "' + pos + '".\n' +
      '?mot ontolex:canonicalForm ?of.\n' +
      '?of ontolex:writtenRep ?ofo.\n' +
      'OPTIONAL {?of lexinfo:person ?p.}\n' +
      'OPTIONAL {?of lexinfo:number ?n.}\n' +
      'OPTIONAL {?of lexinfo:gender ?g.}\n' +
      'OPTIONAL {?of lexinfo:tense ?t.}\n' +
      'OPTIONAL {?of lexinfo:verbFormMood ?vFM.}\n' +
      '}}'
  ].join(' ');
    if (pos !== '-verb-') {
      this.sparkql(query, list, DbnaryService.FormsOfWord);
    } else {
      this.sparkql(query, list, DbnaryService.FormsOfVerb);
    }
  }

  sparkql(query, list, i) {


    const headers = new HttpHeaders({
      'Content-type' : 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    });

    const params = new HttpParams();
    params.append('format', 'json');

    const httpOptions = {
      headers,
      // params: params,
      withCreditals: false
    };

    const proxy = 'https://cors-anywhere.herokuapp.com/';
    this.http
      .get(proxy + 'http://kaiko.getalp.org/sparql' + '?query=' + encodeURIComponent(query) , httpOptions)
      .subscribe(
        data => {
          if ( i === DbnaryService.PartOfSpeechQuerry ) {
            this.sparkqlData = data as ResultJson1;
            this.sparkqlData.results.bindings.forEach(w => {
              list.push(w.po.value);
            });
          } else {
            this.sparkqlData = data as ResultJson2;
            this.sparkqlData.results.bindings.forEach(w => {
              const infoList = [];
              if (w.p !== undefined) {
                infoList.push({person: w.p.value.replace('http://www.lexinfo.net/ontology/2.0/lexinfo#', '')});
              }
              if (w.n !== undefined) {
                infoList.push({number: w.n.value.replace('http://www.lexinfo.net/ontology/2.0/lexinfo#', '')});
              }
              if (w.g !== undefined) {
                infoList.push({gender: w.g.value.replace('http://www.lexinfo.net/ontology/2.0/lexinfo#', '')});

              }
              if (w.t !== undefined) {
                infoList.push({tense: w.t.value.replace('http://www.lexinfo.net/ontology/2.0/lexinfo#', '')});

              }
              if (w.vFM !== undefined) {
                infoList.push({verbFormMood: w.vFM.value.replace('http://www.lexinfo.net/ontology/2.0/lexinfo#', '')});

              }
              if (i === DbnaryService.FormsOfVerb && this.isIndicativePresent(w)) {
                list.push({val: w.ofo.value, info: infoList, selected: false});
              } else if (i === DbnaryService.FormsOfWord) {
                list.push({val: w.ofo.value, info: infoList, selected: false});
              }

            });
          }
          this.searchStarted = 0;
        },
        error => {
          this.searchStarted = 0;
          console.log(error.error.text, error); }
      );
  }

  isIndicativePresent(verb): boolean {
      return (
        verb.t !== undefined && verb.t.value === 'http://www.lexinfo.net/ontology/2.0/lexinfo#present' &&
        verb.vFM !== undefined &&  verb.vFM.value === 'http://www.lexinfo.net/ontology/2.0/lexinfo#indicative'
      );
  }

  unselect() {
    this.newList.forEach(word => word.selected = false );
    this.wordList.forEach(word => word.selected = false );
  }
}


