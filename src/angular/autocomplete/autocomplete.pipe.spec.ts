import { IDataSchema } from './autocomplete.component';
import { AutocompletePipe } from './autocomplete.pipe';

// AutocompletePipe is a pure transform, so it is exercised directly rather than
// through TestBed: there is no template or DI to wire up.
describe('AutocompletePipe', () => {
    let pipe: AutocompletePipe;
    const data: IDataSchema[] = [
        { key: '1', value: 'Apple' },
        { key: '2', value: 'Banana' },
        { key: '3', value: 'apricot' }
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
