export const template = `
<div class = "sdc-loader-wrapper" *ngIf="!global" [attr.data-tests-id]="testId">
    <div class="sdc-loader-background" *ngIf="active"
      [style.top]="offset.top" [style.left]="offset.left" [style.width]="offset.width"  [style.height]="offset.height">
        <div class="sdc-loader {{ size }}" *ngIf="active"></div>
    </div>
    <ng-content></ng-content>
</div>
<div  *ngIf="global&&active" [attr.data-tests-id]="testId">
    <div class="sdc-loader-global-wrapper sdc-loader-background" >
        <div class="sdc-loader {{ size }}"></div>
    </div>
</div>
<span class="sdc-loader-status" role="status" style="position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">{{ active ? loadingText : '' }}</span>
`;
