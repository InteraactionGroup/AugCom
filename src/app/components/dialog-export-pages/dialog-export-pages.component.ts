import { Component, OnInit } from '@angular/core';
import {MultilinguismService} from "../../services/multilinguism.service";
import {BoardService} from "../../services/board.service";
import {Grid, GridElement, Image, Page} from "../../types";
import {ExportSaveDialogComponent} from "../export-save-dialog/export-save-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ExportManagerService} from "../../services/export-manager.service";
import {MatListOption} from "@angular/material/list";

@Component({
  selector: 'app-dialog-export-pages',
  templateUrl: './dialog-export-pages.component.html',
  styleUrls: ['./dialog-export-pages.component.css']
})
export class DialogExportPagesComponent implements OnInit {

  constructor(public boardService: BoardService,
              public multilinguism: MultilinguismService,
              public dialog: MatDialog,
              public exportManagerService: ExportManagerService,) { }

  ngOnInit(): void {
  }

  pageIDToExport:string;
  pageToExportList:Page[] = [];
  pageToExport:Page;
  gridElementOfPage:GridElement[] = [];
  imageListOfPage:Image[] = [];

  exportPage(selected: MatListOption[]) {
    selected.forEach((page) => {
      this.pageIDToExport = page.value;
      this.exportThisPageOnly();
      this.pageToExportList.push(this.pageToExport);
    })
    let exportedGrid:Grid;
    if(this.pageToExport.NumberOfRows !== undefined && this.pageToExport.NumberOfCols!== undefined){
      exportedGrid = new Grid('exportedPage', 'Grid', Number(this.pageToExport.NumberOfCols), Number(this.pageToExport.NumberOfRows), this.gridElementOfPage, this.imageListOfPage, [this.pageToExport]);
    }
    else {
      exportedGrid = new Grid('exportedPage', 'Grid', 10, 10, this.gridElementOfPage, this.imageListOfPage, this.pageToExportList);
    }
    this.downloadFile(JSON.stringify(exportedGrid));
  }

  downloadFile(data: string) {
    this.exportManagerService.prepareExport(data);
    this.dialog.open(ExportSaveDialogComponent, {
      width: '600px'
    });
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

}
