import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../shared/services/categories.service';
import {Category} from '../shared/services/interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.css']
})

export class CategoriesPageComponent implements OnInit {


categories$: Observable<Category[]>;

  constructor(private catserv: CategoriesService) {

  }

  ngOnInit() {

    this.categories$ = this.catserv.fetch();
  }

}
