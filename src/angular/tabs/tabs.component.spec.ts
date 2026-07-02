import { Mode } from '../common/enums';
import { TabComponent } from './children/tab.component';
import { TabsComponent } from './tabs.component';

// TabsComponent coordinates a QueryList of child tabs. The QueryList is
// replaced with a minimal stub exposing the members the component uses
// (toArray, filter, first) so the selection logic can be tested without a host
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
