import {Component, OnInit} from '@angular/core';
import {BoardService} from '../../services/board.service';
import {MultilinguismService} from '../../services/multilinguism.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {

  constructor(public boardService: BoardService, private multilinguism: MultilinguismService) {
  }

  ngOnInit() {
  }

  thenPrint() {
    window.print();
  }
}
