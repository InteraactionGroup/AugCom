import { Component, OnInit } from '@angular/core';
import { MultilinguismService } from '../../services/multilinguism.service';
import { Grid, GridElement, Page } from '../../types';
import { BoardService } from '../../services/board.service';
import { Router } from '@angular/router';
import { IndexeddbaccessService } from '../../services/indexeddbaccess.service';
import { ConfigurationService } from '../../services/configuration.service';
import { SafeUrl } from '@angular/platform-browser';
import arasaacColoredJson from '../../../assets/arasaac-color-symbol-info.json';
import { ArasaacObject } from '../../libTypes';
import { LayoutService } from '../../services/layout.service';
declare const initSqlJs: any;

@Component({
  selector: 'app-spb2aug',
  templateUrl: './spb2aug.component.html',
  styleUrls: ['./spb2aug.component.css']
})
// doc sqlite : https://github.com/sql-js/sql.js/
export class Spb2augComponent implements OnInit {

  newGrid: Grid;
  db = null;
  myFileNameExtension;
  numberErrorImage: number;

  constructor(
    public multilinguism: MultilinguismService,
    public indexedDBacess: IndexeddbaccessService,
    public router: Router,
    public boardService: BoardService,
    public configuration: ConfigurationService,
    public layoutService: LayoutService) {
  }

  ngOnInit(): void {
    this.newGrid = new Grid('newGrid', 'Grid', 0, 0, [], [], []);
    this.newGrid.software = 'Snap Core first'
    this.numberErrorImage = 0;
  }

  /**
   * convert a spb or sps file into a grid
   * @param file file imported
   */
  convert(file) {
    this.router.navigate(['loading']);
    this.newGrid.ID = 'newGrid';
    this.newGrid.GapSize = 5;
    const date: Date = new Date();
    this.newGrid.modificationDate = date.getDate().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear().toString();
    this.newGrid.creationDate = date.getDate().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear().toString();
    const myFile = file[0];
    this.myFileNameExtension = myFile.name.split('.').pop();
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.loadDB(fileReader);
    };
    fileReader.readAsArrayBuffer(myFile);
  }

  /**
   * load the database the data from the file
   * @param arrayBuffer data from the file
   */
  loadDB(arrayBuffer) {
    // initSqlJs is in the library sql.js, use npm install @types/sql.js
    initSqlJs().then(SQL => {
      try {
        this.db = new SQL.Database(new Uint8Array(arrayBuffer.result));
      } catch (ex) {
        alert(ex);
        return;
      }
      this.getGridDimension();
      this.getGridFromDatabase();
      this.getPolice();
      console.log(this.newGrid);
      this.statErrorImage();
      let that = this;
      setTimeout(function () {
        that.db.close();
        that.boardService.board = that.newGrid;
        that.layoutService.refreshAll(that.newGrid.NumberOfCols, that.newGrid.NumberOfRows, that.newGrid.GapSize);
        that.boardService.backHome();
        that.indexedDBacess.update();
        that.router.navigate(['keyboard']);
      }, 500);
    });
  }

  /**
   * the main function where we get the grid from the database
   */
  getGridFromDatabase() {
    this.AdjustBDD();
    this.getAllPagesFromDatabase();
    this.setMainPage();
  }

  /**
   * Here I have to adjust BDD because a useless element is present in table ElementReference at pageId 3 on SPB and somewhere in the base in SPS (elementType = 1)
   */
  AdjustBDD(){
    const indexElementType1 = this.db.prepare('SELECT Id FROM ElementReference WHERE ElementType > 0');
    indexElementType1.step();
    const ElementType1Id = indexElementType1.getAsObject().Id;
    this.db.run('DELETE FROM ElementReference WHERE Id = ' + ElementType1Id);

    const queryIndexButton = this.db.prepare("SELECT Id,ElementReferenceId FROM Button");
    while(queryIndexButton.step()){
      const indexButton = queryIndexButton.getAsObject().Id;
      const indexElementReferenceId = queryIndexButton.getAsObject().ElementReferenceId;
      if(indexButton+ 1 == indexElementReferenceId){
        this.db.run('DELETE FROM ElementReference WHERE Id = ' + indexButton);
        this.db.run('UPDATE ElementReference SET Id = Id - 1 WHERE Id >= '+ indexButton);
        this.db.run('UPDATE ElementPlacement SET ElementReferenceId = ElementReferenceId -1 WHERE ElementReferenceId >= '+ indexButton);
        return;
      }
    }
    console.log("Update finish");
  }

  /**
   * this function import every Pages from the Database
   */
  getAllPagesFromDatabase(){
    //need to swap UniqueId and Id because folderButton target ID and we need the value UniqueId in
    const buttonTable = this.db.prepare('SELECT ElementPlacement.GridPosition,ElementPlacement.GridSpan,ElementPlacement.PageLayoutId,ElementReference.BackgroundColor,ElementReference.PageId AS ERPageId,Button.UniqueId AS ButtonUniqueId,Button.BorderColor,ButtonPageLink.PageUniqueId as PageLink,Button.Label,Button.Message FROM ElementReference INNER JOIN ElementPlacement ON ElementReference.Id = ElementPlacement.ElementReferenceId LEFT JOIN Button ON ElementReference.Id = Button.Id LEFT JOIN ButtonPageLink ON Button.Id = ButtonPageLink.ButtonId WHERE ElementReference.ElementType = 0 ORDER BY ElementReference.PageId ASC,ElementPlacement.PageLayoutId');
    const queryPage = this.db.prepare('SELECT Id as uniqueId, UniqueId as id, Title FROM Page ');
    buttonTable.step();
    while(queryPage.step()){
      let newPage = new Page();
      newPage.ID = String(queryPage.getAsObject().id);
      newPage.UniquePageId = String(queryPage.getAsObject().uniqueId);
      newPage.Name = queryPage.getAsObject().Title;
      if(newPage.Name == null){
        newPage.Name = newPage.ID;
      }
      newPage.ElementIDsList = [];
      const queryPageLayout = this.db.prepare('SELECT Id,PageLayoutSetting FROM PageLayout WHERE PageId =' + queryPage.getAsObject().uniqueId);
      const tabNumberOfColsRowsPagelayoutid = this.getPageDimensionMax(queryPageLayout);
      queryPageLayout.free();
      newPage.NumberOfRows = Number(tabNumberOfColsRowsPagelayoutid[0]);
      newPage.NumberOfCols = Number(tabNumberOfColsRowsPagelayoutid[1]);
      this.addButtonsToPage(tabNumberOfColsRowsPagelayoutid[2], newPage, buttonTable);
      this.newGrid.PageList.push(newPage);
      //TODO la barre de chargement ici chaque page se charge une à une, tu peux incrémenter ici, n'oublie pas que je crée une page pour les "pages suivantes" du coup le max faudra le up dynamiquement va voir la fonction goDownPage()
    }
    buttonTable.free();
    queryPage.free();

  }

  /**
   * function who filled current page
   * @param pageLayoutId the pageLayoutId choose for place our buttons
   * @param currentPage the page we are filling
   * @param buttonTable the query who contain information about buttons
   */
  addButtonsToPage(pageLayoutId:any, currentPage: Page, buttonTable:any ){
    let gridElement:GridElement;
    let ElementPlacementPageLayoutId = buttonTable.getAsObject().PageLayoutId;
    let ElementReferencePageId = buttonTable.getAsObject().ERPageId;

    //good page but bad layoutSetting, step until LayoutId is good too
    while(ElementPlacementPageLayoutId != pageLayoutId && ElementReferencePageId == currentPage.UniquePageId){
      buttonTable.step();
      ElementPlacementPageLayoutId = buttonTable.getAsObject().PageLayoutId;
      ElementReferencePageId = buttonTable.getAsObject().ERPageId;
    }


    //it's the great button
    while(ElementPlacementPageLayoutId == pageLayoutId && ElementReferencePageId == currentPage.UniquePageId){

      let gridPosition = buttonTable.getAsObject().GridPosition;
      const gridSpan = buttonTable.getAsObject().GridSpan;

      let buttonUniqueId: string = buttonTable.getAsObject().ButtonUniqueId;
      // si le bouton n'a pas d'id unique je saute ce bouton, on sait pas ce que c'est
      if(buttonUniqueId != null){
        let label: string = buttonTable.getAsObject().Label;
        let linkFolder = buttonTable.getAsObject().PageLink;
        let message: string = buttonTable.getAsObject().Message;
        let borderColor = buttonTable.getAsObject().BorderColor;
        let color = buttonTable.getAsObject().BackgroundColor;

        //here is button prediction, they don't got label or message, but they have ButtonUniqueId
        if(label == null && message == null){
          label = "Prediction";
          message = "Prediction";
        }

        const B_MASK = 255;
        const G_MASK = 255 << 8; // 65280
        const R_MASK = 255 << 16; // 16711680
        const r = (color & R_MASK) >> 16;
        const g = (color & G_MASK) >> 8;
        const b = color & B_MASK;

        const rb = (borderColor & R_MASK) >> 16;
        const gb = (borderColor & G_MASK) >> 8;
        const bb = borderColor & B_MASK

        const tabResPos = gridPosition.split(',');
        const tabResSpan = gridSpan.split(',');

        if(linkFolder !== null) {
          gridElement = new GridElement(buttonUniqueId,
            {GoTo: String(linkFolder)},
            '',
            'rgb(' + r + ',' + g + ',' + b + ')',
            'rgb(' + rb + ',' + gb + ',' + bb + ')',
            0,
            [
              {
                DisplayedText: (message) !== null ? message : label,
                VoiceText: (message) !== null ? message : label,
                LexicInfos: [{default: true}],
                ImageID: (label) !== null? label : '',
              }
            ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
        }else{
          gridElement = new GridElement(buttonUniqueId,
            'button',
            '',
            'rgb(' + r + ',' + g + ',' + b + ')',
            'rgb(' + rb + ',' + gb + ',' + bb + ')',
            0,
            [
              {
                DisplayedText: (message) !== null ? message : label,
                VoiceText: (message) !== null ? message : label,
                LexicInfos: [{default: true}],
                ImageID: (label) !== null? label : '',
              }
            ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
        }
        gridElement.x = Number(tabResPos[0]);
        gridElement.y = Number(tabResPos[1]);
        gridElement.rows = Number(tabResSpan[1]);
        gridElement.cols = Number(tabResSpan[0]);
        const pathImage = this.getPathImageArsaacLibrary(label, message);
        this.newGrid.ImageList.push({
          ID: (label) !== null? label : '',
          OriginalName: (label) !== null? label : '',
          Path: pathImage,
        });
        this.newGrid.ElementList.push(gridElement);
        this.goDownPage(gridElement, currentPage);

        buttonTable.step();
        ElementPlacementPageLayoutId = buttonTable.getAsObject().PageLayoutId;
        ElementReferencePageId = buttonTable.getAsObject().ERPageId;
      }else{
        buttonTable.step();
        ElementPlacementPageLayoutId = buttonTable.getAsObject().PageLayoutId;
        ElementReferencePageId = buttonTable.getAsObject().ERPageId;
      }
    }
    // still the good page but it's the next LayoutId and we don't care about it, step until next page
    while(ElementPlacementPageLayoutId != pageLayoutId && ElementReferencePageId <= currentPage.UniquePageId){
      buttonTable.step();
      ElementPlacementPageLayoutId = buttonTable.getAsObject().PageLayoutId;
      ElementReferencePageId = buttonTable.getAsObject().ERPageId;
    }
  }

  /**
   * this function check if we need a new page, if yes I add a new page and a button to go in
   * @param gridElement current gridElement I am checking if he can be filled in the page or if we need more
   * @param currentPage current page to take his weight and height
   */
  goDownPage(gridElement:GridElement, currentPage:Page){
    if(gridElement.y >= currentPage.NumberOfRows){
      let numeroPage = String(Math.ceil((gridElement.y + 1) / currentPage.NumberOfRows));
      //test if the page already exist if yes do nothing
      const indexNextPage = this.newGrid.PageList.findIndex(page => 'goDown' + currentPage.ID + numeroPage === page.ID);
      if(indexNextPage == -1){
        let goDownElement = new GridElement('goDown' + currentPage.ID + numeroPage,
          { GoTo: 'goDown' + currentPage.ID + numeroPage },
          '',
          "rgb(253,251,250)",
          '',
          0,
          [
            {
              DisplayedText: 'go Down',
              VoiceText: '',
              LexicInfos: [{ default: true }],
              ImageID: '',
            }
          ], [{ ID: 'click', ActionList: [{ ID: 'display', Options: [] }, { ID: 'say', Options: [] }] }])
        goDownElement.cols = 1;
        goDownElement.rows = 1;
        goDownElement.y = currentPage.NumberOfRows - 1;
        goDownElement.x = currentPage.NumberOfCols - 1;
        this.newGrid.ElementList.push(goDownElement);

        if(numeroPage == "2"){
          currentPage.ElementIDsList.push(goDownElement.ID);
        }else{
          let indexNextPage = this.newGrid.PageList.findIndex(page => 'goDown' + currentPage.ID + String(Number(numeroPage) - 1) === page.ID);
          //si la page n'existe pas, elle devra l'être plus tard autant le faire dessuite
          if(indexNextPage === -1){
            let nextPage: Page = new Page();
            nextPage.ID = 'goDown' + String(currentPage.ID)+ String(Number(numeroPage) - 1);
            nextPage.UniquePageId = currentPage.UniquePageId + String(Number(numeroPage) - 1);
            nextPage.Name = currentPage.Name + String(Number(numeroPage) - 1);
            nextPage.ElementIDsList = [];
            nextPage.NumberOfRows = currentPage.NumberOfRows;
            nextPage.NumberOfCols = currentPage.NumberOfCols;
            this.newGrid.PageList.push(nextPage);
            this.newGrid.PageList[this.newGrid.PageList.length-1].ElementIDsList.push(goDownElement.ID);
          }else{
            this.newGrid.PageList[indexNextPage].ElementIDsList.push(goDownElement.ID);
          }
        }
        //la page suivante
        let nextPage: Page = new Page();
        nextPage.ID = 'goDown' + String(currentPage.ID)+ String(numeroPage);
        nextPage.UniquePageId = currentPage.UniquePageId + numeroPage;
        nextPage.Name = currentPage.Name + numeroPage;
        nextPage.ElementIDsList = [];
        nextPage.NumberOfRows = currentPage.NumberOfRows;
        nextPage.NumberOfCols = currentPage.NumberOfCols;
        gridElement.y = gridElement.y % currentPage.NumberOfRows;
        nextPage.ElementIDsList.push(gridElement.ID);
        this.newGrid.PageList.push(nextPage);
      }else{
        this.newGrid.PageList[indexNextPage].ElementIDsList.push(gridElement.ID);
      }
    }
    else{
      currentPage.ElementIDsList.push(gridElement.ID);
    }
  }

  /**
   * function after everything is charged, will set the main page
   */
  setMainPage(){
    let defaultHomePageUniqueId:any;
    if(this.myFileNameExtension == "sps"){
      const pageSetProperties = this.db.prepare('SELECT DefaultHomePageUniqueId FROM PageSetProperties');
      pageSetProperties.step();
      defaultHomePageUniqueId = pageSetProperties.getAsObject().DefaultHomePageUniqueId;
      let homePage = this.newGrid.PageList.find(page => page.ID === defaultHomePageUniqueId);
      homePage.ID = '#HOME';
      pageSetProperties.free();
    }else{
      const queryHomePageForSpb = this.db.prepare('SELECT Id,UniqueId FROM Page WHERE Id = 4');
      queryHomePageForSpb.step();
      defaultHomePageUniqueId = queryHomePageForSpb.getAsObject().UniqueId;
      let homePage = this.newGrid.PageList.find(page => page.ID === defaultHomePageUniqueId);
      homePage.ID = '#HOME';
      queryHomePageForSpb.free();
    }
    this.SwitchPageLinkTargetMainPage(defaultHomePageUniqueId);
  }

  /**
   * Warning : This function is not tested, i don't have a test for this be careful here
   * function who switch the link from folder button who linked on the unique ID, but I switched it to #HOME for our grid
   * @param defaultHomePageUniqueId id unique for the home page
   * @constructor
   */
  SwitchPageLinkTargetMainPage(defaultHomePageUniqueId: any){
    this.newGrid.ElementList.forEach(elem => {
      if(elem.Type == {GoTo : String(defaultHomePageUniqueId)}) {
        elem.Type = {GoTo : "#HOME"}
      }
    });
  }

  /**
   *
   * @param label the label of the button
   * @param message the message of the button
   */
  getPathImageArsaacLibrary(label, message): string {
    if (label !== null) {
      const index = (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.findIndex(word => {
        return label.toLowerCase() === word.toLowerCase();
      });
      if (index > -1) {
        return 'assets/libs/FR_Pictogrammes_couleur/' + (arasaacColoredJson as unknown as ArasaacObject)[0].wordList[index] + '.png';
      }
    }

    if (message !== null) {
      const index = (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.findIndex(word => {
        return message.toLowerCase() === word.toLowerCase();
      });
      if (index > -1) {
        return 'assets/libs/FR_Pictogrammes_couleur/' + (arasaacColoredJson as unknown as ArasaacObject)[0].wordList[index] + '.png';
      }
    }


    return '';
  }
  /**
   * Search in the database and set the number of rows and colomns in the grid
   */
  getGridDimension() {
    const gridDim = this.db.prepare('SELECT GridDimension FROM PageSetProperties');
    while (gridDim.step()) {
      const result = gridDim.getAsObject().GridDimension;
      const gridDimension = result.split(',');
      this.newGrid.NumberOfCols = Number(gridDimension[0]);
      this.newGrid.NumberOfRows = Number(gridDimension[1]);
    }
    gridDim.free();
  }

  /**
   * get the max of rows and columns for every pages and return the pageLayoutId
   * @param page query from the database for page in PageLayout table
   */
  getPageDimensionMax(page: any): number[] {
    let numberOfRowsMax = 0;
    let numberOfColsMax = 0;
    let pageLayoutId = 0;
    while (page.step()) {
      const pageLayoutSetting = page.getAsObject().PageLayoutSetting;
      const pageLayoutIdDataBase = page.getAsObject().Id;
      const tabLayoutSetting = pageLayoutSetting.split(',');
      if (numberOfRowsMax <= Number(tabLayoutSetting[1]) && numberOfColsMax <= Number(tabLayoutSetting[0])) {
        numberOfRowsMax = Number(tabLayoutSetting[1]);
        numberOfColsMax = Number(tabLayoutSetting[0]);
        pageLayoutId = pageLayoutIdDataBase;
      }
    }
    return [numberOfRowsMax, numberOfColsMax, pageLayoutId];
  }

  /**
   * checks that each image exists in the image bank and makes the error rate
   */
  statErrorImage() {
    this.newGrid.ImageList.forEach(picture => {
      const index = (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.findIndex(word => {
        return picture.ID !== null && picture.ID !== '' && (picture.ID.toLowerCase() === word || picture.ID.toUpperCase() === word);
      });

      if (index === -1) {
        // console.log(picture.ID);
        this.numberErrorImage = this.numberErrorImage + 1;
      }
    });
    console.log('pourcentage d\'erreur : ', this.numberErrorImage / this.newGrid.ImageList.length * 100 + '%');
  }
  /**
   * query the database to set the police
   */
  getPolice() {
    const po = this.db.prepare('SELECT FontFamily FROM PageSetProperties');
    po.step();
    const police = po.getAsObject().FontFamily;
    this.configuration.STYLE_FONTFAMILY_VALUE = String(police);
    po.free();
  }
}
