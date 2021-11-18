import {Injectable} from '@angular/core';
import {saveAs as importedSaveAs} from 'file-saver';

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
