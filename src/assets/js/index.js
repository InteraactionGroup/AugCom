var tokens = [];
var text = "";
var languageSelect;
var sentenceInput;
var sentenceAlternative;
var textHighlights;
var inputSection;
var outputSection;
var meaningsList;
var pictoGroups;
var pictoSentence;
var loadingIndicator;
var uploadButton;
var trash;
var textUpdated = true;
var selectedMeanings = [];
var openTokens = {};
var selectedLibrary;
var dragged;
var lang;
var mobile = false;
var urlImageJS = [];
var keyImageJS = [];
var tokensJS = [];
var dataJS = "Salut";

var internationalization = {
  'fra': {
    'sentence-input.placeholder': 'Saisissez le texte ici',
    'upload-translation.innerText': 'Envoyer l\'annotation',
    'missing-placholder.innerText': 'Signaler',
    'missing-token.innerText': 'Mot non reconnu',
    'missing-meaning.innerText': 'Sens manquant',
    'missing-pictogram.innerText': 'Pictogramme manquant',
    'missing-expression.innerText': 'Expression non reconnue',
    '_missing-comment': 'Partie manquante: ',
    '_missing-thanks': 'Merci de votre aide !',
    '_network-error': 'Erreur liée au réseau'
  },
  'eng': {
    'sentence-input.placeholder': 'Enter text here',
    'upload-translation.innerText': 'Upload translation',
    'missing-placholder.innerText': 'Report',
    'missing-token.innerText': 'Unknown word',
    'missing-meaning.innerText': 'Missing meaning',
    'missing-pictogram.innerText': 'Missing pictogram',
    'missing-expression.innerText': 'Unknown expression',
    '_missing-comment': 'Missing part: ',
    '_missing-thanks': 'Thanks for your help!',
    '_network-error': 'Network error'
  }
};

// called when the user selects an option in the language menu
function changeLanguage() {
  lang = languageSelect.value;
  let texts = internationalization[lang];
  for (let i in texts) {
    if (i.startsWith('_')) continue;
    let id_and_prop = i.split('.');
    document.getElementById(id_and_prop[0])[id_and_prop[1]] = texts[i];
  }
  textUpdated = true;
}

function getTokens(tokens){
  tokensJS = tokens;
}

function getTokensForTS(){
  return tokensJS;
}

// called every 500ms
// this function sends the text field's content to the API
// for tokenization, as a first step of the translation process
function monitorInput(textInput, lang) {
  if (!textUpdated) return;
  let currentText = textInput.replace(/\n|\s{2,}/g, ' ').replace(/^\s/, '');
  sentenceInput = currentText;
  text = currentText;

  this.resetResultPicto();
  this.tokenize(currentText, lang, tokenized);
}

// called on api response with tokenization results
function tokenized(result) {
  tokens = result.tokens;
  // meaningsList.textContent = "";
  let len = selectedMeanings.length;
  selectedMeanings.length = tokens.length;
  selectedMeanings.fill(0, len);
  let lastStop = 0;
  for (let t in tokens) {
    let meaning = tokens[t];
    let before = text.slice(lastStop, meaning.start);
    let token = text.slice(meaning.start, meaning.stop);
    tokens[t].text = token;

    lastStop = meaning.stop;
    if (selectedMeanings[t] >= meaning.synsets.length) {
      selectedMeanings[t] = 0;
    }
    getTokens(tokens);
  }
  refreshPictograms();
}

// called when a meaning is selected, pictograms
// get refreshed to match the selected meanings
function onMeaningSelection(e) {
  let id = e.target.id.split('-');
  let t = parseInt(id[1]);
  let s = parseInt(id[2]);
  selectedMeanings[t] = s;
  refreshPictograms();
}

// called when the pictogram list needs to be refreshed,
// either on user input or when meanings were received.
function refreshPictograms() {
  let synsets = tokens.map((token, t) => {
    let s = selectedMeanings[t];
    return token.synsets[0];
  });
  if (synsets.length > 0) {
    this.pictograms(synsets,pictogramsReceived);
  }else{
    tokens.map((token, t) => {
      pictogramsFromName(token.text,lang);
    });
  }
}

// used by pictogramsReceived to sort pictograms by relevance,
// taking the current list of meanings into account.
function relevanceComparator(a, b) {
  return b[0] - a[0];
}

// called when the API has found relevant pictograms
// for the selected meanings. This function will organize
// pictograms in "libraries".
function pictogramsReceived(pictograms) {
  let expressions = {};
  for (let p in pictograms) {
    let pictoData = pictograms[p];
    let count = pictoData.shift();
    let matches = pictoData.length;
    let relevance = matches / count;
    let indexes = pictoData.map(synsetIndex => synsetIndex.toString());
    indexes.sort();
    let key = indexes.join('-');
    if (key in expressions) expressions[key].push([relevance, p]);
    else expressions[key] = [[relevance, p]];
  }
  if (selectedLibrary === undefined || expressions[selectedLibrary] === undefined) {
    selectedLibrary = Object.keys(expressions)[0];
  }
  for (key in expressions) {
    let pictograms = expressions[key];
    pictograms.sort(relevanceComparator);
    let urlImage = [];
    let keyImage = [];
    for (let p in pictograms) {
      let url = 'http://lig-interaactionpicto.imag.fr/api/' + pictograms[p][1];
      let picto = document.createElement('img');
      picto.src = url;
      picto.draggable = true;
      picto.dataset.key = key;
      picto.dataset.url = url;
      urlImage.push(url);
      keyImage.push(key);
    }
    saveKeyPicto(keyImage);
    saveUrlPicto(urlImage);
  }
}
function saveKeyPicto(keyImage){
  keyImageJS.push(keyImage);
}

function getKeyPicto(){
  return keyImageJS;
}

function saveUrlPicto(urlImage){
  urlImageJS.push(urlImage);
}

function getUrlPicto(){
  return urlImageJS;
}

function clearUrlImageJS(){
  urlImageJS = [];
}

function _phoneHome(path, callback, error) {
  if (error === undefined) error = callback;
  let xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.addEventListener('load', (e) => {
    let xhr = e.target;
    if (xhr.status == 200) callback(xhr.response);
    else error(undefined, xhr.response);
  });
  xhr.open('GET', 'http://lig-interaactionpicto.imag.fr/api/' + path.join('/'));
  xhr.send();
}

function _encode(text) {
  return encodeURIComponent(text);
}

// PUBLIC ENDPOINTS
function tokenize(sentence, language, callback, error) {
  let path = ['t2s', language, this._encode(sentence)];
  this._phoneHome(path, callback, error);
}

// use the function pictogramsFormName from the file : startapi.js
function pictogramsFromName(sentence, language, callback, error) {
  let path = ['t2p', language, this._encode(sentence)];
  this._phoneHome(path, callback, error);
}

function pictograms(synsets, callback, error) {
  let path = ['s2p', synsets.map(encodeURIComponent).join('+')];
  this._phoneHome(path, callback, error);
}

function resetResultPicto(callback,error){
  let path = ['reset'];
  this._phoneHome(path, callback, error);
}

function mkdirJ(data,callback,error){
  let path = ['mkdirJS', dataJS];
  this._phoneHome(path, callback, error);
}

function setDataTS(value){
  dataJS = value;
  console.log(dataJS);
}

// DIRECT DATA SEARCH
function findWordVariation(word, language, callback, error) {
  let path = ['find-word-variation', language, this._encode(word)];
  this._phoneHome(path, callback, error);
}

function findWordMeanings(word, language, callback, error) {
  let path = ['find-word-meanings', language, this._encode(word)];
  this._phoneHome(path, callback, error);
}

function findMeaningDefinition(word, language, callback, error) {
  let path = ['find-meaning-definition', language, this._encode(word)];
  this._phoneHome(path, callback, error);
}

// DIRECT DATA ACCESS
function wordsVariations(start, length, language, callback, error) {
  let path = ['words-variations', language, start, length];
  this._phoneHome(path, callback, error);
}

function wordsMeanings(start, length, language, callback, error) {
  let path = ['words-meanings', language, start, length];
  this._phoneHome(path, callback, error);
}

function meaningsDefinitions(start, length, language, callback, error) {
  let path = ['meanings-definitions', language, start, length];
  this._phoneHome(path, callback, error);
}

function stopList(language, callback, error) {
  let path = ['stop-list', language];
  this._phoneHome(path, callback, error);
}

// AUTHENTICATED ENDPOINTS
function feed(mobile, language, sentence, alt, pictograms, callback, error) {
  let data = {mobile, language, sentence, alt, pictograms};
  let path = ['feed', 'anonymous', this._encode(JSON.stringify(data))];
  this._phoneHome(path, callback, error);
}

function report(issue, language, sentence, comment, callback, error) {
  let data = {issue, language, sentence, comment};
  let path = ['issue', 'anonymous', this._encode(JSON.stringify(data))];
  this._phoneHome(path, callback, error);
}

// ADMIN ENDPOINTS
function summary(callback, error) {
  let path = ['summary'];
  this._phoneHome(path, callback, error);
}

// set
function setWordVariation(variant, canonical, language, callback, error) {
  let [key, value] = [this._encode(variant), this._encode(canonical)];
  let path = ['set-word-variation', language, key, value];
  this._phoneHome(path, callback, error);
}

function setWordMeanings(word, synsets, language, callback, error) {
  let [key, value] = [this._encode(word), this._encode(synsets.join('+'))];
  let path = ['set-word-synsets', language, key, value];
  this._phoneHome(path, callback, error);
}

function setMeaningDefinition(synset, definition, language, callback, error) {
  let [key, value] = [this._encode(synset), this._encode(definition)];
  let path = ['set-synset-definition', language, key, value];
  this._phoneHome(path, callback, error);
}

function addStopWord(word, language, callback, error) {
  let path = ['add-stop-word', language, this._encode(word)];
  this._phoneHome(path, callback, error);
}

// del
function delWordVariation(variant, language, callback, error) {
  let path = ['del-word-variation', language, this._encode(variant)];
  this._phoneHome(path, callback, error);
}

function delWordMeanings(word, language, callback, error) {
  let path = ['del-word-synsets', language, this._encode(word)];
  this._phoneHome(path, callback, error);
}

function delMeaningDefinition(synset, language, callback, error) {
  let path = ['del-synset-definition', language, this._encode(synset)];
  this._phoneHome(path, callback, error);
}

function remStopWord(word, language, callback, error) {
  let path = ['rem-stop-word', language, this._encode(word)];
  this._phoneHome(path, callback, error);
}

// SESSIONS
function currentSessionId(callback, error) {
  let path = ['current-session-id'];
  this._phoneHome(path, callback, error);
}

// contributions
function uploads(sessionId, callback, error) {
  let path = ['storage', sessionId];
  this._phoneHome(path, callback, error);
}

function issues(sessionId, callback, error) {
  let path = ['issues', sessionId];
  this._phoneHome(path, callback, error);
}

function updates(sessionId, callback, error) {
  let path = ['updates', sessionId];
  this._phoneHome(path, callback, error);
}

function revokeUpload(sessionId, timestamp, user, callback, error) {
  let path = ['revoke-storage', sessionId, timestamp, user];
  this._phoneHome(path, callback, error);
}

function revokeUpdate(sessionId, timestamp, user, callback, error) {
  let path = ['revoke-update', sessionId, timestamp, user];
  this._phoneHome(path, callback, error);
}

function revokeIssue(sessionId, timestamp, user, callback, error) {
  let path = ['revoke-issue', sessionId, timestamp, user];
  this._phoneHome(path, callback, error);
}
