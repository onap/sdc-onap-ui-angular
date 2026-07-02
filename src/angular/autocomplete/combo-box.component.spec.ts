import { ElementRef } from '@angular/core';
import { IDropDownOption } from '../form-elements/dropdown/dropdown-models';
import { AutocompletePipe } from './autocomplete.pipe';
import { ComboBoxComponent } from './combo-box.component';

// ComboBoxComponent's result-calculation and selection logic is
// template-independent: it delegates filtering to a real AutocompletePipe and
// emits on selection. The @ViewChild input and ElementRef are replaced with
// light stubs so the component can be instantiated directly.
describe('ComboBoxComponent', () => {
    let component: ComboBoxComponent;

    const data: IDropDownOption[] = [
        { label: '1', value: 'Apple' },
        { label: '2', value: 'Banana' },
        { label: '3', value: 'apricot' }
    ];

    beforeEach(() => {
        const elementRefStub = { nativeElement: {} } as ElementRef;
        component = new ComboBoxComponent(elementRefStub, new AutocompletePipe());
        component.data = data;
        // @ViewChild('comboBoxInput') is not resolved without a template.
        component.input = { isViewMode: false, placeHolder: '' } as any;
    });

    it('filters the data by a case-insensitive substring', () => {
        const results = component.calculateComboBoxResults(data, 'ap');
        expect(results.map((r) => r.value)).toEqual(['Apple', 'apricot']);
    });

    it('returns a single no-results option when nothing matches', () => {
        const results = component.calculateComboBoxResults(data, 'zzz');
        expect(results.length).toEqual(1);
        expect(results[0].value).toEqual(component.noResultsMessage);
    });

    it('ignores a selection of the no-results placeholder', () => {
        let emitted = false;
        component.itemSelected.subscribe(() => { emitted = true; });
        component.onItemSelected({ label: component.noResultsMessage, value: component.noResultsMessage });
        expect(emitted).toEqual(false);
    });

    it('emits the selected value and exits search mode on a real selection', () => {
        let emitted: string;
        component.itemSelected.subscribe((value) => { emitted = value; });
        component.onItemSelected({ label: 'a', value: 'Apple' });
        expect(emitted).toEqual('Apple');
        expect(component.selectedValue).toEqual('Apple');
        expect(component.autoCompleteResults).toEqual([]);
    });

    it('does not react to the right icon while disabled', () => {
        component.disabled = true;
        let emitted = false;
        component.rightIconClickedEmitter.subscribe(() => { emitted = true; });
        component.onRightIconClicked();
        expect(emitted).toEqual(false);
    });
});
