import { Component, Input, OnInit } from '@angular/core'
import { StoreService } from '../../../../services' // move this node_modules in a refactor
import * as $ from 'jquery'

@Component({
  selector: 'settings-bar',
  templateUrl: './settings-bar.component.html'
})
export class SettingsBarComponent {
  @Input() settingsBarData: any = [] // Can insert a Setter to trigger a localState reset when new settingsBarData gets thrown in.
  toggle = true
  localState: any = {}
  filterSettings: any = {}

  constructor( private storeService: StoreService ) {}
  
  clickToJump( evt, key ) {
    evt.preventDefault()
    evt.stopPropagation()
    this.storeService.set({
      scrollTo: key
    })
  }

  hideAll( evt ) {
    this.toggle = false
    this.localState = {}
    this.filterSettings = {}

    this.clickToFilter(evt, this.settingsBarData.map(row => {
      return row.unitType
    }))
  }

  showAll( evt ) {
    this.toggle = true
    this.localState = {}
    this.filterSettings = {}

    this.clickToFilter(evt, '')
  }

  clickToFilter( evt, key ) {
    evt.preventDefault()
    evt.stopPropagation()

    if(Array.isArray(key)) {
      key.forEach(iKey => {
        this.localState[iKey] = this.localState[iKey] ? false : true
      })
    } else {
      this.localState[key] = this.localState[key] ? false : true
    }
    
    
    this.filterSettings = Object.keys(this.localState).reduce((acc, key) => {
      this.localState[key] ? acc.unitType.push(key) : null
      return acc
    }, {
      unitType: []
    })

    this.storeService.set({
      filters: this.filterSettings
    })
  }

}