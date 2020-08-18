import {Component, OnInit} from '@angular/core';
import {MultilinguismService} from '../../services/multilinguism.service';

@Component({
  selector: 'app-error-on-edit',
  templateUrl: './error-on-edit.component.html',
  styleUrls: ['./error-on-edit.component.css']
})
export class ErrorOnEditComponent implements OnInit {

  constructor(private multilinguism: MultilinguismService) {
  }

  ngOnInit() {
  }

}
