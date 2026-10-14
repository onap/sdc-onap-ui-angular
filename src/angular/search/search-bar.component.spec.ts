/*-
 * ============LICENSE_START=======================================================
 * onap-ui-angular
 * ================================================================================
 * Copyright (C) 2026 Deutsche Telekom AG.
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=========================================================
 */

import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SearchModule } from './search.module';

@Component({ template: `
    <sdc-search-bar id="plain" (onSearchClicked)="searches = searches + 1"></sdc-search-bar>
    <sdc-search-bar id="ph" placeHolder="Type to search"></sdc-search-bar>
    <sdc-search-bar id="named" ariaLabel="Search the canvas" searchButtonAriaLabel="Run search"></sdc-search-bar>` })
class HostComponent { searches = 0; }

describe('SearchBarComponent accessibility', () => {
    let f: ComponentFixture<HostComponent>;
    const input = (id: string) => f.nativeElement.querySelector('#' + id + ' input') as HTMLInputElement;
    const button = (id: string) => f.nativeElement.querySelector('#' + id + ' svg-icon button') as HTMLButtonElement;
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [SearchModule], declarations: [HostComponent] });
        f = TestBed.createComponent(HostComponent);
        f.detectChanges();
    });

    it('names the input from ariaLabel, then the placeholder, then "Search"', () => {
        expect(input('named').getAttribute('aria-label')).toBe('Search the canvas');
        expect(input('ph').getAttribute('aria-label')).toBe('Type to search');
        expect(input('plain').getAttribute('aria-label')).toBe('Search');
    });

    it('the search icon is a named native button', () => {
        expect(button('plain').tagName).toBe('BUTTON');
        expect(button('plain').getAttribute('type')).toBe('button');
        expect(button('plain').getAttribute('aria-label')).toBe('Search');
        expect(button('named').getAttribute('aria-label')).toBe('Run search');
    });

    it('a click on the search button emits onSearchClicked once', () => {
        button('plain').click();
        expect(f.componentInstance.searches).toBe(1);
    });
});
