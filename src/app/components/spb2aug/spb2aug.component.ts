import {Component, OnInit} from '@angular/core';
import {MultilinguismService} from '../../services/multilinguism.service';
import {Grid, GridElement, Page} from '../../types';
import {BoardService} from '../../services/board.service';
import {Router} from '@angular/router';
import {IndexeddbaccessService} from '../../services/indexeddbaccess.service';

@Component({
  selector: 'app-spb2aug',
  templateUrl: './spb2aug.component.html',
  styleUrls: ['./spb2aug.component.css']
})
// doc sqlite : https://github.com/sql-js/sql.js/
export class Spb2augComponent implements OnInit {

  constructor(
    public multilinguism: MultilinguismService,
    public indexedDBacess: IndexeddbaccessService,
    public router: Router,
    public boardService: BoardService) {
  }
  newGrid: Grid;
  page : Page;
  gridElement: GridElement;
  rowCounts: number[];
  NumberOfCols: number;
  NumberOfRows: number;
  db = null;

  ngOnInit(): void {
    this.newGrid = new Grid('newGrid','Grid',0,0,[],[],[]);
    this.page = new Page();
    this.page.ID = '#HOME';
    this.page.Name = 'Accueil';
    this.page.ElementIDsList = [];
  }

  convert(file){
    this.newGrid.ID = 'newGrid';
    this.newGrid.GapSize = 5;
    const myFile = file[0];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.loadDB(fileReader);
    };
    fileReader.readAsArrayBuffer(myFile);
  }

  loadDB(arrayBuffer) {
    // initSqlJs is in the library sql.js, use npm install @types/sql.js
    initSqlJs().then(SQL => {
      let tables;
      try {
        this.db = new SQL.Database(new Uint8Array(arrayBuffer.result));
        // Get all table names from master table
        tables = this.db.prepare('SELECT * FROM sqlite_master WHERE type=\'table\' ORDER BY name');
      } catch (ex) {
        alert(ex);
        return;
      }
      let firstTableName = null;
      let columnTypes = [];
      while (tables.step()) {
        const rowObj = tables.getAsObject();
        const name = rowObj.name;

        if (firstTableName === null) {
          firstTableName = name;
        }
        const rowCount = this.getTableRowsCount(name);
        console.log('nom de la table : ' + name + ', nombre de ligne : ' + rowCount);

        if (name === 'Button'){
          this.getElement(name);
        }
        if (name === 'ElementPlacement'){
          this.NumberOfCols = 0;
          this.NumberOfRows = 0;
          if (name != null) {
            columnTypes = this.getTableColumnTypes(name);
            this.getGridDimension(name);
          }
        }
      }
      console.log(this.newGrid);
      this.boardService.board = this.newGrid;
      this.indexedDBacess.update();
      this.router.navigate(['']);
    });
  }
  getTableRowsCount(name): number {
    const cell = this.db.prepare('SELECT COUNT(*) AS count FROM \'' + name + '\'');
    if (cell.step()) {
      return cell.getAsObject().count;
    } else {
      return -1;
    }
  }


  getTableColumnTypes(tableName) {
    const result = [];
    const sel = this.db.prepare('PRAGMA table_info(\'' + tableName + '\')');

    while (sel.step()) {
      const obj = sel.getAsObject();
      result[obj.name] = obj.type;
    }
    return result;
  }

  getGridDimension(name) {
    const cel = this.db.prepare('SELECT GridPosition FROM \'' + name + '\'');
    while (cel.step()) {
      const result = cel.getAsObject().GridPosition;
      const tabRes = result.split(',');
      const currentElementCol = +tabRes[0];
      const currentElementRow = +tabRes[1];
      if(this.NumberOfCols < currentElementCol){
        this.NumberOfCols = currentElementCol;
      }
      if(this.NumberOfRows < currentElementRow){
        this.NumberOfRows = currentElementRow;
      }
    }
    this.newGrid.NumberOfCols = this.NumberOfCols;
    this.newGrid.NumberOfRows = this.NumberOfRows;
  }

  getElement(name){
    const cel = this.db.prepare('SELECT * FROM \'' + name + '\'');
    const elPlacement = this.db.prepare('SELECT * FROM ElementPlacement ORDER BY ElementReferenceId ASC');
    // skip the first because we don't care about it
    elPlacement.step();
    // cel.step itère sur les ligne une à une
    while (cel.step()){
      elPlacement.step();
      const gridPosition = elPlacement.getAsObject().GridPosition;
      const gridSpan = elPlacement.getAsObject().GridSpan;
      const tabResPos = gridPosition.split(',');
      const tabResSpan = gridSpan.split(',');
      const gridPosY = tabResPos[0];
      const gridPosX = tabResPos[1];
      const gridSpanY = tabResSpan[0];
      const gridSpanX = tabResSpan[1];
      const label = cel.getAsObject().Label;
      const message = cel.getAsObject().Message;
      this.gridElement = new GridElement(label, 'button', '', 'var(--main-bg-color1)', 'black'
        , 0,
        [
          {
            DisplayedText: label,
            VoiceText: message,
            LexicInfos: [{default: true}],
            ImageID: label,
          }
        ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}]}])
      this.gridElement.x = gridPosX;
      this.gridElement.y = gridPosY;
      this.gridElement.rows = gridSpanX;
      this.gridElement.cols = gridSpanY;
      this.newGrid.ElementList.push(this.gridElement);
      this.page.ElementIDsList.push(label);
    }
    this.newGrid.PageList.push(this.page);
  }
}
