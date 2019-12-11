import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ResultJson1, Traduction} from '../sparqlJsonResults';

@Injectable({
  providedIn: 'root'
})
export class DbnaryService {

  private sparkqlData = null;
  public wordList = [];
  public typeList = [];

  public newList = [];

  searchStarted = 0;

  constructor(private http: HttpClient) {
  }

  startsearch(i: number) {
    this.searchStarted = i;
  }

  async getTrad(word: string, langFrom: string, langTo) {
    const query = [
      'select distinct ?tradword where {{\n' +
      '?mot ontolex:canonicalForm/ontolex:writtenRep "' + word.toLowerCase() + '"@' + langFrom + '.\n' +
      '?trad dbnary:isTranslationOf ?mot.\n' +
      '?trad dbnary:targetLanguage lexvo:' + langTo + '.\n' +
      '?trad dbnary:writtenForm ?tradword\n' +
      '}UNION {\n' +
      '?mot ontolex:canonicalForm/ontolex:writtenRep "' + word.toUpperCase() + '"@' + langFrom + '.\n' +
      '?trad dbnary:isTranslationOf ?mot.\n' +
      '?trad dbnary:targetLanguage lexvo:' + langTo + '.\n' +
      '?trad dbnary:writtenForm ?tradword\n' +
      '}\n' +
      '} LIMIT 1' ].join(' ');
    return this.getTradFromSparkql(query);
  }

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

  async getTradFromSparkql(query) {
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
      params,
      withCreditals: false
    };
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    return this.http.get(proxy + 'http://kaiko.getalp.org/sparql' + '?query=' + encodeURIComponent(query), httpOptions);
  }

  sparkql(query) {

    this.typeList = [];

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
      params,
      withCreditals: false
    };

    const proxy = 'https://cors-anywhere.herokuapp.com/';
    this.http
      .get(proxy + 'http://kaiko.getalp.org/sparql' + '?query=' + encodeURIComponent(query) , httpOptions)
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
          console.log(error.error.text, error); }
      );
  }

  getWords(classe) {
    this.searchStarted = 1;
    this.sparkqlData.results.bindings.forEach(w => {
          if (w.po !== undefined && w.po.value === classe) {
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

            if (classe === '-verb-' && this.isIndicativePresent(w)) {
              this.wordList.push({val: w.ofo.value, info: infoList, selected: false});
            } else if (classe !== '-verb-') {
              this.wordList.push({val: w.ofo.value, info: infoList, selected: false});
            }
        }
      });
    this.searchStarted = 0;
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


