import { Component, OnInit } from '@angular/core';
import {MultilinguismService} from '../../services/multilinguism.service';
import {query} from '@angular/animations';
import {Grid} from '../../types';

@Component({
  selector: 'app-spb2aug',
  templateUrl: './spb2aug.component.html',
  styleUrls: ['./spb2aug.component.css']
})
export class Spb2augComponent implements OnInit {

  constructor(public multilinguism: MultilinguismService) {
  }
  private newGrid: Grid;

  ngOnInit(): void {
  }

  convert(file){
    this.loadDB(file);
  }

  loadDB(arrayBuffer) {
    // initSqlJs is in the librairy sql.js, use npm install @types/sql.js
    initSqlJs().then(function(SQL) {
    let tables;
    let db;
    try {
      db = new SQL.Database(new Uint8Array(arrayBuffer));

      // Get all table names from master table
      tables = this.db.prepare('SELECT * FROM sqlite_master WHERE type=\'table\' OR type=\'view\' ORDER BY name');
      console.log(tables);
    } catch (ex) {
      alert(ex);
      return;
    }
  });
  }
/*
  loadDB(arrayBuffer) {
    setIsLoading(true);

    function renderQuery(defaultSelect: string) {
      function renderQuery(query) {
        const dataBox = $('#data');
        const thead = dataBox.find('thead').find('tr');
        const tbody = dataBox.find('tbody');

        thead.empty();
        tbody.empty();
        dataBox.show();

        let columnTypes = [];
        const tableName = getTableNameFromQuery(query);
        if (tableName != null) {
          columnTypes = getTableColumnTypes(tableName);
        }

        let sel;
        try {
          sel = this.db.prepare(query);
        } catch (ex) {
          return;
        }

        let addedColums = false;
        while (sel.step()) {
          if (!addedColums) {
            addedColums = true;
            const columnNames = sel.getColumnNames();
            for (let i = 0; i < columnNames.length; i++) {
              const type = columnTypes[columnNames[i]];
              thead.append('<th><span data-toggle="tooltip" data-placement="top" title="' + type + '">' + columnNames[i] + '</span></th>');
            }
          }

          const tr = $('<tr>');
          const s = sel.get();
          for (let i = 0; i < s.length; i++) {
            tr.append('<td><span title="' + htmlEncode(s[i]) + '">' + htmlEncode(s[i]) + '</span></td>');
          }
          tbody.append(tr);
        }

        refreshPagination(query, tableName);

        $('[data-toggle="tooltip"]').tooltip({html: true});
        dataBox.editableTableWidget();
      }
    }

    function doDefaultSelect(name) {
      const defaultSelect = 'SELECT * FROM \'' + name + '\' LIMIT 0,30';
      this.editor.setValue(defaultSelect, -1);
      renderQuery(defaultSelect);
    }

    function resetTableList() {
      const tables = $('#tables');
      const rowCounts = [];
      tables.empty();
      tables.append('<option></option>');
      tables.select2({
        placeholder: 'Select a table',
        formatSelection: this.selectFormatter,
        formatResult: this.selectFormatter
      });
      tables.on('change', function (e) {
        doDefaultSelect(e.val);
      });
    }

    resetTableList();

    function setIsLoading(isLoading) {
      const dropText = $('#drop-text');
      const loading = $('#drop-loading');
      if (isLoading) {
        dropText.hide();
        loading.show();
      } else {
        dropText.show();
        loading.hide();
      }
    }

    function getTableRowsCount(name) {
      const sel = this.db.prepare('SELECT COUNT(*) AS count FROM \'' + name + '\'');
      if (sel.step()) {
        return sel.getAsObject().count;
      } else {
        return -1;
      }
    }

    initSqlJs().then(function (SQL) {
      let tables;
      let db;
      try {
        db = new SQL.Database(new Uint8Array(arrayBuffer));

        // Get all table names from master table
        tables = db.prepare('SELECT * FROM sqlite_master WHERE type=\'table\' OR type=\'view\' ORDER BY name');
      } catch (ex) {
        setIsLoading(false);
        alert(ex);
        return;
      }

      let firstTableName = null;
      const tableList = document.getElementById('#tables');

      while (tables.step()) {
        const rowObj = tables.getAsObject();
        const name = rowObj.name;

        if (firstTableName === null) {
          firstTableName = name;
        }
        const rowCount = getTableRowsCount(name);
        (this.rowCounts)[name] = rowCount;
        tableList.append('<option value="' + name + '">' + name + ' (' + rowCount + ' rows)</option>');
      }

      // Select first table and show It
      tableList.select2('val', firstTableName);
      doDefaultSelect(firstTableName);

      document.getElementById('#output-box');
      document.querySelector('.nouploadinfo');
      document.getElementById('#sample-db-link');
      document.getElementById('#dropzone');
      document.getElementById('#success-box');
      console.log(document.getElementById('#output-box'));

      setIsLoading(false);
    });
  }

 */
}
