import { Component, OnInit } from '@angular/core';
import {NgxXmlToJsonService} from 'ngx-xml-to-json';
import {BoardService} from '../../services/board.service';
import {Grid, GridElement, Page} from '../../types';
import {LayoutService} from '../../services/layout.service';
import {Router} from '@angular/router';
import arasaacColoredJson from '../../../assets/arasaac-color-symbol-info.json';
import {ArasaacObject} from '../../libTypes';

@Component({
  selector: 'app-life-companion2aug',
  templateUrl: './life-companion2aug.component.html',
  styleUrls: ['./life-companion2aug.component.css']
})
export class LifeCompanion2augComponent implements OnInit {
  private folder: string[] = [];
  private grid: Grid;
  private pageHome: Page;

  constructor(private ngxXmlToJsonService: NgxXmlToJsonService,
              private boardService: BoardService,
              private layoutService: LayoutService,
              private router: Router) {}

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
    console.log('test : ', fileJson.Component.Components.Component.StackGrid.Component.Grid);
    this.newGrid(fileJson);
    this.setPageHome(fileJson);
    this.boardService.board = this.grid;
    this.layoutService.refreshAll(this.grid.NumberOfCols,this.grid.NumberOfRows, this.grid.GapSize);
    this.boardService.backHome();
    this.router.navigate(['keyboard']);
    console.log(this.boardService.board);
  }
  // get grid information from fileJson and set it in the new grid
  private newGrid(fileJson: any) {
    this.grid = new Grid('importedGrid','Grid',fileJson.Component.Components.Component.StackGrid.Component.Grid.attr.column,fileJson.Component.Components.Component.StackGrid.Component.Grid.attr.row,[],[],[]);
  }

  // first page when the file is imported
  private setPageHome(fileJson: any){
    this.pageHome = new Page();
    this.pageHome.ID = '#HOME';
    this.pageHome.Name = 'Accueil';
    this.pageHome.ElementIDsList = [];

    const elementsOfFirstPage: any[] = fileJson.Component.Components.Component.StackGrid.Component.Grid.Component;
    // pour l'instant on ne s'occupe que des boutons et pas des dossiers
    elementsOfFirstPage.forEach(element => {
      if(typeof element[0] === 'object'){
        element.forEach(subElement => {
          const gridElement = this.createGridButtonElement(subElement);
          //add this button to the grid
          this.grid.ElementList.push(gridElement);
          this.pageHome.ElementIDsList.push(gridElement.ID);
        });
      }else{
        const gridElement = this.createGridButtonElement(element);
        //add this button to the grid
        this.grid.ElementList.push(gridElement);
        //add this button to the home page
        this.pageHome.ElementIDsList.push(gridElement.ID);
      }
    });
    // ajouter la page à la grille
    this.grid.PageList.push(this.pageHome);
  }

  createGridButtonElement(element: any){
    const gridElement = new GridElement(element.attr.id,
      'button',
      '',
      '',
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
    gridElement.x = element.attr.row;
    gridElement.y = element.attr.column;
    gridElement.rows = 1;
    gridElement.cols = 1;
    this.addImageButton(element);

    return gridElement;
  }

  private getPathImageArsaacLibrary(textContent: any): string {
    if (textContent !== null) {
      const index = (arasaacColoredJson as unknown as ArasaacObject)[0].wordList.findIndex(word => {
        return textContent.toLowerCase() === word.toLowerCase();
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
      Path: pathImage,
    });
  }
}
