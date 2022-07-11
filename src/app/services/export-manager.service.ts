import {Injectable} from '@angular/core';
import {saveAs as importedSaveAs} from 'file-saver';
import {ExportSaveDialogComponent} from "../components/export-save-dialog/export-save-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class ExportManagerService {

  data;

  constructor() {
  }

  prepareExport(data: String) {
    this.data = data;
  }

}
