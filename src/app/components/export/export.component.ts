import { Component, OnInit } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { UsertoolbarService } from '../../services/usertoolbar.service';
import { GeticonService } from '../../services/geticon.service';
import { Router } from '@angular/router';
import { PrintService } from '../../services/print.service';
import { IndexeddbaccessService } from '../../services/indexeddbaccess.service';
import { SpeakForYourselfParser } from '../../services/speakForYourselfParser';
import { HttpClient } from '@angular/common/http';
import { FolderGoTo, Grid, GridElement, Image, Page, User } from '../../types';
import { ProloquoParser } from '../../services/proloquoParser';
import { JsonValidatorService } from '../../services/json-validator.service';
import { MultilinguismService } from '../../services/multilinguism.service';
import { MatDialog } from "@angular/material/dialog";
import { ExportSaveDialogComponent } from "../export-save-dialog/export-save-dialog.component";
import { ExportManagerService } from "../../services/export-manager.service";
import { LayoutService } from "../../services/layout.service";
import { DialogExportPagesComponent } from "../dialog-export-pages/dialog-export-pages.component";
import { UserPageService } from "../../services/user-page.service";
import { PaletteService } from "../../services/palette.service";
import { ConfigurationService } from "../../services/configuration.service";
import { ExportSaveUserDialogComponent } from "../export-save-user-dialog/export-save-user-dialog.component";
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  listNamePage = [];
  listPageAlreadyVisited = [];
  excelFile = [];
  goToValue = "";

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
    public configurationService: ConfigurationService) {

  }

  ngOnInit(): void {
  }

  pageIDToExport: string;
  pageToExportList: Page[] = [];
  pageToExport: Page;
  gridElementOfPage: GridElement[] = [];
  imageListOfPage: Image[] = [];

  /*open a new tab and display the grid in a "ready to print" format*/
  printToPDF() {
    this.userToolBarService.edit = false;
    this.printService.printDiv();
  }

  export() {
    const now: Date = new Date();
    if (this.boardService.board.software == undefined) {
      this.boardService.board.software = "AugCom";
    }
    if (this.boardService.board.creationDate == undefined) {
      this.boardService.board.creationDate = now.getDate().toString() + '/' + (now.getMonth() + 1).toString() + '/' + now.getFullYear().toString();
    }
    this.boardService.board.modificationDate = now.getDate().toString() + '/' + (now.getMonth() + 1).toString() + '/' + now.getFullYear().toString();
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
    let exportedGrid: Grid;
    if (this.pageToExport.NumberOfRows !== undefined && this.pageToExport.NumberOfCols !== undefined) {
      exportedGrid = new Grid('exportedPage', 'Grid', Number(this.pageToExport.NumberOfCols), Number(this.pageToExport.NumberOfRows), this.gridElementOfPage, this.imageListOfPage, [this.pageToExport]);
    }
    else {
      exportedGrid = new Grid('exportedPage', 'Grid', 10, 10, this.gridElementOfPage, this.imageListOfPage, this.pageToExportList);
    }
    this.downloadFile(JSON.stringify(exportedGrid));
  }

  exportPageWithSubset() {
    this.exportThisPageOnly();
    this.pageToExport.ID = '#HOME';
    const newPageHomeCol: number = this.pageToExport.NumberOfCols;
    const newPageHomeRow: number = this.pageToExport.NumberOfRows;
    this.pageToExportList.push(this.pageToExport);
    this.gridElementOfPage.forEach((gridElem) => {
      this.boardService.board.PageList.forEach((page) => {
        if ((gridElem.Type as FolderGoTo).GoTo === page.ID) {
          this.pageIDToExport = page.ID;
          this.exportThisPageOnly();
          this.pageToExportList.push(this.pageToExport);
        }
      });
    });
    let exportedGrid: Grid;
    if (newPageHomeRow !== undefined && newPageHomeCol !== undefined) {
      exportedGrid = new Grid('exportedPage', 'Grid', newPageHomeCol, newPageHomeRow, this.gridElementOfPage, this.imageListOfPage, this.pageToExportList);
    }
    else {
      exportedGrid = new Grid('exportedPage', 'Grid', this.boardService.board.NumberOfCols, this.boardService.board.NumberOfRows, this.gridElementOfPage, this.imageListOfPage, this.pageToExportList);
    }
    this.downloadFile(JSON.stringify(exportedGrid));
  }

  exportThisPageOnly() {
    this.pageToExport = this.boardService.board.PageList.find((page) => { return page.ID === this.pageIDToExport });
    this.pageToExport.ElementIDsList.forEach((gridElem) => {
      const foundElem = this.boardService.board.ElementList.find((elem) => {
        return gridElem === elem.ID;
      });
      if (foundElem !== undefined) {
        this.gridElementOfPage.push(foundElem);
      }
      const imageFound: Image = this.boardService.board.ImageList.find((image) => {
        return gridElem === image.ID;
      });
      if (foundElem !== undefined) {
        this.imageListOfPage.push(imageFound);
      }
    });
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
    let gridUser: Grid[] = [];
    let dataUser = this.userPageService.currentUser;
    let exportedUser: any[] = [];

    dataUser.gridsID.forEach((idGrid) => {
      setTimeout(() => {
        this.indexedDBacess.getTargetGrid(idGrid);
      }, 500);
    })

    setTimeout(() => {
      gridUser = this.indexedDBacess.listGrid;
      exportedUser = [paletteUser, configurationUser, gridUser, dataUser];
      this.downloadFileUser(JSON.stringify(exportedUser));
    }, 800);
  }

  exportTreeStructure() {
    let defaultIndex = 0;
    this.listPageAlreadyVisited.push(this.boardService.board.PageList[0].ID);
    this.boardService.board.PageList[0].ElementIDsList.forEach(elemID => {
      this.excelFile.push(this.addToExcel(this.searchNameElem(elemID), defaultIndex));
      if (this.checkIfIsFolder(elemID)) {
        if (!this.listPageAlreadyVisited.includes(this.goToValue)) {
          this.listPageAlreadyVisited.push(this.goToValue);
          this.goInFolder(this.goToValue, defaultIndex + 1);
        }
      }
    });
    this.exportToExcel("AugComTreeStructure");
  }

  searchNameElem(elemID) {
    for (let i = 0; i < this.boardService.board.ElementList.length; i++) {
      if (this.boardService.board.ElementList[i].ID == elemID) {
        return this.boardService.board.ElementList[i].ElementFormsList[0].DisplayedText;
      }
    }
  }

  checkIfIsFolder(elemID) {
    for (let i = 0; i < this.boardService.board.ElementList.length; i++) {
      if (this.boardService.board.ElementList[i].ID == elemID) {
        if (this.boardService.board.ElementList[i].Type == "button") {
          return false;
        } else {
          this.goToValue = Object.values(this.boardService.board.ElementList[i].Type)[0];
          return true;
        }
      }
    }
  }

  goInFolder(elemID, index) {
    let page: Page;
    for (let i = 0; i < this.boardService.board.PageList.length; i++) {
      if (this.boardService.board.PageList[i].ID == elemID) {
        page = this.boardService.board.PageList[i];
        break;
      }
    }
    page.ElementIDsList.forEach(elem => {
      this.excelFile.push(this.addToExcel(this.searchNameElem(elem), index));
      if (this.checkIfIsFolder(elem)) {
        if (!this.listPageAlreadyVisited.includes(this.goToValue)) {
          this.listPageAlreadyVisited.push(this.goToValue);
          this.goInFolder(this.goToValue, index + 1);
        }
      }
    });
  }

  addToExcel(value, index) {
    let tab = [];
    for (let i = 0; i < index; i++) {
      tab.push("");
    }
    tab.push(value);
    return tab;
  }

  exportToExcel(name: String): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.excelFile);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TreeStructure');
    XLSX.writeFile(workbook, name + ".xlsx");
    this.excelFile = [];
    this.listNamePage = [];
    this.listPageAlreadyVisited = [];
  }

}
