import { Component, OnInit, Input } from "@angular/core";
import { Element } from "../../types";
import { BoardService } from "src/app/services/board.service";

@Component({
  selector: "app-tile",
  templateUrl: "./tile.component.html",
  styleUrls: ["./tile.component.css"],
})
export class TileComponent implements OnInit {
  @Input() element: Element;

  constructor(public boardService: BoardService) {}

  ngOnInit(): void {}
}
