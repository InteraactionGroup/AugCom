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
import {Router} from '@angular/router';
import {PaletteService} from '../../services/palette.service';
import {EditionService} from '../../services/edition.service';

@Component({
  selector: 'app-edition',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.css']
})
export class EditionComponent implements OnInit {

  constructor(public editionService: EditionService, public  paletteService: PaletteService,
              private router: Router, public parametersService: ParametersService,
              public indexedDBacess: IndexeddbaccessService, public ng2ImgMaxService: Ng2ImgMaxService,
              public sanitizer: DomSanitizer, public userToolBar: UsertoolbarService, public getIconService: GeticonService,
              public dbnaryService: DbnaryService, public boardService: BoardService) {

  }

  selectedPalette = this.paletteService.defaultPalette;

  colorPicked = null;

  /**
   * the type of the current element (button by default)
   */
  radioTypeFormat = 'button';

  /**
   * the name of the current element (empty by default)
   *
   */
  name = '';

  /**
   * current element color (#d3d3d3 = grey by default)
   */
  curentColor = '#d3d3d3';

  curentBorderColor = 'rgb(0,0,0,0)';

  /**
   * current imageUrl of the element (empty by default), can be a string or a safe url
   */
  imageURL: any = '';

  /**
   * current grammatical class type of the element (empty by default)
   */
  classe = '';

  /**
   * current list of variant forms for the element (empty by default)
   */
  variantList = [];

  /**
   * if set to true we are displaying the imagePanel Html sections
   */
  choseImage = false;

  /**
   * if set to true we are displaying the variantPanel Html sections
   */
  variantDisplayed = false;

  /**
   * if set to true we are displaying the eventPanel Html sections
   */
  eventDisplayed = false;

  /**
   * the current list of images related to the chose image library search section
   * (the image list resulting in the research in the mullbery library)
   */
  imageList: any[];

  /**
   * the current Interaction index number
   * (by default:
   *      -1 = no interaction selected
   *      0 = click selected
   *      1 = longPress selected
   *      2 = doubleClick selected
   * )
   */
  currentInterractionNumber = -1;

  /**
   * the current Interraction element selected (empty by default)
   */
  interractionList: { InteractionID: string, ActionList: Action[] }[] = [];
  /**
   * update the informations with the elementToModify if it exist and set the elementListener for listening next element modifications
   */
  ngOnInit() {
    this.updatemodif();
    this.editionService.ElementListener.subscribe(value => {
      if (value != null) {
        this.updatemodif();
      }
    });
  }

  /**
   * update the currentInterractionNumber and the currentInteraction with the interraction identified by i.
   * by default i=0 for click, i=1 for longpress and i=2 for doubleClick
   * return false otherwise
   * @param i, a number
   */
  selectInteraction(i: number) {
    this.currentInterractionNumber = i;
  }

  /**
   * return true if the given number i is the same as the current interaction number 'currentInterractionNumber'
   * return false otherwise
   * @param i, a number
   * @return true if i is the currentInterractionNumber, false otherwise
   */
  isCurrentInteraction(i) {
    return this.currentInterractionNumber === i;
  }

  /**
   * close the current opened panel if there is one (image, variant or event panel) and go back to main edition panel
   * otherwise close the edition menu
   * reset the information to its initial value
   */
  close() {
    // go back to main edition panel and close image, variant or event subpanel
    if (this.choseImage || this.variantDisplayed || this.eventDisplayed) {
    this.choseImage = false;
    this.variantDisplayed = false;
    this.eventDisplayed = false;
    this.currentInterractionNumber = -1;
    // close the edition panel
    } else {
      this.editionService.add = false;
      this.clear();
      this.router.navigate(['']);
    }
  }

  /**
   * add the selected variant forms in wordList to the current variantList
   * and close the variant panel by setting variantDisplayed to false
   */
  closeVariant() {
    this.variantList = this.dbnaryService.wordList.filter(b => b.selected);
    this.variantDisplayed = false ;
  }

  /**
   * Clear the informtation of the edition panel, reset all the information to their initial value
   */
  clear() {
    this.name = '';
    this.curentColor = '#d3d3d3';
    this.imageURL = '';
    this.imageList = [];
    this.currentInterractionNumber = -1;
    this.interractionList = [];
    this.dbnaryService.wordList = [];
    this.dbnaryService.typeList = [];
    this.editionService.selectedElements = [];
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  /**
   * Add the action identified by the actionId to the current interaction if it doesn't contain it already,
   * otherwise it delete it from the current interaction
   * @param actionId, the string identifying an action
   */
  addOrRemoveToInteraction(actionId: string) {
    const inter = this.parametersService.interaction[this.currentInterractionNumber - 1];
    const partOfCurrentInter = this.isPartOfCurrentInteraction(actionId);

    const currentInterraction = this.interractionList.findIndex( interaction => interaction.InteractionID === inter );

    if ( currentInterraction === -1 && !partOfCurrentInter) {
      this.interractionList.push({ InteractionID: inter, ActionList: [ {ActionID: actionId, Action: actionId} ] });
    } else if (!partOfCurrentInter) {
      this.interractionList[currentInterraction].ActionList.push({ActionID: actionId, Action: actionId});
    } else if (partOfCurrentInter) {
      // tslint:disable-next-line:max-line-length
      this.interractionList[currentInterraction].ActionList = this.interractionList[currentInterraction].ActionList.filter(x => x.ActionID !== actionId);
    }

  }

  /**
   * Return true if the action identified by actionId exists in the current interaction
   * return false otherwise
   * @param actionId, the string identifying an action
   * @return true if the action identified by actionId exists in the current interaction, false otherwise
   */
  isPartOfCurrentInteraction(actionId) {
    const inter = this.parametersService.interaction[this.currentInterractionNumber - 1];
    const currentInterraction = this.interractionList.find( interaction => interaction.InteractionID === inter );
    if (currentInterraction != null) {
      const res = currentInterraction.ActionList.find(x => x.ActionID === actionId);
      return res != null && res !== undefined;
    }
    return false;
  }

  /**
   * Return the list of 100 first mullberry library images, sorted by length name, matching with string 'text'
   *
   * @param text, the string researched text
   * @return list of 100 mulberry library images
   */
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

  /**
   * Set the current preview imageUrl with the image string Url 't' and close the chooseImage panel
   *
   * @param t, the new imageUrl
   */
  previewWithURL(t) {
    this.imageURL = t;
    this.choseImage = false;
  }

  /**
   * Set the current preview imageUrl with a mulberry library image Url according to the given string 't' and close the chooseImage panel
   *
   * @param t, the string short name of the image of the mulberry library image
   */
  previewMullberry(t: string) {
    this.previewWithURL('assets/libs/mulberry-symbols/EN-symbols/' + t + '.svg');
  }

  /**
   * Set the current preview imageUrl according to the given file 'file' and close the chooseImage panel
   * if the initial image is bigger than 1000*1000 the the image is reduced
   *
   * @param file, a file element
   */
  previewFile(file) {
    this.imageURL = 'assets/icons/load.gif';
    if (file.length === 0) {
      return;
    }
    const mimeType = file[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();

    this.ng2ImgMaxService.resize([file[0]], 1000, 1000).subscribe(result => {
      reader.readAsDataURL(result);
      reader.onload = () => {
        this.imageURL = reader.result;
        this.choseImage = false;
      };
    }, () => {
      reader.readAsDataURL(file[0]);
      reader.onload = () => {
        this.previewWithURL(reader.result);

      };
    });
  }

  /**
   * Save the modified or new element update the indexedDB database with it and close the edition panel
   *
   */
  save() {
    if (this.editionService.add) {
      this.createNewButton();
    } else if (this.editionService.selectedElements.length === 1) {
      this.modifyButton();
    } else if (this.editionService.selectedElements.length > 1) {
      this.modifyAllButtons();
    }
    this.indexedDBacess.update();
    this.close();
  }

  modifyAllButtons() {
    this.editionService.selectedElements.forEach(elt => {

      if (this.curentColor !== '#d3d3d3' ) {
        elt.Color = this.curentColor;
      }
      if (this.curentBorderColor !== '#d3d3d3' ) {
        elt.BorderColor = this.curentBorderColor;
      }

      if (this.name !== this.editionService.DEFAULT_MULTPLE_NAME) { // todo there is probably a cleaner way to do it
        elt.ElementForms.forEach( form => {
          form.LexicInfos.forEach(info => { if (info.default) {info.default = false; }});
        });
        elt.ElementForms.push(
           {
             DisplayedText: this.name,
            VoiceText: this.name,
            LexicInfos: [{default: true}]
           }
        );
      }


      if (this.imageURL !== 'assets/icons/multiple-images.svg' ) {
       const img = this.boardService.board.ImageList.find(image => image.ImageID === elt.ImageID);
       if (img != null) {
         img.ImagePath = this.imageURL;
       }
      }
    });
  }

  /**
   * Update the current modified element and load its modifications into the board,
   * given the information of this class, updated by the edition html panel
   */
  modifyButton() {
    if (this.editionService.selectedElements[0] != null && this.editionService.selectedElements[0] !== undefined ) {
    const element: Element = this.editionService.selectedElements[0];
    element.ElementType = this.radioTypeFormat;

    if (this.variantList.length > 0) {
      element.ElementForms = [];
      let defaultExist = false;
      this.variantList.forEach(variant => {
        const lexicInfo = variant.info;
        if (variant.val === this.name) {
          lexicInfo.push({default: true});
          defaultExist = true;
        }
        element.ElementForms.push({
          DisplayedText: variant.val,
          VoiceText: variant.val,
          LexicInfos: lexicInfo
        });
      });

      if (!defaultExist) {
        element.ElementForms.push({
          DisplayedText: this.name,
          VoiceText: this.name,
          LexicInfos: [{default: true}]
        });
      }
    } else {
      let defaultExist = false;
      element.ElementForms.forEach(elementForm => {
        const lexicInfo = elementForm.LexicInfos;
        if (elementForm.DisplayedText === this.name) {
          const defaultinfo = lexicInfo.find(info => info.default !== undefined);
          if (defaultinfo != null && defaultinfo !== undefined && !defaultinfo.default) {
            defaultinfo.default = true;
          } else if (defaultinfo == null || defaultinfo === undefined) {
            lexicInfo.push({default: true});
          }
          defaultExist = true;
        } else {
          const defaultinfo = lexicInfo.find(info => info.default !== undefined);
          if (defaultinfo !== undefined) {
            defaultinfo.default = false;
          }
        }
      });
      if (!defaultExist) {
        element.ElementForms.push({
          DisplayedText: this.name,
          VoiceText: this.name,
          LexicInfos: [{default: true}]
        });
      }
    }

    console.log(this.interractionList);
    element.InteractionsList = Object.assign([], this.interractionList);
    console.log(element.InteractionsList);

    element.Color = this.curentColor;
    element.BorderColor = this.curentBorderColor;
    element.ImageID = this.boardService.currentFolder + element.ElementID;

    this.boardService.board.ImageList = this.boardService.board.ImageList.filter(
      img => img.ImageID !== this.boardService.currentFolder + element.ElementID);

    this.boardService.board.ImageList.push(
      {
        ImageID: this.boardService.currentFolder + element.ElementID,
        ImageLabel: this.name,
        ImagePath: this.imageURL
      });
  }
  }

  /**
   * Create a new button and add it to the board, given the information of this class, updated by the edition html panel
   */
  createNewButton() {
    const elementForms = [];
    let defaultExist = false;
    this.variantList.forEach( variant => {
      const lexicInfo = variant.info;
      if (variant.val === this.name) {
        lexicInfo.push({default: true});
        defaultExist = true;
      }
      elementForms.push({
        DisplayedText: variant.val,
        VoiceText: variant.val,
        LexicInfos: lexicInfo
      });
    });

    if (!defaultExist) {
      elementForms.push({DisplayedText: this.name,
        VoiceText: this.name,
        LexicInfos: [{default: true}] });
    }

    const interList = [{
      InteractionID: 'click', ActionList: [{
        ActionID: 'display', Action: 'display'}, {
        ActionID: 'say', Action: 'say'}]}, {
      InteractionID: 'longPress', ActionList: [{
        ActionID: 'otherforms', Action: 'otherforms'}]}];


    let i = 0;
    let tempId = this.name;
    while (this.boardService.board.ElementList.findIndex(elt => elt.ElementID === tempId) !== -1) {
      tempId = this.name + i;
      i = i + 1;
    }

    this.boardService.board.ElementList.push(
      {
        ElementID: tempId,
        ElementFolder: this.boardService.currentFolder,
        ElementType: this.radioTypeFormat,
        ElementPartOfSpeech: this.classe,
        ElementForms: elementForms,
        ImageID: this.boardService.currentFolder + tempId,
        InteractionsList: interList,
        Color: this.curentColor,
        BorderColor: this.curentBorderColor
      });

    this.boardService.board.ImageList.push(
      {
        ImageID: this.boardService.currentFolder + tempId,
        ImageLabel: this.name,
        ImagePath: this.imageURL
      });
  }


  getName(element: Element) {
    const index = element.ElementForms.findIndex(form =>  form.LexicInfos.findIndex(info => info.default) !== -1);
    if (index !== -1) {
      return element.ElementForms[index].DisplayedText;
    }
    return element.ElementForms[0].DisplayedText;
  }

  /**
   * Load the information of the element we have to modify, given by this.userToolBar.modif into the current informations of the class:
   * 'name' is the name of current element to modify, 'events' is the interraction event list, 'color' is its color
   * 'radioTypeFormat' is its current type format (button or folder) and imageUrl is its current imageUrl
   */
  updatemodif() {
    if (this.editionService.selectedElements.length === 1 ) {
      const elementToModif: Element = this.editionService.selectedElements[0];
      this.name = this.getName(elementToModif);
      this.curentColor = elementToModif.Color;
      this.curentBorderColor = elementToModif.BorderColor;
      this.radioTypeFormat = elementToModif.ElementType;
      const imageToModif = this.boardService.board.ImageList.find(x => x.ImageID === elementToModif.ImageID);
      if (imageToModif != null && imageToModif !== undefined) {
          this.imageURL = imageToModif.ImagePath;
      } else {
        this.imageURL = '';
      }
      const interactionListToModify = elementToModif.InteractionsList;
      if (interactionListToModify != null) {

        this.interractionList = [] ;
        interactionListToModify.map(val =>
          this.interractionList.push({InteractionID: val.InteractionID, ActionList: Object.assign([], val.ActionList) } ));
      } else {
        this.interractionList = [];
      }
    } else if (this.editionService.selectedElements.length > 1 ) { // todo see what we want to modify here
      this.name = '$different$';
      this.curentColor = '#d3d3d3';
      this.radioTypeFormat = '';
      this.imageURL = 'assets/icons/multiple-images.svg';
      console.log(this.imageURL);
      this.interractionList = [];
    }
  }

  /**
   * Actualize the grammatical type list (typeList)  of the word 'word'
   * (ex: if word = 'bleu' typeList will be ['-nom-','-adj-'] because bleu can be a noun or an adjective
   * @param word, a string word
   */
  getWordList(word) {
    this.variantDisplayed = true;
    this.dbnaryService.typeList = [];
    this.dbnaryService.startsearch(1);
    this.dbnaryService.getTypes(word);
  }

  /**
   * Return the current interaction event list (events) and display the html event panel by setting eventDisplayed to true
   *
   * @return the current list of interaction events
   */
  getEvents() {
    this.eventDisplayed = true;
    return this.interractionList;
  }

  /**
   * Actualize the variants forms list (wordList) of the word 'word' with the grammatical type b
   * (ex: displayVariant('-nom-','chien') will actualise the wordList with ['chien','chiens','chienne','chiennes'])
   * @param classe, a grammatical type (ex: -verb-, -nom-...).
   * @param word, a string word
   */
  displayVariant(classe: string, word: string) {
    this.dbnaryService.wordList = [];
    this.dbnaryService.startsearch(2);
    this.dbnaryService.getWords(classe);
  }

  pickAColor(s: string) {
    this.colorPicked = s;
  }

  selectColor(color) {
    if (this.colorPicked === 'inside') {
      this.curentColor = color;
    } else if (this.colorPicked === 'border') {
      this.curentBorderColor = color;
    }
  }

  selectThePalette( name  ) {
    if (this.selectedPalette === name) {
      this.selectedPalette = null;
    } else {
      this.selectedPalette = name;
    }
  }
}

