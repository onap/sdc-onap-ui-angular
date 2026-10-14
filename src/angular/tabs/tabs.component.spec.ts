import { Component } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Mode } from '../common/enums';
import { TabComponent } from './children/tab.component';
import { TabsComponent } from './tabs.component';
import { TabsModule } from './tabs.module';

// TabsComponent coordinates a QueryList of child tabs. The QueryList is
// replaced with a minimal stub exposing the members the component uses
// (toArray, filter, find, first) so the selection logic can be tested without a host
// template projecting real <sdc-tab> children.
describe('TabsComponent', () => {
    let component: TabsComponent;

    const makeTab = (active: boolean): TabComponent => {
        const tab = new TabComponent();
        tab.active = active;
        return tab;
    };

    const asQueryList = (tabs: TabComponent[]) => ({
        toArray: () => tabs,
        filter: (fn: (t: TabComponent) => boolean) => tabs.filter(fn),
        find: (fn: (t: TabComponent) => boolean) => tabs.find(fn),
        first: tabs[0]
    });

    beforeEach(() => {
        component = new TabsComponent();
    });

    it('selectTab activates only the chosen tab and emits it', () => {
        const tabA = makeTab(true);
        const tabB = makeTab(false);
        component.tabs = asQueryList([tabA, tabB]) as {} as any;
        let emitted: TabComponent;
        component.selectedTab.subscribe((tab) => { emitted = tab; });

        component.selectTab(tabB);

        expect(tabA.active).toEqual(false);
        expect(tabA.titleIconMode).toEqual(Mode.secondary);
        expect(tabB.active).toEqual(true);
        expect(tabB.titleIconMode).toEqual(Mode.primary);
        expect(emitted).toBe(tabB);
    });

    it('activates the first tab when none is active on content init', () => {
        const tabA = makeTab(false);
        const tabB = makeTab(false);
        component.tabs = asQueryList([tabA, tabB]) as {} as any;

        component.ngAfterContentInit();

        expect(tabA.active).toEqual(true);
        expect(tabB.active).toEqual(false);
    });

    it('leaves the active tab untouched when one is already active on content init', () => {
        const tabA = makeTab(false);
        const tabB = makeTab(true);
        component.tabs = asQueryList([tabA, tabB]) as {} as any;

        component.ngAfterContentInit();

        expect(tabA.active).toEqual(false);
        expect(tabB.active).toEqual(true);
    });

    it('sets the vertical class from the isVertical input on init', () => {
        component.isVertical = true;
        component.ngOnInit();
        expect(component.verticalClass).toEqual(true);
    });
});

@Component({ template: `
  <sdc-tabs [isVertical]="vertical" (selectedTab)="selected = selected + 1">
    <sdc-tab title="One" titleIcon="plus"><p>1</p></sdc-tab>
    <sdc-tab title="Two"><p>2</p></sdc-tab>
    <sdc-tab title="Three"><p>3</p></sdc-tab>
  </sdc-tabs>` })
class TabsHostComponent {
    public vertical = false;
    public selected = 0;
}

describe('TabsComponent keyboard pattern', () => {
    let f: ComponentFixture<TabsHostComponent>;
    const tabs = () => Array.from(f.nativeElement.querySelectorAll('[role=tab]')) as HTMLElement[];
    const panels = () => Array.from(f.nativeElement.querySelectorAll('[role=tabpanel]')) as HTMLElement[];
    const press = (key: string, init: KeyboardEventInit = {}): KeyboardEvent => {
        const event = new KeyboardEvent('keydown', Object.assign({ key, bubbles: true, cancelable: true }, init));
        document.activeElement.dispatchEvent(event);
        f.detectChanges();
        tick();
        return event;
    };

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [TabsModule], declarations: [TabsHostComponent] });
        f = TestBed.createComponent(TabsHostComponent);
        f.detectChanges();
        f.componentInstance.selected = 0;
    });

    it('exposes selection and a single tab stop', () => {
        expect(f.nativeElement.querySelector('[role=tablist]').getAttribute('aria-orientation')).toBe('horizontal');
        expect(tabs().map((t) => t.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false']);
        expect(tabs().map((t) => t.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
        tabs().forEach((tab, i) => {
            expect(tab.getAttribute('aria-controls')).toBe(panels()[i].id);
            expect(panels()[i].getAttribute('aria-labelledby')).toBe(tab.id);
        });
        expect(new Set(tabs().map((t) => t.id)).size).toBe(3);
    });

    it('points every aria-controls at a panel in the DOM, including hidden ones', () => {
        tabs().forEach((tab) => {
            const panel = f.nativeElement.querySelector('#' + tab.getAttribute('aria-controls'));
            expect(panel).not.toBeNull();
            expect(panel.getAttribute('role')).toBe('tabpanel');
        });
        expect(panels().map((p) => p.hidden)).toEqual([false, true, true]);
    });

    it('keeps the tab icon out of the tab order', () => {
        const icon = tabs()[0].querySelector('svg-icon-label');
        expect(icon).not.toBeNull();
        expect(tabs()[0].querySelectorAll('[tabindex]').length).toBe(0);
        expect(icon.hasAttribute('role')).toBe(false);
    });

    it('ArrowRight / ArrowLeft / Home / End move selection and focus, wrapping', fakeAsync(() => {
        tabs()[0].focus();
        press('ArrowRight'); expect(document.activeElement).toBe(tabs()[1]);
        press('End');        expect(document.activeElement).toBe(tabs()[2]);
        press('ArrowRight'); expect(document.activeElement).toBe(tabs()[0]);
        press('ArrowLeft');  expect(document.activeElement).toBe(tabs()[2]);
        press('Home');       expect(document.activeElement).toBe(tabs()[0]);
        expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
        expect(tabs().map((t) => t.getAttribute('tabindex'))).toEqual(['0', '-1', '-1']);
    }));

    it('uses ArrowUp / ArrowDown when vertical', fakeAsync(() => {
        f.componentInstance.vertical = true;
        f.detectChanges();
        expect(f.nativeElement.querySelector('[role=tablist]').getAttribute('aria-orientation')).toBe('vertical');
        tabs()[0].focus();
        press('ArrowRight'); expect(document.activeElement).toBe(tabs()[0]);
        press('ArrowDown');  expect(document.activeElement).toBe(tabs()[1]);
        press('ArrowUp');    expect(document.activeElement).toBe(tabs()[0]);
    }));

    it('Enter and Space select the focused tab once and Space does not scroll', fakeAsync(() => {
        tabs()[1].focus();
        press('Enter');
        expect(f.componentInstance.selected).toBe(1);
        expect(tabs()[1].getAttribute('aria-selected')).toBe('true');
        expect(press(' ').defaultPrevented).toBe(true);
        expect(f.componentInstance.selected).toBe(2);
        expect(press('Enter', { repeat: true }).defaultPrevented).toBe(true);
        expect(f.componentInstance.selected).toBe(2);
    }));

    it('leaves modified arrows and other keys to the browser', fakeAsync(() => {
        tabs()[0].focus();
        expect(press('ArrowRight', { altKey: true }).defaultPrevented).toBe(false);
        expect(press('Tab').defaultPrevented).toBe(false);
        expect(document.activeElement).toBe(tabs()[0]);
        expect(f.componentInstance.selected).toBe(0);
    }));
});

@Component({ template: `
  <sdc-tabs (selectedTab)="selected = selected + 1">
    <sdc-tab title="One" [disabled]="firstDisabled"><p>1</p></sdc-tab>
    <sdc-tab title="Two" [disabled]="true"><p>2</p></sdc-tab>
    <sdc-tab title="Three" [disabled]="lastDisabled"><p>3</p></sdc-tab>
  </sdc-tabs>` })
class DisabledTabsHostComponent {
    public firstDisabled = false;
    public lastDisabled = false;
    public selected = 0;
}

describe('TabsComponent disabled tabs', () => {
    let f: ComponentFixture<DisabledTabsHostComponent>;
    const tabs = () => Array.from(f.nativeElement.querySelectorAll('[role=tab]')) as HTMLElement[];
    const create = (firstDisabled: boolean, lastDisabled: boolean) => {
        TestBed.configureTestingModule({ imports: [TabsModule], declarations: [DisabledTabsHostComponent] });
        f = TestBed.createComponent(DisabledTabsHostComponent);
        f.componentInstance.firstDisabled = firstDisabled;
        f.componentInstance.lastDisabled = lastDisabled;
        f.detectChanges();
        f.componentInstance.selected = 0;
    };
    const press = (key: string) => {
        document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
        f.detectChanges();
        tick();
    };

    it('exposes disabled tabs to assistive technology', () => {
        create(false, false);
        expect(tabs().map((t) => t.getAttribute('aria-disabled'))).toEqual([null, 'true', null]);
        expect(tabs().map((t) => t.hasAttribute('disabled'))).toEqual([false, true, false]);
        expect(tabs()[1].getAttribute('tabindex')).toBe('-1');
    });

    it('arrows, Home and End skip disabled tabs', fakeAsync(() => {
        create(false, false);
        tabs()[0].focus();
        press('ArrowRight'); expect(document.activeElement).toBe(tabs()[2]);
        press('ArrowLeft');  expect(document.activeElement).toBe(tabs()[0]);
        press('End');        expect(document.activeElement).toBe(tabs()[2]);
        press('Home');       expect(document.activeElement).toBe(tabs()[0]);
        expect(tabs()[1].getAttribute('aria-selected')).toBe('false');
    }));

    it('stays put when every other tab is disabled', fakeAsync(() => {
        create(false, true);
        tabs()[0].focus();
        press('ArrowRight'); expect(document.activeElement).toBe(tabs()[0]);
        press('End');        expect(document.activeElement).toBe(tabs()[0]);
        expect(tabs()[0].getAttribute('aria-selected')).toBe('true');
    }));

    it('click and Enter do not activate a disabled tab', fakeAsync(() => {
        create(false, false);
        tabs()[1].click();
        f.detectChanges();
        tabs()[1].focus();
        press('Enter');
        press(' ');
        expect(f.componentInstance.selected).toBe(0);
        expect(tabs().map((t) => t.getAttribute('aria-selected'))).toEqual(['true', 'false', 'false']);
    }));

    it('activates the first enabled tab when none is active', () => {
        create(true, false);
        expect(tabs().map((t) => t.getAttribute('aria-selected'))).toEqual(['false', 'false', 'true']);
    });
});
