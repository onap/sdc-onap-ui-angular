import { Component, Input, AfterContentInit, ContentChildren, QueryList, HostBinding, EventEmitter, Output } from '@angular/core';
import { TabComponent } from './children/tab.component';
import { Mode, Size, TabsStyle } from './../common/enums';
import { template } from "./tabs.component.html";

@Component({
    selector: 'sdc-tabs',
    template: template
})

export class TabsComponent implements AfterContentInit {

    @HostBinding('class') classes = 'sdc-tabs sdc-tabs-header';
    @HostBinding('class.vertical') verticalClass: boolean;
    @ContentChildren(TabComponent) public tabs: QueryList<TabComponent>;
    @Input() public testId: string;
    @Input() public iconsSize: Size = Size.medium;
    @Input() public isVertical: boolean = false;
    @Input() public tabStyle: TabsStyle = TabsStyle.panel;
    @Output() public selectedTab: EventEmitter<TabComponent> = new EventEmitter<TabComponent>();

    public selectTab(tab: TabComponent) {
        if (tab.disabled) {
            return;
        }
        this.selectedTab.emit(tab);
        // deactivate all tabs
        this.tabs.toArray().forEach((_tab: TabComponent) => {
            _tab.active = false;
            _tab.titleIconMode = Mode.secondary;
        });

        // activate the tab the user has clicked on.
        tab.active = true;
        tab.titleIconMode = Mode.primary;
    }

    public onTabKeydown(event: KeyboardEvent, index: number): void {
        if (event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }
        const list = this.tabs.toArray();
        const prev = this.isVertical ? 'ArrowUp' : 'ArrowLeft';
        const next = this.isVertical ? 'ArrowDown' : 'ArrowRight';
        let target = -1;
        if (event.key === next) {
            target = this.nextEnabled(list, index, 1);
        } else if (event.key === prev) {
            target = this.nextEnabled(list, index, -1);
        } else if (event.key === 'Home') {
            target = this.nextEnabled(list, -1, 1);
        } else if (event.key === 'End') {
            target = this.nextEnabled(list, list.length, -1);
        }
        if (target < 0) {
            return;
        }
        event.preventDefault();
        this.selectTab(list[target]);
        // A tab panel can project another sdc-tabs, so only this list's own items count.
        const items = (event.currentTarget as HTMLElement).parentElement.parentElement.children;
        const button = items[target].querySelector('.sdc-tab__button') as HTMLElement;
        setTimeout(() => button.focus());
    }

    private nextEnabled(list: TabComponent[], from: number, step: number): number {
        const n = list.length;
        for (let i = 1; i <= n; i++) {
            const candidate = (((from + step * i) % n) + n) % n;
            if (!list[candidate].disabled) {
                return candidate;
            }
        }
        return -1;
    }

  public ngOnInit() {
    this.verticalClass = this.isVertical;
  }

    public ngAfterContentInit() {
        // get all active tabs
        const activeTabs = this.tabs.filter((tab) => tab.active);

        // if there is no active tab set, activate the first enabled one
        if (activeTabs.length === 0) {
            const firstEnabled = this.tabs.find((tab) => !tab.disabled);
            if (firstEnabled) {
                this.selectTab(firstEnabled);
            }
        }
    }
}
