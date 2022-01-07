import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-life-companion2aug',
  templateUrl: './life-companion2aug.component.html',
  styleUrls: ['./life-companion2aug.component.css']
})
export class LifeCompanion2augComponent implements OnInit {
  private fileData: string = "";
  private folder: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  convert(file) {
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
        console.log('folder[3] : ', this.folder[3]);
        },200);
  }
}
