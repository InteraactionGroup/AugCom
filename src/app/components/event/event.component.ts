import {Component, OnInit} from '@angular/core';
import {EditionService} from "../../services/edition.service";
import {ParametersService} from "../../services/parameters.service";
import {GeticonService} from "../../services/geticon.service";
import {Interaction} from "../../types";
import {MultilinguismService} from "../../services/multilinguism.service";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  constructor(private multilinguism: MultilinguismService, public getIconService: GeticonService, public parametersService: ParametersService, public editionService: EditionService) {
  }

  ngOnInit() {
  }

  /**
   * Return true if the action identified by actionId exists in the current interaction
   * return false otherwise
   * @param interactionId
   * @param actionId, the string identifying an action
   * @return true if the action identified by actionId exists in the current interaction, false otherwise
   */
  isPartOfTheInteraction(interactionId: string, actionId: string) {
    const currentInterraction: Interaction = this.editionService.interractionList.find(interaction => interaction.ID === interactionId);
    if (currentInterraction != null) {
      const res = currentInterraction.ActionList.find(x => x.ID === actionId);
      return res != null && res !== undefined;
    }
    return false;
  }

  /*get label of the interaction depending on its code name (will be replace by an implementation of multilinguism soon)*/
  getLabel(codeName: string) {
    switch (codeName) {
      case 'display':
        return 'ajouter à la phrase';
      case'say':
        return 'prononcer';
      case 'otherforms':
        return 'afficher les formes alternatives';
      case 'click' :
        return 'click';
      case'longPress':
        return 'appui long';
      case 'doubleClick':
        return 'double click';
    }

  }

  /**
   * Add the action identified by the actionId to the current interaction if it doesn't contain it already,
   * otherwise it delete it from the current interaction
   * @param interractionId
   * @param actionId, the string identifying an action
   */
  addOrRemoveToInteraction(interactionId , actionId: string) {
    const partOfCurrentInter = this.isPartOfTheInteraction(interactionId, actionId);

    const currentInterraction: Interaction = this.editionService.interractionList.find(interaction => interaction.ID === interactionId);

    if ((currentInterraction === null || currentInterraction === undefined) && !partOfCurrentInter) {
      this.editionService.interractionList.push({
        ID: interactionId,
        ActionList: [{ID: actionId, Action: actionId}]
      });
    } else if (!partOfCurrentInter) {
      currentInterraction.ActionList.push({ID: actionId, Action: actionId});
    } else if (partOfCurrentInter) {
      currentInterraction.ActionList = currentInterraction.ActionList.filter(x => x.ID !== actionId);
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
