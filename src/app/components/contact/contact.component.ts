import {Component, OnInit} from '@angular/core';
import {MultilinguismService} from "../../services/multilinguism.service";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private multilinguism: MultilinguismService) {
  }

  ngOnInit() {
  }

}
