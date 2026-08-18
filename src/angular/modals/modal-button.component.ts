import { Component, Input, HostListener, EventEmitter, Output } from "@angular/core";
import { ButtonComponent } from "../buttons/button.component";
import { IModalButtonComponent } from "./models/modal-config";
import { template } from "./../buttons/button.component.html";

@Component({
    selector: "sdc-modal-button",
    template: template
})
// `implements IModalButtonComponent` is a compile-time guard only: ModalService and IModalConfig
// accept that interface, so the class must stay assignable to it or callers are forced into casts.
export class ModalButtonComponent extends ButtonComponent implements IModalButtonComponent {

    @Input() public id?: string;
    @Input() public callback: Function;
    @Input() public closeModal: boolean;
    @Output() closeModalEvent: EventEmitter<any> = new EventEmitter<any>();
    @HostListener('click') invokeCallback = (): void => {
        if (this.callback) {
            this.callback();
        }
        if (this.closeModal) {
            this.closeModalEvent.emit();
        }
    }

    constructor() {
        super();
        this.closeModal = false;
    }

}
