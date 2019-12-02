import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoriesService } from 'src/app/shared/services/categories.service';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Category } from 'src/app/shared/services/interfaces';


@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {
  form: FormGroup;
  isNew = true;
  image: File;
  imagePreview: any;
  category: Category;
  @ViewChild('input', null) inputRef: ElementRef;
  // -------------------------------------------
  constructor(private route: ActivatedRoute, private catserv: CategoriesService, private router: Router) {

  }
  // --------------------------------------------
  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    });
    const pid = 'id';
    this.form.disable();

    this.route.params.pipe(
      switchMap(
        (params: Params) => {
          if (params[pid]) {
            this.isNew = false; // MaterialService.toast(this.catserv.getById(params[pid]));
            return this.catserv.getById(params[pid]);
          } else {
            return of(null);
          }
        }
      )
    ).subscribe(
      category => {
        if (category) {
          this.category = category;
          this.form.patchValue({
            name: category.name
          });
          this.imagePreview = category.imageSrc;
          MaterialService.updateTextInputs();
        }

        this.form.enable();
      },
      error => { MaterialService.toast(error.error.message); }
    );
  }
  // ------------------------------------------------
  onSubmit() {
    let obs$;
    this.form.disable();
    if (this.isNew) {
      obs$ = this.catserv.create(this.form.value.name, this.image);
    } else { obs$ = this.catserv.update(this.category._id, this.form.value.name, this.image); }

    obs$.subscribe(
      category => {
        MaterialService.toast('Изменения сохранены');
        this.category = category;
        this.form.enable();
      },
      error => {

        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }
  // ---------------------------------------------------
  triggerClick() {
    this.inputRef.nativeElement.click();

  }
  // ---------------------------------------------------
  onFileUpload(event: any) {
    const file = event.target.files[0];
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
  // -----------------------------------------------------
  deleteCategory() {
    const decision = window.confirm(`Удалить категорию -'"${this.category.name}"`);
    if (decision) {
      this.catserv.delete(this.category._id).subscribe(
        response => MaterialService.toast(response.message),
        error => MaterialService.toast(error.error.message),
        () => this.router.navigate(['/categories'])
);
    }
  }
}
