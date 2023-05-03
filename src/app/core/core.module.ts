import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MainComponent } from './layout/main/main.component';
import {CoreRoutingModule} from "./core-routing.module";



@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        MainComponent
    ],
    exports: [
        HeaderComponent,
        FooterComponent
    ],
    imports: [
        CommonModule,
        CoreRoutingModule
    ]
})
export class CoreModule { }
