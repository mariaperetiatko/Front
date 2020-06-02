/*import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { APIClient, Building } from '../api.service';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  yearForYear = 2019;
  yearForMonth = 2019;
  monthForMonth = 5;
  buildingIdForYear = 2;
  buildingIdForMonth = 2;
  buildingIdForWeek = 2;
  isYearVisible = true;
  isMonthVisible = true;
  isWeekVisible = true;
  buildings: Building[] = [];


  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartLabelsForYear: Label[] = [];
  public barChartLabelsForMonth: Label[] = [];
  public barChartLabelsForWeek: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartDataForYear: ChartDataSets[] = [{data: [], label: 'Attendance'}];
  public barChartDataForMonth: ChartDataSets[] = [{data: [], label: 'Attendance'}];
  public barChartDataForWeek: ChartDataSets[] = [{data: [], label: 'Attendance'}];

  constructor(private apiClient: APIClient) { }

  ngOnInit() {
    this.buildingIdForYear = 2;
    this.showStatByYear();
    this.getBuildings();
  }

  getBuildings() {
    this.apiClient.getBuildingsList()
    .subscribe((res: Building[]) => {
      this.buildings = res;
    });
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  changeYearBuilding(buildYearId: number) {
    this.buildingIdForYear = buildYearId;
    this. showStatByYear();
  }

  showStatByYear() {
    this.apiClient.getStatisticsByYear(this.yearForYear, this.buildingIdForYear)
    .subscribe((res) => {
      this.isYearVisible = true;
      this.isMonthVisible = false;
      this.isWeekVisible = false;
      this.barChartLabelsForYear = Object.keys(res);
      this.barChartDataForYear[0].data = Object.values(res);
    });
  }

  changeMonthBuilding(buildMonthId: number) {
    this.buildingIdForMonth = buildMonthId;
    this. showStatByMonth();
  }

  showStatByMonth() {
    this.apiClient.getStatisticsByMonth(this.yearForMonth, this.monthForMonth, this.buildingIdForMonth)
    .subscribe((res) => {
      this.isYearVisible = false;
      this.isMonthVisible = true;
      this.isWeekVisible = false;
      this.barChartLabelsForMonth = Object.keys(res);
      this.barChartDataForMonth[0].data = Object.values(res);
    });
  }

  changeWeekBuilding(buildWeekId: number) {
    this.buildingIdForWeek = buildWeekId;
    this. showStatByWeek();
  }

  showStatByWeek() {
    this.apiClient.getAverageStatisticsByWeek(this.buildingIdForWeek)
    .subscribe((res) => {
      this.isYearVisible = false;
      this.isMonthVisible = false;
      this.isWeekVisible = true;
      this.barChartLabelsForWeek = Object.keys(res);
      this.barChartDataForWeek[0].data = Object.values(res);
      });
  }
}*/


import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { APIClient, Building } from '../api.service';
import { finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  yearForYear = 2019;
  yearForMonth = 2019;
  monthForMonth = 5;
  buildingIdForYear = 2;
  buildingIdForMonth = 2;
  buildingIdForWeek = 2;
  isYearVisible = true;
  isMonthVisible = true;
  isWeekVisible = true;
  buildings: Building[] = [];
  isRequesting = false;

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  public barChartLabelsForYear: Label[] = [];
  public barChartLabelsForMonth: Label[] = [];
  public barChartLabelsForWeek: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartDataForYear: ChartDataSets[] = [{data: [], label: 'Відвідуваність'}];
  public barChartDataForMonth: ChartDataSets[] = [{data: [], label: 'Відвідуваність'}];
  public barChartDataForWeek: ChartDataSets[] = [{data: [], label: 'Відвідуваність'}];

  constructor(private apiClient: APIClient, private translate: TranslateService) { }

  ngOnInit() {
    this.showStatByYear();
   // this.getBuildings();
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  changeYearBuilding(buildYearId: number) {
    this.buildingIdForYear = buildYearId;
    this. showStatByYear();
  }

  showStatByYear() {
    this.isRequesting = true;
    this.apiClient.getClientStatisticsByYear()
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((res) => {
      this.isYearVisible = true;
      this.isMonthVisible = false;
      this.isWeekVisible = false;
      this.barChartLabelsForYear = Object.keys(res);
      this.barChartDataForYear[0].data = Object.values(res);
    });
  }

  changeMonthBuilding(buildMonthId: number) {
    this.buildingIdForMonth = buildMonthId;
    this. showStatByMonth();
  }

  showStatByMonth() {
    this.isRequesting = true;
    this.apiClient.getClientStatisticsByMonth()
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((res) => {
      this.isYearVisible = false;
      this.isMonthVisible = true;
      this.isWeekVisible = false;
      this.barChartLabelsForMonth = Object.keys(res);
      this.barChartDataForMonth[0].data = Object.values(res);
    });
  }

  changeWeekBuilding(buildWeekId: number) {
    this.buildingIdForWeek = buildWeekId;
    this. showStatByWeek();
  }

  showStatByWeek() {
    this.isRequesting = true;
    this.apiClient.getClientStatisticsByWeek()
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((res) => {
      this.isYearVisible = false;
      this.isMonthVisible = false;
      this.isWeekVisible = true;
      this.barChartLabelsForWeek = Object.keys(res);
      this.barChartDataForWeek[0].data = Object.values(res);
      });
  }
}
