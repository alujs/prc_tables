import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { CommonComponentModule } from './components'
import { RoutesModule } from './app.routes'
import { RequestService, StoreService, OverrideService} from './services'


let components = [
  // RecommendationsComponent
  AppComponent
]

@NgModule({
  declarations: [
    ...components
  ],
  imports: [
    BrowserModule,
    RoutesModule,
    CommonComponentModule
  ],
  providers: [
    StoreService,
    RequestService,
    OverrideService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
