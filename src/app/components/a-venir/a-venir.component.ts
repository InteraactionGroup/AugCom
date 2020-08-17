import {Component, OnInit} from '@angular/core';
import {MultilinguismService} from "../../services/multilinguism.service";

@Component({
  selector: 'app-a-venir',
  templateUrl: './a-venir.component.html',
  styleUrls: ['./a-venir.component.css']
})
export class AVenirComponent implements OnInit {

  constructor(private multilinguism: MultilinguismService) {
  }

  ngOnInit() {
  }

}
