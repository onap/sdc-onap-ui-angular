import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { AutocompletePipe } from './autocomplete.pipe';
import { AutoCompleteComponent } from './autocomplete.component';

describe('AutoCompleteComponent with dataUrl', () => {
    const dataUrl = '/search';
    let component: AutoCompleteComponent;
    let httpMock: HttpTestingController;

    const pendingRequestFor = (query: string): TestRequest =>
        httpMock.expectOne((req) => req.url === dataUrl && req.params.get('searchQuery') === query);

    const resultValues = (): string[] => component.autoCompleteResults.map((r) => r.value);

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
        httpMock = TestBed.get(HttpTestingController);
        component = new AutoCompleteComponent(TestBed.get(HttpClient), new AutocompletePipe());
        component.dataUrl = dataUrl;
        component.ngOnInit();
    });

    afterEach(() => {
        component.ngOnDestroy();
    });

    it('shows the results of the latest query when an earlier response arrives late', () => {
        component.onSearchQueryChanged('a');
        const first = pendingRequestFor('a');
        component.onSearchQueryChanged('ab');
        const second = pendingRequestFor('ab');

        second.flush(['abc']);
        if (!first.cancelled) {
            first.flush(['apple', 'abc']);
        }

        expect(first.cancelled).toEqual(true);
        expect(resultValues()).toEqual(['abc']);
    });

    it('stays empty when the query is cleared while a request is in flight', () => {
        component.onSearchQueryChanged('a');
        const request = pendingRequestFor('a');
        component.onSearchQueryChanged('');

        if (!request.cancelled) {
            request.flush(['apple']);
        }

        expect(request.cancelled).toEqual(true);
        expect(component.autoCompleteResults).toEqual([]);
    });

    it('stays closed when an item is selected while a request is in flight', () => {
        component.onSearchQueryChanged('a');
        pendingRequestFor('a').flush(['apple', 'apricot']);
        component.onSearchQueryChanged('ap');
        const request = pendingRequestFor('ap');
        (component as any).onItemSelected({ label: 'apple', value: 'apple' });

        expect(request.cancelled).toEqual(true);
        expect(component.autoCompleteResults).toEqual([]);
    });

    it('clears the results on an HTTP error and still serves the next query', () => {
        component.onSearchQueryChanged('a');
        pendingRequestFor('a').flush(['apple']);
        component.onSearchQueryChanged('ab');
        pendingRequestFor('ab').flush('boom', { status: 500, statusText: 'Server Error' });

        expect(component.autoCompleteResults).toEqual([]);

        component.onSearchQueryChanged('abc');
        pendingRequestFor('abc').flush(['abc']);

        expect(resultValues()).toEqual(['abc']);
    });

    it('maps the response through the dataSchema', () => {
        component.dataSchema = { label: 'name', value: 'id' };
        component.onSearchQueryChanged('a');
        pendingRequestFor('a').flush([{ name: 'Apple', id: 'apple-1' }]);

        expect(component.autoCompleteResults).toEqual([{ label: 'Apple', value: 'apple-1' }]);
    });
});
