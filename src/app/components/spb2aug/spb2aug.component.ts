import {Component, OnInit} from '@angular/core';
import {MultilinguismService} from '../../services/multilinguism.service';
import {Grid} from '../../types';
import {readPackageTree} from "@angular/cli/utilities/package-tree";

@Component({
  selector: 'app-spb2aug',
  templateUrl: './spb2aug.component.html',
  styleUrls: ['./spb2aug.component.css']
})
// doc sqlite : https://github.com/sql-js/sql.js/
export class Spb2augComponent implements OnInit {

  constructor(public multilinguism: MultilinguismService) {
  }
  newgrid: Grid;
  rowCounts: number[];
  NumberOfCols: number;
  NumberOfRows: number;
  db = null;

  ngOnInit(): void {
  }

  convert(file){
    const myFile = file[0];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.loadDB(fileReader);
    };
    fileReader.readAsArrayBuffer(myFile);
    console.log('myFile : ' + myFile);
    console.log('filereader.result : ' + fileReader.result);

  }

  loadDB(arrayBuffer) {
    // initSqlJs is in the library sql.js, use npm install @types/sql.js
    initSqlJs().then(SQL => {
      let tables;
      try {
        this.db = new SQL.Database(new Uint8Array(arrayBuffer.result));
        // Get all table names from master table
        tables = this.db.prepare("SELECT * FROM sqlite_master WHERE type='table' ORDER BY name");
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
        console.log('name : ' + name);

        if (firstTableName === null) {
          firstTableName = name;
          console.log('firstTableName : ' + firstTableName);
        }
        const rowCount = this.getTableRowsCount(name);
        console.log('nom de la table ' + name + ', nombre de ligne : ' + rowCount);

        if (name === 'ElementPlacement'){
          this.NumberOfCols = 0;
          this.NumberOfRows = 0;
          if (name != null) {
            columnTypes = this.getTableColumnTypes(name);
            console.log('columnTypes : ' + columnTypes);
          }
        }
      }
    });
  }
  getTableRowsCount(name): number {
    const cell = this.db.prepare("SELECT COUNT(*) AS count FROM '" + name + "'");
    if (cell.step()) {
      return cell.getAsObject().count;
    } else {
      return -1;
    }
  }


  getTableColumnTypes(tableName) {
    const result = [];
    const sel = this.db.prepare("PRAGMA table_info('" + tableName + "')");

    while (sel.step()) {
      const obj = sel.getAsObject();
      result[obj.name] = obj.type;
      /*if (obj.notnull === 1) {
          result[obj.name] += " NOTNULL";
      }*/
    }
    console.log('result' + result);
    return result;
}
}
