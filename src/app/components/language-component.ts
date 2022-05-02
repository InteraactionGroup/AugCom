import {ConfigurationService} from "../services/configuration.service";
import {ActivatedRoute} from "@angular/router";

export class LanguageComponent {

  public constructor(
    public configurationService: ConfigurationService,
    public route: ActivatedRoute) {
  }

  getAndSetLanguageValueIfNeeded() {
    let lang = String(this.route.snapshot.paramMap.get('lang'));
    if (lang != null && lang != '') {
      this.configurationService.LANGUAGE_VALUE = lang;
    }
  }

}
