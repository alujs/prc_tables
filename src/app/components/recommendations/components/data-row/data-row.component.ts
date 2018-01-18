import { Component, OnInit, Input } from '@angular/core'
import { OverrideService, StoreService } from '../../../../services'
// insert more vigorous interface to test processedData on

@Component({
  selector: '[data-row]',
  templateUrl: './data-row.component.html'
})
export class DataRowComponent implements OnInit  {
  @Input('data-row') rawRowData: any

  constructor( private overrideService: OverrideService ) {}

  processedData = []

  rowDefinitions = {
    'UnitType': { "sWidth": "7%", "sClass": "center", "sTitle": "UnitType", 'fn': 'loadStageColumnInRMPUnitRecDetails' }, 
    'PhysicalUnitCount': { 'formatVal': 'checkIfNull',"sClass": "right", "sWidth": "3%", "sTitle": "Total" }, 
    'UnitCount': { 'formatVal': 'checkIfNull',"sClass": "right", "sWidth": "3%", "sTitle": "Avail" }, 
    'OccupiedCount': { 'formatVal': 'checkIfNull',"sClass": "right", "sWidth": "3%", "sTitle": "Units" }, 
    'OccupiedChange': { 'formatVal': 'checkIfNull',"sClass": "right", "sWidth": "3%", "sTitle": "Chg" }, 
    'OccupiedPercent': { 'formatVal': 'checkIfNull', "sClass": "right", "sWidth": "4%", "sTitle": "Pct" },
    'Exposure': { 'formatVal': 'checkIfNull',"sClass": "right", "sWidth": "4%", "sTitle": "Units" }, 
    'ExpChange': { 'formatVal': 'checkIfNull',"sClass": "right", "sWidth": "4%", "sTitle": "Chg" }, 
    'ExpPct': { 'formatVal': 'checkIfNull',"sClass": "right", "sWidth": "4%", "sTitle": "Pct" }, 
    'OccupiedRent': { 'formatVal': 'roundedMoney', "sClass": "right", "sWidth": "4%", "sTitle": "Occupied" },
    'CurrRent': { 'formatVal': 'roundedMoney', "sClass": "right", "sWidth": "5%", "sTitle": "Current" },
    'RecRent': { 'formatVal': 'roundedMoney',"sClass": "", "sWidth": "5%", "sTitle": "Current", 'fn': 'createActionColumnHTMLForUnitLevelTable' },// CreateActionColumnHTMLForUnitLevelTable(row)) @ hL = 2
    'HierarchyLevel': { "sWidth": "5%", "sTitle": "Override", 'fn': 'loadUnitLevelOverrideColumnHtml' }, //corresponds to override column
    'RentChange': { 'formatVal': 'roundedMoney', "sClass": "right", "sWidth": "3%", "sTitle": "Chg$" },
    'RentChangePct': { 'formatVal': 'checkIfNull',"sClass": "right", "sWidth": "3%", "sTitle": "Chg%" }
  }

  ngOnInit() {
    this.processedData = this.reduceRows(this.rawRowData, this.processedData)
  }

  //implement ngOnChanges for reduceRows or at least a setter.

  reduceRows(rawData: any, target: Array<any>): any {
    let x = Object.keys(this.rowDefinitions).reduce((acc, definition) => {
      let processed = {
        HierarchyLevel: rawData.HierarchyLevel,
        class: this.rowDefinitions[definition].sClass || '',
        value: this.rowDefinitions[definition].formatVal ? this[this.rowDefinitions[definition].formatVal](rawData[definition]) : '',
        Override: rawData.Override || null,
        viewOverride: rawData.Override
      }

      if(this.rowDefinitions[definition].fn) {
        this[this.rowDefinitions[definition].fn](rawData, processed)
      }
      acc.push(processed)
      return acc
    }, target)
 
    return x;
  }

  formatMoney = function (decPlaces, thouSeparator, decSeparator) {
    decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 0 : decPlaces;                 //replace '0' with '2' if you wish to have upto two decimal values.
    decSeparator = decSeparator == undefined ? "." : decSeparator;
    thouSeparator = thouSeparator == undefined ? "," : thouSeparator;
    var currencySymbol = "$";
    var n = this,
    sign = n < 0 ? "-" : "",
    i = parseInt(n = Math.abs(+n || 0).toFixed(decPlaces)) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
    return sign + currencySymbol + (j ? i.substr(0, j) + thouSeparator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thouSeparator) + (decPlaces ? decSeparator + Math.abs(Number(n) - Number(i)).toFixed(decPlaces).slice(2) : "");
 }

  roundedMoney(val) {
    var result = "-NA-";
    if ((val !== null) && (val !== undefined) && (val !== '') && (val!=='-NA-')) {
        result = this.formatMoney.apply((Math.round(val)))
    }
    return result;
  }

  checkIfNull(val, pctFlag) {
    var result = "-NA-";
    if ((val !== "") && (val !== null) && (val !== undefined)) {
        result = val;
        if (pctFlag == 1) {
            result = Number(result).toFixed(1) + "%";
        }
    }
    return result;
  }


  IsValueNOTNULL(val) {
    var result = false;
    if ((val !== "") && (val !== null) && (val !== undefined) && (val !== '-NA-')) {
        result = true;
    }
    return result;
  }

  createBtnHTMLForUnitLevelTable(ActionName, set, flag, rawRowData) {
    let _thisNameAttrDataString = rawRowData.RMProductKey + '-' + rawRowData.UnitConfigKey + '-' + rawRowData.Stage + '-' + rawRowData.Status;

    if(flag) {
      set.accept = true
      set.accName = _thisNameAttrDataString
      set.accActionName =  ActionName + ' pull-right'
      return set
    } 

    set.reject = true
    set.rejName = _thisNameAttrDataString
    set.rejActionName = ActionName + ' pull-right'
    return set
  }

  createActionColumnHTMLForUnitLevelTable(_thisData, processed) {

    if(_thisData.HierarchyLevel !== 2) {
        return processed
    }

    var result = "";
    var _thisAcceptActionClassName = "";
    var _thisRejectActionClassName = "";
    if (this.IsValueNOTNULL(_thisData.Override)) {
        _thisAcceptActionClassName = "UnitLevel_AcceptAction" ;
    }
    else {
        _thisAcceptActionClassName = "UnitLevel_DisabledAcceptAction" ;
    }
    if (this.IsValueNOTNULL(_thisData.Override) && this.IsValueNOTNULL(_thisData.CurrRent)) {                                       
        //Unit Level
        var _thisRejectcondition = ((_thisData.CurrRent >= (_thisData.Override) - 1) && (_thisData.CurrRent <= (_thisData.Override) + 1));
        _thisRejectActionClassName = _thisRejectcondition ? "UnitLevel_DisabledRejectAction" : "UnitLevel_RejectAction";
    } else
    {
        _thisRejectActionClassName = "UnitLevel_RejectAction";
    }

    this.createBtnHTMLForUnitLevelTable(_thisRejectActionClassName, processed, false, this.rawRowData)
    this.createBtnHTMLForUnitLevelTable(_thisAcceptActionClassName, processed, true, this.rawRowData)

    return processed
  }

  loadUnitLevelOverrideColumnHtml(row, processed) {
    processed.unitOver = true
    if(row.HierarchyLevel !== 2) {
      processed.unitOver = true
      if(processed.Override === null) {
        processed.viewOverride = ''
      } else {
        processed.viewOverride = this.roundedMoney(processed.Override)
      }
      return processed
    }

    if(processed.Override === null) {
      processed.viewOverride = '---  NA  ---'
    } else {
      processed.viewOverride = this.roundedMoney(processed.Override)
    }

    return processed
  }

  loadStageColumnInRMPUnitRecDetails(_thisRowData, processed) {
    processed.value = _thisRowData.UnitType
    if (_thisRowData.HierarchyLevel === 1) {
      processed.Stage = _thisRowData.Stage 
        if (_thisRowData.Stage === 'Review') {
            processed.iconClass = "Im-YellowStageReview"
        }
        else if (_thisRowData.Stage === 'Saved') {
            processed.iconClass = "Im-BlueStageSaved"
        }
        else if (_thisRowData.Stage === 'Deployed') {
            processed.iconClass = "Im-GreenStageDeployed"
        }
    }

    return processed
  }

  createOverride() {
    this.overrideService.setOverride({
      type: 'Total',
      val: this.rawRowData.CurrRent,
      expiration: null,
      target: this.rawRowData
    })
  }

  activateManualOverride() {
    if(this.rawRowData.HierarchyLevel === 1) {
      return
    }
    
    this.overrideService.manualOverride({
      origin: 'data-row',
      source: this.rawRowData
    })
  }
}
