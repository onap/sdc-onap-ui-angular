export const template = `
<div class="sdc-accordion" [ngClass]="customCSSClass" [attr.data-tests-id]="testId">
    <div class="sdc-accordion-header" sdcKeyboardClick (click)="toggleAccordion()"
         [attr.aria-expanded]="!!open" [attr.aria-controls]="bodyId"
         [ngClass]="{'arrow-right': arrowDirection === accordionArrowDirection.right}">
        <div class="svg-icon-wrapper bottom" [ngClass]="{'down': open}">
            <svg-icon [name]="'chevron-up'"  [size]="'large'" [mode]="'secondary'"></svg-icon>
        </div>
        <div class="title">
            {{title}}
        </div>
    </div>
    <div class="sdc-accordion-body" [attr.id]="bodyId" [ngClass]="{open: open}">
        <ng-content></ng-content>
    </div>
</div>`;
