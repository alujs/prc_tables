interface RowData {
  CurrRent: number;
  OverrideType: string;
  UnitType: string;
  Override: number;
  Expiration: string | null;
  Source: any;
  RecRent?: number
}

export class OverrideModel {
  private defaults: RowData | any
  public staging: RowData | any
  public view: RowData | any

  constructor( { CurrRent, Override, OverrideType, Expiration, Source } : RowData ) {
    this.defaults = { CurrRent, Override, OverrideType, Expiration, Source, 'RecRent': Source.RecRent }
    this.staging = Object.assign({}, this.defaults)
    this.view = Object.assign({}, this.defaults)
  }

  restore() {
    this.view = Object.assign({}, this.defaults)
    this.staging = Object.assign({}, this.defaults)
  }

  translate() {
    return {
        type: this.view.OverrideType,
        val: this.view.Override,
        expiration: this.view.Expiration,
        target: this.view.Source || {
          UnitType: this.view.UnitType
        }
    }
  }

  static overrideValidator(ref) {
    return (control) => {
      if(Number(control.value) === NaN) {
        return {'invalidNumber': {value: control.value, name: 'Invalid number', valid: false}}
      }

      if(Number(control.value) <  0 && ref.value === 'Total') {
        return {'invalidNumber': {value: control.value, name: 'Negative numbers only allowed for incremental.', valid: false}}
      }

      return null
    }
  }

  static dateValidator (control)  {
    let date = new Date(control.value)
    if( Object.prototype.toString.call(date) === "[object Date]" ) {
      if( isNaN( date.getTime() ) ) { 
        return {'invalidDate': {value: control.value, name: 'invalid date', valid: false}}
      }
      else {
        return null
      }
    }
    else {
      return {'invalidDate': {value: control.value, name: 'invalid date', valid: false}}
    }
  }
}
