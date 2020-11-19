import {Component, OnInit} from '@angular/core';
import {SnapBarService} from '../../services/snap-bar.service';
import {MultilinguismService} from '../../services/multilinguism.service';

@Component({
  selector: 'app-snap-bar',
  templateUrl: './snap-bar.component.html',
  styleUrls: ['./snap-bar.component.css']
})
export class SnapBarComponent implements OnInit {

  constructor(public snapBarService: SnapBarService) {
  }

  ngOnInit() {
  }

}
