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

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { CommonDirectiveModule } from '../utils/common-directive.module';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
// Must be imported before ModalService: the two modules import each other, and loading the service
// first leaves the button's constructor parameter type undefined ("Can't resolve all parameters").
import { ModalCloseButtonComponent } from './modal-close-button.component';
import { ModalService } from './modal.service';

describe('ModalCloseButtonComponent accessibility', () => {
    let f: ComponentFixture<ModalCloseButtonComponent>;
    let closeModal: jest.Mock;
    const button = () => f.nativeElement.querySelector('.sdc-modal__close-button') as HTMLElement;
    const enter = () => button().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CommonModule, CommonDirectiveModule, SvgIconModule],
            declarations: [ModalCloseButtonComponent],
            providers: [{ provide: ModalService, useValue: {} }]
        });
        f = TestBed.createComponent(ModalCloseButtonComponent);
        closeModal = jest.fn();
        f.componentInstance.modalInstanceRef = { instance: { closeModal } } as any;
        f.detectChanges();
    });

    it('is a named keyboard button that closes the modal on Enter', () => {
        expect(button().getAttribute('role')).toBe('button');
        expect(button().getAttribute('tabindex')).toBe('0');
        expect(button().getAttribute('aria-label')).toBe('Close');
        enter();
        expect(closeModal).toHaveBeenCalledTimes(1);
        expect(closeModal).toHaveBeenCalledWith('close');
    });

    it('is inert and out of the tab order while disabled', () => {
        f.componentInstance.disabled = true;
        f.detectChanges();
        enter();
        expect(closeModal).not.toHaveBeenCalled();
        expect(button().getAttribute('tabindex')).toBe('-1');
        expect(button().getAttribute('aria-disabled')).toBe('true');
    });
});
