import { Injectable } from '@angular/core'
import { StoreService } from '../store/store.service'

/*
1. Type: Represents what type of the override is applied.
a. Total Override: The value you enter replaces the Recommended Rent.
b. Incremental Override: The value you enter is added to (if positive) or deducted (if negative) from the Recommended Rent.
2. Value: Dollar amount of override
3. Expiration: The Expiration date represents the date the override expires.
The user can override the rent recommendations in two different ways:
1. Clicking the red cross button creates a new override with "Total Override" type, current rent as value, and null expiration date.
2. Clicking the "Override" field opens a new pop-up where the user can enter all three components.
*/


interface DataSource {
  UnitType: string;
}

interface Override {
  val: number;
  expiration: string | null;
  target: DataSource;
  type: string;
}

@Injectable()
export class OverrideService {
  dataListener: any
  currentSet: any = []

  constructor( private storeService: StoreService ) {
    this.dataListener = storeService.get('RecDetails')
    .subscribe(data => {
      this.currentSet = data
    })
  }
  
  manualOverride( params ) {
    this.storeService.set({
      manualOverride: params
    })
  }

  updateMasterList( unitType, source ) {
    let masterListing = 0
    let changes = source.filter((row, index) => {
      if(row.HierarchyLevel === 1 && row.UnitType.split('-')[0] === unitType.split('-')[0]) {
        masterListing = index
        return false
      }
      return row.UnitType.split('-')[0] === unitType.split('-')[0]
    })
    .reduce((acc, row) => {
      acc.instances += 1

      if(!row.Override || row.Override === null) {
        acc.total += row.RecRent
        return acc
      }

      acc.total += row.Override
      return acc
    }, {instances: 0, total: 0})
   
    source[masterListing].Override = (changes.instances * (changes.total * source[masterListing].UnitCount)) / (changes.instances * source[masterListing].UnitCount)
    return source
  }

  setOverride( settings: Override ) {
    console.log('overriding')
    let overriden = this.currentSet.map((row) => {
      if(row.UnitType === settings.target.UnitType) {
        if(settings.type === 'Total') {
          row.Override = settings.val
        }

        if(settings.type === 'Inc') {
          row.Override = row.RecRent + settings.val
        }

        row.OverrideType = settings.type
        row.OverrideDate = settings.expiration
        row.OverrideVal = settings.val 
      }


      return row
    })

    this.storeService.set({
      RecDetails: this.updateMasterList(settings.target.UnitType, overriden)
    })
  }
  
}