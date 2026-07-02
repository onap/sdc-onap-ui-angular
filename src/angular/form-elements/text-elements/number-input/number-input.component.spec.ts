import { NumberInputComponent } from './number-input.component';

// NumberInputComponent's stepper/clamp logic (clickUp/clickDown ->
// validateValue -> validateMax/validateMin) is plain arithmetic with no
// template dependency, so it is exercised by direct instantiation. onKeyPress
// (inherited value coercion) is triggered via the clicks.
describe('NumberInputComponent', () => {
    let component: NumberInputComponent;

    beforeEach(() => {
        component = new NumberInputComponent();
    });

    it('defaults the step to 1', () => {
        expect(component.step).toEqual(1);
    });

    it('increments the value by the step on clickUp', () => {
        component.value = 5;
        component.clickUp();
        expect(component.value).toEqual(6);
    });

    it('decrements the value by the step on clickDown', () => {
        component.value = 5;
        component.clickDown();
        expect(component.value).toEqual(4);
    });

    it('honours a custom step', () => {
        component.step = 10;
        component.value = 0;
        component.clickUp();
        expect(component.value).toEqual(10);
    });

    it('clamps to maxValue and does not exceed it on clickUp', () => {
        component.maxValue = 5;
        component.value = 5;
        component.clickUp();
        expect(component.value).toEqual(5);
    });

    it('clamps to minValue and does not go below it on clickDown', () => {
        component.minValue = 2;
        component.value = 2;
        component.clickDown();
        expect(component.value).toEqual(2);
    });

    it('validateMax returns true and pins the value when above the max', () => {
        component.maxValue = 5;
        component.value = 3;
        expect(component.validateMax(10)).toEqual(true);
        expect(component.value).toEqual(component.maxValue);
    });

    it('validateMax returns falsy when no max is set', () => {
        expect(component.validateMax(10)).toBeFalsy();
    });

    it('validateMin returns true and pins the value when below the min', () => {
        component.minValue = 2;
        component.value = 5;
        expect(component.validateMin(1)).toEqual(true);
        expect(component.value).toEqual(2);
    });

    it('validateMin returns falsy when no min is set', () => {
        expect(component.validateMin(-10)).toBeFalsy();
    });

    // Characterization test, not a wish: the min/max guards are written
    // `if (this.minValue && ...)` / `if (this.maxValue && ...)`, so a bound of
    // exactly 0 is falsy and silently disables clamping. This documents the
    // current (arguably buggy) behaviour so a future fix is a deliberate,
    // visible change rather than a surprise.
    it('does NOT clamp when the bound is exactly 0 (falsy-guard quirk)', () => {
        component.minValue = 0;
        component.value = 0;
        component.clickDown();
        expect(component.value).toEqual(-1);
    });
});
