import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { APIClient } from '../api.service';


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
    this.showStatByYear();
  }

  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
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
}
