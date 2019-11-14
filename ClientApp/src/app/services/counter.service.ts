import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";
@Injectable({ providedIn: 'root' })
export class CounterService {
    private counterSource = new BehaviorSubject<number>(0);
    public counter$ = this.counterSource.asObservable();
    increment() {
        this.counterSource.next(this.counterSource.getValue() + 1);
    }
    reset() {
        this.counterSource.next(0);
    }
}