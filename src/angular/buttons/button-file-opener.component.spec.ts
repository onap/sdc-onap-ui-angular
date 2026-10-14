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
import { TestBed } from '@angular/core/testing';
import { ButtonsModule } from './buttons.module';

@Component({ template: `<sdc-button-file-opener text="Import VFC"></sdc-button-file-opener>` })
class HostComponent {}

describe('ButtonFileOpenerComponent accessibility', () => {
    it('names the transparent file input after the button text', () => {
        TestBed.configureTestingModule({ imports: [ButtonsModule], declarations: [HostComponent] });
        const f = TestBed.createComponent(HostComponent);
        f.detectChanges();
        const input = f.nativeElement.querySelector('input.file-opener-input');
        expect(input.getAttribute('aria-label')).toBe('Import VFC');
    });
});
