import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { Position } from 'src/app/shared/services/interfaces';
import { OrderService } from '../order.service';
import { MaterialService } from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  position$: Observable<Position[]>;
  constructor(private route: ActivatedRoute, private positionsService: PositionsService, private order: OrderService) {

  }

  ngOnInit() {
    const pid = 'id';
    this.position$ = this.route.params.pipe(
      switchMap((params: Params) => {
        return this.positionsService.fetch(params[pid]);
      }
      ),
      map(
        (positions: Position[]) => {
          return positions.map(position => {
            position.quantity = 1;
            return position;
          });
        }
      )
    );
  }
  // -------------------------------------------------
  addToOrder(position: Position) {
    this.order.add(position);
    MaterialService.toast(`Добавлено х${position.quantity} ${position.name}`);
  }

}
