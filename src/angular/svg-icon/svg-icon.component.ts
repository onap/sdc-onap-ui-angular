import { Component, Input, OnChanges, SimpleChanges, HostBinding, HostListener, ElementRef } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Mode, Size, BackgroundShape, BackgroundColor } from "../common/enums";
import { iconsMap } from 'onap-ui-common';
import { template } from './svg-icon.component.html';

@Component({
    selector: 'svg-icon',
    template: template
})
export class SvgIconComponent implements OnChanges {

    @Input() public name: string;
    @Input() public type: string;
    @Input() public mode: Mode;
    @Input() public size: Size;
    @Input() public backgroundShape: BackgroundShape;
    @Input() public backgroundColor: BackgroundColor;
    @Input() public disabled: boolean;
    @Input() public clickable: boolean;
    @Input() public className: any;
    @Input() public testId: string;
    @Input() public ariaLabel: string;

    public svgIconContent: string;
    public svgIconContentSafeHtml: SafeHtml;
    public svgIconCustomClassName: string;
    public classes: string;

    constructor(protected domSanitizer: DomSanitizer, protected hostEl: ElementRef) {
        this.size = Size.medium;
        this.disabled = false;
        this.type = this.type || "common";
    }

    @HostBinding('attr.role') get hostRole(): string {
        return this.isKeyboardButton() ? 'button' : null;
    }

    @HostBinding('attr.tabindex') get hostTabindex(): string {
        return this.isKeyboardButton() ? (this.disabled ? '-1' : '0') : null;
    }

    @HostBinding('attr.aria-disabled') get hostAriaDisabled(): string {
        return this.isKeyboardButton() && this.disabled ? 'true' : null;
    }

    @HostBinding('attr.aria-label') get hostAriaLabel(): string {
        return this.isKeyboardButton() && this.ariaLabel ? this.ariaLabel : null;
    }

    @HostBinding('attr.aria-hidden') get hostAriaHidden(): string {
        return this.isDecorative() ? 'true' : null;
    }

    @HostListener('keydown', ['$event'])
    public onHostKeydown(event: KeyboardEvent): void {
        if (!this.isKeyboardButton() || this.disabled || event.repeat || event.target !== this.hostEl.nativeElement) {
            return;
        }
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
            event.preventDefault();
            this.hostEl.nativeElement.click();
        }
    }

    static Icons(): { [key: string]: string } {
        return iconsMap;
    }

    public ngOnChanges(changes: SimpleChanges) {
        this.updateSvgIconByName();
        this.buildClasses();
    }

    protected isKeyboardButton(): boolean {
        return !!this.clickable;
    }

    protected isDecorative(): boolean {
        return !this.clickable;
    }

    protected updateSvgIconByName() {
        this.svgIconContent = iconsMap[this.type][this.name] || null;
        if (this.svgIconContent) {
            this.svgIconContentSafeHtml = this.domSanitizer.bypassSecurityTrustHtml(this.svgIconContent);
            this.svgIconCustomClassName = '__' + this.name.replace(/\s+/g, '_');
        } else {
            this.svgIconContentSafeHtml = null;
            this.svgIconCustomClassName = 'missing';
        }
    }

    private buildClasses = (): void => {
        const _classes = ['svg-icon'];
        if (this.mode) { _classes.push('mode-' + this.mode); }
        if (this.size) { _classes.push('size-' + this.size); }
        if (this.clickable) { !this.disabled && _classes.push('clickable'); }
        if (this.svgIconCustomClassName) { _classes.push(this.svgIconCustomClassName); }
        if (this.className) { _classes.push(this.className); }
        if (this.backgroundShape) { _classes.push('bg-type-' + this.backgroundShape); }
        if (this.backgroundShape && this.backgroundColor) {
            _classes.push('bg-color-' + this.backgroundColor);
        } else if (this.backgroundShape && !this.backgroundColor) {
            _classes.push('bg-color-primary');
        }
        this.classes = _classes.join(" ");
    }
}
