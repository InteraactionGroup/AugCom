import {Component, OnInit} from '@angular/core';
import {MultilinguismService} from '../../services/multilinguism.service';
import {FolderGoTo, Grid, GridElement, Page} from '../../types';
import {BoardService} from '../../services/board.service';
import {Router} from '@angular/router';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {ConfigurationService} from '../../services/configuration.service';
import arasaacJson from '../../../assets/arasaac.json';
import {LayoutService} from '../../services/layout.service';

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
      this.getGridDimensionFromDatabase();
      this.getGridFromDatabase();
      this.fillPageWithDashboard();
      this.getPolice();
      this.switchLinkedPage();
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
    this.getAllPagesFromDatabase();
    this.setMainPage();
  }

  /**
   * this function import every Pages from the Database
   */
  getAllPagesFromDatabase() {
    //need to swap UniqueId and Id because folderButton target ID and we need the value UniqueId in
    const buttonTable = this.db.prepare('SELECT ElementPlacement.GridPosition,ElementPlacement.GridSpan,ElementPlacement.PageLayoutId,ElementPlacement.Visible,ElementReference.BackgroundColor,ElementReference.PageId AS ERPageId,Button.UniqueId AS ButtonUniqueId,Button.BorderColor,ButtonPageLink.PageUniqueId as PageLink,Button.Label,Button.Message FROM ElementReference INNER JOIN ElementPlacement ON ElementReference.Id = ElementPlacement.ElementReferenceId LEFT JOIN Button ON ElementReference.Id = Button.ElementReferenceId LEFT JOIN ButtonPageLink ON Button.Id = ButtonPageLink.ButtonId WHERE ElementReference.ElementType = 0 ORDER BY ElementReference.PageId ASC,ElementPlacement.PageLayoutId');
    const queryPage = this.db.prepare('SELECT Id as uniqueId, UniqueId as id, Title, PageType, GridDimension FROM Page ');
    buttonTable.step();
    while (queryPage.step()) {
      let newPage = new Page();
      newPage.ID = String(queryPage.getAsObject().id);
      newPage.UniquePageId = String(queryPage.getAsObject().uniqueId);
      newPage.PageType = queryPage.getAsObject().PageType;
      newPage.Name = queryPage.getAsObject().Title;
      let pageDimension = queryPage.getAsObject().GridDimension;
      if (newPage.Name == null) {
        newPage.Name = newPage.ID;
      }
      newPage.ElementIDsList = [];
      const queryPageLayout = this.db.prepare('SELECT Id,PageLayoutSetting FROM PageLayout WHERE PageId =' + queryPage.getAsObject().uniqueId);
      const tabNumberOfColsRowsPagelayoutid = this.getPageDimension(queryPageLayout, pageDimension, queryPage);
      queryPageLayout.free();
      newPage.NumberOfRows = Number(tabNumberOfColsRowsPagelayoutid[0]);
      //page 2 (dashboard) will be placed between the 0 and 1 position
      if (newPage.UniquePageId == "2") {
        newPage.NumberOfCols = Number(tabNumberOfColsRowsPagelayoutid[1]);
      } else {
        newPage.NumberOfCols = Number(tabNumberOfColsRowsPagelayoutid[1]) + 1;
      }
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
  addButtonsToPage(pageLayoutId: any, currentPage: Page, buttonTable: any) {
    let gridElement: GridElement;
    let ElementPlacementPageLayoutId = buttonTable.getAsObject().PageLayoutId;
    let ElementReferencePageId = buttonTable.getAsObject().ERPageId;

    //good page but bad layoutSetting, step until LayoutId is good too
    while (ElementPlacementPageLayoutId != pageLayoutId && ElementReferencePageId == currentPage.UniquePageId) {
      buttonTable.step();
      ElementPlacementPageLayoutId = buttonTable.getAsObject().PageLayoutId;
      ElementReferencePageId = buttonTable.getAsObject().ERPageId;
    }

    //it's the great button
    while (ElementPlacementPageLayoutId == pageLayoutId && ElementReferencePageId == currentPage.UniquePageId) {

      let gridPosition = buttonTable.getAsObject().GridPosition;
      const gridSpan = buttonTable.getAsObject().GridSpan;

      let buttonUniqueId: string = buttonTable.getAsObject().ButtonUniqueId;
      // If the button doesn't have a unique ID, I skip this button; we don't know what it is.
      if (buttonUniqueId != null) {
        let label: string = buttonTable.getAsObject().Label;
        let linkFolder = buttonTable.getAsObject().PageLink;
        let message: string = buttonTable.getAsObject().Message;
        let borderColor = buttonTable.getAsObject().BorderColor;
        let color = buttonTable.getAsObject().BackgroundColor;
        let visibilityLevel: number = buttonTable.getAsObject().Visible;
        visibilityLevel = visibilityLevel == 0 ? 1 : 0;

        //here is button prediction, they don't got label or message, but they have ButtonUniqueId
        if (label == null && message == null) {
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

        if (linkFolder !== null) {
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
                ImageID: (label) !== null ? label : '',
              }
            ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}]);
          if(label !== null){
            if((label.toLowerCase() == "clavier" || label.toLowerCase() == "keyboard") && (currentPage.UniquePageId == "2" || currentPage.PageType == 3)){
              console.log("clavier x 0");
              const pageSetProperties = this.db.prepare('SELECT DefaultKeyboardPageUniqueId FROM PageSetProperties');
              pageSetProperties.step();
              let defaultKeyboardPageUniqueId = pageSetProperties.getAsObject().DefaultKeyboardPageUniqueId;
              gridElement.Type = {GoTo: String(defaultKeyboardPageUniqueId)};
              pageSetProperties.free();
            }
          }
        } else {
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
                ImageID: (label) !== null ? label : '',
              }
            ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
        }
        if (currentPage.UniquePageId == "2" || currentPage.PageType == 3) {
          gridElement.x = Number(tabResPos[0]);
        } else {
          gridElement.x = Number(tabResPos[0]) + 1;
        }
        this.assignFunctionToButton(gridElement);
        gridElement.y = Number(tabResPos[1]);
        gridElement.rows = Number(tabResSpan[1]);
        gridElement.cols = Number(tabResSpan[0]);
        gridElement.VisibilityLevel = visibilityLevel;
        const pathImage = this.getPathImageArsaacLibrary(label, message);
        this.newGrid.ImageList.push({
          ID: (label) !== null ? label : '',
          OriginalName: (label) !== null ? label : '',
          Path: pathImage,
        });
        this.newGrid.ElementList.push(gridElement);
        this.goDownPage(gridElement, currentPage);

        buttonTable.step();
        ElementPlacementPageLayoutId = buttonTable.getAsObject().PageLayoutId;
        ElementReferencePageId = buttonTable.getAsObject().ERPageId;
      } else {
        buttonTable.step();
        ElementPlacementPageLayoutId = buttonTable.getAsObject().PageLayoutId;
        ElementReferencePageId = buttonTable.getAsObject().ERPageId;
      }
    }
    // still the good page but it's the next LayoutId and we don't care about it, step until next page
    while (ElementPlacementPageLayoutId != pageLayoutId && ElementReferencePageId <= currentPage.UniquePageId) {
      buttonTable.step();
      ElementPlacementPageLayoutId = buttonTable.getAsObject().PageLayoutId;
      ElementReferencePageId = buttonTable.getAsObject().ERPageId;
    }
  }

  /**
   * assign the function to the button by mathching his text
   * @param element current grid element
   */
  assignFunctionToButton(element:GridElement){
    if(element.ElementFormsList[0].DisplayedText.toLowerCase() == "retour"){
      element.InteractionsList[0].ActionList = [];
      element.InteractionsList[0].ActionList.push({ID:'back', Options: []});
    }else if(element.ElementFormsList[0].DisplayedText.toLowerCase() == "monter le son"){
      element.InteractionsList[0].ActionList = [];
      element.InteractionsList[0].ActionList.push({ID:'turnupvolume', Options: []});
    }else if(element.ElementFormsList[0].DisplayedText.toLowerCase() == "baisser le son"){
      element.InteractionsList[0].ActionList = [];
      element.InteractionsList[0].ActionList.push({ID:'turndownvolume', Options: []});
    }else if(element.ElementFormsList[0].DisplayedText.toLowerCase() == "couper le son"){
      element.InteractionsList[0].ActionList = [];
      element.InteractionsList[0].ActionList.push({ID:'mute', Options: []});
    }
  }

  /**
   * this function check if we need a new page, if yes I add a new page and a button to go in
   * @param gridElement current gridElement I am checking if he can be filled in the page or if we need more
   * @param currentPage current page to take his weight and height
   */
  goDownPage(gridElement: GridElement, currentPage: Page) {
    if (gridElement.y >= currentPage.NumberOfRows) {
      let numeroPage = String(Math.ceil((gridElement.y + 1) / currentPage.NumberOfRows));
      //test if the page already exist if yes do nothing
      const indexNextPage = this.newGrid.PageList.findIndex(page => 'goDown' + numeroPage + "Page" + currentPage.ID === page.ID);
      if (indexNextPage == -1) {
        let goDownElement = new GridElement('goDown' + numeroPage + "Page" + currentPage.ID,
          {GoTo: 'goDown' + numeroPage + "Page" + currentPage.ID},
          '',
          "rgb(253,251,250)",
          '',
          0,
          [
            {
              DisplayedText: 'go Down',
              VoiceText: '',
              LexicInfos: [{default: true}],
              ImageID: '',
            }
          ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}])
        goDownElement.cols = 1;
        goDownElement.rows = 1;
        goDownElement.y = currentPage.NumberOfRows - 1;
        goDownElement.x = currentPage.NumberOfCols - 1;
        this.newGrid.ElementList.push(goDownElement);

        if (numeroPage == "2") {
          currentPage.ElementIDsList.push(goDownElement.ID);
        } else {
          let indexNextPage = this.newGrid.PageList.findIndex(page => 'goDown' + String(Number(numeroPage) - 1) + "Page" + currentPage.ID === page.ID);
          //If the page doesn't exist, create it.
          if (indexNextPage === -1) {
            let nextPage: Page = new Page();
            nextPage.ID = 'goDown' + String(Number(numeroPage) - 1) + "Page" + String(currentPage.ID);
            nextPage.UniquePageId = currentPage.UniquePageId + String(Number(numeroPage) - 1) + "Page";
            nextPage.Name = currentPage.Name + String(Number(numeroPage) - 1) + "Page";
            nextPage.ElementIDsList = [];
            nextPage.NumberOfRows = currentPage.NumberOfRows;
            nextPage.NumberOfCols = currentPage.NumberOfCols;
            nextPage.PageType = currentPage.PageType;
            this.newGrid.PageList.push(nextPage);
            this.newGrid.PageList[this.newGrid.PageList.length - 1].ElementIDsList.push(goDownElement.ID);
          } else {
            this.newGrid.PageList[indexNextPage].ElementIDsList.push(goDownElement.ID);
          }
        }
        let nextPage: Page = new Page();
        nextPage.ID = 'goDown' + String(numeroPage) + "Page" + String(currentPage.ID);
        nextPage.UniquePageId = currentPage.UniquePageId + numeroPage + "Page";
        nextPage.Name = currentPage.Name + numeroPage + "Page";
        nextPage.ElementIDsList = [];
        nextPage.NumberOfRows = currentPage.NumberOfRows;
        nextPage.NumberOfCols = currentPage.NumberOfCols;
        gridElement.y = gridElement.y % currentPage.NumberOfRows;
        nextPage.ElementIDsList.push(gridElement.ID);
        nextPage.PageType = currentPage.PageType;
        this.newGrid.PageList.push(nextPage);
      } else {
        gridElement.y = gridElement.y % currentPage.NumberOfRows;
        this.newGrid.PageList[indexNextPage].ElementIDsList.push(gridElement.ID);
      }
    } else {
      currentPage.ElementIDsList.push(gridElement.ID);
    }
  }

  /**
   * function after everything is charged, will set the main page
   */
  setMainPage() {
    let defaultHomePageUniqueId: any;
    if (this.myFileNameExtension == "sps") {
      const pageSetProperties = this.db.prepare('SELECT DefaultHomePageUniqueId FROM PageSetProperties');
      pageSetProperties.step();
      defaultHomePageUniqueId = pageSetProperties.getAsObject().DefaultHomePageUniqueId;
      let homePage = this.newGrid.PageList.find(page => page.ID === defaultHomePageUniqueId);
      homePage.ID = '#HOME';
      pageSetProperties.free();
    } else {
      const queryHomePageForSpb = this.db.prepare('SELECT Id,UniqueId FROM Page WHERE Id = 4');
      queryHomePageForSpb.step();
      defaultHomePageUniqueId = queryHomePageForSpb.getAsObject().UniqueId;
      let homePage = this.newGrid.PageList.find(page => page.ID === defaultHomePageUniqueId);
      homePage.ID = '#HOME';
      queryHomePageForSpb.free();
    }
  }

  /**
   *
   * @param label the label of the button
   * @param message the message of the button
   */
  getPathImageArsaacLibrary(label, message): string {

    if(label !== null){
      // @ts-ignore
      const idInArasaac = arasaacJson.filter(item => item.keywords.some(k => k.keyword === label)).map(item => item._id);
      if(idInArasaac.length > 0){
        return 'assets/libs/arasaac_pictos/' + idInArasaac[0] + '.png';
      }
    }
    if(message !== null){
      // @ts-ignore
      const idInArasaac = arasaacJson.filter(item => item.keywords.some(k => k.keyword === message)).map(item => item._id);
      if(idInArasaac.length > 0){
        return 'assets/libs/arasaac_pictos/' + idInArasaac[0] + '.png';
      }
    }
    return '';
  }

  /**
   * Search in the database and set the number of rows and colomns in the grid
   */
  getGridDimensionFromDatabase() {
    const gridDim = this.db.prepare('SELECT GridDimension FROM PageSetProperties');
    while (gridDim.step()) {
      const result = gridDim.getAsObject().GridDimension;
      const gridDimension = result.split(',');
      this.newGrid.NumberOfCols = Number(gridDimension[0]) + 1;
      this.newGrid.NumberOfRows = Number(gridDimension[1]);
    }
    gridDim.free();
  }

  /**
   * this function calculate the dimension of the page and return it
   * @param queryPageLayout query indicate the Layout of the page
   * @param pageDimension array who indicate dimension of this page
   * @param queryPage query to know the PageType of our page
   */
  getPageDimension(queryPageLayout: any, pageDimension: any, queryPage: any): number[] {
    {
      let numberOfRowsMax = 0;
      let numberOfColsMax = 0;
      let pageLayoutId = 0;

      let pageType: number = queryPage.getAsObject().PageType;

      while (queryPageLayout.step()) {
        const pageLayoutSetting = queryPageLayout.getAsObject().PageLayoutSetting;
        const pageLayoutIdDataBase = queryPageLayout.getAsObject().Id;
        const tabLayoutSetting = pageLayoutSetting.split(',');
        if (pageDimension != null) {
          let tabPageDimension = pageDimension.split(',');
          //Condition for the grid size to match the one specified in the Page table (i.e., the one that specifies a size)
          if (Number(tabLayoutSetting[0]) == Number(tabPageDimension[0]) && Number(tabLayoutSetting[1]) == Number(tabPageDimension[1])) {
            numberOfRowsMax = Number(tabLayoutSetting[1]);
            numberOfColsMax = Number(tabLayoutSetting[0]);
            pageLayoutId = pageLayoutIdDataBase;
            return [numberOfRowsMax, numberOfColsMax, pageLayoutId];
          }
          //Condition for the grid size to match the one specified in the PageSetProperty table
        } else if (Number(tabLayoutSetting[0]) == this.newGrid.NumberOfCols - 1 && Number(tabLayoutSetting[1]) == this.newGrid.NumberOfRows) {
          numberOfRowsMax = Number(tabLayoutSetting[1]);
          numberOfColsMax = Number(tabLayoutSetting[0]);
          pageLayoutId = pageLayoutIdDataBase;
          return [numberOfRowsMax, numberOfColsMax, pageLayoutId];
        }
        //Condition for the dashboard: it differs from the standard, its column is always one higher, it never has a page specialization, so it doesn't fit in the right place.
        else if (pageType == 3 && Number(tabLayoutSetting[1]) == this.newGrid.NumberOfRows) {
          numberOfRowsMax = Number(tabLayoutSetting[1]);
          numberOfColsMax = Number(tabLayoutSetting[0]);
          pageLayoutId = pageLayoutIdDataBase;
          return [numberOfRowsMax, numberOfColsMax, pageLayoutId];
        }
        //Condition to take the largest possible grid size
        else if (numberOfRowsMax <= Number(tabLayoutSetting[1]) && numberOfColsMax <= Number(tabLayoutSetting[0])) {
          numberOfRowsMax = Number(tabLayoutSetting[1]);
          numberOfColsMax = Number(tabLayoutSetting[0]);
          pageLayoutId = pageLayoutIdDataBase;
        }
      }
      return [numberOfRowsMax, numberOfColsMax, pageLayoutId];
    }
  }

  /**
   * checks that each image exists in the image bank and makes the error rate
   */
  statErrorImage() {
    this.newGrid.ImageList.forEach(picture => {
      // @ts-ignore
      const idInArasaac = arasaacJson.filter(item => item.keywords.some(k => k.keyword === picture.ID)).map(item => item._id);
      if (idInArasaac.length == 0) {
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

  /**
   * add the dashboard on every page
   */
  fillPageWithDashboard() {
    let howManyPages: number = 2;

    if (this.myFileNameExtension == "spb") {
      let dashboard: Page = this.newGrid.PageList.find(page => page.UniquePageId == "2");
      this.newGrid.PageList.forEach(page => {
        if (page.UniquePageId != "2") {
          dashboard.ElementIDsList.forEach(el => {
            if (el.includes("goDown") == false) {
              page.ElementIDsList.push(el);
            }
          });
        }
      });
      let goDownIDPage: string = "goDown" + String(howManyPages);
      let dashboardGoDown: Page = this.newGrid.PageList.find(page => page.UniquePageId == "2" && page.ID.includes(goDownIDPage));
      if (dashboardGoDown != undefined) {
        while (dashboardGoDown) {
          this.newGrid.PageList.forEach(page => {
            if (page.UniquePageId != "2" && page.ID.includes(goDownIDPage) == true) {
              dashboardGoDown.ElementIDsList.forEach(el => {
                if (el.includes("goDown") == false) {
                  page.ElementIDsList.push(el);
                }
              });
            }
          });
          howManyPages += 1;
          goDownIDPage = "goDown" + String(howManyPages);
          dashboardGoDown = this.newGrid.PageList.find(page => page.UniquePageId == "2" && page.ID.includes(goDownIDPage));
        }
      }
    }
    if (this.myFileNameExtension == "sps") {
      let dashboard: Page = this.newGrid.PageList.find(page => page.PageType == 3 && !page.ID.includes("goDown"));
      this.newGrid.PageList.forEach(page => {
        if (page.PageType != 3 && page.ID.includes("goDown") == false) {
          dashboard.ElementIDsList.forEach(el => {
            if (el.includes("goDown") == false) {
              page.ElementIDsList.push(el);
            }
          });
        }
      });
      let goDownIDPage: string = "goDown" + String(howManyPages) + "Page";
      let dashboardGoDown: Page = this.newGrid.PageList.find(page => page.PageType == 3 && page.ID.includes(goDownIDPage));
      if (dashboardGoDown != undefined) {
        while (dashboardGoDown) {
          this.newGrid.PageList.forEach(page => {
            if (page.PageType != 3 && page.ID.includes(goDownIDPage) == true) {
              dashboardGoDown.ElementIDsList.forEach(el => {
                if (el.includes("goDown") == false) {
                  page.ElementIDsList.push(el);
                }
              });
            }
          });
          howManyPages += 1;
          goDownIDPage = "goDown" + String(howManyPages);
          dashboardGoDown = this.newGrid.PageList.find(page => page.PageType == 3 && page.ID.includes(goDownIDPage));
        }
      }
    }
  }

  /**
   * This function look at the folder pointed by the GridElement, if the folder doesn't it switch the pointer to HomePage
   */
  switchLinkedPage() {
    this.newGrid.ElementList.forEach(gridElem => {
      if ((gridElem.Type as FolderGoTo).GoTo !== undefined) {
        const pagelinked = this.newGrid.PageList.find(page => page.ID == (gridElem.Type as FolderGoTo).GoTo);
        if (pagelinked == undefined) {
          (gridElem.Type as FolderGoTo).GoTo = "#HOME";
        }
      }
    });
  }
}
