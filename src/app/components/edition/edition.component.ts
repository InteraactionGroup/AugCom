import { Component, OnInit } from '@angular/core';
import {DbnaryService} from '../../services/dbnary.service';
import {BoardService} from '../../services/board.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {GeticonService} from '../../services/geticon.service';
import {MulBerryObject} from '../../libTypes';
import mullberryJson from '../../../assets/symbol-info.json';
import {DomSanitizer} from '@angular/platform-browser';
import {Ng2ImgMaxService} from 'ng2-img-max';
import {Action, Element} from '../../types';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {ParametersService} from '../../services/parameters.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-edition',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.css']
})
export class EditionComponent implements OnInit {

  // par default un element est un bouton
  radioTypeFormat = 'button';
  // son nom est vide
  name = '';
  // il na pas devenement dinteraction
  events: { InteractionID: string, ActionList: Action[] }[] = [];
  // couleur grise
  color = '#d3d3d3';
  // pas d'image
  imageURL;
  // pas de classe grammaticale
  classe = '';
  // pas de forme variante
  variantList = [];

  // on choisit une image
  choseImage = false;
  // on choisit une variante
  variantDisplayed = false;
  // on choisit les evenements
  eventDisplayed = false;

  imageList: any[];

  // interaction actuellement selectionee
  currentInterractionNumber = -1;
  currentInterraction: { InteractionID: string, ActionList: Action[] } = null;

  constructor(private router: Router, public parametersService: ParametersService, public indexedDBacess: IndexeddbaccessService, public ng2ImgMaxService: Ng2ImgMaxService, public sanitizer: DomSanitizer, public userToolBar: UsertoolbarService, public getIconService: GeticonService, public dbnaryService: DbnaryService, public boardService: BoardService) {

  }

  ngOnInit() {
    this.updatemodif();
    this.userToolBar.ElementListener.subscribe(value => {
      if (value != null) {
        this.updatemodif();
        console.log(value);
      }
    });
  }

  // selection de l'interaction i, par default 0 est click, 1 est longpress, 2 est doubleclick
  selectInteraction(i: number) {
    this.currentInterractionNumber = i;
    this.currentInterraction = this.events.find(x => x.InteractionID === this.parametersService.interaction[i - 1]);
  }

  // renvoit true si i est l'interaction courante
  isCurrentInteraction(i) {
    return this.currentInterractionNumber === i;
  }

  // fermeture de la fenetre actuelle
  close() {
    // retour a l'edition principale si on est dans le sous menu variante image ou evenement
    if (this.choseImage || this.variantDisplayed || this.eventDisplayed) {
    this.choseImage = false;
    this.variantDisplayed = false;
    this.eventDisplayed = false;
    this.currentInterractionNumber = -1;
    this.currentInterraction = null;
    // fermeture du menu edition sinon
    } else {
      this.userToolBar.add = false;
      this.userToolBar.modif = null;
      this.clear();
      this.router.navigate(['']);
    }
  }

  // on enregistre les variantes et on ferme le sous menu variante
  closeVariant() {
    this.variantList = this.dbnaryService.wordList.filter(b => b.selected);
    this.variantDisplayed = false ;
  }

  // on nettoie le menu dedition
  clear() {
    this.name = '';
    this.color = '#d3d3d3';
    this.imageURL = '';
    this.imageList = [];
    this.currentInterractionNumber = -1;
    this.currentInterraction = null;
    this.dbnaryService.wordList = [];
    this.dbnaryService.typeList = [];
  }

  // on renvoit l'url de l'icone correspondant a s
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  // on ajoute l'action a l'interaction courante si elle n'y est pas, on la retire sinon
  addToInteraction(action: string) {
    const inter = this.parametersService.interaction[this.currentInterractionNumber - 1];
    const partOfCurrentInter = this.isPartOfCurrentInteraction(action);

    if (this.currentInterraction == null && !partOfCurrentInter) {
      this.currentInterraction = { InteractionID: inter, ActionList: [ {ActionID: action, Action: action} ] };
    } else if (!partOfCurrentInter) {
      this.currentInterraction.ActionList.push({ActionID: action, Action: action});
    } else if (partOfCurrentInter) {
      this.currentInterraction.ActionList = this.currentInterraction.ActionList.filter(x => x.ActionID !== action);
    }
    console.log(this.currentInterraction.ActionList);
  }

  // renvoit true si l'action identifiee par actionId existe dans l'interaction courante
  isPartOfCurrentInteraction(actionId) {
    if (this.currentInterraction != null) {
      const res = this.currentInterraction.ActionList.find(x => x.ActionID === actionId);
      return res != null && res !== undefined;
    }
    return false;
  }

  // return the list of images of mullberry library matching with text
  searchInLib(text: string) {
    this.imageList = [];
    let tempList = [];
    (mullberryJson as unknown as MulBerryObject[]).forEach(value => {
      if (text !== null && text !== '' && value.symbol.toLowerCase().includes(text.toLocaleLowerCase())) {
        const url = value.symbol;
        tempList.push(url);
        tempList = tempList.sort((a: string, b: string) => {
            if (a.toLowerCase().startsWith(text.toLowerCase()) && b.toLowerCase().startsWith(text.toLowerCase())) {
              return a.length - b.length;
            } else if ( a.toLowerCase().startsWith(text.toLowerCase())) {
              return -1;
            } else {
              return 1;
            }

          }
        );
      }
    }, this);
    this.imageList = tempList.slice(0, 100);
  }

  // set the imageUrl for the preview of the button
  previewWithURL(t) {
    this.imageURL = t;
    this.choseImage = false;
  }
  // set the imageUrl with a mullberry image url
  previewMullberry(t) {
    this.previewWithURL('assets/libs/mulberry-symbols/EN-symbols/' + t + '.svg');
  }

  // set the imageUrl from an image file
  previewFile(files) {
    this.imageURL = 'assets/icons/load.gif';
    if (files.length === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();

    this.ng2ImgMaxService.resize([files[0]], 1000, 1000).subscribe(result => {
      reader.readAsDataURL(result);
      reader.onload = (e) => {
        this.imageURL = reader.result;
        this.choseImage = false;
      };
    }, error => {
      reader.readAsDataURL(files[0]);
      reader.onload = (e) => {
        this.previewWithURL(reader.result);

      };
    });
  }

  // sauvegarde le bouton modifié ou le nouveau bouton et ferme la fenetre dedition
  save() {
    if (this.userToolBar.add) {
      this.createNewButton();
    } else if (this.userToolBar.modif !== null) {
      this.modifyButton();
    }
    this.indexedDBacess.update();
    this.close();
  }

  // modifie le bouton a partir des infos de la fenetre d'edition
  modifyButton() {
    // tslint:disable-next-line:no-shadowed-variable
    const element: Element = this.userToolBar.modif;
    element.ElementType = this.radioTypeFormat;
    const defaultform = element.ElementForms.find(form => {
      const newForm = form.LexicInfos.find(info => {
        return (info.default != null && info.default);
      });
      return (newForm != null);
    });
    if (defaultform != null) {
    defaultform.DisplayedText = this.name;
    defaultform.VoiceText = this.name;
    } else {
      element.ElementForms.push({
        DisplayedText: this.name,
        VoiceText: this.name,
        LexicInfos: [{default: true}]
      });
    }
    this.variantList.forEach( variant => {
      element.ElementForms.push({
        DisplayedText: variant.val,
        VoiceText: variant.val,
        LexicInfos: variant.info
      });
    });
    element.Color = this.color;
    element.ImageID = this.boardService.currentFolder + this.name;

    this.boardService.board.ImageList = this.boardService.board.ImageList.filter( img => img.ImageID !== this.boardService.currentFolder + this.name);

    this.boardService.board.ImageList.push(
      {
        ImageID: this.boardService.currentFolder + this.name,
        ImageLabel: this.name,
        ImagePath: this.imageURL
      });
  }

  // cree un nouveau bouton a partir des infos de la fenetre d'edition
  createNewButton() {
    const elementForms = [];
    elementForms.push({DisplayedText: this.name,
      VoiceText: this.name,
      LexicInfos: [{default: true}] });
    this.variantList.forEach( variant => {
      elementForms.push({
        DisplayedText: variant.val,
        VoiceText: variant.val,
        LexicInfos: variant.info
      });
    });

    const interList = [{
      InteractionID: 'click', ActionList: [{
        ActionID: 'display', Action: 'display'}, {
        ActionID: 'say', Action: 'say'}]}, {
      InteractionID: 'longPress', ActionList: [{
        ActionID: 'otherforms', Action: 'otherforms'}]}];



    this.boardService.board.ElementList.push(
      {
        ElementID: this.name,
        ElementFolder: this.boardService.currentFolder,
        ElementType: this.radioTypeFormat,
        ElementPartOfSpeech: this.classe,
        ElementForms: elementForms,
        ImageID: this.boardService.currentFolder + this.name,
        InteractionsList: interList,
        Color: this.color
      });

    this.boardService.board.ImageList.push(
      {
        ImageID: this.boardService.currentFolder + this.name,
        ImageLabel: this.name,
        ImagePath: this.imageURL
      });
  }

  // charge les informations du bouton a modifier
  updatemodif() {
    if (this.userToolBar.modif !== null) {
    const elementToModif: Element = this.userToolBar.modif;
    this.name = elementToModif.ElementForms[0].DisplayedText;
    this.events = elementToModif.InteractionsList;
    this.color = elementToModif.Color;
    this.radioTypeFormat = elementToModif.ElementType;
    const imageToModif = this.boardService.board.ImageList.find(x => x.ImageID === elementToModif.ImageID);
    this.imageURL = imageToModif.ImagePath;
  }
    return false;
  }

  // actualise la liste la liste des classes grammaticales possible pour le mot word
  getWordList(word) {
    this.variantDisplayed = true;
    this.dbnaryService.typeList = [];
    this.dbnaryService.startsearch(1);
    this.dbnaryService.getWordPartOfSpeech(word, this.dbnaryService.typeList);
  }

  /**
   * Return the current interaction event list (events) and display the html event panel by setting eventDisplayed to true
   *
   * @Return the current list of interaction events
   */
  getEvents() {
    this.eventDisplayed = true;
    return this.events;
  }

  /**
   * Actualize the variants forms list (wordList) of the word 'word' with the grammatical class b
   * (ex: displayVariant('-nom-','chien') will actualise the wordList with ['chien','chiens','chienne','chiennes'])
   * @Params string b, a grammatical class (ex: -verb-, -nom-...). string word, a word
   */
  displayVariant(b: string, word: string) {
    this.dbnaryService.wordList = [];
    this.dbnaryService.startsearch(2);
    this.dbnaryService.getOtherFormsOfThisPartOfSpeechWord(word, b, this.dbnaryService.wordList);
  }
}

