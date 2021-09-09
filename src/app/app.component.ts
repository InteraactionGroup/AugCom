import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'AugCom';
  operaAgent: boolean;
  firefoxAgent: boolean;
  safariAgent: boolean;
  chromeAgent: boolean;
  IExplorerAgent: boolean;
  acceptTheRisk: boolean = false;

  userAcceptTheRisk() {
    this.acceptTheRisk = true;
  }

  checkBrowser() {
    // Get the user-agent string
    let userAgentString =
      navigator.userAgent;
    console.log('userAgentString', userAgentString);
    // Detect Chrome
    this.chromeAgent =
      userAgentString.indexOf("Chrome") > -1;

    // Detect Internet Explorer
    this.IExplorerAgent =
      userAgentString.indexOf("MSIE") > -1 ||
      userAgentString.indexOf("rv:") > -1;

    // Detect Firefox
    this.firefoxAgent =
      userAgentString.indexOf("Firefox") > -1;

    // Detect Safari
    this.safariAgent =
      userAgentString.indexOf("Safari") > -1;

    // Discard Safari since it also matches Chrome
    if ((this.chromeAgent) && (this.safariAgent))
      this.safariAgent = false;

    // Detect Opera
    this.operaAgent =
      userAgentString.indexOf("OP") > -1;

    // Discard Chrome since it also matches Opera
    if ((this.chromeAgent) && (this.operaAgent))
      this.chromeAgent = false;

    if(document.querySelector(".output-safari") !== null){
      document.querySelector(".output-safari").textContent
        = String(this.safariAgent);
    }
    if(document.querySelector(".output-chrome") !== null) {
      document.querySelector(".output-chrome").textContent
        = String(this.chromeAgent);
    }
    if(document.querySelector(".output-ie") !== null) {
      document.querySelector(".output-ie").textContent
        = String(this.IExplorerAgent);
    }
    if(document.querySelector(".output-opera") !== null) {
      document.querySelector(".output-opera").textContent
        = String(this.operaAgent);
    }
    if(document.querySelector(".output-firefox") !== null) {
      document.querySelector(".output-firefox").textContent
        = String(this.firefoxAgent);
    }
  }

  ngOnInit(): void {
    this.checkBrowser();
  }
}
