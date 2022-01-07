import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-life-companion2aug',
  templateUrl: './life-companion2aug.component.html',
  styleUrls: ['./life-companion2aug.component.css']
})
export class LifeCompanion2augComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * convert a spb file into a grid
   * @param file file imported
   */
  convert(file) {
    const myFile = file[0];
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
    };
    fileReader.readAsArrayBuffer(myFile);
  }
}
