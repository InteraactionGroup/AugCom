import { Component, OnInit } from '@angular/core';
import {EditionService} from "../../services/edition.service";
import {ParametersService} from "../../services/parameters.service";
import {Action} from "../../types";
import {GeticonService} from "../../services/geticon.service";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  /**
   * the current Interaction index number
   * (by default:
   *      -1 = no interaction selected
   *      0 = click selected
   *      1 = longPress selected
   *      2 = doubleClick selected
   * )
   */
  currentInterractionNumber = -1;

  constructor(public getIconService: GeticonService, public parametersService: ParametersService, public editionService: EditionService) { }

  ngOnInit() {
  }

  isEventDisplayed(){
    return this.editionService.currentEditPage==='Interactions';
  }

  /**
   * update the currentInterractionNumber and the currentInteraction with the interraction identified by i.
   * by default i=0 for click, i=1 for longpress and i=2 for doubleClick
   * return false otherwise
   * @param i, a number
   */
  selectInteraction(i: number) {
    this.currentInterractionNumber = i;
  }

  /**
   * return true if the given number i is the same as the current interaction number 'currentInterractionNumber'
   * return false otherwise
   * @param i, a number
   * @return true if i is the currentInterractionNumber, false otherwise
   */
  isCurrentInteraction(i) {
    return this.currentInterractionNumber === i;
  }

  /**
   * Return true if the action identified by actionId exists in the current interaction
   * return false otherwise
   * @param actionId, the string identifying an action
   * @return true if the action identified by actionId exists in the current interaction, false otherwise
   */
  isPartOfCurrentInteraction(actionId) {
    const inter = this.parametersService.interaction[this.currentInterractionNumber - 1];
    const currentInterraction = this.editionService.interractionList.find(interaction => interaction.InteractionID === inter);
    if (currentInterraction != null) {
      const res = currentInterraction.ActionList.find(x => x.ActionID === actionId);
      return res != null && res !== undefined;
    }
    return false;
  }

  /**
   * Add the action identified by the actionId to the current interaction if it doesn't contain it already,
   * otherwise it delete it from the current interaction
   * @param actionId, the string identifying an action
   */
  addOrRemoveToInteraction(actionId: string) {
    const inter = this.parametersService.interaction[this.currentInterractionNumber - 1];
    const partOfCurrentInter = this.isPartOfCurrentInteraction(actionId);

    const currentInterraction = this.editionService.interractionList.findIndex(interaction => interaction.InteractionID === inter);

    if (currentInterraction === -1 && !partOfCurrentInter) {
      this.editionService.interractionList.push({InteractionID: inter, ActionList: [{ActionID: actionId, Action: actionId}]});
    } else if (!partOfCurrentInter) {
      this.editionService.interractionList[currentInterraction].ActionList.push({ActionID: actionId, Action: actionId});
    } else if (partOfCurrentInter) {
      // tslint:disable-next-line:max-line-length
      this.editionService.interractionList[currentInterraction].ActionList = this.editionService.interractionList[currentInterraction].ActionList.filter(x => x.ActionID !== actionId);
    }

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
