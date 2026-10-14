export const template = `
<ul class="sdc-tabs-list" role="tablist" [attr.aria-orientation]="isVertical ? 'vertical' : 'horizontal'" [attr.data-tests-id]="testId">
    <li *ngFor="let tab of tabs; let i = index" class="{{tabStyle}}" role="presentation"
      [class.sdc-tab-active]="tab.active"
      sdc-tooltip [tooltip-text]="tab.tooltipText" [tooltip-placement]="3" [attr.data-tests-id]="tab.testId">
     <button type="button" class="sdc-tab__button" role="tab"
       [attr.id]="tab.tabId" [attr.aria-controls]="tab.panelId"
       [attr.aria-label]="tab.title ? null : (tab.tooltipText || null)"
       [attr.aria-selected]="!!tab.active" [attr.tabindex]="tab.active ? 0 : -1"
       [disabled]="!!tab.disabled" (click)="selectTab(tab)" (keydown)="onTabKeydown($event, i)">
     <span class="tab-container">
     <svg-icon-label [ngClass]="{'tab-icon' : tab.title}"
     *ngIf="tab.titleIcon"
     [name]="tab.titleIcon"
     [mode]="tab.active && tabStyle == 'sdc-table-tab' ? 'white' : tab.titleIconMode"
     [size]="iconsSize">
    </svg-icon-label>
      <span class="tab-title" *ngIf="tab.title">{{tab.title}}</span>
      </span>
     </button>
    </li>
</ul>
<div *ngIf="tabStyle == 'sdc-table-tab'" class="line-separates"></div>
<ng-content></ng-content>
`;
