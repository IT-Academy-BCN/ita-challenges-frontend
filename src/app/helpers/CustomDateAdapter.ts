import {NativeDateAdapter} from "@angular/material/core";
import {Injectable} from "@angular/core";

@Injectable()
export class CustomDateAdapter extends NativeDateAdapter {

  /*
  0-Sunday
  1-Monday
  2-Tuesday
  3- ...
   */

  override getFirstDayOfWeek(): number {
    return 1;
  }

}
