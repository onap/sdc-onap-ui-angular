import { IDropDownOption } from '../form-elements/dropdown/dropdown-models';
import { AutocompletePipe } from './autocomplete.pipe';

// AutocompletePipe is a pure transform, so it is exercised directly rather than
// through TestBed: there is no template or DI to wire up.
describe('AutocompletePipe', () => {
    let pipe: AutocompletePipe;
    const data: IDropDownOption[] = [
        { label: '1', value: 'Apple' },
        { label: '2', value: 'Banana' },
        { label: '3', value: 'apricot' }
    ];

    beforeEach(() => {
        pipe = new AutocompletePipe();
    });

    it('returns the data unchanged when the filter text is empty', () => {
        expect(pipe.transform(data, '')).toBe(data);
    });

    it('returns the data unchanged when the filter text is undefined', () => {
        expect(pipe.transform(data, undefined)).toBe(data);
    });

    it('filters by a case-insensitive substring of the value', () => {
        const result = pipe.transform(data, 'ap');
        expect(result.map((item) => item.value)).toEqual(['Apple', 'apricot']);
    });

    it('returns an empty array when nothing matches', () => {
        expect(pipe.transform(data, 'zzz')).toEqual([]);
    });
});
