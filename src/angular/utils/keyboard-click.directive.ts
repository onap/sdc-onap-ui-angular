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

import { Directive, ElementRef, HostListener, Input, OnChanges, OnInit, Renderer2 } from '@angular/core';

/**
 * Keyboard operation for elements that only have a (click) binding. Adds attributes and never
 * changes the tag or class, because consumer Selenium suites match on both.
 */
@Directive({ selector: '[sdcKeyboardClick]' })
export class SdcKeyboardClickDirective implements OnInit, OnChanges {
    @Input() public sdcKeyboardClick: string;
    @Input() public sdcKeyboardClickDisabled: boolean = false;

    private initialized: boolean = false;
    private ownTabindex: string;

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    public ngOnInit(): void {
        const host: HTMLElement = this.el.nativeElement;
        if (!host.hasAttribute('role')) {
            this.renderer.setAttribute(host, 'role', this.sdcKeyboardClick === 'link' ? 'link' : 'button');
        }
        this.ownTabindex = host.getAttribute('tabindex');
        this.initialized = true;
        this.applyDisabled();
    }

    public ngOnChanges(): void {
        if (this.initialized) {
            this.applyDisabled();
        }
    }

    @HostListener('keydown', ['$event'])
    public onKeydown(event: KeyboardEvent): void {
        const host: HTMLElement = this.el.nativeElement;
        if (event.target !== host || this.sdcKeyboardClickDisabled || event.repeat) {
            return;
        }
        const isSpace = event.key === ' ' || event.key === 'Spacebar';
        if (event.key === 'Enter' || (isSpace && host.getAttribute('role') !== 'link')) {
            event.preventDefault();
            host.click();
        }
    }

    private applyDisabled(): void {
        const host: HTMLElement = this.el.nativeElement;
        if (this.sdcKeyboardClickDisabled) {
            this.renderer.setAttribute(host, 'aria-disabled', 'true');
            this.renderer.setAttribute(host, 'tabindex', '-1');
        } else {
            this.renderer.removeAttribute(host, 'aria-disabled');
            this.renderer.setAttribute(host, 'tabindex', this.ownTabindex !== null ? this.ownTabindex : '0');
        }
    }
}
