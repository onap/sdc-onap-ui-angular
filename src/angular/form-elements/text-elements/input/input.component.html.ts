export const template = `
<div class="sdc-input ">
    <label class="sdc-input__label" *ngIf="label" [attr.id]="labelId" [ngClass]="{'required':required}">{{label}}</label>
    <div class="sdc-input-wrapper">
        <input
            class="sdc-input__input {{classNames}} {{size}}"
            [ngClass]="{'error': (!valid && dirty), 'disabled':disabled, 'isViewMode': isViewMode}"
            [attr.id]="inputId"
            [attr.aria-labelledby]="label ? labelId : null"
            [attr.name]="name ? name : null"
            [placeholder]="placeHolder"
            [(ngModel)]="value"
            [maxlength]="maxLength"
            [minlength]="minLength"
            [type]="type"
            [formControl]="control"
            [attr.disabled]="(disabled || (isViewMode && !focusableInViewMode)) ? 'disabled' : null"
            [attr.readonly]="!disabled && isViewMode && focusableInViewMode ? 'readonly' : null"
            [attr.role]="ariaRole || null"
            [attr.aria-haspopup]="ariaHasPopup || null"
            [attr.aria-expanded]="ariaExpanded == null ? null : !!ariaExpanded"
            [attr.aria-controls]="ariaControls || null"
            [attr.aria-activedescendant]="ariaActiveDescendant || null"
            (input)="onKeyPress($event.target.value)"
            [attr.data-tests-id]="testId"
        />

        <svg-icon *ngIf="righIconName" [testId]="testId +'-icon'" class="input-right-icon" [name]="righIconName" mode="secondary" (click)="onIconClicked()" [clickable]="isIconClickable" size="medium"></svg-icon>

    </div>
</div>
`;
