import {Component, OnInit} from '@angular/core';
import {SnapBarService} from '../../services/snap-bar.service';
import {Ng2ImgMaxService} from "ng2-img-max";

@Component({
  selector: 'app-snap-bar',
  templateUrl: './snap-bar.component.html',
  styleUrls: ['./snap-bar.component.css'],
  providers: [{provide: Ng2ImgMaxService}, SnapBarService]
})
export class SnapBarComponent implements OnInit {

  constructor(public snapBarService: SnapBarService) {
  }

  ngOnInit() {
  }

}
