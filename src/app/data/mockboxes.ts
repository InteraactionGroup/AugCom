import {Box} from './box';

export const Boxes: Box[] = [
  {parent: 'root', id: '0', name: '1:1', type: 'elt'},
  {parent: 'root', id: '1', name: '1:2', type: 'elt'},
  {parent: 'root', id: '2', name: '1:3', type: 'elt'},
  {parent: 'root', id: '3', name: '1:4', type: 'elt'},
  {parent: 'root', id: '4', name: '1:5', type: 'elt'},

  {parent: 'root', id: '5', name: '2:1', type: 'elt'},
  {parent: 'root', id: '6', name: '2:2', type: 'cat'},
  {parent: '6', id: '17', name: '2:2-1:1', type: 'elt'},
  {parent: '6', id: '18', name: '2:2-1:2', type: 'elt'},
  {parent: '6', id: '19', name: '2:2-1:3', type: 'cat'},
  {parent: '19', id: '20', name: '2:2-1:3-1:1', type: 'elt'},


  {parent: 'root', id: '7', name: '2:3', type: 'elt'},
  {parent: 'root', id: '8', name: '2:4', type: 'elt'},
  {parent: 'root', id: '9', name: '2:5', type: 'elt'},

  {parent: 'root', id: '10', name: '3:1', type: 'elt'},
  {parent: 'root', id: '11', name: '3:2', type: 'elt'},
  {parent: 'root', id: '12', name: '3:3', type: 'elt'},
  {parent: 'root', id: '13', name: '3:4', type: 'elt'},
  {parent: 'root', id: '14', name: '3:5', type: 'cat'},
  {parent: '14', id: '15', name: '3:5-1:1', type: 'elt'},
  {parent: '14', id: '16', name: '3:5-1:2', type: 'elt'},
];
