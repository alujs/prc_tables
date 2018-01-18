import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable()
export class StoreService {
  state = {}
  // ideally could use .scan or a reducer to keep a record of transactions and then SAGA if necessary for transactions.
  store = new BehaviorSubject(this.state) 

  set(data) {
    let oldState = this.state
    let newState = Object.assign(this.state, data)

    this.store.next(newState)
  }

  get(prop) {
    return this.store.pluck(prop).filter(Boolean)
  }

  raw() {
    return this.store
  }
}
