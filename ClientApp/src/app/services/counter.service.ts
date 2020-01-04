import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class CounterService {
    public score: number = 0;
    private counterSource = new BehaviorSubject<number>(this.score);
    public counter$ = this.counterSource.asObservable();

    increment(score: number) {
        this.counterSource.next(score + 1);
    }
    
    decrement(score: number) {
        this.counterSource.next(score - 1);
    }

    reset() {
        this.counterSource.next(this.score);
    }
}