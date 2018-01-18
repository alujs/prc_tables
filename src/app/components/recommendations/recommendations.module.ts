import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router'
import { RecommendationsComponent } from './recommendations.component'
import { SettingsBarModule, DataRowModule, OverrideDetailsModule } from './components'

@NgModule({
  declarations: [ RecommendationsComponent ],
  imports: [
    RouterModule.forChild([
      {
        path: 'recommendations', component: RecommendationsComponent
      }
    ]),
    CommonModule,
    SettingsBarModule,
    DataRowModule,
    OverrideDetailsModule
  ],
  exports: [
    RouterModule,
    RecommendationsComponent
  ]
})
export class RecommendationsModule {}
