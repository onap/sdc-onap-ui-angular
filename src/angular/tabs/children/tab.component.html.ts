export const template = `
<div [hidden]="!active" class="sdc-tab-content" role="tabpanel" [attr.id]="panelId" [attr.aria-labelledby]="tabId">
    <ng-content></ng-content>
</div>
`;
