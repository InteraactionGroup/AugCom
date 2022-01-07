import { Component, OnInit } from '@angular/core';
import {NgxXmlToJsonService} from 'ngx-xml-to-json';

@Component({
  selector: 'app-life-companion2aug',
  templateUrl: './life-companion2aug.component.html',
  styleUrls: ['./life-companion2aug.component.css']
})
export class LifeCompanion2augComponent implements OnInit {
  private fileData: string = "";
  private folder: string[] = [];

  constructor(private ngxXmlToJsonService: NgxXmlToJsonService) {}

  ngOnInit(): void {
  }

  convert(file) {
    const options = { // set up the default options
      textKey: 'text', // tag name for text nodes
      attrKey: 'attr', // tag for attr groups
      cdataKey: 'cdata', // tag for cdata nodes (ignored if mergeCDATA is true)
    };
    const jsZip = require('jszip');
    jsZip.loadAsync(file[0]).then((zip) => {
      Object.keys(zip.files).forEach((filename) => {
        zip.files[filename].async('string').then((fileData) => {
          this.fileData = this.fileData + '**$$##$$**' + fileData;
          this.folder.push(fileData);
        });
      });
    });
    //give time to read the file
    setTimeout(()=> {
      const fileJson = this.ngxXmlToJsonService.xmlToJson(this.folder[3], options);
      console.log('folder[3] : ', this.folder[3]);
      console.log('fileJson : ', fileJson);
      },200);
  }
}
