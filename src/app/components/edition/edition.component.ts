import {Component, OnInit} from '@angular/core';
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
   * current element color (#d3d3d3 = grey by default)
   */
  curentColor = '#d3d3d3';

  curentBorderColor = 'black';

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

  selectMenu(name: string){
    this.editionService.currentEditPage=name;
  }

  /**
   * close the current opened panel if there is one (image, variant or event panel) and go back to main edition panel
   * otherwise close the edition menu
   * reset the information to its initial value
   */
  close() {
    // go back to main edition panel and close image, variant or event subpanel
    if (this.editionService.currentEditPage !== "") {
      this.editionService.currentEditPage = ""
      // close the edition panel
    } else {
      this.editionService.add = false;
      this.clear();
      this.router.navigate(['']);
    }
  }

  /**
   * Clear the informtation of the edition panel, reset all the information to their initial value
   */
  clear() {
    this.editionService.name = '';
    this.curentColor = '#d3d3d3';
    this.editionService.imageURL = '';
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

      if (this.curentColor !== '#d3d3d3') {
        elt.Color = this.curentColor;
      }
      if (this.curentBorderColor !== '#d3d3d3') {
        elt.BorderColor = this.curentBorderColor;
      }

      if (this.editionService.name !== this.editionService.DEFAULT_MULTPLE_NAME) { // todo there is probably a cleaner way to do it
        elt.ElementForms.forEach(form => {
          form.LexicInfos.forEach(info => {
            if (info.default) {
              info.default = false;
            }
          });
        });
        elt.ElementForms.push(
          {
            DisplayedText: this.editionService.name,
            VoiceText: this.editionService.name,
            LexicInfos: [{default: true}]
          }
        );
      }


      if (this.editionService.imageURL !== 'assets/icons/multiple-images.svg') {
        const img = this.boardService.board.ImageList.find(image => image.ImageID === elt.ImageID);
        if (img != null) {
          img.ImagePath = this.editionService.imageURL;
        }
      }
    });
  }

  /**
   * Update the current modified element and load its modifications into the board,
   * given the information of this class, updated by the edition html panel
   */
  modifyButton() {
    if (this.editionService.selectedElements[0] != null && this.editionService.selectedElements[0] !== undefined) {
      const element: Element = this.editionService.selectedElements[0];
      element.ElementType = this.editionService.radioTypeFormat;

      if (this.editionService.variantList.length > 0) {
        element.ElementForms = [];
        let defaultExist = false;
        this.editionService.variantList.forEach(variant => {
          const lexicInfo = variant.info;
          if (variant.val === this.editionService.name) {
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
            DisplayedText: this.editionService.name,
            VoiceText: this.editionService.name,
            LexicInfos: [{default: true}]
          });
        }
      } else {
        let defaultExist = false;
        element.ElementForms.forEach(elementForm => {
          const lexicInfo = elementForm.LexicInfos;
          if (elementForm.DisplayedText === this.editionService.name) {
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
            DisplayedText: this.editionService.name,
            VoiceText: this.editionService.name,
            LexicInfos: [{default: true}]
          });
        }
      }

      console.log(this.editionService.interractionList);
      element.InteractionsList = Object.assign([], this.editionService.interractionList);
      console.log(element.InteractionsList);

      element.Color = this.curentColor;
      element.BorderColor = this.curentBorderColor;
      element.ImageID = this.boardService.currentFolder + element.ElementID;

      this.boardService.board.ImageList = this.boardService.board.ImageList.filter(
        img => img.ImageID !== this.boardService.currentFolder + element.ElementID);

      this.boardService.board.ImageList.push(
        {
          ImageID: this.boardService.currentFolder + element.ElementID,
          ImageLabel: this.editionService.name,
          ImagePath: this.editionService.imageURL
        });
    }
  }

  /**
   * Create a new button and add it to the board, given the information of this class, updated by the edition html panel
   */
  createNewButton() {
    const elementForms = [];
    let defaultExist = false;
    this.editionService.variantList.forEach(variant => {
      const lexicInfo = variant.info;
      if (variant.val === this.editionService.name) {
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
      elementForms.push({
        DisplayedText: this.editionService.name,
        VoiceText: this.editionService.name,
        LexicInfos: [{default: true}]
      });
    }

    const interList = [{
      InteractionID: 'click', ActionList: [{
        ActionID: 'display', Action: 'display'
      }, {
        ActionID: 'say', Action: 'say'
      }]
    }, {
      InteractionID: 'longPress', ActionList: [{
        ActionID: 'otherforms', Action: 'otherforms'
      }]
    }];


    let i = 0;
    let tempId = this.editionService.name;
    while (this.boardService.board.ElementList.findIndex(elt => elt.ElementID === tempId) !== -1) {
      tempId = this.editionService.name + i;
      i = i + 1;
    }

    this.boardService.board.ElementList.push(
      {
        ElementID: tempId,
        ElementFolder: this.boardService.currentFolder,
        ElementType: this.editionService.radioTypeFormat,
        ElementPartOfSpeech: this.editionService.classe,
        ElementForms: elementForms,
        ImageID: this.boardService.currentFolder + tempId,
        InteractionsList: interList,
        Color: this.curentColor,
        BorderColor: this.curentBorderColor,
        Visible: true
      });

    this.boardService.board.ImageList.push(
      {
        ImageID: this.boardService.currentFolder + tempId,
        ImageLabel: this.editionService.name,
        ImagePath: this.editionService.imageURL
      });
  }


  getName(element: Element) {
    const index = element.ElementForms.findIndex(form => form.LexicInfos.findIndex(info => info.default) !== -1);
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
    if (this.editionService.selectedElements.length === 1) {
      const elementToModif: Element = this.editionService.selectedElements[0];
      this.editionService.name = this.getName(elementToModif);
      this.curentColor = elementToModif.Color;
      this.curentBorderColor = elementToModif.BorderColor;
      this.editionService.radioTypeFormat = elementToModif.ElementType;
      const imageToModif = this.boardService.board.ImageList.find(x => x.ImageID === elementToModif.ImageID);
      if (imageToModif != null && imageToModif !== undefined) {
        this.editionService.imageURL = imageToModif.ImagePath;
      } else {
        this.editionService.imageURL = '';
      }
      const interactionListToModify = elementToModif.InteractionsList;
      if (interactionListToModify != null) {

        this.editionService.interractionList = [];
        interactionListToModify.map(val =>
          this.editionService.interractionList.push({
            InteractionID: val.InteractionID,
            ActionList: Object.assign([], val.ActionList)
          }));
      } else {
        this.editionService.interractionList = [];
      }
    } else if (this.editionService.selectedElements.length > 1) { // todo see what we want to modify here
      this.editionService.name = '$different$';
      this.curentColor = '#d3d3d3';
      this.editionService.radioTypeFormat = '';
      this.editionService.imageURL = 'assets/icons/multiple-images.svg';
      console.log(this.editionService.imageURL);
      this.editionService.interractionList = [];
    }
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

  selectThePalette(name) {
    if (this.selectedPalette === name) {
      this.selectedPalette = null;
    } else {
      this.selectedPalette = name;
    }
  }
}

