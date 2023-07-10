import { Component, OnInit } from '@angular/core';
import { MultilinguismService } from "../../services/multilinguism.service";

@Component({
  selector: 'app-mention',
  templateUrl: './mention.component.html',
  styleUrls: ['./mention.component.css']
})
export class MentionComponent implements OnInit {

  constructor(public multilinguismService: MultilinguismService) { }

  ngOnInit(): void {
  }

}
