import { NgModule } from '@angular/core'
import { FooterComponent } from './footer/footer.component'
import { NavBarComponent } from './nav-bar/nav-bar.component'
import { HeaderComponent } from './header/header.component'

const components = [
  FooterComponent,
  NavBarComponent,
  HeaderComponent
]

@NgModule({
  declarations: components,
  exports: components
})  
export class CommonComponentModule {}