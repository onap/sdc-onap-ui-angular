import { Component, Input } from '@angular/core';
import { Mode } from './../../common/enums';
import { template } from "./tab.component.html";

@Component({
  selector: 'sdc-tab',
  template: template
})
export class TabComponent {
  private static nextId = 0;

  @Input() public title: string;
  @Input() public titleIcon: string;
  @Input() public active = false;
  @Input() public tooltipText: string;
  @Input() public testId: string;
  @Input() public disabled = false;

  public titleIconMode = Mode.secondary;
  public tabId: string;
  public panelId: string;

  constructor() {
    const n = TabComponent.nextId++;
    this.tabId = 'sdc-tab-' + n;
    this.panelId = 'sdc-tabpanel-' + n;
  }

}
