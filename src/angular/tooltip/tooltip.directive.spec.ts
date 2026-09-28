import { ApplicationRef, Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TooltipModule } from './tooltip.module';
import { TooltipDirective } from './tooltip.directive';

@Component({
    template: `<span sdc-tooltip tooltip-text="Tooltip text">Host</span>`
})
class TooltipHostComponent {
}

describe('TooltipDirective', () => {
    let fixture: ComponentFixture<TooltipHostComponent>;
    let appRef: ApplicationRef;
    let directive: TooltipDirective;
    let hostElement: HTMLElement;

    const tooltipElement = (): HTMLElement => document.querySelector('.sdc-tooltip-template-container');

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [TooltipModule],
            declarations: [TooltipHostComponent]
        });
        fixture = TestBed.createComponent(TooltipHostComponent);
        // TestBed does not bootstrap, so register the host the way a real app root is registered.
        appRef = TestBed.get(ApplicationRef);
        appRef.components.push(fixture.componentRef);
        fixture.detectChanges();

        const debugElement = fixture.debugElement.query(By.directive(TooltipDirective));
        directive = debugElement.injector.get(TooltipDirective);
        hostElement = debugElement.nativeElement;
    });

    afterEach(() => {
        const index = appRef.components.indexOf(fixture.componentRef);
        if (index >= 0) {
            appRef.components.splice(index, 1);
        }
        const leftover = document.querySelector('tooltip-template');
        if (leftover && leftover.parentNode) {
            leftover.parentNode.removeChild(leftover);
        }
    });

    const show = () => {
        hostElement.dispatchEvent(new Event('mouseenter'));
        appRef.tick();
    };

    it('renders the tooltip as a direct child of document.body', () => {
        show();

        const tooltip = tooltipElement();
        expect(tooltip).not.toBeNull();
        expect(tooltip.textContent).toEqual('Tooltip text');
        expect(tooltip.parentElement.tagName.toLowerCase()).toEqual('tooltip-template');
        expect(tooltip.parentElement.parentElement).toBe(document.body);
        expect(tooltip.classList).toContain('sdc-tooltip-show');
    });

    it('removes the tooltip and the scroll listener on mouseleave', () => {
        const removeSpy = jest.spyOn(window, 'removeEventListener');
        show();

        hostElement.dispatchEvent(new Event('mouseleave'));

        expect(tooltipElement()).toBeNull();
        expect(removeSpy).toHaveBeenCalledWith('scroll', (directive as any).scrollEventHandler, true);
        removeSpy.mockRestore();
    });

    it('removes a shown tooltip and the scroll listener when the host is destroyed', () => {
        const removeSpy = jest.spyOn(window, 'removeEventListener');
        show();
        expect(tooltipElement()).not.toBeNull();

        fixture.destroy();

        expect(tooltipElement()).toBeNull();
        expect(removeSpy).toHaveBeenCalledWith('scroll', (directive as any).scrollEventHandler, true);
        removeSpy.mockRestore();
    });

    it('does not reposition after the host is destroyed during a pending scroll', fakeAsync(() => {
        show();
        const setPositionSpy = jest.spyOn(directive as any, 'setPosition');

        window.dispatchEvent(new Event('scroll'));
        fixture.destroy();
        window.dispatchEvent(new Event('scroll'));
        tick(20);

        expect(setPositionSpy).not.toHaveBeenCalled();
    }));
});
