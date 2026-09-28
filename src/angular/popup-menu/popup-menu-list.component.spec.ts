import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupMenuModule } from './popup-menu.module';
import { PopupMenuListComponent } from './popup-menu-list.component';
import { PopupMenuItemComponent } from './popup-menu-item.component';

@Component({
    template: `
        <popup-menu-list [(open)]="open">
            <popup-menu-item *ngFor="let item of items">{{item}}</popup-menu-item>
        </popup-menu-list>`
})
class PopupMenuHostComponent {
    public open: boolean = true;
    public items: string[] = ['first', 'second'];
    @ViewChild(PopupMenuListComponent) public list: PopupMenuListComponent;
    @ViewChildren(PopupMenuItemComponent) public menuItems: QueryList<PopupMenuItemComponent>;
}

describe('PopupMenuListComponent', () => {
    let fixture: ComponentFixture<PopupMenuHostComponent>;
    let host: PopupMenuHostComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [PopupMenuModule],
            declarations: [PopupMenuHostComponent]
        }).compileComponents();
        fixture = TestBed.createComponent(PopupMenuHostComponent);
        host = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('links the initial items to the list', () => {
        host.menuItems.forEach((item, idx) => {
            expect(item.parentMenu).toBe(host.list);
            expect(item.index).toBe(idx);
        });
    });

    it('links items to the list after the item list changes', () => {
        host.items = ['zeroth', 'first', 'second', 'third'];
        fixture.detectChanges();

        expect(host.menuItems.length).toBe(4);
        host.menuItems.forEach((item, idx) => {
            expect(item.parentMenu).toBe(host.list);
            expect(item.index).toBe(idx);
        });
    });

    it('closes the list when an item added after init is clicked', () => {
        host.items = [...host.items, 'third'];
        fixture.detectChanges();

        const items = fixture.nativeElement.querySelectorAll('li.sdc-menu-item');
        items[items.length - 1].click();
        fixture.detectChanges();

        expect(host.open).toBe(false);
    });
});
