import {Injectable} from '@angular/core';
import {saveAs as importedSaveAs} from "file-saver";


@Injectable({
  providedIn: 'root'
})
export class ExportSaveService {

  constructor() {
  }

  downloadFile(data: string) {
    const blob = new Blob([data], {type: 'text/json'});
    //const url= window.URL.createObjectURL(blob);
    //window.open(url);
    importedSaveAs(blob, "save.json");
  }
}
