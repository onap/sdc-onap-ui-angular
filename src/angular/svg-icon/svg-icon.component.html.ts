// The button carries only svg-icon-wrapper: mode-*/size-* stay on the inner .svg-icon, because the
// .svg-icon-wrapper.mode-* hover rules would otherwise override the icon's own hover colour.
export const template = `
<button *ngIf="isButton(); else plainIcon" type="button" class="svg-icon-wrapper" [disabled]="!!disabled" [attr.aria-label]="ariaLabel || null" [attr.data-tests-id]="testId"><span [ngClass]="classes" [innerHtml]="svgIconContentSafeHtml"></span></button>
<ng-template #plainIcon><span [ngClass]="classes" [attr.disabled]="disabled || undefined" [innerHtml]="svgIconContentSafeHtml" [attr.data-tests-id]="testId"></span></ng-template>
`;
