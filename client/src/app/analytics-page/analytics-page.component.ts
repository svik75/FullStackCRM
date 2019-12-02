import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { AnalyticsPage } from '../shared/services/interfaces';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';
import { MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('gain', null) gainRef: ElementRef;
  @ViewChild('order', null) orderRef: ElementRef;

  average: number;
  pending = true;
  aSub: Subscription;

  constructor(private service: AnalyticsService) { }
// -------------------------------------------------------
  ngAfterViewInit() {
    const gainConfig: any = {
      label: 'выручка',
      color: 'rgb(255,132,25)',
    };
    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    };

    this.aSub = this.service.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average;

      gainConfig.labels = data.chart.map(item => item.label);
      gainConfig.data = data.chart.map(item => item.gain);
      orderConfig.labels = data.chart.map(item => item.label);
      orderConfig.data = data.chart.map(item => item.order);

      const gainCtx = this.gainRef.nativeElement.getContext('2d');
      gainCtx.canvas.height = '300px';
      new Chart(gainCtx, createChartConfig(gainConfig));

      const orderCtx = this.orderRef.nativeElement.getContext('2d');
      orderCtx.canvas.height = '300px';
      new Chart(orderCtx, createChartConfig(orderConfig));

      this.pending = false;
    });
  }
  // -----------------------------------------------------
  ngOnInit(): void {

  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}

function createChartConfig({ labels, data, label, color }) {
  return {
    type: 'line',
    options: {
      responsive: true
    }, data: {
      labels,
      datasets: [{
        label, data, borderColor: color, steppedLine: false,
        fill: false
      }]
    }
  }
}
