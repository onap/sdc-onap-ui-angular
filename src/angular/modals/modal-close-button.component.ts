import { Component, Input } from "@angular/core";
import { ButtonComponent } from "../buttons/button.component";
import { ModalService } from "./modal.service";
import { RippleAnimationAction } from "../animations/ripple-click.animation.directive";

@Component({
    selector: "sdc-modal-close-button",
    template: `
    <div class="sdc-modal__close-button"
        SdcRippleClickAnimation
        [ngClass]="disabled ? 'disabled' : ''"
        [rippleOnAction]="!disabled && rippleAnimationAction"
        [attr.data-tests-id]="testId"
        (click)="!disabled && closeModal()"
        >
        <svg-icon name="close" [mode]="disabled? 'secondary' : 'info'" size="small"></svg-icon>
    </div>
    `
})
export class ModalCloseButtonComponent {

    @Input() testId: string;
    @Input() disabled: boolean;

    public rippleAnimationAction: RippleAnimationAction = RippleAnimationAction.MOUSE_ENTER;

    constructor(private modalService: ModalService) {
    }

    public closeModal = (): void => {
        this.modalService.closeModal();
    }

}
