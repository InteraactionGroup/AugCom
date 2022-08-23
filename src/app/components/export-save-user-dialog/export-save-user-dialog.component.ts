import {Component, OnInit} from '@angular/core';
import {ExportManagerService} from "../../services/export-manager.service";
import JSZip from "jszip";
import {saveAs as importedSaveAs} from 'file-saver';
import {MultilinguismService} from "../../services/multilinguism.service";
import {BoardService} from "../../services/board.service";

@Component({
  selector: 'app-xport-save-user-dialog',
  templateUrl: './export-save-user-dialog.component.html',
  styleUrls: ['./export-save-user-dialog.component.css']
})
export class ExportSaveUserDialogComponent implements OnInit {

  name: String = "save";

  constructor(public  exportManagerService: ExportManagerService,
              public multilinguism: MultilinguismService,
              public boardservice: BoardService) {
  }

  ngOnInit(): void {
  }

  exportSave() {
    let tempName;
    if (this.name.endsWith(".json")) {
      tempName = this.name.slice(0, this.name.length - 5);
    } else if (this.name.endsWith(".augcom")) {
      tempName = this.name.slice(0, this.name.length - 7);
    } else {
      tempName = this.name;
    }
    if (tempName.length == 0) {
      tempName = "save";
    }

    const jszip = new JSZip();
    jszip.file(tempName + '.opgf', this.exportManagerService.data);

    jszip.generateAsync({type: 'blob'}).then(function (content) {
      // see FileSaver.js
      importedSaveAs(content, tempName + '.augcom');
    });

  }

}
