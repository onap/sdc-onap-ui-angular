export const template = `
<button *ngIf="isButton(); else plainLabel" type="button" class="svg-icon-wrapper" [ngClass]="[(mode) ? 'mode-'+mode : '', (size) ? 'size-'+size : '', (labelPlacement) ? 'label-placement-'+labelPlacement : '', (clickable) ? 'clickable' : '', className || '']" [disabled]="!!disabled"
    [attr.aria-label]="label ? null : (ariaLabel || null)" [attr.data-tests-id]="testId">
    <ng-container *ngTemplateOutlet="labelContent"></ng-container>
</button>
<ng-template #plainLabel>
<span class="svg-icon-wrapper" [ngClass]="[(mode) ? 'mode-'+mode : '', (size) ? 'size-'+size : '', (labelPlacement) ? 'label-placement-'+labelPlacement : '', (clickable) ? 'clickable' : '', className || '']" [attr.disabled]="disabled || undefined"
    [attr.data-tests-id]="testId">
    <ng-container *ngTemplateOutlet="labelContent"></ng-container>
</span>
</ng-template>
<ng-template #labelContent>
    <svg-icon [name]="name" className="svg-icon" [size]="size"></svg-icon>
    <span *ngIf="label" class="svg-icon-label" [ngClass]="[labelClassName || '']">{{ label }}</span>
</ng-template>
`;
