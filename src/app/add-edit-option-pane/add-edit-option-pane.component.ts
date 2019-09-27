import { Component, OnInit } from '@angular/core';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {BoardMemory} from "../services/boardMemory";
import {UserBarOptionManager} from "../services/userBarOptionManager";

@Component({
  selector: 'app-add-edit-option-pane',
  templateUrl: './add-edit-option-pane.component.html',
  styleUrls: ['./add-edit-option-pane.component.css']
})
export class AddEditOptionPaneComponent implements OnInit {

  constructor(private _sanitizer: DomSanitizer, private boardServiceService :BoardMemory, private userBarServiceService: UserBarOptionManager) {
  }

  color = "black";
  name = "Enter the name";
  file:any;
  public imagePath;
  public imgURL:any;
  public imgSafeURL: SafeUrl;
  public message: string;

  ngOnInit() {
  }

  preview(files) {
    if (files.length === 0)
      return;

    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }

    var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
      this.imgSafeURL=this._sanitizer.bypassSecurityTrustUrl(this.imgURL);
    }
  }

  coloPickerValue(){
    return  (<HTMLInputElement>document.getElementById("colorPicker")).value;
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


  createNewButton(){
    let path = "";
    if ((<HTMLInputElement>document.getElementById("radioButton")).checked){
      path = "";
    }else if ((<HTMLInputElement>document.getElementById("radioFolder")).checked){
      path = (<HTMLInputElement>document.getElementById("nameID")).value;
    }


    this.boardServiceService.board.boutons.push(
      { id: "99",
        extCboardLabelKey: this.boardServiceService.folder,
        label: (<HTMLInputElement>document.getElementById("nameID")).value,
        backgroundColor: (<HTMLInputElement>document.getElementById("colorID")).value,
        imageId: "im5"+(<HTMLInputElement>document.getElementById("nameID")).value,
        loadBoard: {name: "99", path: path}});

    this.boardServiceService.board.images.push(
      {  id: "im5"+(<HTMLInputElement>document.getElementById("nameID")).value,
        path: this.imgURL,
        contentType: '',
        width: 300,
        height: 300});

    this.userBarServiceService.addEditOptionEnabled=false;
  }
  getColor(){
    console.log((<HTMLInputElement>document.getElementById("colorID")).value);
  }
}
