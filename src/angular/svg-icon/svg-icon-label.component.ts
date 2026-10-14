import { Component, Input, ElementRef } from "@angular/core";
import { SvgIconComponent } from './svg-icon.component';
import {Placement, Size} from "../common/enums";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { template } from './svg-icon-label.component.html';

@Component({
    selector: 'svg-icon-label',
    template: template
})
export class SvgIconLabelComponent extends SvgIconComponent {

    @Input() public label: string;
    @Input() public labelPlacement: Placement;
    @Input() public labelClassName: string;
    @Input() public size: Size;
    @Input() public testId: string;

    constructor(protected domSanitizer: DomSanitizer, protected hostEl: ElementRef) {
        super(domSanitizer, hostEl);
        this.labelPlacement = Placement.left;
    }

    // The host bindings are inherited from SvgIconComponent. A label host must not be hidden,
    // because it carries visible text (validation messages), and consumers pass clickable="false"
    // as a truthy string, so only a real true or "true" may turn it into a tab stop.
    protected isKeyboardButton(): boolean {
        return this.clickable === true || (this.clickable as any) === 'true';
    }

    protected isDecorative(): boolean {
        return false;
    }
}
