import { Component, OnInit } from '@angular/core';
import { IndexeddbaccessService } from '../../services/indexeddbaccess.service';
import { GeticonService } from '../../services/geticon.service';
import { PaletteService } from '../../services/palette.service';
import { MultilinguismService } from '../../services/multilinguism.service';

@Component({
  selector: 'app-palettes',
  templateUrl: './palettes.component.html',
  styleUrls: ['./palettes.component.css']
})
export class PalettesComponent implements OnInit {

  constructor(public multilinguism: MultilinguismService,
    public indexeddbaccessService: IndexeddbaccessService,
    public getIconService: GeticonService,
    public paletteService: PaletteService) {
  }

  ngOnInit() {
  }

  /*open the palette creation tool after clicking on add new palette button*/
  clickOnAdd() {
    if (!this.paletteService.newpalette) {
      this.paletteService.newpalette = true;
    }
  }

  /*delete selected palette and remove it from indexeddb*/
  deletePalette() {
    this.paletteService.deletePalette(this.paletteService.paletteCodamne);
    this.paletteService.paletteCodamne = null;
    this.indexeddbaccessService.update();
  }

  /*save the new created palette and add it to the indexeddb*/
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
