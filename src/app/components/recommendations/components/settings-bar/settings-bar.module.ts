import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { SettingsBarComponent } from './settings-bar.component'

@NgModule({
  declarations: [
    SettingsBarComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SettingsBarComponent
  ]
})  
export class SettingsBarModule {}