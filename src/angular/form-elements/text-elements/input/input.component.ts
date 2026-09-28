import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { template } from "./input.component.html";
import { BaseTextElementComponent } from "../base-text-element.component";

let nextInputId = 0;

@Component({
    selector: 'sdc-input',
    template: template,
})
export class InputComponent extends BaseTextElementComponent {
    @Input() public type: string;

    // This is if the we need to put an icon iside the input
    @Input() public righIconName:string;
    @Input() public isIconClickable: boolean;
    @Output() onRighIconClicked:EventEmitter<any> = new EventEmitter<any>();

    // ARIA passthrough for wrappers such as sdc-dropdown and sdc-combo-box: they own the
    // widget semantics but cannot reach the <input> element this component renders.
    @Input() public ariaRole: string;
    @Input() public ariaHasPopup: string;
    @Input() public ariaExpanded: boolean;
    @Input() public ariaControls: string;
    @Input() public ariaActiveDescendant: string;

    // For wrappers with their own (click) handler on this host (sdc-dropdown, sdc-combo-box): view
    // mode then renders readonly instead of disabled, which dispatches no clicks and takes no focus.
    @Input() public focusableInViewMode: boolean;

    // aria-labelledby rather than <label for>: with "for", the browser follows a label click with a
    // second click on the input, and sdc-dropdown's toggling host handler would open and re-close.
    public inputId: string = `sdc-input-${nextInputId++}`;
    public labelId: string = `${this.inputId}-label`;

    constructor() {
        super();
        this.type = 'text';
    }

    public onIconClicked = () =>{
          this.onRighIconClicked.emit()
    }

}
