import {NgModule} from "@angular/core";
import {ClickOutsideDirective} from "./clickoutside.directive";
import {RippleClickAnimationDirective} from "./animations/ripple-click.animation.directive";
import {SdcKeyboardClickDirective} from "./keyboard-click.directive";

@NgModule({
  declarations: [
    ClickOutsideDirective,
    RippleClickAnimationDirective,
    SdcKeyboardClickDirective
  ],
  exports: [
    ClickOutsideDirective,
    RippleClickAnimationDirective,
    SdcKeyboardClickDirective
  ],
  providers:[]
})
export class CommonDirectiveModule {
}
