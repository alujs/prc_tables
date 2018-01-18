import { Component, AfterViewChecked, OnDestroy } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { StoreService, RequestService } from '../../services'
import * as $ from 'jquery'

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

@Component({
  selector: 'recommendations',
  templateUrl: './recommendations.component.html'
})
export class RecommendationsComponent implements AfterViewChecked, OnDestroy {
  recDetailsListener: Observable<any>
  filterListener: Observable<any>
  recDetails: Array<any> = []
  filteredDetails: Array<any> = []
  scrollListener: Observable<any>
  unitTypes = []
  currentFilters = {}
  unsubscribe:  Subject<boolean> = new Subject()
  resize = false

  constructor(private storeService: StoreService, private requestService: RequestService ) {
    this.init(storeService, requestService)
  }

  init(store: StoreService, req: RequestService) {

    this.recDetailsListener = req.fetchAndSeed().takeUntil(this.unsubscribe)
    this.scrollListener = store.get('scrollTo').takeUntil(this.unsubscribe).distinctUntilChanged() // these could just go on the storage.
    this.filterListener = store.get('filters').takeUntil(this.unsubscribe)
    
    this.recDetailsListener.subscribe(data => {
        // diff checker can be thrown in here to append new data if required
      this.recDetails = data
      this.filteredDetails = JSON.parse(JSON.stringify(this.filterRows(this.currentFilters, data)))
      
      this.unitTypes = data.reduce((acc, row) => {
        if(row.HierarchyLevel === 1) {
          acc = acc.concat({ 'unitType': row.UnitType})
        }
    
        return acc
      }, [])
    })

    this.filterListener.subscribe(filters => {
      if(filters.unitType && filters.unitType.indexOf('CTG') > -1) { // unit types need to be added to the data :/
        filters.unitType.push('C2BR', 'GS1BR', 'GS2BR')
      }

      this.filteredDetails = JSON.parse(JSON.stringify(this.filterRows(filters, this.recDetails)))
      this.currentFilters = filters
    })

    this.scrollListener.subscribe(scrollTo => {
      this.scrollTo(scrollTo)
    })
  }

  scrollTo( target ) {
    let head = $('tbody').offset().top
    $('.dataTables_scrollBody').animate({
      scrollTop: $(`#RecDetailsTable .parentrow.${target}`).first().offset().top - head
    }, 100)
  }

  resizeTable() {
    var min_height = $('#RecDetailsTable_wrapper .dataTables_scrollBody').height();
    var new_height = $("#RecDetailsTable").height();

    $("#RecDetailsTable").next().height(new_height + 4)
  }

  filterRows( filters, data ): Array<any> {
    if(Object.keys(filters).length === 0) {
      return data
    }
    // Can be expanded later to cover an array of things, or better yet a sub-service. 
    return data.filter(row => {
      if(row.HierarchyLevel === 1) {
        return true
      }

      if(filters.unitType) {
        return filters.unitType.reduce((acc, type) => {
          if(row.UnitType.split('-')[0] === type) {
            acc = false
            this.resize = true
          }

          return acc
        }, true)
      }
      
      return true
    })
  }

  ngAfterViewChecked() {
    if(this.resize) {
      this.resizeTable()
      this.resize = false
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

}
