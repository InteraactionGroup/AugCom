import {Component, OnInit} from '@angular/core';
import {BoardMemory} from "../services/boardMemory";
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {UserBarOptionManager} from "../services/userBarOptionManager";
import {Ng2ImgMaxService} from 'ng2-img-max';
import {MulBerryObject} from "../data/mulBerryFile";
import  mullberryJson from "../.././assets/picto/mulberry-symbols/symbol-info.json";
import {DBnaryReader} from "../data/dbnaryReader";

@Component({
  selector: 'app-edition-panel',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.css']
})

export class EditionComponent implements OnInit {

  regex;
  color = "black";
  name = "Enter the name";
  public radioButtonType;
  public wordList = [];
  public typeList = [];
  public imagePath;
  public imgURL: any;
  public imgSafeURL: SafeUrl;
  public imgSafeMulberry: SafeUrl;
  public message: string;
  imageList: any[];
  public radioButtonValue ="radiobutton";


  constructor(private ng2ImgMaxService: Ng2ImgMaxService, public _sanitizer: DomSanitizer, private boardServiceService: BoardMemory, public userBarServiceService: UserBarOptionManager) {
    this.imageList = [];
  }

  getWordList(){
    let dico = new DBnaryReader();
    let tempDicoResults = dico.getWord(this.name);
    this.wordList = tempDicoResults.wordlist;
    this.typeList = tempDicoResults.typelist;

  }
  displayVariant(b){
    let temp = [];
    this.wordList.forEach(function(value){
      if(value.type === b) {
        temp.push(value);
      }
    });
    return temp;
  }

  gettypeof(b){
    return  b.type;
  }
  previewWithURL(t) {
    this.imgURL = t;
    this.imgSafeURL = this._sanitizer.bypassSecurityTrustUrl(t);
  }


  previewLib(b:string){
    this.imgURL= 'assets/picto/mulberry-symbols/EN-symbols/'+b+'.svg';
  this.imgSafeURL= this._sanitizer.bypassSecurityTrustUrl(this.imgURL);
  }

  uploadDocument(text: string) {
    this.imageList = [];
    let tempList =[];
    (<MulBerryObject[]> mullberryJson).forEach(function(value) {
      if(text!=null && text!="" && value.symbol.toLowerCase().includes(text.toLocaleLowerCase())){
        let url = value.symbol;
        tempList.push(url);
        tempList=tempList.sort((a:string,b:string)=> {
          if(a.toLowerCase().startsWith(text.toLowerCase())&&b.toLowerCase().startsWith(text.toLowerCase())) {
           return a.length - b.length;
          }else if(a.toLowerCase().startsWith(text.toLowerCase())){
            return -1;
          }else{
            return 1;
          }

        }
          )
      }
    },this);
    this.imageList = tempList.slice(0,100)
  }

  getImgFromlib(textToSearch: string): string[] {
    /*var pat = new RegExp(textToSearch + "+", 'ig');
    var res2 = pat.test("abbbabAAbbABbc");
    return ["a","b"];*/
    return this.imageList;
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

    this.imgURL = 'assets/images/load.gif';
    this.imgSafeURL = this._sanitizer.bypassSecurityTrustUrl(this.imgURL);

    this.ng2ImgMaxService.resize([files[0]], 1000, 1000).subscribe(result => {
      reader.readAsDataURL(result);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
        this.imgSafeURL = this._sanitizer.bypassSecurityTrustUrl(this.imgURL);
      }
    }, error => {
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        this.imgURL = reader.result;
        this.imgSafeURL = this._sanitizer.bypassSecurityTrustUrl(this.imgURL);
      }
    })
  }

  coloPickerValue() {
    return (<HTMLInputElement>document.getElementById("colorPicker")).value;
  }

  ngOnInit() {
  }

  createNewButton() {
    let path = "";
    if ((<HTMLInputElement>document.getElementById("radioButton")).checked) {
      path = "";
    } else if ((<HTMLInputElement>document.getElementById("radioFolder")).checked) {
      path = (<HTMLInputElement>document.getElementById("nameID")).value;
    }


    let temp :{form: string, formInfo: string[]}[] = [];
    let that = this;
    this.wordList.forEach(function(value){
      if(value.type === that.radioButtonType) {
        temp.push({form: value.writtenRep,formInfo:value.formInfo });
      }
    });

    this.boardServiceService.board.boutons.push(
      {
        id: "99",
        extCboardLabelKey: this.boardServiceService.folder,
        label: (<HTMLInputElement>document.getElementById("nameID")).value,
        backgroundColor: (<HTMLInputElement>document.getElementById("colorID")).value,
        imageId: "im5" + (<HTMLInputElement>document.getElementById("nameID")).value,
        loadBoard: {path: path} ,alternativeFroms: temp
      });

    this.boardServiceService.board.images.push(
      {
        id: "im5" + (<HTMLInputElement>document.getElementById("nameID")).value,
        path: this.imgURL,
        contentType: '',
        width: 300,
        height: 300
      });

    this.userBarServiceService.addEditOptionEnabled = false;
  }

  getColor() {
    console.log((<HTMLInputElement>document.getElementById("colorID")).value);
  }
}
