import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { template } from "./input.component.html";
import { BaseTextElementComponent } from "../base-text-element.component";
import 'rxjs/add/operator/debounceTime';

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

    // Ties the label to the input. Unique per instance because a form holds many inputs.
    public inputId: string = `sdc-input-${nextInputId++}`;

    constructor() {
        super();
        this.type = 'text';
    }

    public onIconClicked = () =>{
          this.onRighIconClicked.emit()
    }

}
