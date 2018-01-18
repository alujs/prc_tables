import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { RecommendationsComponent } from './components'
import { RecommendationsModule } from './components'

const childRoutes = [
  RecommendationsModule
]


const mainRoutes = [
  {path: '', redirectTo: '/recommendations', pathMatch: 'full'}
]

@NgModule({
  imports: [
    RouterModule.forRoot([
      ...mainRoutes
    ]),
    ...childRoutes
  ],
  exports: [
    RouterModule
  ]
})
export class RoutesModule {}
