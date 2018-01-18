import { Component, OnDestroy } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { StoreService, OverrideService } from '../../../../services'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OverrideModel } from './override-model'
import { OverrideDetailsModule } from '../index';

@Component({
  selector: 'override-details',
  templateUrl: './override-details.component.html'
})
export class OverrideDetailsComponent {
  modalStatus = false
  modalListener: Observable<any>
  unsubscribe:  Subject<boolean> = new Subject()
  currentModel: OverrideModel

  overrideForm: any
  OverrideType: any

  constructor( private storeService: StoreService, private overrideService: OverrideService) {
    this.init( storeService, overrideService )
  }

  init( storeService: StoreService, overrideService: OverrideService) {
    this.modalListener = storeService.get('manualOverride').takeUntil(this.unsubscribe).distinctUntilChanged()

    this.modalListener.subscribe(call => {
      this.modalStatus = true
      this.currentModel = new OverrideModel({
        CurrRent: call.source.CurrRent || 0,
        OverrideType: call.source.OverrideType || 'Total',
        UnitType: call.source.UnitType || 'None',
        Override: call.source.OverrideVal || 0,
        Expiration: call.source.OverrideDate || 'N/A',
        Source: call.source
      })

      this.OverrideType = new FormControl('Total')
      this.overrideForm = new FormGroup({
        OverrideType: this.OverrideType,
        Expiration:  new FormControl('',[Validators.required, OverrideModel.dateValidator]),
        Override: new FormControl('', [Validators.required, OverrideModel.overrideValidator(this.OverrideType)])
      })
    })
  }

  submit() {
    this.currentModel.view = Object.assign(this.currentModel.view, {
      OverrideType: this.overrideForm.controls.OverrideType.value,
      Expiration: this.overrideForm.controls.Expiration.value,
      Override: Number(this.overrideForm.controls.Override.value)
    })

    this.overrideService.setOverride(this.currentModel.translate())

    this.overrideForm.reset()

    this.closeModal()
  }

  closeModal() {
    this.modalStatus = false
  }

  reset() {
    this.currentModel.restore()
  }

  ngOnDestroy() {
    this.unsubscribe.next(true)
    this.unsubscribe.complete()
  }

}
