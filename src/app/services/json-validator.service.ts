import {Injectable} from '@angular/core';
import Ajv from 'ajv';
import schema from '../../assets/schemas/saveSchema.json';
import defaultGrid from '../../assets/defaultsave.json';
import {Grid} from '../types';

@Injectable({
  providedIn: 'root'
})
export class JsonValidatorService {

  constructor() {
  }

  getCheckedGrid(dataToValidate): Grid {
    const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}
    const validate = ajv.compile(schema);
    const valid = validate(dataToValidate);
    if (!valid) {
      console.log('ERROR WHEN PARSING THE GRID:');
      console.log(validate.errors);
      console.log('DEFAULT GRID USED INSTEAD');
      return defaultGrid as unknown as Grid;
    } else {
      // console.log("PARSING SUCCESSFUL");
      return dataToValidate as Grid;
    }
  }

}
