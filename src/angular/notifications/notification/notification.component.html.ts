export const template = `
<div class="sdc-notification {{'type-' + notificationSetting.type}}" (click)="fadeOut()" aria-atomic="true"
    [attr.aria-live]="notificationSetting.type === 'error' ? 'assertive' : null"
    [class.fade-out__animated]="fade" (animationend)="destroyMe()" [attr.data-tests-id]="testId">
    <div *ngIf="!notificationSetting.hasCustomContent" class="sdc-notification__icon_container">
        <div class="sdc-notification__icon" >
        </div>
    </div>    
    <div *ngIf="!notificationSetting.hasCustomContent" class="sdc-notification__message">
        <div class="sdc-notification__title">
            {{notificationSetting.notifyTitle}}
        </div>
        <div class="sdc-notification__text" >
            {{notificationSetting.notifyText}}
        </div>
    </div>
    <div #dynamicContentContainer></div>
</div>
`;
