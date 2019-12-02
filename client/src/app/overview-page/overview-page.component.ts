import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { AnalyticsService } from '../shared/services/analytics.service';
import { Observable } from 'rxjs';
import { OverViewPage } from '../shared/services/interfaces';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.css']
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tapTarget', null) tapTargetRef: ElementRef;
  tapTarget: MaterialInstance;
  data$: Observable<OverViewPage>;
  yesterday: Date = new Date();

  constructor(private service: AnalyticsService) { }

  ngOnInit() {
    this.data$ = this.service.getOverview();
    this.yesterday.setDate(this.yesterday.getDate()-1);
  }

  ngOnDestroy() {
    this.tapTarget.destroy();
  }

  ngAfterViewInit() {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef);
  }

  openInfo() {
    this.tapTarget.open();
  }
}
