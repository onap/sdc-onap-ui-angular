export const template = `
<div class="sdc-textarea">
    <label class="sdc-textarea__label" *ngIf="label" [attr.for]="textareaId" [ngClass]="{'required':required}">{{label}}</label>
    <textarea
        class="sdc-textarea__textarea {{classNames}}"
        [ngClass]="{'error': (!valid && dirty), 'disabled':disabled}"
        [attr.id]="textareaId"
        [attr.aria-required]="required ? 'true' : null"
        [attr.aria-invalid]="hasError() ? 'true' : null"
        [attr.aria-describedby]="hasError() && describedBy ? describedBy : null"
        [attr.name]="name ? name : null"
        [placeholder]="placeHolder || ''"
        [(ngModel)]="value"
        [maxlength]="maxLength"
        [minlength]="minLength"
        [formControl]="control"
        [attr.disabled]="disabled ? 'disabled' : null"
        (input)="onKeyPress($event.target.value)"
        [attr.data-tests-id]="testId">
    </textarea>
</div>
`;
