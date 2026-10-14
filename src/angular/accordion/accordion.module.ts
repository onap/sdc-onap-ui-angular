import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccordionComponent } from "./accordion.component";
import { SvgIconModule } from "../svg-icon/svg-icon.module";
import { CommonDirectiveModule } from "../utils/common-directive.module";

@NgModule({
    declarations: [
        AccordionComponent
    ],
    imports: [
        CommonModule,
        SvgIconModule,
        CommonDirectiveModule
    ],
    exports: [
        AccordionComponent
    ],
})
export class AccordionModule {

}
