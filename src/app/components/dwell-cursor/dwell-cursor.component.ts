import {Component, OnInit} from '@angular/core';
import {DwellCursorService} from "../../services/dwell-cursor.service";
import {ConfigurationService} from "../../services/configuration.service";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dwell-cursor',
  templateUrl: './dwell-cursor.component.html',
  styleUrls: ['./dwell-cursor.component.css']
})
export class DwellCursorComponent implements OnInit {

  constructor(public dwellCursorService: DwellCursorService,
    public configurationService: ConfigurationService) {

  }

  ngOnInit(): void {
    const cursor = document.getElementById('cursor');
    document.addEventListener('mousemove', e => {
      if (this.configurationService.DWELL_TIME_ENABLED) {
        cursor.setAttribute(
          "style",
          "top: " + this.dwellCursorService.y + "px;"+
          " left: " + this.dwellCursorService.x + "px;"+
          "opacity:" + this.getCursorOpacity())
      }
    });

  }

  /**
   * Checks if the progress indicator if visible or not
   * @returns 1 if so, 0 else
   */
  public getCursorOpacity() {
    return (this.configurationService.DWELL_TIME_ENABLED && this.dwellCursorService.visible && this.dwellCursorService.started) ? '1' : '0'
  }

}
