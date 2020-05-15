/// <reference types="@types/dhtmlxscheduler" />
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import 'dhtmlx-scheduler';
import { APIClient, Client, Scheduler} from '../api.service';

import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
})
export class SchedulerComponent implements OnInit {

  @ViewChild('scheduler_here') schedulerContainer: ElementRef;

  ready: Promise<any>;
  workplaces = [];
  client: Client;
  isRequesting = false;

  constructor(public translate: TranslateService, private apiClient: APIClient) {
  }

  check(lang: string) {
    this.translate.currentLang = lang;
    if ((lang === 'uk' && scheduler.locale.labels.dhx_cal_today_button !== 'Сьогодні')
    || (lang === 'en' && scheduler.locale.labels.dhx_cal_today_button !== 'Today')) {
      this.ngOnInit();
    }
  }

  onDel(id: number) {
    this.isRequesting = true;
    this.apiClient.deleteWorkplaceOrder(id)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe(result => console.log(result));
  }

  ngOnInit() {
    this.isRequesting = true;

    this.apiClient.getSchedule(1)
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((res: Scheduler[]) => {
      console.log('res');
      console.log(res);

      scheduler.config.xml_date = '%Y-%m-%d %H:%i';
      scheduler.config.limit_time_select = true;
      scheduler.config.first_hour = 7;
      scheduler.config.last_hour = 21;
      scheduler.attachEvent('onEventDeleted', (id, ev) => {
          this.onDel(id);
      });
      scheduler.config.readonly = true;



      if (this.translate.currentLang === 'uk' && scheduler.locale.labels.dhx_cal_today_button !== 'Сьогодні') {
        scheduler.locale = {
          date: {
            month_full: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень',
            'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
            month_short: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
            day_full: ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'],
            day_short: ['Нед', 'Пон', 'Вів', 'Сер', 'Чет', 'Птн', 'Суб']
          },
          labels: {
            dhx_cal_today_button: 'Сьогодні',
            day_tab: 'День',
            week_tab: 'Тиждень',
            month_tab: 'Місяць',
            new_event: 'Нова подія',
            icon_save: 'Зберегти',
            icon_cancel: 'Відміна',
            icon_details: 'Деталі',
            icon_edit: 'Редагувати',
            icon_delete: 'Вилучити',
            confirm_closing: '', // Ваші зміни втратяться. Ви впевнені ?
            confirm_deleting: 'Подія вилучиться назавжди. Ви впевнені?',
            section_description: 'Опис',
            section_time: 'Часовий проміжок',
            unit_tab: 'unit_tab'
          }
        };
      } else if (this.translate.currentLang  === 'en' && scheduler.locale.labels.dhx_cal_today_button !== 'Today') {
        scheduler.locale = {
          date: {
            month_full: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
              'November', 'December'],
            month_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            day_full: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            day_short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          },
          labels: {
            dhx_cal_today_button: 'Today',
            day_tab: 'Day',
            week_tab: 'Week',
            month_tab: 'Month',
            new_event: 'New event',
            icon_save: 'Save',
            icon_cancel: 'Cancel',
            icon_details: 'Details',
            icon_edit: 'Edit',
            icon_delete: 'Delete',
            confirm_closing: '', // Your changes will be lost, are your sure ?
            confirm_deleting: 'Event will be deleted permanently, are you sure?',
            section_description: 'Description',
            section_time: 'Time period',
            unit_tab: 'unit_tab'
          }
        };
      }
      scheduler.init(this.schedulerContainer.nativeElement, new Date());
      scheduler.parse(res, 'json');
    });
  }
}

