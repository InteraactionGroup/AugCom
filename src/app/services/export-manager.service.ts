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

  exportSave(name: String) {
    const blob = new Blob([this.data], {type: 'text/json'});
    let tempName = name;
    if(name.endsWith(".json")){
      tempName = name.slice(0, name.length - 5);
    }else if (name.endsWith(".augcom")){
      tempName = name.slice(0, name.length - 7);
    }
    if (tempName.length == 0) {
      tempName = "save";
    }
    importedSaveAs(blob, tempName + '.augcom');
  }
}
