import {Component, OnInit} from '@angular/core';
import {SnapBarService} from '../../services/snap-bar.service';
import {Ng2ImgMaxService} from "ng2-img-max";
import {MultilinguismService} from "../../services/multilinguism.service";

@Component({
  selector: 'app-snap-bar',
  templateUrl: './snap-bar.component.html',
  styleUrls: ['./snap-bar.component.css']
})
export class SnapBarComponent implements OnInit {

  constructor(private multilinguism: MultilinguismService, public snapBarService: SnapBarService) {
  }

  ngOnInit() {
  }

}
