import {Component, OnInit} from '@angular/core';
import {IndexeddbaccessService} from "../../services/indexeddbaccess.service";
import {GeticonService} from "../../services/geticon.service";
import {PaletteService} from "../../services/palette.service";

@Component({
  selector: 'app-palettes',
  templateUrl: './palettes.component.html',
  styleUrls: ['./palettes.component.css']
})
export class PalettesComponent implements OnInit {

  constructor(private indexeddbaccessService: IndexeddbaccessService, private getIconService: GeticonService, public paletteService: PaletteService) {
  }

  paletteCodamne = null;

  ngOnInit() {
  }

  clickOnAdd() {
   if (!this.paletteService.newpalette) {
     this.paletteService.newpalette = true;
   }
  }

  deletePalette() {
    this.paletteService.deletePalette(this.paletteCodamne);
    this.paletteCodamne = null;
    this.indexeddbaccessService.update();
  }

  saveNewPalette() {
    this.paletteService.savePalette();
    this.indexeddbaccessService.update();
  }

  /**
   * return the icon url corresponding to the string s
   * @param s, the string identifying the icon
   * @return the icon url
   */
  getIcon(s: string) {
    return this.getIconService.getIconUrl(s);
  }

}
