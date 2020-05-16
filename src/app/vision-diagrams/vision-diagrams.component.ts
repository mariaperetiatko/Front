import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { interval } from 'rxjs';
import { APIClient, Monitoring } from './../api.service';
import { takeWhile } from 'rxjs/operators';


@Component({
  selector: 'app-vision-diagrams',
  templateUrl: './vision-diagrams.component.html',
  styleUrls: ['./vision-diagrams.component.css']
})
export class VisionDiagramsComponent implements OnInit {


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
  pieChartLabels111: Label[];
  pieChartData111: number[];
  pieChartType111: ChartType;
  pieChartLegend111;
  pieChartPlugins111;
  pieChartColors111 = [];



  dist = 0;
  public pieChartOptions: ChartOptions = {
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


  public pieChartOptions1: ChartOptions = {
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



  date: Date;

  constructor(private apiClient: APIClient) {
  }

  ngOnInit() {
    // this.showDist();
  }

  getStatistics() {
    console.log(this.date);
    this.apiClient.getMonitoringByDate(this.date)
      .subscribe((data) => {
        console.log(data);
        this.pieChartLabels111 = [['Wrong'], ['Right']];
        this.pieChartData111 = [1 - data.rightValues, data.rightValues];
        this.pieChartType111 = 'pie';
        this.pieChartLegend111 = true;
        this.pieChartPlugins111 = [pluginDataLabels];
        this.pieChartColors111 = [
          {
            backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)'],
            //, 'rgba(0,0,255,0.3)'
          }
      ]
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
  this.pieChartLabels = Array.apply(null, { length: 3 }).map(_ => randomWord());
}

addSlice() {
  this.pieChartLabels.push(['Line 1', 'Line 2', 'Line 3']);
  this.pieChartData.push(400);
  this.pieChartColors[0].backgroundColor.push('rgba(196,79,244,0.3)');
}

removeSlice() {
  this.pieChartLabels.pop();
  this.pieChartData.pop();
  this.pieChartColors[0].backgroundColor.pop();
}

changeLegendPosition() {
  this.pieChartOptions.legend.position = this.pieChartOptions.legend.position === 'left' ? 'top' : 'left';
}

showDist(): void {
  interval(1000)
    .pipe(takeWhile(() => (true)))
    .subscribe(i => {
      this.distPerform();
    });
}

distPerform(): void {
  this.apiClient.getAll()
    .subscribe((data: string[]) => {
      this.dist = parseInt(data[0], 10);
    });
}

}
