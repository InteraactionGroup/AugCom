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
import {Document, Packer, Paragraph, Media, HeadingLevel, Table, TableRow, TableCell, ImageRun} from 'docx';
import * as fs from 'fs';


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
      exportedGrid = new Grid('exportedPage', 'Grid', Number(this.pageToExport.NumberOfCols), Number(this.pageToExport.NumberOfRows), this.gridElementOfPage, this.imageListOfPage, [this.pageToExport]);
    } else {
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
    } else {
      exportedGrid = new Grid('exportedPage', 'Grid', this.boardService.board.NumberOfCols, this.boardService.board.NumberOfRows, this.gridElementOfPage, this.imageListOfPage, this.pageToExportList);
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
      const imageUrl = this.searchImageElem(elemID);
      const imageData = await this.getImageBase64(imageUrl);
      this.excelFile.push(this.addToExcel(text, imageData, defaultIndex));
      if (this.checkIfIsFolder(elemID)) {
        if (!this.listPageAlreadyVisited.includes(this.goToValue)) {
          this.listPageAlreadyVisited.push(this.goToValue);
          await this.goInFolder(this.goToValue, defaultIndex + 1); // await the recursive call
        }
      }
    }
    this.exportToExcel('ExcellFile');
  }

  async goInFolder(elemID, index) {
    const page = this.boardService.board.PageList.find(item => item.ID === elemID);
    for (const elem of page.ElementIDsList) {
      const text = this.searchNameElem(elem);
      const imageUrl = this.searchImageElem(elem);
      const imageData = await this.getImageBase64(imageUrl); // Fetch and convert image to base64
      this.excelFile.push(this.addToExcel(text, imageData, index));
      if (this.checkIfIsFolder(elem)) {
        if (!this.listPageAlreadyVisited.includes(this.goToValue)) {
          this.listPageAlreadyVisited.push(this.goToValue);
          await this.goInFolder(this.goToValue, index + 1); // await the recursive call
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


  addToExcel(text: string, imageData: string, index: number) {
    const tab = [];
    for (let i = 0; i < index; i++) {
      tab.push('');
    }

    // Split the text into chunks of maximum 32767 characters
    const chunks = this.splitTextIntoChunks(imageData);
    tab.push(chunks[0]);
    tab.push(text);
    for (let i = 1; i < chunks.length; i++) {
      const newRow = Array.from(tab);
      newRow[index] = chunks[i]; // Replace the text in the current column
      this.excelFile.push(newRow);
    }

    return tab;
  }

  splitTextIntoChunks(text: string): string[] {
    const chunkSize = 32767;
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  }


  exportToExcel(name: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.excelFile);

    // Modify the column width for the image column
    const wscols = [
      {wch: 20}, // Adjust the width of the text column if needed
      {wpx: 100} // Adjust the width of the image column
    ];
    worksheet['!cols'] = wscols;

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Grid');
    XLSX.writeFile(workbook, name + '.xlsx');
    this.excelFile = [];
    this.listNamePage = [];
    this.listPageAlreadyVisited = [];
  }


  exportToWord(name: string): void {
    const table = this.makeGridWord();
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: 'Hello World',
              heading: HeadingLevel.HEADING_1,
            }),
            table
          ]
        }
      ]
    });
    Packer.toBuffer(doc).then((buffer) => {
      fs.writeFileSync(name + '.docx', buffer);
    });

  }

  makeGridWord(): Table {
    const defaultIndex = 0;
    this.listPageAlreadyVisited.push(this.boardService.board.PageList[0].ID);
    const page = this.boardService.board.PageList[0];
    const rows = [];

    for (const elemID of page.ElementIDsList) {
      const text = this.searchNameElem(elemID);
      const imageUrl = this.searchImageElem(elemID);

      // Create table row for each elemID
      const row = new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text })],
          }),
          new TableCell({
            // tslint:disable-next-line:max-line-length
            children: [new Paragraph({ children:[new ImageRun({ data: fs.readFileSync(imageUrl), transformation: { width: 100, height: 100 } })]})],
          }),
        ],
      });

      // Push the row to the rows array
      rows.push(row);
    }

    // Create the table with all rows
    const grid = new Table({
      rows,
    });

    return grid;
  }

}
