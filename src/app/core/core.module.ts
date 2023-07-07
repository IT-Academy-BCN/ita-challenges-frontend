import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MainComponent } from './layout/main/main.component';
import {CoreRoutingModule} from "./core-routing.module";
import { MainMenuComponent } from './layout/main-menu/main-menu.component';
import { ModalsModule } from '../modules/modals/modals.module';



@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        MainComponent,
        MainMenuComponent
    ],
    exports: [
        HeaderComponent,
        FooterComponent
    ],
    imports: [
        CommonModule,
        CoreRoutingModule,
        ModalsModule
    ]
})
export class CoreModule { }
