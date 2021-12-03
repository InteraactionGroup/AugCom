import { Component, OnInit } from '@angular/core';
import {ConfigurationService} from "../../services/configuration.service";
import {FolderGoTo, Grid, GridElement, Interaction, Page} from "../../types";
import {BoardService} from "../../services/board.service";
import arasaacJson from "../../../assets/arasaac-symbol-info.json";
import {ArasaacObject, MulBerryObject} from "../../libTypes";
import arasaacColoredJson from "../../../assets/arasaac-color-symbol-info.json";
import mullberryJson from "../../../assets/symbol-info.json";
import {EditionService} from "../../services/edition.service";
import {FunctionsService} from "../../services/functions.service";
import {DbnaryService} from "../../services/dbnary.service";
import {Router} from "@angular/router";
import {MultilinguismService} from "../../services/multilinguism.service";
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";
import {LayoutService} from "../../services/layout.service";
import {ifStmt} from "@angular/compiler/src/output/output_ast";

@Component({
  selector: 'app-generator-grid',
  templateUrl: './generator-grid.component.html',
  styleUrls: ['./generator-grid.component.css']
})
export class GeneratorGridComponent implements OnInit {

  nameGrid = "";
  nbCols = 0;
  nbRows = 0;
  posX = 0;
  posY = 0;
  sentence = "";
  wordsFromSentence = [];
  indexWordsFromSentence = 0;
  libToUse = "arasaacNB";

  imageList = [];
  imageUrlList = [];

  addOnlyOneImage;

  constructor(public configuration: ConfigurationService,
              public boardService: BoardService,
              public editionService: EditionService,
              public functionsService: FunctionsService,
              public dbnaryService: DbnaryService,
              public router: Router,
              public multilinguism: MultilinguismService,
              public indexedDBacess: IndexeddbaccessService,
              public layoutService: LayoutService) {
  }

  ngOnInit(): void {
  }

  clearActualGrid(){

    const generatedPage: Page = new Page();
    generatedPage.ID = '#HOME';
    generatedPage.Name = this.nameGrid;
    generatedPage.ElementIDsList = [];
    generatedPage.NumberOfCols = Number(this.nbCols);
    generatedPage.NumberOfRows = Number(this.nbRows);
    generatedPage.GapSize = 6;
    this.boardService.board = new Grid('nothing','Grid',0,0,[],[],[generatedPage]);
    this.boardService.updateElementList();
  }

  getWordsFromSentence(){
    this.wordsFromSentence = this.sentence.split(" ");
    this.wordsFromSentence = this.wordsFromSentence.filter(word => word != "");
    console.log(this.wordsFromSentence);
  }

  getNameGrid(event){
    this.nameGrid = event.target.value;
  }

  getColsGrid(event){
    this.nbCols = event.target.value;
  }

  getRowsGrid(event){
    this.nbRows = event.target.value;
  }

  getSentence(event){
    this.sentence = event.target.value;
  }

  getImageFromSentence(){
    this.wordsFromSentence.forEach(words => {
      this.searchExactWordInLib(words);
    });

    this.imageList.forEach(image => {
      this.previewLibrary(image);
    });
  }

  getLibrairy(lib){
    this.libToUse = lib;
  }

  searchExactWordInLib(text: string) {
    this.addOnlyOneImage = false;
    console.log("Search the exact word : ");
    if(this.libToUse === "arasaacNB"){
      (arasaacJson as unknown as ArasaacObject)[0].wordList.forEach(word => {
          if (text !== null && text !== '' && word.toLowerCase() === text.toLocaleLowerCase() && !this.addOnlyOneImage) {
            this.addOnlyOneImage = true;
            const url = word;
            this.imageList.push({lib: 'arasaacNB', word: this.cleanString(url)});
            return;
          }
        }, this);
    }else if (this.libToUse === "arasaacColor"){
      (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.forEach(word => {
          if (text !== null && text !== '' && word.toLowerCase() === text.toLocaleLowerCase() && !this.addOnlyOneImage) {
            this.addOnlyOneImage = true;
            const url = word;
            this.imageList.push({lib: 'arasaacColor', word: this.cleanString(url)});
          }
        }, this);
      }
    if (!this.addOnlyOneImage){
      console.log("No find in arasaac lib !");
      (mullberryJson as unknown as MulBerryObject[]).forEach(value => {
        if (text !== null && text !== '' && value.symbol.toLowerCase() === text.toLocaleLowerCase() && !this.addOnlyOneImage) {
          this.addOnlyOneImage = true;
          const url = value.symbol;
          this.imageList.push({lib: 'mulberry', word: this.cleanString(url)});
          return;
        }
      }, this);
      if (!this.addOnlyOneImage){
        this.searchTheClosestWordInLib(text);
      }
    }
  }

  searchTheClosestWordInLib(text : string){
    console.log("Search the closest word :");
    if(this.libToUse === "arasaacNB"){
      (arasaacJson as unknown as ArasaacObject)[0].wordList.forEach(word => {
        if (text !== null && text !== '' && word.toLowerCase().includes(text.toLocaleLowerCase()) && !this.addOnlyOneImage) {
          this.addOnlyOneImage = true;
          const url = word;
          this.imageList.push({lib: 'arasaacNB', word: this.cleanString(url)});
          return;
        }
      }, this);
    }else if (this.libToUse === "arasaacColor"){
      (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.forEach(word => {
        if (text !== null && text !== '' && word.toLowerCase().includes(text.toLocaleLowerCase()) && !this.addOnlyOneImage) {
          this.addOnlyOneImage = true;
          const url = word;
          this.imageList.push({lib: 'arasaacColor', word: this.cleanString(url)});
        }
      }, this);
    }
    if (!this.addOnlyOneImage){
      (mullberryJson as unknown as MulBerryObject[]).forEach(value => {
        if (text !== null && text !== '' && value.symbol.toLowerCase().includes(text.toLocaleLowerCase()) && !this.addOnlyOneImage) {
          this.addOnlyOneImage = true;
          const url = value.symbol;
          this.imageList.push({lib: 'mulberry', word: this.cleanString(url)});
          return;
        }
      }, this);
    }
  }

  cleanString(t: string) {
    return t.replace(/'/g, '\\\'');
  }

  previewLibrary(elt: { lib, word }) {
    if (elt.lib === 'mulberry') {
      this.previewMullberry(elt.word);
    } else if (elt.lib === 'arasaacNB') {
      this.previewArasaac(elt.word, false);
    } else if (elt.lib === 'arasaacColor') {
      this.previewArasaac(elt.word, true);
    }
  }

  previewMullberry(t: string) {
    this.previewWithURL('assets/libs/mulberry-symbols/EN-symbols/' + t + '.svg');
    console.log('assets/libs/mulberry-symbols/EN-symbols/' + t + '.svg');
  }

  previewArasaac(t: string, isColored: boolean) {
    if (isColored) {
      this.previewWithURL('assets/libs/FR_Pictogrammes_couleur/' + t + '.png');
      console.log('assets/libs/FR_Pictogrammes_couleur/' + t + '.png');
    } else {
      this.previewWithURL('assets/libs/FR_Noir_et_blanc_pictogrammes/' + t + '.png');
      console.log('assets/libs/FR_Noir_et_blanc_pictogrammes/' + t + '.png');
    }
  }

  previewWithURL(t) {
    this.imageUrlList.push(t);
  }

  setButtonOnGrid(){
    this.imageUrlList.forEach(image => {
      this.createNewButton(image);
      this.indexWordsFromSentence += 1;
    });
  }

  createNewButton(image: string) {
    let name = this.wordsFromSentence[this.indexWordsFromSentence];

    let tempId = name;

    let i = 0;
    while (this.boardService.board.ElementList.findIndex(elt => elt.ID === tempId) !== -1) {
      tempId = name + i;
      i ++;
    }

    this.editionService.variantList.push(
      {
        DisplayedText: name,
        VoiceText: name,
        LexicInfos: [{default: true}],
        ImageID: tempId
      }
    );

    const elementFormsList = Object.assign([], this.editionService.variantList);
    this.editionService.variantList = [];

    for (const interaction of this.functionsService.interactionIDs) {
      this.editionService.interractionList.push({
        ID: 'click',
        ActionList: [
          {ID: 'say', Options: []},
        ]
      });
    }

    let generatedGrid = new GridElement(tempId, this.returnTypeOf(tempId), this.editionService.classe, this.editionService.curentColor, this.editionService.curentBorderColor, 0, elementFormsList, this.editionService.interractionList);
    generatedGrid.x = this.posX;
    generatedGrid.y = this.posY;

    this.updatePositionGrid();

    this.boardService.board.ElementList.push(generatedGrid);

    this.boardService.board.ImageList.push(
      {
        ID: tempId,
        OriginalName: name,
        Path: image
      });

    const currentPage: Page = this.getCurrentPage();
    currentPage.ElementIDsList.push(tempId);
  }

  returnTypeOf(elementID) {
    if (this.editionService.radioTypeFormat === 'folder') {
      if (this.editionService.pageLink === '@') {
        return new FolderGoTo(elementID);
      } else if (this.editionService.pageLink === '@NEW@') {
        if (this.editionService.newPage.replace(/ /g, '') === '') {
          return new FolderGoTo(elementID)
        } else {
          this.boardService.board.PageList.push({
            BackgroundColor: 'default',
            ID: this.editionService.newPage,
            Name: this.editionService.newPage.replace(/_/g, ' ').toUpperCase(),
            ElementIDsList: [],
            NumberOfCols: undefined,
            NumberOfRows: undefined,
            GapSize: undefined
          });
          return new FolderGoTo(this.editionService.newPage);
        }
      } else {
        return new FolderGoTo(this.editionService.pageLink);
      }
    } else {
      return 'button';
    }
  }

  getCurrentPage(): Page {
    let currentPage = this.boardService.board.PageList.find(page => {
      return page.ID === this.boardService.getCurrentFolder()
    });
    if (currentPage === null || currentPage === undefined) {
      currentPage = this.createAndGetNewPage();
    }
    return currentPage;
  }

  updatePositionGrid(){
    if (this.posX != this.nbCols){
      this.posX += 1;
    }else {
      this.posX = 0;
      this.posY += 1;
    }
  }

  clear() {
    this.editionService.imageTextField = "";
    this.editionService.borderCheck = false;
    this.editionService.insideCheck = false;
    this.editionService.name = '';
    this.editionService.curentColor = '#d3d3d3';
    this.editionService.imageURL = '';
    this.dbnaryService.wordList = [];
    this.dbnaryService.typeList = [];
    this.editionService.selectedElements = [];
    this.functionsService.reset();
  }

  createAndGetNewPage(): Page {
    const name = this.boardService.getCurrentFolder();
    return {
      BackgroundColor: 'default',
      ID: name,
      Name: name,
      ElementIDsList: [],
      NumberOfCols: undefined,
      NumberOfRows: undefined,
      GapSize: undefined
    };
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async submit(){
    this.clearActualGrid();
    this.getWordsFromSentence();
    this.getImageFromSentence();
    this.setButtonOnGrid();
    this.clear();
    this.indexedDBacess.update();
    this.router.navigate(['keyboard']);
    await this.delay(500);
    this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());
    await this.delay(1000);
    this.layoutService.refreshAll(this.boardService.getNumberOfCols(), this.boardService.getNumberOfRows(), this.boardService.getGapSize());
  }

}
