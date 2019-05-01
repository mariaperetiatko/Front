import {Injectable} from '@angular/core';
import {Event} from './event';


@Injectable()
export class EventService {
    get(): Promise<Event[]> {
        return Promise.resolve([
            {id: 1, start_date: '2019-05-01 00:00', end_date: '2019-05-01 13:00', text: 'Event 1'},
            {id: 2, start_date: '2019-05-03 00:00', end_date: '2019-05-03 13:00', text: 'Event 2'},
        ]);
    }
}
