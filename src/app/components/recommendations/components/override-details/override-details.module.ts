import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { OverrideDetailsComponent } from './override-details.component'

@NgModule({
  declarations: [ OverrideDetailsComponent ],
  imports: [ CommonModule, ReactiveFormsModule ],
  exports: [ OverrideDetailsComponent ]
})
export class OverrideDetailsModule {

}