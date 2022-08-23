import {Component, OnInit} from '@angular/core';
import {BoardService} from '../../services/board.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {GeticonService} from '../../services/geticon.service';
import * as JSZip from 'jszip';
import {Router} from '@angular/router';
import {PrintService} from '../../services/print.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {SpeakForYourselfParser} from '../../services/speakForYourselfParser';
import {HttpClient} from '@angular/common/http';
import {Ng2ImgMaxService} from 'ng2-img-max';
import {FolderGoTo, Grid, GridElement, Image, Page, User} from '../../types';
import {ProloquoParser} from '../../services/proloquoParser';
import {JsonValidatorService} from '../../services/json-validator.service';
import {MultilinguismService} from '../../services/multilinguism.service';
import {MatDialog} from "@angular/material/dialog";
import {ExportSaveDialogComponent} from "../export-save-dialog/export-save-dialog.component";
import {ExportManagerService} from "../../services/export-manager.service";
import {LayoutService} from "../../services/layout.service";
import {DialogExportPagesComponent} from "../dialog-export-pages/dialog-export-pages.component";
import {UserPageService} from "../../services/user-page.service";
import {PaletteService} from "../../services/palette.service";
import {ConfigurationService} from "../../services/configuration.service";
import {ExportSaveUserDialogComponent} from "../export-save-user-dialog/export-save-user-dialog.component";

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css'],
  providers: [HttpClient, Ng2ImgMaxService]
})
export class ShareComponent implements OnInit {
  constructor(
    public speakForYourselfParser: SpeakForYourselfParser,
    public indexedDBacess: IndexeddbaccessService,
    public printService: PrintService,
    public http: HttpClient,
    public router: Router,
    public getIconService: GeticonService,
    public boardService: BoardService,
    public userToolBarService: UsertoolbarService,
    public proloquoParser: ProloquoParser,
    public jsonValidator: JsonValidatorService,
    public multilinguism: MultilinguismService,
    public layoutService: LayoutService,
    public exportManagerService: ExportManagerService,
    public userPageService: UserPageService,
    public dialog: MatDialog,
    public paletteService: PaletteService,
    public configurationService:ConfigurationService) {
  }

  ngOnInit() {
  }

  pageIDToExport:string;
  pageToExportList:Page[] = [];
  pageToExport:Page;
  gridElementOfPage:GridElement[] = [];
  imageListOfPage:Image[] = [];

  /*open a new tab and display the grid in a "ready to print" format*/
  printToPDF() {
    this.userToolBarService.edit = false;
    this.printService.printDiv();
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

  /*read CSV file of csv reader and open it as a grid*/
  parseAndCreateSpeak4YourselfGrid() {
    this.speakForYourselfParser.createGridSpeak4YourselfCSV();
  }

  /*read CSV file of csv reader and open it as a grid*/
  parseAndCreateProloquoGrid() {
    this.proloquoParser.createGridFromProloquoCSVs();
  }

  /**
   * explore the zip file e containing only images and folders and create elements and images in the board
   * using the image and image name to respectively create imageUrl and element name and keep the same tree aspect
   * @param zip the zip file returned by the file explorer
   */
  exploreZip(zip) { // TODO change the folderPath implementation
    const zipFolder: JSZip = new JSZip();
    zipFolder.loadAsync(zip[0]).then((zipFiles) => {
      this.boardService.board.PageList = [];
      this.boardService.board.ElementList = [];
      this.boardService.board.ImageList = [];
      zipFiles.forEach((fileName) => {
          if (fileName[fileName.length - 1] !== '/') {
            zipFolder
              .file(fileName)
              .async('base64')
              .then((content) => {
                const split = fileName.split('.');
                let fileType = split[split.length - 1];

                if (fileType !== null && fileType !== undefined) {
                  if (fileType === 'svg') {
                    fileType = 'svg+xml';
                  }
                  const imageURL =
                    'data:image/' + fileType + ';base64,' + content;

                  const folder = split[split.length - 2];
                  if (folder !== null && folder !== undefined) {
                    let folderPath = folder.split('/');

                    const name = folderPath[folderPath.length - 1];

                    let path = '';
                    folderPath = folderPath.slice(0, folderPath.length - 1);
                    folderPath.forEach((s) => {
                      path = path + '.' + s;
                    });

                    let type;
                    if (folderPath.length === 0) {
                      type = new FolderGoTo(name);
                    } else {
                      type = 'button';
                    }
                    this.createNewButtonFromInfoInZIP(name, imageURL, path, type);

                  }
                }
              });
          } else {
            const imageURL = 'assets/libs/mulberry-symbols/EN-symbols/computer_folder_open_,_to.svg';
            let splitName = fileName.split('/');
            const name = splitName[splitName.length - 2];
            let path = '';
            splitName = splitName.slice(0, splitName.length - 2);
            if (splitName.length === 0) {
              path = '.';
            }
            splitName.forEach(s => {
              path = path + '.' + s;
            });
            this.createNewButtonFromInfoInZIP(name, imageURL, path, new FolderGoTo(name));
          }
        }
      );
    });

    this.indexedDBacess.update();
    this.router.navigate(['keyboard']);

  }


  exploreAugcomZip(zip) { // TODO change the folderPath implementation
    const zipFolder: JSZip = new JSZip();
    //let tempBoard;
    zipFolder.loadAsync(zip[0]).then((zipFiles) => {
      zipFiles.forEach((fileName) => {
        zipFolder
          .file(fileName)
          .async('base64')
          .then((content) => {
              this.useAugcomZip(content);
            }
          );
      });
    });
  }

  useAugcomZip(contentZip:any){
    let tempBoard;
    tempBoard = JSON.parse(this.b64DecodeUnicode(contentZip));
    tempBoard.ElementList.forEach(element => {
      this.checkAndUpdateElementDefaultForm(element);
    });
    this.boardService.board = this.jsonValidator.getCheckedGrid(tempBoard);
    this.layoutService.refreshAll(this.boardService.board.NumberOfCols, this.boardService.board.NumberOfRows, this.boardService.board.GapSize);
    this.boardService.updateElementList();
    this.boardService.backHome();
    console.log(this.boardService.board);
    this.indexedDBacess.update();
    this.router.navigate(['keyboard']);
  }

  b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }


  /**
   * create and add a new element and a new image to the bard using information contained in parameters
   * @param name, the name of the new element
   * @param imageURL, the imageUrl of the nex element
   * @param path, the folder having to contain the new element
   * @param type, the type of the new element (button or folder)
   */
  createNewButtonFromInfoInZIP(name, imageURL, path: string, type) {
    const regex = /\./g;
    const pathWithNoDot = path.replace(regex, '$');

    const theID = pathWithNoDot + '$' + name + (type === 'button' ? 'button' : '');
    this.boardService.board.ElementList.push(
      new GridElement(theID, type, '', 'var(--main-bg-color1)', 'black'
        , 0,
        [
          {
            DisplayedText: name,
            VoiceText: name,
            LexicInfos: [{default: true}],
            ImageID: theID,
          }
        ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}]}])
    );

    this.boardService.board.ImageList.push(
      {
        ID: theID,
        OriginalName: name,
        Path: imageURL
      });

    let pathTab = path.split('.');
    pathTab = pathTab.filter(tab => tab.length > 0);
    const folder = pathTab.length === 1 ? '#HOME' : pathWithNoDot;

    let getPage = this.boardService.board.PageList.find(page => page.ID === folder);
    if (getPage === null || getPage === undefined) {
      this.boardService.board.PageList.push(
        {
          BackgroundColor: 'default',
          ID: folder,
          Name: folder,
          ElementIDsList: [],
          NumberOfCols: undefined,
          NumberOfRows: undefined,
          GapSize: undefined
        });
      getPage = this.boardService.board.PageList.find(page => page.ID === folder);
    }
    getPage.ElementIDsList.push(theID);
  }

  /**
   * import and set the current information contained in the file of event e into the board
   * @param file the file returned by the explorer
   */
  import(file) {
    const myFile = file[0];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const tempBoard = JSON.parse(fileReader.result.toString());
      tempBoard.ElementList.forEach(element => {
        this.checkAndUpdateElementDefaultForm(element);
      });

      this.boardService.board = this.jsonValidator.getCheckedGrid(tempBoard);
      this.indexedDBacess.update();
      this.router.navigate(['keyboard']);
    };
    fileReader.readAsText(myFile);
  }

  /*check if a default form exists for the given element, otherwise create a new one with first displayed text*/

  checkAndUpdateElementDefaultForm(element: GridElement) {
    const defaultForm = element.ElementFormsList.find(form => {
      const newForm = form.LexicInfos.find(info => {
        return (info.default != null && info.default);
      });
      return newForm != null;
    });
    if (defaultForm === null) {
      if (element.ElementFormsList[0] !== null && element.ElementFormsList[0] !== undefined) {
        element.ElementFormsList.push({
          DisplayedText: element.ElementFormsList[0].DisplayedText,
          VoiceText: element.ElementFormsList[0].VoiceText,
          LexicInfos: [{default: true}],
          ImageID: element.ElementFormsList[0].ImageID
        });
      } else {
        console.log('DEFAULT FORM NOT FOUND FOR ' + element.ID);
        element.ElementFormsList.push({
          DisplayedText: element.ID,
          VoiceText: element.ID,
          LexicInfos: [{default: true}],
          ImageID: element.ID
        });
      }
    }
  }

  /**
   * download a JSON file 'save.json' containing the json version of the board
   */
  export() {
    const now:Date = new Date();
    if(this.boardService.board.software == undefined){
      this.boardService.board.software = "AugCom";
    }
    if(this.boardService.board.creationDate == undefined){
      this.boardService.board.creationDate = now.getDate().toString() + '/' + (now.getMonth() + 1).toString() + '/'+ now.getFullYear().toString();
    }
    this.boardService.board.modificationDate = now.getDate().toString() + '/' + (now.getMonth() + 1).toString() + '/'+ now.getFullYear().toString();
    this.downloadFile(JSON.stringify(this.boardService.board));
  }

  /**
   * download a file save.json containing the string 'data'
   * @param data, the string text that have to be saved
   */
  downloadFile(data: string) {
    this.exportManagerService.prepareExport(data);
    this.dialog.open(ExportSaveDialogComponent, {
      width: '600px'
    });
  }

  downloadFileUser(data: string) {
    this.exportManagerService.prepareExport(data);
    this.dialog.open(ExportSaveUserDialogComponent, {
      width: '600px'
    });
  }

  exportPage() {
    this.exportThisPageOnly();
    this.pageToExportList.push(this.pageToExport);
    let exportedGrid:Grid;
    if(this.pageToExport.NumberOfRows !== undefined && this.pageToExport.NumberOfCols!== undefined){
      exportedGrid = new Grid('exportedPage', 'Grid', Number(this.pageToExport.NumberOfCols), Number(this.pageToExport.NumberOfRows), this.gridElementOfPage, this.imageListOfPage, [this.pageToExport]);
    }
    else {
      exportedGrid = new Grid('exportedPage', 'Grid', 10, 10, this.gridElementOfPage, this.imageListOfPage, this.pageToExportList);
    }
    this.downloadFile(JSON.stringify(exportedGrid));
  }

  exportPageWithSubset(){
    this.exportThisPageOnly();
    this.pageToExport.ID = '#HOME';
    const newPageHomeCol:number = this.pageToExport.NumberOfCols;
    const newPageHomeRow:number = this.pageToExport.NumberOfRows;
    this.pageToExportList.push(this.pageToExport);
    this.gridElementOfPage.forEach((gridElem)=>{
      this.boardService.board.PageList.forEach((page)=>{
        if ((gridElem.Type as FolderGoTo).GoTo === page.ID) {
          this.pageIDToExport = page.ID;
          this.exportThisPageOnly();
          this.pageToExportList.push(this.pageToExport);
        }
      });
    });
    let exportedGrid:Grid;
    if(newPageHomeRow !== undefined && newPageHomeCol!== undefined){
      exportedGrid = new Grid('exportedPage', 'Grid', newPageHomeCol, newPageHomeRow, this.gridElementOfPage, this.imageListOfPage, this.pageToExportList);
    }
    else {
      exportedGrid = new Grid('exportedPage', 'Grid', this.boardService.board.NumberOfCols, this.boardService.board.NumberOfRows, this.gridElementOfPage, this.imageListOfPage, this.pageToExportList);
    }
    this.downloadFile(JSON.stringify(exportedGrid));
  }

  exportThisPageOnly(){
    this.pageToExport = this.boardService.board.PageList.find((page)=>{ return page.ID === this.pageIDToExport});
    this.pageToExport.ElementIDsList.forEach((gridElem) => {
      const foundElem = this.boardService.board.ElementList.find((elem) =>{
        return gridElem === elem.ID;
      });
      if(foundElem !== undefined){
        this.gridElementOfPage.push(foundElem);
      }
      const imageFound:Image = this.boardService.board.ImageList.find((image) =>{
        return gridElem === image.ID;
      });
      if(foundElem !== undefined){
        this.imageListOfPage.push(imageFound);
      }
    });
  }

  importPages(zip) {
    let importedGrid:Grid = new Grid('newGrid', 'Grid', 0, 0, [], [], []);
    const zipFolder: JSZip = new JSZip();
    let tempBoard;
    zipFolder.loadAsync(zip[0]).then((zipFiles) => {
      zipFiles.forEach((fileName) => {
        zipFolder
          .file(fileName)
          .async('base64')
          .then((content) => {
              tempBoard = JSON.parse(this.b64DecodeUnicode(content));
              tempBoard.ElementList.forEach(element => {
                this.checkAndUpdateElementDefaultForm(element);
              });
              importedGrid = this.jsonValidator.getCheckedGrid(tempBoard);
            }
          );
      });
    });
    setTimeout( () => {
      this.importPageToCurrentGrid(importedGrid);
    },200);
  }

  importPageToCurrentGrid(importedGrid:Grid){
    importedGrid.ElementList.forEach((gridElem)=>{
      this.boardService.board.ElementList.push(gridElem);
    });
    importedGrid.PageList.forEach((page) => {
      this.boardService.board.PageList.push(page);
    });
    importedGrid.ImageList.forEach((image) => {
      this.boardService.board.ImageList.push(image);
    })
    this.indexedDBacess.update();
    this.router.navigate(['keyboard']);
  }

  openDialogExportPages() {
    this.dialog.open(DialogExportPagesComponent, {
      height: '40%',
      width: '40%'
    });
  }

  exportUser() {
    let paletteUser = this.paletteService.palettes;
    let configurationUser = this.configurationService.getConfiguration();
    let gridUser:Grid[] = [];
    let dataUser = this.userPageService.currentUser;
    let exportedUser:any[] = [];

    dataUser.gridsID.forEach((idGrid) => {
      setTimeout(() => {
        this.indexedDBacess.getTargetGrid(idGrid);
      },500);
    })

    setTimeout(() => {
      gridUser = this.indexedDBacess.listGrid;
      exportedUser = [paletteUser,configurationUser,gridUser,dataUser];
      this.downloadFileUser(JSON.stringify(exportedUser));
    },800);
  }
}
