import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MaterialService, MaterialInstance } from 'src/app/shared/classes/material.service';
import { Position } from 'src/app/shared/services/interfaces';
import { PositionsService } from 'src/app/shared/services/positions.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() categoryId: string;
  @ViewChild('modal', null) modalRef: ElementRef;
  positions: Position[] = [];
  loading = false;
  modal: MaterialInstance;
  form: FormGroup;
  positionId: string = null;

  constructor(private positionsService: PositionsService) { }

  ngOnInit() {

    this.loading = true;
    this.positionsService.fetch(this.categoryId)
      .subscribe(positions => {
        this.positions = positions;
        this.loading = false;
      });
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    });

  }
  // ------------------------
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);

  }
  // -------------------------------------------
  ngOnDestroy() {
    this.modal.destroy();
  }
  // ------------------------------------------------
  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }
  // -----------------------------------------------
  onAddPosition() {
    this.positionId = null;
    this.form.reset({
      name: '',
      cost: 1
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }
  // ------------------------------------------------
  onCancel() {
    this.modal.close();
  }

  // -------------------------------------------------------
  onSubmit() {
    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };
    this.form.disable();
    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions[idx] = position;
          MaterialService.toast('Изменения сохранены');
        },
        error => { this.form.enable(); MaterialService.toast(error.error.message); },
        () => {
          this.modal.close(); this.form.reset({ name: '', cost: 1 }); this.form.enable();
        }
      );
    } else {
      // MaterialService.toast(this.categoryId);
      this.positionsService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Позиция создана');
          this.positions.push(position);
        },
        error => { this.form.enable(); MaterialService.toast(error.error.message); },
        () => {
          this.modal.close(); this.form.reset({ name: '', cost: 1 }); this.form.enable();
        }
      );
    }
  }
  // -----------------------------------------------------------
  onDeletePosition(event: Event, position: Position) {
    event.stopPropagation();
    const decision = window.confirm(`Удалить позицию? - ${position.name}`);
    if (decision) {
      this.positionsService.delete(position).subscribe(
        response => {
          const idx = this.positions.findIndex(p => p._id === position._id);
          this.positions.splice(idx, 1);
          MaterialService.toast(response.message);
        },
        error => { MaterialService.toast(error.error.message); }
      );
    } else {

    }
  }
}
