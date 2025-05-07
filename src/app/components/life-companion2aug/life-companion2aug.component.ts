import { Component, OnInit } from '@angular/core';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { BoardService } from '../../services/board.service';
import { Grid, GridElement, Page } from '../../types';
import { LayoutService } from '../../services/layout.service';
import { Router } from '@angular/router';
import scleraJson from '../../../assets/sclera.json';
import parlerPictoJson from '../../../assets/parlerpictos.json';
import arasaacJsonLCC from '../../../assets/arasaacLCC.json';
import fontawesomeJson from '../../../assets/fontawesome.json';
import mulberryJson from '../../../assets/mulberry-symbols-lcc.json';
import {
  arasaacLCCObject,
  fontawesomeObject,
  mulberryObject,
  ParlerPictoObject,
  ScleraObject
} from '../../libTypes';
import { IndexeddbaccessService } from '../../services/indexeddbaccess.service';

@Component({
  selector: 'app-life-companion2aug',
  templateUrl: './life-companion2aug.component.html',
  styleUrls: ['./life-companion2aug.component.css']
})
export class LifeCompanion2augComponent implements OnInit {
  private grid: Grid;
  private page: Page;
  private pageHomeId: string = '';
  private numberErrorImage: number = 0;

  private accessStackGrid: any;
  private isKeyListExist: boolean;

  private wordList: string[] = [];


  private imageImportedFromFile: any[][] = [];

  constructor(private ngxXml2jsonService: NgxXml2jsonService,
    private boardService: BoardService,
    private layoutService: LayoutService,
    private router: Router,
    private indexedDBacess: IndexeddbaccessService) { }

  ngOnInit(): void {
  }

  convert(file) {
    this.isKeyListExist = false;
    let LCConfiguration: any;
    let keyList: any;
    let metadata: any;
    const options = { // set up the default options
      textKey: 'text', // tag name for text nodes
      attrKey: 'attr', // tag for attr groups
      cdataKey: 'cdata', // tag for cdata nodes (ignored if mergeCDATA is true)
    };

    const jsZip = require('jszip');
    jsZip.loadAsync(file[0]).then((zip) => {
      Object.keys(zip.files).forEach((filename) => {
        //console.log("filename : ",filename);
        if (filename.includes('images')) {
          let filenameTab = filename.split("/");
          if (filenameTab[1] !== 'images') {
            zip.files[filename].async('uint8array').then((fileData) => {
              // on créer un blob lisible par le reader
              const blobImage: Blob = new Blob([fileData], { type: "image/png" });

              const reader = new FileReader();
              reader.readAsDataURL(blobImage);

              reader.onload = () => {
                this.imageImportedFromFile.push([filenameTab[1], reader.result]);
              };

            }, () => {
              console.error('error file');
            });
          }
        }
        if (filename === 'lifecompanion-configuration.xml') {
          zip.files[filename].async('string').then((fileData) => {
            LCConfiguration = fileData;
          });
        }
        if (filename === 'keylist/lifecompanion-keylist.xml') {
          zip.files[filename].async('string').then((fileData) => {
            keyList = fileData;
          });
          this.isKeyListExist = true;
        }
        if (filename === 'lifecompanion-configuration-description.xml') {
          zip.files[filename].async('string').then((fileData) => {
            metadata = fileData;
          });
        }
      });
    });
    //give time to read the file
    setTimeout(() => {
      const parser = new DOMParser();
      LCConfiguration = this.ngxXml2jsonService.xmlToJson(parser.parseFromString(LCConfiguration, 'text/xml'));
      keyList = this.ngxXml2jsonService.xmlToJson(parser.parseFromString(keyList, 'text/xml'));
      metadata = this.ngxXml2jsonService.xmlToJson(parser.parseFromString(metadata, 'text/xml'));
      // at this line the file is convert to Json, now we need to read in and extract the grid, elements to do the new grid
      this.jsonToGrid(LCConfiguration, keyList, metadata);
    }, 2000);
  }

  private jsonToGrid(LCConfiguration: any, keyList: any, metadata: any) {
    //console.log('LCConfiguration', LCConfiguration);
    //console.log('keylist', keyList);
    //console.log('metadata', metadata);
    try {
      this.accessStackGrid = LCConfiguration.Component.Components.Component[0].StackGrid.Component;
    } catch (e) {
      this.accessStackGrid = LCConfiguration.Component.Components.Component.StackGrid.Component;
    }
    //console.log('zone utile LCConfiguration : ', this.accessStackGrid);
    this.newGrid(metadata);
    this.setPageHome();
    this.setPages();
    if (this.isKeyListExist) {
      try {
        this.addFromKeyList(keyList);
      }
      catch (e) { }
    }
    this.router.navigate(['keyboard']);
    let that = this;
    setTimeout(function () {
      that.boardService.board = that.grid;
      that.layoutService.refreshAll(that.grid.NumberOfCols, that.grid.NumberOfRows, that.grid.GapSize);
      that.boardService.backHome();
      that.indexedDBacess.update();
      console.log(that.boardService.board);
      that.statErrorImage();
    }, 50);

  }

  // get grid information from fileJson and set it in the new grid
  private newGrid(metadata: any) {
    this.grid = new Grid('importedGrid', 'Grid', 6, 6, [], [], []);
    let date: Date;
    const lastDate: Date = new Date(parseInt(metadata.ConfigurationDescription.attr.lastDate));
    try {
      date = new Date(parseInt(metadata.ConfigurationDescription.ChangelogEntries.attr.when));
    } catch (e) {
      date = lastDate;
    }
    this.grid.creationDate = date.getDate().toString() + '/' + (date.getMonth() + 1).toString() + '/' + date.getFullYear().toString();
    this.grid.modificationDate = lastDate.getDate().toString() + '/' + (lastDate.getMonth() + 1).toString() + '/' + lastDate.getFullYear().toString();
    this.grid.author = metadata.ConfigurationDescription.attr.configurationAuthor;
    this.grid.software = 'LifeCompanion';
    this.grid.GapSize = 5;
  }

  // first page when the file is imported
  private setPageHome() {

    let searchInTreePage: boolean = true;
    let mainPage = this.accessStackGrid;
    while (searchInTreePage) {

      if (typeof mainPage[0] === 'object') {
        mainPage = mainPage[0];
      } else {
        searchInTreePage = false;
      }
    }

    this.page = new Page();
    this.page.ID = '#HOME';
    this.pageHomeId = mainPage.attr.id;
    this.page.Name = 'Accueil';
    this.page.ElementIDsList = [];
    this.page.NumberOfRows = Number(mainPage.Grid.attr.row);
    this.page.NumberOfCols = Number(mainPage.Grid.attr.column);
    this.grid.NumberOfRows = Number(mainPage.Grid.attr.row);
    this.grid.NumberOfCols = Number(mainPage.Grid.attr.column);

    let elementsOfFirstPage: any[] = mainPage.Grid.Component;

    // console.log('vue depuis elementOfFirstPage : ', this.accessStackGrid[0][0].Grid.Component);

    let searchInTree: boolean = true;

    while (searchInTree) {
      let isFolder = false;
      try {
        if (elementsOfFirstPage[1].UseActionManager.UseActionsEvent.UseActions.UseAction[1].attr.nodeType === 'MoveToGridAction') {
          isFolder = true;
          const gridElement = this.createGridButtonElement(elementsOfFirstPage[1], isFolder);
          //add this button to the grid
          this.grid.ElementList.push(gridElement);
          //add this button to the home page
          this.page.ElementIDsList.push(gridElement.ID);
        }
      } catch (e) {
        try {
          if (elementsOfFirstPage[1].UseActionManager.UseActionsEvent.UseActions.UseAction.attr.nodeType === 'MoveToGridAction') {
            isFolder = true;
            const gridElement = this.createGridButtonElement(elementsOfFirstPage[1], isFolder);
            //add this button to the grid
            this.grid.ElementList.push(gridElement);
            //add this button to the home page
            this.page.ElementIDsList.push(gridElement.ID);
          }
        } catch (e) {
          isFolder = false;
        }
        try {
          if (!isFolder) {
            const gridElement = this.createGridButtonElement(elementsOfFirstPage[1], isFolder);
            //add this button to the grid
            this.grid.ElementList.push(gridElement);
            //add this button to the home page
            this.page.ElementIDsList.push(gridElement.ID);
          }
        } catch (e) { }
      }

      //go next Page if exist
      if (typeof elementsOfFirstPage[0] === 'object') {
        elementsOfFirstPage = elementsOfFirstPage[0];
      } else {
        let isFolder = false;
        try {
          if (elementsOfFirstPage[1].UseActionManager.UseActionsEvent.UseActions.UseAction[1].attr.nodeType === 'MoveToGridAction') {
            isFolder = true;
            const gridElement = this.createGridButtonElement(elementsOfFirstPage, isFolder);
            //add this button to the grid
            this.grid.ElementList.push(gridElement);
            //add this button to the home page
            this.page.ElementIDsList.push(gridElement.ID);
          }
        } catch (e) {
          try {
            if (elementsOfFirstPage[1].UseActionManager.UseActionsEvent.UseActions.UseAction.attr.nodeType === 'MoveToGridAction') {
              isFolder = true;
              const gridElement = this.createGridButtonElement(elementsOfFirstPage, isFolder);
              //add this button to the grid
              this.grid.ElementList.push(gridElement);
              //add this button to the home page
              this.page.ElementIDsList.push(gridElement.ID);
            }
          } catch (e) {
            isFolder = false;
          }
          try {
            if (!isFolder) {
              const gridElement = this.createGridButtonElement(elementsOfFirstPage, isFolder);
              //add this button to the grid
              this.grid.ElementList.push(gridElement);
              //add this button to the home page
              this.page.ElementIDsList.push(gridElement.ID);
            }
          } catch (e) { }
        }

        searchInTree = false;
      }
    }
    // add homepage to the grid
    this.grid.PageList.push(this.page);
  }

  private createGridButtonElement(element: any, isFolder: boolean) {
    let backgroundColorJson: string[];
    try {
      backgroundColorJson = element.KeyCompStyle.attr.backgroundColor.split(';');
      // didn't get splitted because their is no ; in the file
      if (backgroundColorJson.length === 1) {
        const backgroundColorJsonHash = element.KeyCompStyle.attr.backgroundColor.split('');
        backgroundColorJson.shift();
        backgroundColorJson.push(String(parseInt(backgroundColorJsonHash[1] + backgroundColorJsonHash[2], 16)), String(parseInt(backgroundColorJsonHash[3] + backgroundColorJsonHash[4], 16)), String(parseInt(backgroundColorJsonHash[5] + backgroundColorJsonHash[6], 16)));
      }
    } catch (e) {
      backgroundColorJson = "255;255;255".split(';');
    }
    const rb = Number(backgroundColorJson[0]);
    const gb = Number(backgroundColorJson[1]);
    const bb = Number(backgroundColorJson[2]);

    let gridElement: GridElement;
    if (isFolder) {
      let targetPageId: any;
      try {
        targetPageId = element.UseActionManager.UseActionsEvent.UseActions.UseAction.attr.targetGridId;
      } catch (e) {
        targetPageId = element.UseActionManager.UseActionsEvent.UseActions.UseAction[1].attr.targetGridId;
      }
      if (targetPageId === this.pageHomeId) {
        targetPageId = '#HOME';
      }
      gridElement = new GridElement(element.attr.id,
        { GoTo: targetPageId },
        '',
        'rgb(' + rb + ',' + gb + ',' + bb + ')',
        '',
        0,
        [
          {
            DisplayedText: element.attr.textContent,
            VoiceText: element.attr.textContent,
            LexicInfos: [{ default: true }],
            ImageID: element.attr.imageId2 ? element.attr.imageId2 : '',
          }
        ], [{ ID: 'click', ActionList: [{ ID: 'display', Options: [] }, { ID: 'say', Options: [] }] }]);
    } else {
      gridElement = new GridElement(element.attr.id,
        'button',
        '',
        'rgb(' + rb + ',' + gb + ',' + bb + ')',
        '',
        0,
        [
          {
            DisplayedText: element.attr.textContent,
            VoiceText: element.attr.textContent,
            LexicInfos: [{ default: true }],
            ImageID: element.attr.imageId2 ? element.attr.imageId2 : '',
          }
        ], [{ ID: 'click', ActionList: [{ ID: 'display', Options: [] }, { ID: 'say', Options: [] }] }]);
    }

    gridElement.x = Number(element.attr.column);
    gridElement.y = Number(element.attr.row);
    gridElement.rows = Number(element.attr.rowSpan);
    gridElement.cols = Number(element.attr.columnSpan);
    this.addImageButtonFullLibrary(element);

    return gridElement;
  }

  private getPathImageFromLibraries(idImage: any): string {
    if (idImage !== undefined) {
      //sclera
      let index = (scleraJson as unknown as ScleraObject).images.findIndex(word => {
        return idImage === word.id;
      });
      if (index > -1) {
        return 'assets/libs/sclera/' + (scleraJson as unknown as ScleraObject).images[index].id + '.png';
      }
      //parlerPicto
      index = (parlerPictoJson as unknown as ParlerPictoObject).images.findIndex(word => {
        return idImage === word.id;
      });
      if (index > -1) {
        return 'assets/libs/parlerpictos/' + (parlerPictoJson as unknown as ParlerPictoObject).images[index].id + '.png';
      }
      // ca commence ici
      //arasaac-lifecompanion
      index = (arasaacJsonLCC as unknown as arasaacLCCObject).images.findIndex(word => {
        return idImage === word.id;
      });
      if (index > -1) {
        return 'assets/libs/arasaac/' + (arasaacJsonLCC as unknown as arasaacLCCObject).images[index].id + '.png';
      }
      //mulberry-lifecompanion
      index = (mulberryJson as unknown as mulberryObject).images.findIndex(word => {
        return idImage === word.id;
      });
      if (index > -1) {
        return 'assets/libs/mulberry-symbols-lcc/' + (mulberryJson as unknown as mulberryObject).images[index].id + '.png';
      }
      //fontawesome
      index = (fontawesomeJson as unknown as fontawesomeObject).images.findIndex(word => {
        return idImage === word.id;
      });
      if (index > -1) {
        return 'assets/libs/fontawesome/' + (fontawesomeJson as unknown as fontawesomeObject).images[index].id + '.png';
      }
      //search in imageImportedFromFile from lifecompanion
      index = this.imageImportedFromFile.findIndex(nameImage => {
        const nameImageSplit = nameImage[0].split('.');
        //console.log('nameImage : ',nameImageSplit[0]);
        return idImage === nameImageSplit[0];
      })
      //console.log('index : ',index);
      if (index > -1) {
        return this.imageImportedFromFile[index][1];
      }

    }
    return '';
  }

  private addImageButtonFullLibrary(element: any) {
    let pathImage: string;

    if (element.attr.imageId2 === undefined) {
      if (element.attr.textContent !== undefined) {
        //element.attr.imageId2 = element.attr.textContent;
        pathImage = this.getPathImageFromLibraries(element.attr.textContent);
        this.grid.ImageList.push({
          ID: element.attr.textContent,
          OriginalName: element.attr.textContent,
          Path: pathImage !== undefined ? pathImage : '',
        });
      }
      else {
        //element.attr.imageId2 = element.attr.text;
        pathImage = this.getPathImageFromLibraries(element.attr.text);
        this.grid.ImageList.push({
          ID: element.attr.text,
          OriginalName: element.attr.text,
          Path: pathImage !== undefined ? pathImage : '',
        });
      }
    }
    else {
      if (element.attr.textContent !== undefined) {
        pathImage = this.getPathImageFromLibraries(element.attr.imageId2);
        this.grid.ImageList.push({
          ID: element.attr.imageId2,
          OriginalName: element.attr.textContent,
          Path: pathImage !== undefined ? pathImage : '',
        });
      } else {
        pathImage = this.getPathImageFromLibraries(element.attr.imageId2);
        this.grid.ImageList.push({
          ID: element.attr.imageId2,
          OriginalName: element.attr.text,
          Path: pathImage !== undefined ? pathImage : '',
        });
      }
    }
  }

  private setPages() {

    let pagesInJson: any[] = this.accessStackGrid;

    let searchInTreePage: boolean = true;
    while (searchInTreePage) {
      if (typeof pagesInJson[0] === 'object') {
        this.pagesToGrid(pagesInJson);

        let elements: any[] = pagesInJson[1].Grid.Component;

        // console.log('new page view : ', elements);

        let searchInTree: boolean = true;

        while (searchInTree) {
          let isFolder = false;
          try {
            if (elements[1].UseActionManager.UseActionsEvent.UseActions.UseAction[1].attr.nodeType === 'MoveToGridAction') {
              isFolder = true;
              const gridElement = this.createGridButtonElement(elements[1], isFolder);
              //add this button to the grid
              this.grid.ElementList.push(gridElement);
              //add this button to the home page
              this.page.ElementIDsList.push(gridElement.ID);
            }
          } catch (e) {
            try {
              if (elements[1].UseActionManager.UseActionsEvent.UseActions.UseAction.attr.nodeType === 'MoveToGridAction') {
                isFolder = true;
                const gridElement = this.createGridButtonElement(elements[1], isFolder);
                //add this button to the grid
                this.grid.ElementList.push(gridElement);
                //add this button to the home page
                this.page.ElementIDsList.push(gridElement.ID);
              }
            } catch (e) {
              isFolder = false;
            }
            try {
              if (!isFolder) {
                const gridElement = this.createGridButtonElement(elements[1], isFolder);
                //add this button to the grid
                this.grid.ElementList.push(gridElement);
                //add this button to the home page
                this.page.ElementIDsList.push(gridElement.ID);
              }
            } catch (e) { }
          }

          //go next Page if exist
          if (typeof elements[0] === 'object') {
            elements = elements[0];
          } else {
            let isFolder = false;
            try {
              if (elements[1].UseActionManager.UseActionsEvent.UseActions.UseAction[1].attr.nodeType === 'MoveToGridAction') {
                isFolder = true;
                const gridElement = this.createGridButtonElement(elements, isFolder);
                //add this button to the grid
                this.grid.ElementList.push(gridElement);
                //add this button to the home page
                this.page.ElementIDsList.push(gridElement.ID);
              }
            } catch (e) {
              try {
                if (elements[1].UseActionManager.UseActionsEvent.UseActions.UseAction.attr.nodeType === 'MoveToGridAction') {
                  isFolder = true;
                  const gridElement = this.createGridButtonElement(elements, isFolder);
                  //add this button to the grid
                  this.grid.ElementList.push(gridElement);
                  //add this button to the home page
                  this.page.ElementIDsList.push(gridElement.ID);
                }
              } catch (e) {
                isFolder = false;
              }
              try {
                if (!isFolder) {
                  const gridElement = this.createGridButtonElement(elements, isFolder);
                  //add this button to the grid
                  this.grid.ElementList.push(gridElement);
                  //add this button to the home page
                  this.page.ElementIDsList.push(gridElement.ID);
                }
              } catch (e) { }
            }

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

  private pagesToGrid(pagesInJson: any) {
    this.page = new Page();
    this.page.ID = pagesInJson[1].attr.id;
    this.page.Name = pagesInJson[1].attr.userName;
    this.page.ElementIDsList = [];
    this.page.NumberOfRows = Number(pagesInJson[1].Grid.attr.row);
    this.page.NumberOfCols = Number(pagesInJson[1].Grid.attr.column);
  }

  statErrorImage() {
    this.grid.ImageList.forEach(picture => {


      if (picture.Path === '') {
        this.numberErrorImage = this.numberErrorImage + 1;
      }
    });
    console.log('pourcentage de bouton sans image : ', this.numberErrorImage / this.grid.ImageList.length * 100);
  }

  //add every buttons form keyList file
  private addFromKeyList(keyList: any) {
    let treeKeyList = keyList.KeyListNode.KeyListNode;


    let searchInTreeKeyList = true;
    let searchInSubTreeKeyList = true;

    let indexOfInTreeKeyList = -1;

    while (searchInTreeKeyList) {
      let subtreeKeyList: any;
      try {
        subtreeKeyList = treeKeyList[1].KeyListNode;
      } catch (e) {
      }
      //si l'élément est un noeud donc un dossier on vérifie que cet élément existe déjà, si oui on le modifie pour le transformer en bouton dossier, si non on le créer
      try {
        if (treeKeyList[1].attr.nodeType === 'KeyListNode') {
          for (let i = 0; i < this.grid.ElementList.length; i++) {
            indexOfInTreeKeyList = this.grid.ElementList[i].ElementFormsList[0].DisplayedText.indexOf(treeKeyList[1].attr.text);
            if (indexOfInTreeKeyList !== -1) {
              this.grid.ElementList[i].Type = { GoTo: treeKeyList[1].attr.id };
              this.setPagesFromKeyList(treeKeyList);
              //si on a trouvé le mot recherché inutile de continuer la boucle donc break
              break;
            }
          }
          if (indexOfInTreeKeyList === -1) {
            this.createGridButtonElementFromKeyList(treeKeyList[1], true);
            this.setPagesFromKeyList(treeKeyList);
          }
          //ajouter les boutons du dossier repéré
          searchInSubTreeKeyList = true;
          while (searchInSubTreeKeyList) {
            try {
              //console.log('subtreeKeyList : ',subtreeKeyList);
              this.createGridButtonElementFromKeyList(subtreeKeyList[1], false);
            } catch (e) {
              this.createGridButtonElementFromKeyList(subtreeKeyList, false);
            }

            if (typeof subtreeKeyList[0] === 'object') {
              subtreeKeyList = subtreeKeyList[0];
              this.addPageIfNecessary();
            } else {
              searchInSubTreeKeyList = false;
            }
          }
        }

      } catch (e) { }

      if (typeof treeKeyList[0] === 'object') {
        treeKeyList = treeKeyList[0];
      } else {
        searchInTreeKeyList = false;
      }
    }
  }

  private setPagesFromKeyList(treeKeyList: any) {
    this.page = new Page();
    this.page.ID = treeKeyList[1].attr.id;
    this.page.Name = treeKeyList[1].attr.text;
    this.page.ElementIDsList = [];

    this.grid.PageList.push(this.page);
  }

  private createGridButtonElementFromKeyList(treeKeyListElement: any, isFolder: boolean) {
    let backgroundColorJson: string[];
    try {
      backgroundColorJson = treeKeyListElement.KeyCompStyle.attr.backgroundColor.split(';');
    } catch (e) {
      backgroundColorJson = "255;255;255;1.0".split(';');
    }
    const rb = Number(backgroundColorJson[0]);
    const gb = Number(backgroundColorJson[1]);
    const bb = Number(backgroundColorJson[2]);

    let gridElement: GridElement;

    if (isFolder) {
      gridElement = new GridElement(treeKeyListElement.attr.id,
        { GoTo: treeKeyListElement.attr.text },
        '',
        'rgb(' + rb + ',' + gb + ',' + bb + ')',
        '',
        0,
        [
          {
            DisplayedText: treeKeyListElement.attr.text,
            VoiceText: treeKeyListElement.attr.text,
            LexicInfos: [{ default: true }],
            ImageID: treeKeyListElement.attr.imageId2 ? treeKeyListElement.attr.imageId2 : '',
          }
        ], [{ ID: 'click', ActionList: [{ ID: 'display', Options: [] }, { ID: 'say', Options: [] }] }]);
    } else {
      gridElement = new GridElement(treeKeyListElement.attr.id,
        'button',
        '',
        'rgb(' + rb + ',' + gb + ',' + bb + ')',
        '',
        0,
        [
          {
            DisplayedText: treeKeyListElement.attr.text,
            VoiceText: treeKeyListElement.attr.text,
            LexicInfos: [{ default: true }],
            ImageID: treeKeyListElement.attr.imageId2 ? treeKeyListElement.attr.imageId2 : '',
          }
        ], [{ ID: 'click', ActionList: [{ ID: 'display', Options: [] }, { ID: 'say', Options: [] }] }]);
    }
    if (gridElement.ElementFormsList[0].ImageID === undefined) {
      gridElement.ElementFormsList[0].ImageID = '';
    }
    this.addImageButtonFullLibrary(treeKeyListElement);
    this.grid.ElementList.push(gridElement);
    this.page.ElementIDsList.push(gridElement.ID);
  }

  private addPageIfNecessary() {
    if (this.page.NumberOfCols !== undefined && this.page.NumberOfRows !== undefined) {
      if (this.page.NumberOfRows * this.page.NumberOfCols - 1 === this.page.ElementIDsList.length) {
        let nextPage: Page = new Page();
        nextPage.ID = this.page.ID + '1';
        nextPage.Name = this.page.Name + '1';
        nextPage.NumberOfCols = this.page.NumberOfCols;
        nextPage.NumberOfRows = this.page.NumberOfRows;
        nextPage.ElementIDsList = [];
        this.addButtonNextPage(nextPage);
        this.page = nextPage;
        this.grid.PageList.push(this.page);
      }
    } else {
      if (this.grid.NumberOfCols * this.grid.NumberOfCols - 1 === this.page.ElementIDsList.length) {
        let nextPage: Page = new Page();
        nextPage.ID = this.page.ID + '1';
        nextPage.Name = this.page.Name + '1';
        nextPage.ElementIDsList = [];
        this.addButtonNextPage(nextPage);
        this.page = nextPage;
        this.grid.PageList.push(this.page);
      }
    }

  }

  // add the button "Page suivante" at the bottom right of full pages
  private addButtonNextPage(nextPage: Page) {
    const buttonNextPage = new GridElement(this.page.ID + 'NextPage',
      { GoTo: nextPage.ID },
      '',
      '',
      '',
      0,
      [
        {
          DisplayedText: 'Page suivante',
          VoiceText: '',
          LexicInfos: [{ default: true }],
          ImageID: '',
        }
      ], [{ ID: 'click', ActionList: [{ ID: 'display', Options: [] }, { ID: 'say', Options: [] }] }]);
    this.grid.ElementList.push(buttonNextPage);
    this.page.ElementIDsList.push(buttonNextPage.ID);
  }
}
