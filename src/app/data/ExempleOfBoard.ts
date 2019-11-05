import {Grid} from '../types';

export const Board: Grid = {

  GridID: 'gridExample',
  ElementList: [
    {
      ElementID: 'je',
      ElementFolder: '.',
      ElementType: 'button',
      ElementForms: [{DisplayedText: 'je', VoiceText: '', LexicInfos: [{person: 'firstPerson'}, {number: 'singular'}]}],
      ImageID: 'img1',
      InteractionsList: [{ InteractionID: 'click', ActionList: [{ActionID: 'pronomChangeInfo', Action: 'pronomChangeInfo'}] }],
      Color: '#888000'
    },
    {
      ElementID: 'tu',
      ElementFolder: '.',
      ElementType: 'button',
      ElementForms: [{DisplayedText: 'tu', VoiceText: '', LexicInfos: [{person: 'secondPerson'}, {number: 'singular'}]}],
      ImageID: 'img1',
      InteractionsList: [{ InteractionID: 'click', ActionList: [{ActionID: 'pronomChangeInfo', Action: 'pronomChangeInfo'}] }],
      Color: '#880800'
    },
    {
      ElementID: 'il',
      ElementFolder: '.',
      ElementType: 'button',
      ElementForms: [{DisplayedText: 'il', VoiceText: '', LexicInfos: [{person: 'thirdPerson'}, {number: 'singular'}]}],
      ImageID: 'img1',
      InteractionsList: [{ InteractionID: 'click', ActionList: [{ActionID: 'pronomChangeInfo', Action: 'pronomChangeInfo'}] }],
      Color: '#880080'
    },
    {
      ElementID: 'elle',
      ElementFolder: '.',
      ElementType: 'button',
      ElementForms: [{DisplayedText: 'elle', VoiceText: '', LexicInfos: [{person: 'thirdPerson'}, {number: 'singular'}]}],
      ImageID: 'img1',
      InteractionsList: [{ InteractionID: 'click', ActionList: [{ActionID: 'pronomChangeInfo', Action: 'pronomChangeInfo'}] }],
      Color: '#880008'
    },
    {
      ElementID: 'nous',
      ElementFolder: '.',
      ElementType: 'button',
      ElementForms: [{DisplayedText: 'nous', VoiceText: '', LexicInfos: [{person: 'firstPerson'}, {number: 'plural'}]}],
      ImageID: 'img1',
      InteractionsList: [{ InteractionID: 'click', ActionList: [{ActionID: 'pronomChangeInfo', Action: 'pronomChangeInfo'}] }],
      Color: '#808800'
    },
    {
      ElementID: 'vous',
      ElementFolder: '.',
      ElementType: 'button',
      ElementForms: [{DisplayedText: 'vous', VoiceText: '', LexicInfos: [{person: 'secondPerson'}, {number: 'plural'}]}],
      ImageID: 'img1',
      InteractionsList: [{ InteractionID: 'click', ActionList: [{ActionID: 'pronomChangeInfo', Action: 'pronomChangeInfo'}] }],
      Color: '#808080'
    },
    {
      ElementID: 'ils',
      ElementFolder: '.',
      ElementType: 'button',
      ElementForms: [{DisplayedText: 'ils', VoiceText: '', LexicInfos: [{person: 'thirdPerson'}, {number: 'plural'}]}],
      ImageID: 'img1',
      InteractionsList: [{ InteractionID: 'click', ActionList: [{ActionID: 'pronomChangeInfo', Action: 'pronomChangeInfo'}] }],
      Color: '#808008'
    },
    {
      ElementID: 'elles',
      ElementFolder: '.',
      ElementType: 'button',
      ElementForms: [{DisplayedText: 'elles', VoiceText: '', LexicInfos: [{person: 'thirdPerson'}, {number: 'plural'}]}],
      ImageID: 'img1',
      InteractionsList: [{ InteractionID: 'click', ActionList: [{ActionID: 'pronomChangeInfo', Action: 'pronomChangeInfo'}] }],
      Color: '#888800'
    },
  ],
  ImageList: [
    {
      ImageID: 'img1',
      ImageLabel: 'thumb',
      ImagePath: 'assets/images/img1.png'
    },
    {
      ImageID: 'img2',
      ImageLabel: 'thumb',
      ImagePath: 'assets/images/img2.svg'
    }
  ],
  GridType: 'grid',
  GridInfo: 2,
  Style: []

};

