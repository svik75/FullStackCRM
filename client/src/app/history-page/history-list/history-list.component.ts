import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Order, OrderPosition } from 'src/app/shared/services/interfaces';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() orders: Order[];
  @ViewChild('modal', null) modalRef: ElementRef;
  selectedOrder: Order;
  modal: MaterialInstance;
  orderP: OrderPosition[] = [];
  constructor() { }

  ngOnInit() {
  }
  // ---------------------------------------------------
  ngOnDestroy() {
    this.modal.destroy();
  }
  // -------------------------------------- -------------
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }
  // ------------------------------------------------
  calcPrice(order: Order): number {
    this.orderP = order.list;

    return this.orderP.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0);

  }
  // ---------------------------------------------------
  selectOrder(order: Order) {
    this.selectedOrder = order;
    this.modal.open();
  }
  // -------------------------------------------------------
  closeModal() {
    this.modal.close();
  }
}

