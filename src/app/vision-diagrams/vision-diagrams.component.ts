import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { interval } from 'rxjs';
import { APIClient, Monitoring } from './../api.service';
import { takeWhile, finalize } from 'rxjs/operators';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as moment from 'moment';



@Component({
  selector: 'app-vision-diagrams',
  templateUrl: './vision-diagrams.component.html',
  styleUrls: ['./vision-diagrams.component.css']
})
export class VisionDiagramsComponent implements OnInit {

  monit=1;
  is0 = false;
  is1 = false;
  is2 = false;
  is3 = false;
  is4 = false;
  isRequesting = false;
  pieChartData0: number[];
  pieChartData1: number[];
  pieChartData2: number[];
  pieChartData3: number[];
  pieChartData4: number[];
  date0: Date;
  date1: Date;
  date2: Date;
  date3: Date;
  date4: Date;

  monitorings: Monitoring[];

  lineChartData: ChartDataSets[] = [{ data: [], label: 'Позитивна динаміка' }];

  //    [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
  //  { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
  //  { data: [180, 480, 770, 90, 1000, 270, 400], label: 'Series C', yAxisID: 'y-axis-1' }
  //];

  lineChartLabels: Label[] = [];
  // = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  lineChartOptions: (ChartOptions & { annotation: any }) = {
    legend: {
      labels: {
        boxWidth: 80
      }
    },

    responsive: true,
    maintainAspectRatio: false ,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          ticks: {
          beginAtZero: true,
          suggestedMax:1,
          suggestedMin:0,
          stepSize: 20
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            boxWidth: 80,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  lineChartColors: Color[] = [
    { // grey
      backgroundColor: 'rgba(117,235,162,0.15)',
      borderColor: 'rgba(117,235,162,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }];



    lineChartLegend = true;
    lineChartType = 'line';
    lineChartPlugins = [pluginAnnotations];


  hhh=false;
  lastMonitorings: Monitoring[];
  public pieChartOptions111: ChartOptions = {
    responsive: true,

    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  pieChartLabels111: Label[] = [['Недозволена'], ['Дозволена']];
  pieChartData111: number[];
  pieChartType111: ChartType  = 'pie';
  pieChartLegend111  = true;
  pieChartPlugins111  = [pluginDataLabels];
  pieChartColors111 = [
    {
      backgroundColor: ['rgba(255,0,0,0.2)', 'rgba(0,255,0,0.2)'],
      //, 'rgba(0,0,255,0.3)'
    }
]

  dist = 0;
  /*public pieChartOptions: ChartOptions = {
    responsive: true,

    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = [['Wrong'], ['Right']];
  public pieChartData: number[] = [1, 2.5];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)'],
      //, 'rgba(0,0,255,0.3)'
    },
  ];


  /*public pieChartOptions1: ChartOptions = {
    responsive: true,

    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels1: Label[] = [['Wrong'], ['Right']];
  public pieChartData1: number[] = [1.2, 2.3];
  public pieChartType1: ChartType = 'pie';
  public pieChartLegend1 = true;
  public pieChartPlugins1 = [pluginDataLabels];
  public pieChartColors1 = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)'],
      //, 'rgba(0,0,255,0.3)'
    },
  ];

  public pieChartOptions2: ChartOptions = {
    responsive: true,

    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels2: Label[] = [['Wrong'], ['Right']];
  public pieChartData2: number[] = [0.5, 2];
  public pieChartType2: ChartType = 'pie';
  public pieChartLegend2 = true;
  public pieChartPlugins2 = [pluginDataLabels];
  public pieChartColors2 = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)'],
      //, 'rgba(0,0,255,0.3)'
    },
  ];

*/

  date: Date;

  constructor(private apiClient: APIClient) {
  }

  ngOnInit() {
    // this.showDist();
    // this.getLast();
   // this.fff();
    this.getMonitoringList();
  }

  getMonitoringList() {
    this.isRequesting = true;

    this.apiClient.getMonitoringList()
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: Monitoring []) => {
      this.monitorings = data;
      this.lineChartData[0].data = [];
      for (let i = 0; i < this.monitorings.length; i++) {
        this.lineChartLabels.push(moment(this.monitorings[i].date).format('MM/DD/YYYY'));
        (this.lineChartData[0].data as number[]).push(this.monitorings[i].rightValues);
      }

    });
  }


  getLast() {
    this.isRequesting = true;

    this.apiClient.getLastMonitorings()
    .pipe(finalize(() => this.isRequesting = false))
    .subscribe((data: Monitoring []) => {
      this.lastMonitorings = data;
      console.log(this.lastMonitorings);
      if (this.lastMonitorings.length >= 0)
      {
        this.date0 = this.lastMonitorings[0].date;
        this.pieChartData0 = [1 - this.lastMonitorings[0].rightValues, this.lastMonitorings[0].rightValues];
        this.is0 = true;
      }

      if (this.lastMonitorings.length >= 1)
      {
        this.date1 = this.lastMonitorings[1].date;
        this.pieChartData1 = [1 - this.lastMonitorings[1].rightValues, this.lastMonitorings[1].rightValues];
        this.is1 = true;
      }
      if (this.lastMonitorings.length >= 2)
      {
        this.date2 = this.lastMonitorings[2].date;
        this.pieChartData2 = [1 - this.lastMonitorings[2].rightValues, this.lastMonitorings[2].rightValues];
        this.is2 = true;
      }
      if (this.lastMonitorings.length >= 3)
      {
        this.date3 = this.lastMonitorings[3].date;
        this.pieChartData3 = [1 - this.lastMonitorings[3].rightValues, this.lastMonitorings[3].rightValues];
        this.is3 = true;
      }
      if (this.lastMonitorings.length >= 4)
      {
        this.date4 = this.lastMonitorings[4].date;
        this.pieChartData4 = [1 - this.lastMonitorings[4].rightValues, this.lastMonitorings[4].rightValues];
        this.is4 = true;
      }
  })};


  getStatistics() {

    this.apiClient.getMonitoringByDate(this.date)
    .pipe(finalize(() => this.hhh = true))
      .subscribe((data) => {
        console.log(data);
        this.pieChartData111 = [1 - data.rightValues, data.rightValues];
    })};


  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
  console.log(event, active);
}

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  console.log(event, active);
}

changeLabels() {
  const words = ['hen', 'variable', 'embryo', 'instal', 'pleasant', 'physical', 'bomber', 'army', 'add', 'film',
    'conductor', 'comfortable', 'flourish', 'establish', 'circumstance', 'chimney', 'crack', 'hall', 'energy',
    'treat', 'window', 'shareholder', 'division', 'disk', 'temptation', 'chord', 'left', 'hospital', 'beef',
    'patrol', 'satisfied', 'academy', 'acceptance', 'ivory', 'aquarium', 'building', 'store', 'replace', 'language',
    'redeem', 'honest', 'intention', 'silk', 'opera', 'sleep', 'innocent', 'ignore', 'suite', 'applaud', 'funny'];
  const randomWord = () => words[Math.trunc(Math.random() * words.length)];
  this.pieChartLabels111 = Array.apply(null, { length: 3 }).map(_ => randomWord());
}

addSlice() {
  this.pieChartLabels111.push(['Line 1', 'Line 2', 'Line 3']);
  this.pieChartData111.push(400);
  this.pieChartColors111[0].backgroundColor.push('rgba(196,79,244,0.3)');
}

removeSlice() {
  this.pieChartLabels111.pop();
  this.pieChartData111.pop();
  this.pieChartColors111[0].backgroundColor.pop();
}

changeLegendPosition() {
  this.pieChartOptions111.legend.position = this.pieChartOptions111.legend.position === 'left' ? 'top' : 'left';
}

showDist(): void {
  interval(1000)
    .pipe(takeWhile(() => (true)))
    .subscribe(i => {
      this.distPerform();
    });
}


                 //  set your counter to 1
fff() {

  for (let i=1; i<10; i++) {

    setTimeout( function timer(){
      console.log(this.monit);
      this.monit=i;
    }, 2000 );
}
}



distPerform(): void {
  this.apiClient.getAll()
    .subscribe((data: string[]) => {
      this.dist = parseInt(data[0], 10);
    });
}

}
