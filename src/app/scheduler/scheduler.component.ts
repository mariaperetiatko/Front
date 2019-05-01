import { Workplace } from './../api.service';
import { List } from 'linqts';
/// <reference types="@types/dhtmlxscheduler" />
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import 'dhtmlx-scheduler';
import {EventService} from '../event.service';
import { APIClient, Building, WorkplaceOrder, Client } from '../api.service';

import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css'],
  providers: [ EventService ]
})
export class SchedulerComponent implements OnInit {

  @ViewChild('scheduler_here') schedulerContainer: ElementRef;

  ready: Promise<any>;
  workplaces = [];
  client;
  ordersDataList = [];

  constructor(public translate: TranslateService, private apiClient: APIClient) {
  }

  check(lang: string) {
    this.translate.currentLang = lang;
    if ((lang === 'uk' && scheduler.locale.labels.dhx_cal_today_button !== 'Сьогодні')
    || (lang === 'en' && scheduler.locale.labels.dhx_cal_today_button !== 'Today')) {
      this.ngOnInit();

    }

  }
    getOrders() {

      this.apiClient.getClientById(0)
      .subscribe((data: Client) => {
        this.apiClient.getWorkplaceOrdersListByClient(data.id, '').
        subscribe ((items: WorkplaceOrder[]) => {
        this.workplaces = items;
        console.log(items);
        for (const item of items) {
          this.apiClient.getWorkplaceById(item.workplaceId)
          .subscribe((workplace: Workplace) => {
            this.apiClient.getBuildingById(workplace.buildingId)
            .subscribe((building: Building) => {

              this.ordersDataList.push({
                'id': workplace.id.toString(),
                'start_date': item.startTime.toLocaleTimeString(),
                'end_date':  item.finishTime.toLocaleTimeString(),
                'text': building.country + ', ' + building.city + ', ' + building.street +
                ', ' + building.house + ', ' + building.flat.toString(),
                'details': item.sumToPay.toString()
              });
              console.log(this.ordersDataList);
            })
          })
        }
// console.log(items);
        })
      });
      let i = 0;
      while(this.ordersDataList.length < this.workplaces.length) {
        i++;
      };
      scheduler.config.xml_date = '%Y-%m-%d %H:%i';
      scheduler.config.limit_time_select = true;
      scheduler.config.first_hour = 9;
      scheduler.config.last_hour = 21;

      scheduler.init(this.schedulerContainer.nativeElement, new Date(2019, 4, 1));
      scheduler.parse(this.ordersDataList, 'json');

    }


    ngOnInit() {
      this.getOrders();

  /*   this.ready.then(() => {*/
        const data = [
            { 'id': '2', 'start_date': '2019-05-01 11:00:00', 'end_date': '2019-05-01 12:00:00', 'text': 'French Open', 'details': 'Philippe-Chatrier Court\n Paris, FRA'},
            { 'id': '3', 'start_date': '2019-05-02 10:00:00', 'end_date': '2019-05-02 12:00:00', 'text': 'Aegon Championship', 'details': 'The Queens Club\n London, ENG'}
          /*  { "id": "4", "start_date": "2017-06-21 00:00:00", "end_date": "2017-07-05 00:00:00", "text": "Wimbledon", "details": "Wimbledon\n June 21, 2009 - July 5, 2009"},
            { "id": "5", "start_date": "2017-06-18 00:00:00", "end_date": "2017-06-27 00:00:00", "text": "Indianapolis Tennis Championship", "details": "Indianapolis Tennis Center\n Indianapolis, IN"},
            { "id": "8", "start_date": "2017-06-27 00:00:00", "end_date": "2017-06-02 00:00:00", "text": "Countrywide Classic Tennis", "details": "Los Angeles Tennis Center.\n Los Angeles, CA  "},
            { "id": "7", "start_date": "2017-06-11 00:00:00", "end_date": "2017-06-18 00:00:00", "text": "ATP Master Tennis", "details": "La Caja Magica.\n Madrid, Spain"}*/
        ];

      /*  scheduler.config.xml_date = '%Y-%m-%d %H:%i';
        scheduler.config.limit_time_select = true;
        scheduler.config.first_hour = 9;
        scheduler.config.last_hour = 21;
*/

        if (this.translate.currentLang === 'uk' && scheduler.locale.labels.dhx_cal_today_button !== 'Сьогодні') {
          scheduler.locale = {
            date: {
              month_full: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
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
              month_full: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
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

        //scheduler.init(this.schedulerContainer.nativeElement, new Date(2019, 4, 1));
        //scheduler.parse(this.ordersDataList, 'json');
alert('yyy');
  }

  }
