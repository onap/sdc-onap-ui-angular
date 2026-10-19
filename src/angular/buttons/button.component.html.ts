export const template = `
<button type="button" class="sdc-button sdc-button__{{ type }} btn-{{ size }} {{ iconPositionClass }}" 
 [disabled] = "(disabled || show_spinner) && !isExplainedDisabled()"
        [attr.aria-disabled]="isExplainedDisabled() ? 'true' : null"
        [attr.title]="isExplainedDisabled() ? disabledReason : null"
        [attr.data-tests-id]="testId"
        (click)="onInnerClick($event)">
        <svg-icon
                *ngIf="icon_name"
                [name]="icon_name"
                [mode]="icon_mode"
                [size]="'medium'"
                >
        </svg-icon>
       {{text}}
</button>
<svg-icon *ngIf="show_spinner" name="spinner" [size]="'medium'" class="sdc-button__spinner" [ngClass]="{left: spinner_position === placement.right}"></svg-icon>
`;
