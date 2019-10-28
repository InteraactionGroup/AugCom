import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import {ResultJson1, ResultJson2} from '../sparqlJsonResults';

@Injectable({
  providedIn: 'root'
})
export class DbnaryService {

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
    this.sparkql(query, list, 1 );

  }

  getOtherFormsOfThisPartOfSpeechWord(word: string, pos: string, list) {

    const query = [
      'SELECT DISTINCT ?ofo ?p ?n ?g WHERE {{\n' +
      '?mot ontolex:canonicalForm/ontolex:writtenRep "' + word + '"@fr.\n' +
      '?mot dbnary:partOfSpeech "' + pos + '".\n' +
      '?mot ontolex:otherForm ?of.\n' +
      '?of ontolex:writtenRep ?ofo.\n' +
      'OPTIONAL {?of lexinfo:person ?p.}\n' +
      'OPTIONAL {?of lexinfo:number ?n.}\n' +
      'OPTIONAL {?of lexinfo:gender ?g.}\n' +
      '}UNION{\n' +
      '?mot ontolex:canonicalForm/ontolex:writtenRep "' + word + '"@fr.\n' +
      '?mot dbnary:partOfSpeech "' + pos + '".\n' +
      '?mot ontolex:canonicalForm ?of.\n' +
      '?of ontolex:writtenRep ?ofo.\n' +
      'OPTIONAL {?of lexinfo:person ?p.}\n' +
      'OPTIONAL {?of lexinfo:number ?n.}\n' +
      'OPTIONAL {?of lexinfo:gender ?g.}\n' +
      '}}'
    ].join(' ');
    this.sparkql(query, list, 2);

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
          if ( i === 1 ) {
            this.sparkqlData = data as ResultJson1;
            this.sparkqlData.results.bindings.forEach(w => {
              list.push(w.po.value);
            });
          } else if ( i === 2 ) {
            this.sparkqlData = data as ResultJson2;
            this.sparkqlData.results.bindings.forEach(w => {
              const infoList = [];
              if (w.p !== undefined) {
                infoList.push({person: w.p.value});
              }
              if (w.n !== undefined) {
                infoList.push({number: w.n.value});
              }
              if (w.g !== undefined) {
                infoList.push({gender: w.g.value});

              }
              list.push({val: w.ofo.value, info: infoList, selected: false});
            });
          }
          this.searchStarted = 0;
        },
        error => {
          this.searchStarted = 0;
          console.log(error.error.text, error); }
      );
  }

  moveToRight() {
    this.wordList.forEach(word => {
        if (word.selected) {
          this.newList.push(word);
        }
      }
    );
    this.wordList = this.wordList.filter(word =>  !word.selected);
    this.unselect();
  }

  moveToLeft() {
    this.newList.forEach(word => {
        if (word.selected) {
          this.wordList.push(word);
        }
      }
    );
    this.newList = this.newList.filter(word =>  !word.selected);
    this.unselect();
  }

  unselect() {
    this.newList.forEach(word => word.selected = false );
    this.wordList.forEach(word => word.selected = false );
  }
}


