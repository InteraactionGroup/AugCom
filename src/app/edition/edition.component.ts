import { Component, OnInit } from '@angular/core';
import {BoardMemory} from "../services/boardMemory";
import { DomSanitizer, SafeResourceUrl, SafeUrl ,SafeStyle} from '@angular/platform-browser';
import {UserBarOptionManager} from "../services/userBarOptionManager";
import { Ng2ImgMaxService } from 'ng2-img-max';




@Component({
  selector: 'app-edition-panel',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.css']
})

export class EditionComponent implements OnInit {

  constructor(private ng2ImgMaxService: Ng2ImgMaxService,public _sanitizer: DomSanitizer, private boardServiceService :BoardMemory, public userBarServiceService: UserBarOptionManager) {
  }
  regex;
 color = "black";
  name = "Enter the name";
  public imagePath;
  public imgURL:any;
  public imgSafeURL: SafeUrl;
  public message: string;
  imageList;

  previewWithURL(t){
    this.imgURL = t;
    this.imgSafeURL=this._sanitizer.bypassSecurityTrustUrl(t);
  }

  previewWrap(textToSearch: string) : boolean{
    var pat = new RegExp(textToSearch+"+",'ig');
    var res2 = pat.test("abbbabAAbbABbc");
    return res2;
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

    this.ng2ImgMaxService.resize([files[0]], 2000, 1000).subscribe(result => {
      reader.readAsDataURL(result);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
        this.imgSafeURL=this._sanitizer.bypassSecurityTrustUrl(this.imgURL);
      }
    },error => {
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
        this.imgSafeURL = this._sanitizer.bypassSecurityTrustUrl(this.imgURL);
      }
    })
  }

  coloPickerValue(){
   return  (<HTMLInputElement>document.getElementById("colorPicker")).value;
  }

  ngOnInit() {
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
