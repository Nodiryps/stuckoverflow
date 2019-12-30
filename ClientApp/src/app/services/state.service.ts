import { Injectable } from "@angular/core";
import { MatTableState } from "../helpers/mattable.state";

@Injectable({ providedIn: 'root' })
export class StateService {
    public userListState = new MatTableState('id', 'asc', 5); // col, direction, items per page
    public postListState = new MatTableState('id', 'asc', 5);
    public tagListState = new MatTableState('id', 'asc', 5);
    public tagQuestionsState = new MatTableState('id', 'asc', 5);
}