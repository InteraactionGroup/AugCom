import {Component, OnInit} from '@angular/core';
import {NgxXmlToJsonService} from 'ngx-xml-to-json';
import {BoardService} from '../../services/board.service';
import {Grid, GridElement, Page} from '../../types';
import {LayoutService} from '../../services/layout.service';
import {Router} from '@angular/router';
import arasaacColoredJson from '../../../assets/arasaac-color-symbol-info.json';
import {ArasaacObject} from '../../libTypes';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';

@Component({
  selector: 'app-life-companion2aug',
  templateUrl: './life-companion2aug.component.html',
  styleUrls: ['./life-companion2aug.component.css']
})
export class LifeCompanion2augComponent implements OnInit {
  private folder: string[] = [];
  private grid: Grid;
  private page: Page;
  private pageHomeId:string = '';

  constructor(private ngxXmlToJsonService: NgxXmlToJsonService,
              private boardService: BoardService,
              private layoutService: LayoutService,
              private router: Router,
              private indexedDBacess: IndexeddbaccessService) {}

  ngOnInit(): void {
  }

  convert(file) {
    this.folder = [];
    //this.fileData = "";
    const options = { // set up the default options
      textKey: 'text', // tag name for text nodes
      attrKey: 'attr', // tag for attr groups
      cdataKey: 'cdata', // tag for cdata nodes (ignored if mergeCDATA is true)
    };
    const jsZip = require('jszip');
    jsZip.loadAsync(file[0]).then((zip) => {
      Object.keys(zip.files).forEach((filename) => {
        if(filename === 'lifecompanion-configuration.xml'){
          zip.files[filename].async('string').then((fileData) => {
            this.folder.push(fileData);
          });
        }
      });
    });
    //give time to read the file
    setTimeout(()=> {
      const fileJson = this.ngxXmlToJsonService.xmlToJson(this.folder[0], options);
      // at this line the file is convert to Json, now we need to read in and extract the grid, elements to do the new grid
      this.jsonToGrid(fileJson);
      },200);

  }

  private jsonToGrid(fileJson: any) {
    console.log('fileJson', fileJson);
    console.log('test : ', fileJson.Component.Components.Component[0].StackGrid.Component);
    this.newGrid(fileJson);
    this.setPageHome(fileJson);
    this.setPages(fileJson);
    this.router.navigate(['keyboard']);
    let that = this;
    setTimeout(function() {
      that.boardService.board = that.grid;
      that.layoutService.refreshAll(that.grid.NumberOfCols,that.grid.NumberOfRows, that.grid.GapSize);
      that.boardService.backHome();
      that.indexedDBacess.update();
      console.log(that.boardService.board);
    },50);

  }

  // get grid information from fileJson and set it in the new grid
  private newGrid(fileJson: any) {
    this.grid = new Grid('importedGrid','Grid',fileJson.Component.Components.Component[0].StackGrid.Component[0][0].Grid.attr.column,fileJson.Component.Components.Component[0].StackGrid.Component[0][0].Grid.attr.row,[],[],[]);
    this.grid.GapSize = 5;
  }

  // first page when the file is imported
  private setPageHome(fileJson: any){
    this.page = new Page();
    this.page.ID = '#HOME';
    this.pageHomeId = fileJson.Component.Components.Component[0].StackGrid.Component[0][0].attr.id;
    this.page.Name = 'Accueil';
    this.page.ElementIDsList = [];
    this.page.NumberOfRows = fileJson.Component.Components.Component[0].StackGrid.Component[0][0].Grid.attr.row;
    this.page.NumberOfCols = fileJson.Component.Components.Component[0].StackGrid.Component[0][0].Grid.attr.column;

    let elementsOfFirstPage: any[] = fileJson.Component.Components.Component[0].StackGrid.Component[0][0].Grid.Component;
    // pour l'instant on ne s'occupe que des boutons et pas des dossiers
    console.log('vue depuis elementOfFirstPage : ', fileJson.Component.Components.Component[0].StackGrid.Component[0][0].Grid.Component);

    let searchInTree: boolean = true;

    while (searchInTree) {
      let isFolder = false;
      try {
        if (elementsOfFirstPage[1].UseActionManager.UseActionsEvent.UseActions.UseAction[1].attr.nodeType === 'MoveToGridAction') {
          isFolder = true;
          const gridElement = this.createGridButtonElement(fileJson, elementsOfFirstPage[1], isFolder);
          //add this button to the grid
          this.grid.ElementList.push(gridElement);
          //add this button to the home page
          this.page.ElementIDsList.push(gridElement.ID);
        }
      }catch (e) {
        try {
          if (elementsOfFirstPage[1].UseActionManager.UseActionsEvent.UseActions.UseAction.attr.nodeType === 'MoveToGridAction') {
            isFolder = true;
            const gridElement = this.createGridButtonElement(fileJson, elementsOfFirstPage[1], isFolder);
            //add this button to the grid
            this.grid.ElementList.push(gridElement);
            //add this button to the home page
            this.page.ElementIDsList.push(gridElement.ID);
          }
        } catch (e) {
          isFolder = false;
          try {
            const gridElement = this.createGridButtonElement(fileJson, elementsOfFirstPage[1], isFolder);
            //add this button to the grid
            this.grid.ElementList.push(gridElement);
            //add this button to the home page
            this.page.ElementIDsList.push(gridElement.ID);
          } catch (e) {
          }
        }
      }

      //go next Page if exist
      if (typeof elementsOfFirstPage[0] === 'object') {
        elementsOfFirstPage = elementsOfFirstPage[0];
      } else {
        searchInTree = false;
      }
    }
    // add homepage to the grid
    this.grid.PageList.push(this.page);
  }

  private createGridButtonElement(fileJson: any, element: any, isFolder: boolean){
    let backgroundColorJson: string[];
    try {
      backgroundColorJson = element.KeyCompStyle.attr.backgroundColor.split(';');
    }catch (e){
      backgroundColorJson = "255;255;255;1.0".split(';');
    }
    const rb = Number(backgroundColorJson[0]);
    const gb = Number(backgroundColorJson[1]);
    const bb = Number(backgroundColorJson[2]);

    let gridElement: GridElement;
    if(isFolder){
      let targetPageId:any;
      try{
        targetPageId = element.UseActionManager.UseActionsEvent.UseActions.UseAction.attr.targetGridId;
      }catch (e) {
        targetPageId = element.UseActionManager.UseActionsEvent.UseActions.UseAction[1].attr.targetGridId;
      }
      if(targetPageId === this.pageHomeId){
        targetPageId = '#HOME';
      }
      gridElement = new GridElement(element.attr.id,
        {GoTo: targetPageId},
        '',
        'rgb('+rb+','+gb+','+bb+')',
        '',
        0,
        [
          {
            DisplayedText: element.attr.textContent,
            VoiceText: element.attr.textContent,
            LexicInfos: [{default: true}],
            ImageID: element.attr.textContent,
          }
        ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}]);
    }else{
      gridElement = new GridElement(element.attr.id,
        'button',
        '',
        'rgb('+rb+','+gb+','+bb+')',
        '',
        0,
        [
          {
            DisplayedText: element.attr.textContent,
            VoiceText: element.attr.textContent,
            LexicInfos: [{default: true}],
            ImageID: element.attr.textContent,
          }
        ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}, {ID: 'say', Options: []}]}]);
    }

    gridElement.x = Number(element.attr.column);
    gridElement.y = Number(element.attr.row);
    gridElement.rows = Number(element.attr.rowSpan);
    gridElement.cols = Number(element.attr.columnSpan);
    this.addImageButton(element);

    return gridElement;
  }

  private getPathImageArsaacLibrary(textContent: any): string {
    if (textContent !== null) {
      const index = (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.findIndex(word => {
        return textContent.toLowerCase().trim() === word.toLowerCase();
      });
      if (index > -1) {
        return 'assets/libs/FR_Pictogrammes_couleur/' + (arasaacColoredJson as unknown as ArasaacObject)[0].wordList[index] + '.png';
      }
    }
  }

  private addImageButton(element: any){
    const pathImage = this.getPathImageArsaacLibrary(element.attr.textContent);
    this.grid.ImageList.push({
      ID: element.attr.textContent,
      OriginalName: element.attr.textContent,
      Path: pathImage !== undefined? pathImage : '',
    });
  }

  private setPages(fileJson: any) {

    let pagesInJson: any[] = fileJson.Component.Components.Component[0].StackGrid.Component;

    let searchInTreePage:boolean = true;
    while (searchInTreePage) {

      if (typeof pagesInJson[0] === 'object') {
        this.pagesToGrid(pagesInJson);

        let elements: any[] = pagesInJson[1].Grid.Component;

        let searchInTree: boolean = true;

        while (searchInTree) {
          let isFolder = false;
          try {
            if (elements[1].UseActionManager.UseActionsEvent.UseActions.UseAction[1].attr.nodeType === 'MoveToGridAction') {
              isFolder = true;
              const gridElement = this.createGridButtonElement(fileJson, elements[1], isFolder);
              //add this button to the grid
              this.grid.ElementList.push(gridElement);
              //add this button to the home page
              this.page.ElementIDsList.push(gridElement.ID);
            }
          }catch (e) {
            try {
              if (elements[1].UseActionManager.UseActionsEvent.UseActions.UseAction.attr.nodeType === 'MoveToGridAction') {
                isFolder = true;
                const gridElement = this.createGridButtonElement(fileJson, elements[1], isFolder);
                //add this button to the grid
                this.grid.ElementList.push(gridElement);
                //add this button to the home page
                this.page.ElementIDsList.push(gridElement.ID);
              }
            } catch (e) {
              isFolder = false;
              try {
                const gridElement = this.createGridButtonElement(fileJson, elements[1], isFolder);
                //add this button to the grid
                this.grid.ElementList.push(gridElement);
                //add this button to the home page
                this.page.ElementIDsList.push(gridElement.ID);
              } catch (e) {
              }
            }
          }

          //go next Page if exist
          if (typeof elements[0] === 'object') {
            elements = elements[0];
          } else {
            searchInTree = false;
          }
        }

        // add homepage to the grid
        this.grid.PageList.push(this.page);
        pagesInJson = pagesInJson[0];

      } else {
        searchInTreePage = false;
      }
    }
  }

  private pagesToGrid(pagesInJson: any){
    this.page = new Page();
    this.page.ID = pagesInJson[1].attr.id;
    this.page.Name = pagesInJson[1].attr.userName;
    this.page.ElementIDsList = [];
    this.page.NumberOfRows = pagesInJson[1].Grid.attr.row;
    this.page.NumberOfCols = pagesInJson[1].Grid.attr.column;
  }
}
