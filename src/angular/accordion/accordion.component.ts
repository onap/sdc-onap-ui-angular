import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Placement } from "../common/enums";
import { template } from './accordion.component.html';

@Component({
    selector: 'sdc-accordion',
    template: template,
})
export class AccordionComponent {
    private static nextId = 0;

    @Input('arrow-direction') arrowDirection: Placement;
    @Input('css-class') customCSSClass: string;
    @Input('title') title: string;
    @Input('open') open: boolean;
    @Output('accordionChanged') changed = new EventEmitter<boolean>();
    @Input() public testId: string;
    @Input() public disabled: boolean;

    public accordionArrowDirection = Placement;
    public bodyId = 'sdc-accordion-body-' + (AccordionComponent.nextId++);

    public toggleAccordion(){
        this.open = !this.open;
        this.changed.emit(this.open);
    }
}
