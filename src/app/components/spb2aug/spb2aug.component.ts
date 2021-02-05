import {Component, OnInit} from '@angular/core';
import {MultilinguismService} from '../../services/multilinguism.service';
import {Grid, GridElement} from '../../types';

@Component({
  selector: 'app-spb2aug',
  templateUrl: './spb2aug.component.html',
  styleUrls: ['./spb2aug.component.css']
})
// doc sqlite : https://github.com/sql-js/sql.js/
export class Spb2augComponent implements OnInit {

  constructor(public multilinguism: MultilinguismService) {
  }
  newGrid: Grid;
  rowCounts: number[];
  NumberOfCols: number;
  NumberOfRows: number;
  db = null;

  ngOnInit(): void {
    this.newGrid = new Grid('newGrid','Grid',0,0,0,0,0);
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
        console.log(tables);
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
            console.log('columnTypes : ' + columnTypes);
            this.getGridDimension(name);
          }
        }
      }
      console.log(this.newGrid);
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
      console.log('obj.name : ' + obj.name);
      result[obj.name] = obj.type;
    }
    console.log('result :' + result);
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
    // cel.step itère sur les ligne une à une
    while (cel.step()){
      const label = cel.getAsObject().Label;
      const message = cel.getAsObject().Message;
      this.newGrid.ElementList.push(
        new GridElement(label, 'button', '', 'var(--main-bg-color1)', 'black'
          , 0,
          [
            {
              DisplayedText: label,
              VoiceText: message,
              LexicInfos: [{default: true}],
              ImageID: label,
            }
          ], [{ID: 'click', ActionList: [{ID: 'display', Options: []}]}])
      );
    }
  }
}
