import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MaterialService, MaterialInstance } from '../shared/classes/material.service';
import { OrderService } from './order.service';
import { OrderPosition, Order } from '../shared/services/interfaces';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  pending = false;
  isRoot: boolean;
  modal: MaterialInstance;
  oSub: Subscription;
  @ViewChild('modal', null) modalRef: ElementRef;
  constructor(private router: Router, public order: OrderService, private ordersService: OrdersService) {

  }

  ngOnInit() {

    this.router.events.subscribe(
      event => {
        if (event instanceof NavigationEnd) {
          this.isRoot = this.router.url === '/order';
        }
      }
    );
  }
  // -----------------------------------------
  ngOnDestroy() {
    this.modal.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();

    }
  }
  // ---------------------------------------------
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }
  // -------------------------------------------
  open() {
    this.modal.open();
  }
  // -------------------------------------------
  cancel() {
    this.modal.close();
  }
  // ---------------------------------------------
  submit() {
    this.pending = true;
    // this.modal.close();
    const list = this.order.list.map(item => {
      delete item._id;
      return item;
    });


    this.oSub = this.ordersService.create({ list }).subscribe(
      order => {

        MaterialService.toast(`Заказ ${order.order} добавлен!`);
        this.order.clear(); this.pending = false; this.modal.close();
      },
      error => {
        MaterialService.toast(error.error.message); this.pending = false;
      }
    );
  }
// -------------------------------------------------------------
  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition);
  }
}
