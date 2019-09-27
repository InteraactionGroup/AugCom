import { Component, OnInit } from '@angular/core';
import {UserBarOptionManager} from "../services/userBarOptionManager";
import {BoardMemory} from "../services/boardMemory";
import {ExportSaveService} from "../services/export-save.service";


@Component({
  selector: 'app-share-component',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {


  file:any;

  constructor( private exportSaveService:ExportSaveService, private boardServiceService :BoardMemory,public userBarServiceService: UserBarOptionManager) { }

  ngOnInit() {
  }

  fileChanged(e){
    this.file = e.target.files[0];
    this.uploadDocument();
  }

  uploadDocument() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      let t = JSON.parse(fileReader.result.toString())
      console.log("Old JS object translated to JSON format:");
      console.log(JSON.stringify(this.boardServiceService.board));
      this.boardServiceService.board = t;
      console.log("New JSON file translated to JS object:");
      console.log(t);
    }
    fileReader.readAsText(this.file);
  }

  export(){
    this.exportSaveService.downloadFile(JSON.stringify(this.boardServiceService.board));
  }
}
