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
import { LoaderModule } from './loader.module';

@Component({ template: `
    <sdc-loader id="g" [global]="true" [active]="activeGlobal"></sdc-loader>
    <sdc-loader id="r" [active]="activeLocal" loadingText="Loading properties"><p>content</p></sdc-loader>` })
class HostComponent { activeGlobal = 0; activeLocal = 0; }

describe('LoaderComponent status', () => {
    let f: ComponentFixture<HostComponent>;
    const status = (id: string) => f.nativeElement.querySelector('#' + id + ' .sdc-loader-status') as HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [LoaderModule], declarations: [HostComponent] });
        f = TestBed.createComponent(HostComponent);
        f.detectChanges();
    });

    it('keeps an empty status region in the DOM while inactive', () => {
        ['g', 'r'].forEach(id => {
            expect(status(id).getAttribute('role')).toBe('status');
            expect(status(id).textContent.trim()).toBe('');
        });
    });

    it('says Loading while active and clears it afterwards', () => {
        f.componentInstance.activeGlobal = 1;
        f.componentInstance.activeLocal = 1;
        f.detectChanges();
        expect(status('g').textContent.trim()).toBe('Loading');
        expect(status('r').textContent.trim()).toBe('Loading properties');
        f.componentInstance.activeGlobal = 0;
        f.detectChanges();
        expect(status('g').textContent.trim()).toBe('');
    });
});
