import { Injectable } from '@angular/core'
import { RecDetailsData } from './data'
import { StoreService } from '../store/store.service'
import { Observable } from 'rxjs'

@Injectable()
export class RequestService {

  constructor( private storeService: StoreService ) {}

  fetchAndSeed() {
    Observable.create((obs) => {
      obs.next(RecDetailsData)
      obs.complete()
    })
    .subscribe(data => {
      this.storeService.set({
        RecDetails: data
      })
    })

    return this.storeService.get('RecDetails').filter(Boolean)
  }
}