import { Component, OnInit } from '@angular/core';
import { MultilinguismService } from "../../services/multilinguism.service";
import { PrintService } from "../../services/print.service";
import { IndexeddbaccessService } from "../../services/indexeddbaccess.service";

@Component({
  selector: 'app-exportStyle',
  templateUrl: './exportStyle.component.html',
  styleUrls: ['./exportStyle.component.css']
})
export class ExportStyleComponent implements OnInit {

  //Header
  header;
  buttonEnableHeader;
  typeChoice;
  selectedFile;
  textButton = true;
  imgButton = false;
  textPosition = "left";
  buttonEnablePageName;
  buttonEnableVersion;


  //Footer
  footer;
  buttonEnableFooter;
  typeChoiceFooter;
  selectedFileFooter;
  textButtonFooter = true;
  imgButtonFooter = false;
  textPositionFooter = "left";

  constructor(public multilinguism: MultilinguismService,
    public printService: PrintService,
    public indexedDBacess: IndexeddbaccessService) { }

  ngOnInit(): void {
    this.indexedDBacess.update();
    setTimeout(() => {
      //Header
      this.buttonEnableHeader = this.printService.buttonEnableHeader;
      this.buttonEnablePageName = this.printService.enablePageName;
      this.buttonEnableVersion = this.printService.enableVersion;
      this.typeChoice = this.printService.typeChoiceHeader;
      this.textPosition = this.printService.textAlignHeader;
      if (this.typeChoice == "text") {
        this.header = this.printService.header;
      } else {
        this.selectedFile = this.printService.header;
        this.textButton = false;
        this.imgButton = true;
      }

      //Footer
      this.buttonEnableFooter = this.printService.buttonEnableFooter;
      this.typeChoiceFooter = this.printService.typeChoiceFooter;
      this.textPositionFooter = this.printService.textAlignFooter;
      if (this.typeChoiceFooter == "text") {
        this.footer = this.printService.footer;
      } else {
        this.selectedFileFooter = this.printService.footer;
        this.textButtonFooter = false;
        this.imgButtonFooter = true;
      }
    }, 150);
  }


  //--------------------------------------
  //Header functions 
  //--------------------------------------

  choiceType(type) {
    this.typeChoice = type;
    this.printService.typeChoiceHeader = type;
    this.printService.updateConfigHeader(this.header, this.buttonEnableHeader, this.typeChoice);
  }

  enablePageName() {
    this.printService.enablePageName = !this.printService.enablePageName;
    this.buttonEnablePageName = this.printService.enablePageName;
  }

  enableVersion() {
    this.printService.enableVersion = !this.printService.enableVersion;
    this.buttonEnableVersion = this.printService.enableVersion;
  }

  enableHeader() {
    this.printService.buttonEnableHeader = !this.printService.buttonEnableHeader;
    this.buttonEnableHeader = this.printService.buttonEnableHeader;
    this.printService.updateConfigHeader(this.header, this.buttonEnableHeader, this.typeChoice);
  }

  getText(event) {
    this.header = event.target.value;
    this.printService.header = event.target.value;
    this.printService.updateConfigHeader(this.header, this.buttonEnableHeader, this.typeChoice);
  }

  getPosition(value) {
    this.textPosition = value;
    this.printService.textAlignHeader = value;
  }

  onFileSelected(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.selectedFile = reader.result;
      this.printService.header = reader.result;
      this.printService.updateConfigHeader(this.header, this.buttonEnableHeader, this.typeChoice);
    };

    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

  //--------------------------------------
  //Footer functions 
  //--------------------------------------

  choiceTypeFooter(type) {
    this.typeChoiceFooter = type;
    this.printService.typeChoiceFooter = type;
    this.printService.updateConfigFooter(this.footer, this.buttonEnableFooter, this.typeChoiceFooter);
  }

  enableFooter() {
    this.printService.buttonEnableFooter = !this.printService.buttonEnableFooter;
    this.buttonEnableFooter = this.printService.buttonEnableFooter;
    this.printService.updateConfigFooter(this.footer, this.buttonEnableFooter, this.typeChoiceFooter);
  }

  getTextFooter(event) {
    this.footer = event.target.value;
    this.printService.footer = event.target.value;
    this.printService.updateConfigFooter(this.footer, this.buttonEnableFooter, this.typeChoiceFooter);
  }

  getPositionFooter(value) {
    this.textPositionFooter = value;
    this.printService.textAlignFooter = value;
  }

  onFileSelectedFooter(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.selectedFileFooter = reader.result;
      this.printService.footer = reader.result;
      this.printService.updateConfigFooter(this.footer, this.buttonEnableFooter, this.typeChoiceFooter);
    };

    reader.onerror = (error) => {
      console.log('Error: ', error);
    };
  }

}
