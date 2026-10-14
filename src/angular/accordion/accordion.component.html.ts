export const template = `
<div class="sdc-accordion" [ngClass]="[customCSSClass || '', disabled ? 'disabled' : '']" [attr.data-tests-id]="testId">
    <button type="button" class="sdc-accordion-header" [disabled]="!!disabled" (click)="toggleAccordion()"
         [attr.aria-expanded]="!!open" [attr.aria-controls]="bodyId"
         [ngClass]="{'arrow-right': arrowDirection === accordionArrowDirection.right}">
        <span class="svg-icon-wrapper bottom" [ngClass]="{'down': open}">
            <svg-icon [name]="'chevron-up'"  [size]="'large'" [mode]="'secondary'"></svg-icon>
        </span>
        <span class="title">
            {{title}}
        </span>
    </button>
    <div class="sdc-accordion-body" [attr.id]="bodyId" [ngClass]="{open: open}">
        <ng-content></ng-content>
    </div>
</div>`;
