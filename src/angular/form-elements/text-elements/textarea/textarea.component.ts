import { Component } from "@angular/core";
import { template } from './textarea.component.html';
import { BaseTextElementComponent } from "../base-text-element.component";

let nextTextareaId = 0;

@Component({
    selector: 'sdc-textarea',
    template: template,
})

export class TextareaComponent extends BaseTextElementComponent {
    public textareaId: string = `sdc-textarea-${nextTextareaId++}`;

    constructor() {
        super();
    }
}
