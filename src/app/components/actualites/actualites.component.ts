import {Component, OnInit} from '@angular/core';
import {MultilinguismService} from "../../services/multilinguism.service";

@Component({
  selector: 'app-actualites',
  templateUrl: './actualites.component.html',
  styleUrls: ['./actualites.component.css']
})
export class ActualitesComponent implements OnInit {

  constructor(private multilinguism: MultilinguismService) {
  }

  ngOnInit() {
  }

}
