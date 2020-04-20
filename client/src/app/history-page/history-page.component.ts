import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';
import { Order, Filter } from '../shared/services/interfaces';
const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip', null) tooltipRef: ElementRef;
  tooltip: MaterialInstance;
  isFilterVisible = false;
  filter: Filter = {};
  offset = 0;
  limit = STEP;
  oSub: Subscription;
  orders: Order[] = [];
  loading = false;
  reloading = false;
  noMoreOrders = false;

  constructor(private ordersService: OrdersService) {

  }

  ngOnInit() {
    this.reloading = true;
    this.fetch();
  }
  // ----------------------------------------------
  private fetch() {

    /*const params = {
      offset: this.offset,
      limit: this.limit
    };*/
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit });
    this.oSub = this.ordersService.fetch(params).subscribe(
      (orders: Order[]) => {
        this.orders = this.orders.concat(orders);
        this.noMoreOrders = orders.length < STEP;
      });
    this.loading = false; this.reloading = false;

    // if (!this.orders.length) { MaterialService.toast('Пустой массив orders!'); }
  }
  // -----------------------------------------------
  ngOnDestroy() {
    this.tooltip.destroy();
    this.oSub.unsubscribe();
  }
  // -----------------------------------------------
  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }
  // -----------------------------------------------
  loadMore() {
    this.loading = true;
    this.offset += STEP;
    this.fetch();
  }

  // ------------------------------------------------
  applyFilter(filter: Filter) {
    this.orders = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.fetch();
  }
// ----------------------------------------
isFiltered(): boolean {
return Object.keys(this.filter).length !== 0;
}
}
