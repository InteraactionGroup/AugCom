import {Component, OnInit} from '@angular/core';
import {BoardService} from '../../services/board.service';
import {UsertoolbarService} from '../../services/usertoolbar.service';
import {GeticonService} from '../../services/geticon.service';
import {Router} from '@angular/router';
import {PrintService} from '../../services/print.service';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';
import {SpeakForYourselfParser} from '../../services/speakForYourselfParser';
import {HttpClient} from '@angular/common/http';
import {FolderGoTo, Grid, GridElement, Image, Page, User} from '../../types';
import {ProloquoParser} from '../../services/proloquoParser';
import {JsonValidatorService} from '../../services/json-validator.service';
import {MultilinguismService} from '../../services/multilinguism.service';
import {MatDialog} from '@angular/material/dialog';
import {ExportSaveDialogComponent} from '../export-save-dialog/export-save-dialog.component';
import {ExportManagerService} from '../../services/export-manager.service';
import {LayoutService} from '../../services/layout.service';
import {DialogExportPagesComponent} from '../dialog-export-pages/dialog-export-pages.component';
import {UserPageService} from '../../services/user-page.service';
import {PaletteService} from '../../services/palette.service';
import {ConfigurationService} from '../../services/configuration.service';
import {ExportSaveUserDialogComponent} from '../export-save-user-dialog/export-save-user-dialog.component';
import * as XLSX from 'xlsx';
import {Document, Packer, Paragraph, Media, HeadingLevel, Table, TableRow, TableCell, ImageRun, WidthType} from 'docx';


@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {

  listNamePage = [];
  listPageAlreadyVisited = [];
  excelFile = [];
  goToValue = '';
  WordTable = [];
  baseTable = [];

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
    public configurationService: ConfigurationService,) {

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
    if (this.boardService.board.software === undefined) {
      this.boardService.board.software = 'AugCom';
    }
    if (this.boardService.board.creationDate === undefined) {
      this.boardService.board.creationDate = now.getDate().toString() + '/' + (now.getMonth() + 1).toString()
        + '/' + now.getFullYear().toString();
    }
    this.boardService.board.modificationDate = now.getDate().toString() + '/' + (now.getMonth() + 1).toString()
      + '/' + now.getFullYear().toString();
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
      exportedGrid = new Grid('exportedPage', 'Grid', Number(this.pageToExport.NumberOfCols), Number(this.pageToExport.NumberOfRows), this.gridElementOfPage, this.imageListOfPage, [this.pageToExport], [], []);
    } else {
      exportedGrid = new Grid('exportedPage', 'Grid', 10, 10, this.gridElementOfPage, this.imageListOfPage, this.pageToExportList,[],[]);
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
      exportedGrid = new Grid('exportedPage', 'Grid', newPageHomeCol, newPageHomeRow, this.gridElementOfPage, this.imageListOfPage, this.pageToExportList,[],[]);
    } else {
      exportedGrid = new Grid('exportedPage', 'Grid', this.boardService.board.NumberOfCols, this.boardService.board.NumberOfRows, this.gridElementOfPage, this.imageListOfPage, this.pageToExportList,[],[]);
    }
    this.downloadFile(JSON.stringify(exportedGrid));
  }

  exportThisPageOnly() {
    this.pageToExport = this.boardService.board.PageList.find((page) => {
      return page.ID === this.pageIDToExport
    });
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
    const paletteUser = this.paletteService.palettes;
    const configurationUser = this.configurationService.getConfiguration();
    let gridUser: Grid[] = [];
    const dataUser = this.userPageService.currentUser;
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

  async exportTreeStructure() {
    const defaultIndex = 0;
    this.listPageAlreadyVisited.push(this.boardService.board.PageList[0].ID);
    const page = this.boardService.board.PageList[0];
    for (const elemID of page.ElementIDsList) {
      const text = this.searchNameElem(elemID);
      this.excelFile.push(this.addToExcel(text, defaultIndex));
      if (this.checkIfIsFolder(elemID)) {
        if (!this.listPageAlreadyVisited.includes(this.goToValue)) {
          this.listPageAlreadyVisited.push(this.goToValue);
          await this.goInFolderExcell(this.goToValue, defaultIndex + 1); // await the recursive call
        }
      }
    }
    this.exportToExcel('AugComTreeStructure');
  }

  async goInFolderExcell(elemID, index) {
    const page = this.boardService.board.PageList.find(item => item.ID === elemID);
    for (const elem of page.ElementIDsList) {
      const text = this.searchNameElem(elem);
      this.excelFile.push(this.addToExcel(text, index));
      if (this.checkIfIsFolder(elem)) {
        if (!this.listPageAlreadyVisited.includes(this.goToValue)) {
          this.listPageAlreadyVisited.push(this.goToValue);
          await this.goInFolderExcell(this.goToValue, index + 1); // await the recursive call
        }
      }
    }
  }


  searchNameElem(elemID) {
    for (const item of this.boardService.board.ElementList) {
      if (item.ID === elemID) {
        return item.ElementFormsList[0].DisplayedText;
      }
    }
  }

  searchImageElem(elemID) {
    for (const item of this.boardService.board.ElementList) {
      if (item.ID === elemID) {
        return this.boardService.board.ImageList.find(image => image.ID === item.ElementFormsList[0].ImageID).Path;
      }
    }
  }

  async getImageBase64(url: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }


  checkIfIsFolder(elemID) {
    for (const item of this.boardService.board.ElementList) {
      if (item.ID === elemID) {
        if (item.Type === 'button') {
          return false;
        } else {
          this.goToValue = Object.values(item.Type)[0];
          return true;
        }
      }
    }
  }


  addToExcel(value, index) {
    let tab = [];
    for (let i = 0; i < index; i++) {
      tab.push('');
    }
    tab.push(value);
    return tab;
  }


  exportToExcel(name: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.excelFile);

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Grid');
    XLSX.writeFile(workbook, name + '.xlsx');
    this.excelFile = [];
    this.listNamePage = [];
    this.listPageAlreadyVisited = [];
  }

  makerow(text: any, imageUrl: any, imageData: any) {
    const row = new TableRow({
      children: [
        new TableCell({
          width: {
            size: 2000,
            type: WidthType.DXA
          },
          children: [new Paragraph({text})],
        }),
        new TableCell({
          width: {
            size: 2000,
            type: WidthType.DXA
          },
          children: [new Paragraph({
            children: [new ImageRun({
              data: imageData,
              transformation: {width: 100, height: 100}
            })]
          })],
        }),
      ],
    });

    return row;
  }


  async goInFolderWord(elemID, index) {
    const page = this.boardService.board.PageList.find(item => item.ID === elemID);
    const rows = [];
    for (const elem of page.ElementIDsList) {
      const text = this.searchNameElem(elem);
      const imageUrl = this.searchImageElem(elem);
      const imageData = await this.getImageBase64(imageUrl); // Fetch and convert image to base64
      const row = this.makerow(text, imageUrl, imageData);
      rows.push(row);
      if (this.checkIfIsFolder(elem)) {
        if (!this.listPageAlreadyVisited.includes(this.goToValue)) {
          this.listPageAlreadyVisited.push(this.goToValue);
          await this.goInFolderExcell(this.goToValue, index + 1); // await the recursive call
        }
      }
    }
    const TableFolder = new Table({
      columnWidths: [2000, 2000],
      rows,
      width: {
        size: 4000,
        type: WidthType.DXA,
      }
    })
    this.WordTable.push(TableFolder);
  }

  async getGridWord() {
    const defaultIndex = 0;
    this.listPageAlreadyVisited.push(this.boardService.board.PageList[0].ID);
    const page = this.boardService.board.PageList[0];
    const rows = [];
    for (const elemID of page.ElementIDsList) {
      const text = this.searchNameElem(elemID);
      const imageUrl = this.searchImageElem(elemID);
      const imageData = await this.getImageBase64(imageUrl);
      const row = this.makerow(text, imageUrl, imageData);
      rows.push(row);
      if (this.checkIfIsFolder(elemID)) {
        if (!this.listPageAlreadyVisited.includes(this.goToValue)) {
          this.listPageAlreadyVisited.push(this.goToValue);
          await this.goInFolderWord(this.goToValue, defaultIndex + 1);
        }
      }
    }
    const TableFolder = new Table({
      columnWidths: [2000, 2000],
      rows,
      width: {
        size: 4000,
        type: WidthType.DXA,
      }
    })
    this.baseTable.push(TableFolder);
  }

  async exportToWord() {
    await this.getGridWord();
    // Créez un tableau de sections
    const sections: any[] = [];

    // Ajouter le titre et la grille de base
    sections.push({
      properties: {},
      children: [
        new Paragraph({
          text: this.multilinguism.translate('WordTitle'),
          heading: HeadingLevel.HEADING_1,
        }),
        this.baseTable[0]
      ]
    });

    // Ajouter chaque éléments des dossiers avec un saut de page
    this.WordTable.forEach((table) => {
      sections.push({
        properties: {
          pageBreakBefore: true,
        },
        children: [
          new Paragraph({
            text: this.multilinguism.translate('WordFolder'),
            heading: HeadingLevel.HEADING_1,
          }),
          table
        ]
      });
    });

    // Créer le document avec les sections
    const doc = new Document({
      sections: sections,
    });
    Packer.toBlob(doc).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.multilinguism.translate('WordNameFile') + '.docx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
    this.WordTable = [];
    this.listNamePage = [];
    this.listPageAlreadyVisited = [];
  }


}
