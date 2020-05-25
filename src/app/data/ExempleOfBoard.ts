import {Grid} from '../types';
import defaultgrid from '../../assets/defaultsave.json';
import schema from '../../assets/schemas/saveSchema.json';
import Ajv from 'ajv';

/**
 * the initial grid displayed when accessing the app for the first time
 */
export const Board: Grid = getCheckedGrid();

function getCheckedGrid() {
  var ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
  var validate = ajv.compile(schema);
  var valid = validate(defaultgrid);
  if (!valid) {
    console.log("ERROR!");
    console.log(validate.errors);
    return <Grid>defaultgrid;
  } else {
    console.log("NoERROR!");
    return <Grid>defaultgrid;
  }
}


