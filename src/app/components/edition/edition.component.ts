import {Component, OnInit} from '@angular/core';
import {DbnaryService} from '../../services/dbnary.service';
import {BoardService} from '../../services/board.service';
import {GeticonService} from '../../services/geticon.service';
import {DomSanitizer} from '@angular/platform-browser';
import {GridElement, ElementForm, Interaction, Page} from '../../types';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {Router} from '@angular/router';
import {PaletteService} from '../../services/palette.service';
import {EditionService} from '../../services/edition.service';
import {Ng2ImgMaxService} from "ng2-img-max";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-edition',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.css'],
  providers: [Ng2ImgMaxService, HttpClient]
})
export class EditionComponent implements OnInit {

  constructor(public editionService: EditionService, public  paletteService: PaletteService,
              private router: Router,
              public indexedDBacess: IndexeddbaccessService,
              public sanitizer: DomSanitizer, public getIconService: GeticonService,
              public dbnaryService: DbnaryService, public boardService: BoardService) {

  }


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

  /*select given edit page menu item*/
  selectMenu(name: string) {
    this.editionService.currentEditPage = name;
  }

  /**
   * Clear the informtation of the edition panel, reset all the information to their initial value
   */
  clear() {
    this.editionService.name = '';
    this.editionService.curentColor = '#d3d3d3';
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
    this.indexedDBacess.update();
    if (this.editionService.currentEditPage !== "") {
      this.editionService.currentEditPage = ""
    } else {
      if (this.editionService.add) {
        this.createNewButton();
      } else if (this.editionService.selectedElements.length === 1) {
        this.modifyButton();
      } else if (this.editionService.selectedElements.length > 1) {
        this.modifyAllButtons();
      }
      this.editionService.add = false;
      this.clear();
      this.router.navigate(['']);
    }
  }

  /*open modification for all selected items of the grid*/
  modifyAllButtons() {
    this.editionService.selectedElements.forEach(elt => {

      if (this.editionService.curentColor !== '#d3d3d3') {
        elt.Color = this.editionService.curentColor;
      }
      if (this.editionService.curentBorderColor !== '#d3d3d3') {
        elt.BorderColor = this.editionService.curentBorderColor;
      }

      if (this.editionService.name !== this.editionService.DEFAULT_MULTPLE_NAME) { // todo there is probably a cleaner way to do it
        elt.ElementFormsList.forEach(form => {
          form.LexicInfos.forEach(info => {
            if (info.default) {
              info.default = false;
            }
          });
        });
        elt.ElementFormsList.push(
          {
            DisplayedText: this.editionService.name,
            VoiceText: this.editionService.name,
            LexicInfos: [{default: true}],
            ImageID: elt.ElementFormsList[0].ImageID
          }
        );
      }


      if (this.editionService.imageURL !== 'assets/icons/multiple-images.svg') {
        const img = this.boardService.board.ImageList.find(image => image.ID === elt.ElementFormsList[0].ImageID);
        if (img != null) {
          img.Path = this.editionService.imageURL;
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
      const element: GridElement = this.editionService.selectedElements[0];
      element.Type = this.editionService.radioTypeFormat;

      if (this.editionService.variantList.length > 0) {
        element.ElementFormsList = [];
        let defaultExist = false;
        this.editionService.variantList.forEach(variant => {
          const lexicInfo = variant.info;
          if (variant.val === this.editionService.name) {
            lexicInfo.push({default: true});
            defaultExist = true;
          }
          element.ElementFormsList.push({
            DisplayedText: variant.val,
            VoiceText: variant.val,
            LexicInfos: lexicInfo,
            ImageID: element.ID

          });
        });

        if (!defaultExist) {
          element.ElementFormsList.push({
            DisplayedText: this.editionService.name,
            VoiceText: this.editionService.name,
            LexicInfos: [{default: true}],
            ImageID: element.ID
          });
        }
      } else {
        let defaultExist = false;
        element.ElementFormsList.forEach(elementForm => {
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
          element.ElementFormsList.push({
            DisplayedText: this.editionService.name,
            VoiceText: this.editionService.name,
            LexicInfos: [{default: true}],
            ImageID: element.ID
          });
        }
      }

      console.log(this.editionService.interractionList);
      element.InteractionsList = Object.assign([], this.editionService.interractionList);
      console.log(element.InteractionsList);

      element.Color = this.editionService.curentColor;
      element.BorderColor = this.editionService.curentBorderColor;


      this.boardService.board.ImageList = this.boardService.board.ImageList.filter(
        img => img.ID !== element.ID);

      this.boardService.board.ImageList.push(
        {
          ID: element.ID,
          OriginalName: this.editionService.name,
          Path: this.editionService.imageURL
        });
    }
  }

  /**
   * Create a new button and add it to the board, given the information of this class, updated by the edition html panel
   */
  createNewButton() {
    const elementForms: ElementForm[] = [];
    let defaultExist = false;

    let i = 0;
    let tempId = this.editionService.name;
    while (this.boardService.board.ElementList.findIndex(elt => elt.ID === tempId) !== -1) {
      tempId = this.editionService.name + i;
      i = i + 1;
    }

    this.editionService.variantList.forEach(variant => {
      const lexicInfo = variant.info;
      if (variant.val === this.editionService.name) {
        lexicInfo.push({default: true});
        defaultExist = true;
      }
      elementForms.push({
        DisplayedText: variant.val,
        VoiceText: variant.val,
        LexicInfos: lexicInfo,
        ImageID: tempId,
      });
    });

    if (!defaultExist) {
      elementForms.push({
        DisplayedText: this.editionService.name,
        VoiceText: this.editionService.name,
        LexicInfos: [{default: true}],
        ImageID: tempId,
      });
    }

    const interList: Interaction[] = [
      {ID: 'click',
      ActionList: [
                  {ID: 'display', Action: 'display'},
                  {ID: 'say', Action: 'say'}
      ]
      },
      {ID: 'longPress',
      ActionList: [
                  {ID: 'otherforms', Action: 'otherforms'}
      ]
      }
    ];

    this.boardService.board.ElementList.push(
      {
        ID: tempId,
        Type: this.editionService.radioTypeFormat,
        PartOfSpeech: this.editionService.classe,
        ElementFormsList: elementForms,
        InteractionsList: interList,
        Color: this.editionService.curentColor,
        BorderColor: this.editionService.curentBorderColor,
        VisibilityLevel: 0
      });

    this.boardService.board.ImageList.push(
      {
        ID: tempId,
        OriginalName: this.editionService.name,
        Path: this.editionService.imageURL
      });

    let currentPage = this.boardService.board.PageList.find(page =>{ return page.ID === this.boardService.getCurrentFolder()});
    if(currentPage===null || currentPage===undefined){
      currentPage = {ID: this.boardService.getCurrentFolder(), ElementIDsList: []};
      this.boardService.board.PageList.push(currentPage);
    }
    currentPage.ElementIDsList.push(tempId);
  }

  /* get the default name of an element */
  getName(element: GridElement) {
    const index = element.ElementFormsList.findIndex(form => form.LexicInfos.findIndex(info => info.default) !== -1);
    if (index !== -1) {
      return element.ElementFormsList[index].DisplayedText;
    }
    return element.ElementFormsList[0].DisplayedText;
  }

  /**
   * Load the information of the element we have to modify, given by this.userToolBar.modif into the current informations of the class:
   * 'name' is the name of current element to modify, 'events' is the interraction event list, 'color' is its color
   * 'radioTypeFormat' is its current type format (button or folder) and imageUrl is its current imageUrl
   */
  updatemodif() {
    if (this.editionService.selectedElements.length === 1) {
      const elementToModif: GridElement = this.editionService.selectedElements[0];
      this.editionService.name = this.getName(elementToModif);
      this.editionService.curentColor = elementToModif.Color;
      this.editionService.curentBorderColor = elementToModif.BorderColor;
      this.editionService.radioTypeFormat = elementToModif.Type;
      const imageToModif = this.boardService.board.ImageList.find(x => x.ID === elementToModif.ElementFormsList[0].ImageID);
      if (imageToModif != null && imageToModif !== undefined) {
        this.editionService.imageURL = imageToModif.Path;
      } else {
        this.editionService.imageURL = '';
      }
      const interactionListToModify = elementToModif.InteractionsList;
      if (interactionListToModify != null) {

        this.editionService.interractionList = [];
        interactionListToModify.map(val =>
          this.editionService.interractionList.push({
            ID: val.ID,
            ActionList: Object.assign([], val.ActionList)
          }));
      } else {
        this.editionService.interractionList = [];
      }
    } else if (this.editionService.selectedElements.length > 1) { // todo see what we want to modify here
      this.editionService.name = '$different$';
      this.editionService.curentColor = '#d3d3d3';
      this.editionService.radioTypeFormat = '';
      this.editionService.imageURL = 'assets/icons/multiple-images.svg';
      console.log(this.editionService.imageURL);
      this.editionService.interractionList = [];
    }
  }


}

