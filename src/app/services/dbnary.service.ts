import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ResultJson1 } from '../sparqlJsonResults';

@Injectable({
  providedIn: 'root',

})
export class DbnaryService {

  private sparkqlData = null;
  public wordList = [];
  public typeList = [];
  searchStarted = 0;

  constructor(public http: HttpClient) {
  }

  /*1 opens display variant 2 open wordlist*/
  startsearch(i: number) {
    this.searchStarted = i;
  }

  /*get grammatical types of a word*/
  getTypes(word: string) {

    const query = [
      'SELECT DISTINCT ?po ?ofo ?p ?g ?n ?t ?vFM WHERE {{\n' +
      '?mot ontolex:canonicalForm/ontolex:writtenRep "' + word + '"@FR.\n' +
      '?mot dbnary:partOfSpeech ?po.\n' +
      '?mot ontolex:otherForm ?of.\n' +
      '?of ontolex:writtenRep ?ofo.\n' +
      'OPTIONAL {?of lexinfo:person ?p.}\n' +
      'OPTIONAL {?of lexinfo:number ?n.}\n' +
      'OPTIONAL {?of lexinfo:gender ?g.}\n' +
      'OPTIONAL {?of lexinfo:tense ?t.}\n' +
      'OPTIONAL {?of lexinfo:verbFormMood ?vFM.}\n' +
      '}UNION{\n' +
      '?mot ontolex:canonicalForm/ontolex:writtenRep "' + word + '"@FR.\n' +
      '?mot dbnary:partOfSpeech ?po.\n' +
      '?mot ontolex:canonicalForm ?of.\n' +
      '?of ontolex:writtenRep ?ofo.\n' +
      'OPTIONAL {?of lexinfo:person ?p.}\n' +
      'OPTIONAL {?of lexinfo:number ?n.}\n' +
      'OPTIONAL {?of lexinfo:gender ?g.}\n' +
      'OPTIONAL {?of lexinfo:tense ?t.}\n' +
      'OPTIONAL {?of lexinfo:verbFormMood ?vFM.}\n' +
      '}\n' +
      '}ORDER BY ?po, ?g ,?n'
    ].join(' ');
    this.sparkql(query);
  }

  /*execute given sparql query on dbnary*/
  sparkql(query) {
    this.typeList = [];
    const headers = new HttpHeaders({
      "Access-Control-Allow-Origin": "localhost:4200",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
      "Access-Control-Allow-Headers": "Access-Control-Allow-Origin, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    });
    const params = new HttpParams();
    params.append('format', 'json');

    const httpOptions = {
      params
    };

    this.http
      .get('https://kaiko.getalp.org/sparql' + '?query=' + encodeURIComponent(query), httpOptions)
      .subscribe(
        data => {
          this.sparkqlData = data as ResultJson1;
          this.sparkqlData.results.bindings.forEach(w => {
            if (!this.typeList.includes(w.po.value)) {
              this.typeList.push(w.po.value);
            }
          });
          this.searchStarted = 0;
        },
        error => {
          this.searchStarted = 0;
          console.log(error.error.text, error);
        }
      );
  }

  /*get the words of results with the given grammaticalClass*/
  getWords(grammaticalClass) {
    this.searchStarted = 1;
    this.sparkqlData.results.bindings.forEach(w => {
      if (w.po !== undefined && w.po.value === grammaticalClass) {
        const infoList = [];
        if (w.p !== undefined) {
          infoList.push({ person: w.p.value.replace('https://www.lexinfo.net/ontology/2.0/lexinfo#', '') });
        }
        if (w.n !== undefined) {
          infoList.push({ number: w.n.value.replace('https://www.lexinfo.net/ontology/2.0/lexinfo#', '') });
        }
        if (w.g !== undefined) {
          infoList.push({ gender: w.g.value.replace('https://www.lexinfo.net/ontology/2.0/lexinfo#', '') });

        }
        if (w.t !== undefined) {
          infoList.push({ tense: w.t.value.replace('https://www.lexinfo.net/ontology/2.0/lexinfo#', '') });

        }
        if (w.vFM !== undefined) {
          infoList.push({ verbFormMood: w.vFM.value.replace('http://www.lexinfo.net/ontology/2.0/lexinfo#', '') });

        }

        if (grammaticalClass === '-verb-' && this.isIndicativePresent(w)) {
          this.wordList.push({ val: w.ofo.value, info: infoList, selected: false });
        } else if (grammaticalClass !== '-verb-') {
          this.wordList.push({ val: w.ofo.value, info: infoList, selected: false });
        }
      }
    });
    this.searchStarted = 0;
  }

  /*return true if the given verb is present of indicative */
  isIndicativePresent(verb): boolean {
    return (
      verb.t !== undefined && verb.t.value === 'https://www.lexinfo.net/ontology/2.0/lexinfo#present' &&
      verb.vFM !== undefined && verb.vFM.value === 'https://www.lexinfo.net/ontology/2.0/lexinfo#indicative'
    );
  }
}


