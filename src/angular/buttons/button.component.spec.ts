import { ButtonType } from '../common/enums';
import { ButtonComponent } from './button.component';

// The button's logic (double-click guard, enable/disable, icon class) is plain
// TypeScript with no template dependency, so the component is instantiated
// directly. onClick is fed minimal event stubs that record preventDefault /
// stopPropagation calls.
describe('ButtonComponent', () => {
    let component: ButtonComponent;

    const makeEvent = () => {
        const calls = { prevented: false, stopped: false };
        const event = {
            preventDefault: () => { calls.prevented = true; },
            stopPropagation: () => { calls.stopped = true; }
        };
        return { event, calls };
    };

    beforeEach(() => {
        component = new ButtonComponent();
    });

    it('defaults to a primary, enabled, default-size button', () => {
        expect(component.type).toEqual(ButtonType.primary);
        expect(component.size).toEqual('default');
        expect(component.disabled).toEqual(false);
    });

    it('derives the icon position class in ngOnInit', () => {
        component.icon_position = 'right';
        component.ngOnInit();
        expect(component.iconPositionClass).toEqual('sdc-icon-right');
    });

    it('leaves the icon position class empty when no position is set', () => {
        component.ngOnInit();
        expect(component.iconPositionClass).toEqual('');
    });

    it('enables and disables the button', () => {
        component.disableButton();
        expect(component.disabled).toEqual(true);
        component.enableButton();
        expect(component.disabled).toEqual(false);
    });

    it('does not block a click when preventDoubleClick is off', () => {
        component.preventDoubleClick = false;
        const first = makeEvent();
        component.onClick(first.event);
        const second = makeEvent();
        component.onClick(second.event);
        expect(second.calls.prevented).toEqual(false);
        expect(second.calls.stopped).toEqual(false);
    });

    it('blocks a second rapid click when preventDoubleClick is on', () => {
        component.preventDoubleClick = true;
        const first = makeEvent();
        component.onClick(first.event);
        // A second click within 500ms is suppressed.
        const second = makeEvent();
        component.onClick(second.event);
        expect(second.calls.prevented).toEqual(true);
        expect(second.calls.stopped).toEqual(true);
    });
});
