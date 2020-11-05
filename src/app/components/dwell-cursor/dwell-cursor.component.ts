import { Component, OnInit } from '@angular/core';
import {DwellCursorService} from "../../services/dwell-cursor.service";

@Component({
  selector: 'app-dwell-cursor',
  templateUrl: './dwell-cursor.component.html',
  styleUrls: ['./dwell-cursor.component.css']
})
export class DwellCursorComponent implements OnInit {

  constructor(public dwellCursorService: DwellCursorService) {

  }

  ngOnInit(): void {
    const cursor = document.getElementById('cursor');

    document.addEventListener('mousemove', e => {
      cursor.setAttribute("style", "top: "+(e.pageY - 10)+"px; left: "+(e.pageX - 10)+"px;opacity:"+ this.getCursorOpacity())
    });

  }

  public getCursorOpacity(){
    return (this.dwellCursorService.visible&&this.dwellCursorService.started)?'1':'0'
  }

}
