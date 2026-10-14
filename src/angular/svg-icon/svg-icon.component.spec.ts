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
import { SvgIconModule } from './svg-icon.module';

@Component({ template: `
    <svg-icon id="c" name="close" [clickable]="true" ariaLabel="Close" (click)="n = n + 1"></svg-icon>
    <svg-icon id="d" name="close" [clickable]="true" [disabled]="true" (click)="n = n + 1"></svg-icon>
    <svg-icon id="p" name="close"></svg-icon>
    <svg-icon-label id="l" name="close" clickable="false" label="Update Failed"></svg-icon-label>
    <svg-icon-label id="m" name="alert-triangle" label="Required"></svg-icon-label>
    <svg-icon-label id="a" name="plus" [clickable]="true" label="Add Artifact" (click)="added = added + 1"></svg-icon-label>
    <svg-icon-label id="s" name="plus" clickable="true" label="Add" (click)="added = added + 1"></svg-icon-label>` })
class HostComponent { n = 0; added = 0; }

describe('SvgIconComponent accessibility', () => {
    let f: ComponentFixture<HostComponent>;
    const el = (id: string) => f.nativeElement.querySelector('#' + id) as HTMLElement;
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [SvgIconModule], declarations: [HostComponent] });
        f = TestBed.createComponent(HostComponent);
        f.detectChanges();
    });

    it('a clickable icon is a named, focusable button that Enter activates', () => {
        expect(el('c').getAttribute('role')).toBe('button');
        expect(el('c').getAttribute('tabindex')).toBe('0');
        expect(el('c').getAttribute('aria-label')).toBe('Close');
        el('c').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        expect(f.componentInstance.n).toBe(1);
    });

    it('a clickable icon ignores auto-repeated keydowns', () => {
        el('c').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, repeat: true }));
        expect(f.componentInstance.n).toBe(0);
    });

    it('a disabled clickable icon is out of the tab order and inert', () => {
        expect(el('d').getAttribute('tabindex')).toBe('-1');
        expect(el('d').getAttribute('aria-disabled')).toBe('true');
        el('d').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        expect(f.componentInstance.n).toBe(0);
    });

    it('a presentational icon is hidden from assistive tech and not focusable', () => {
        expect(el('p').getAttribute('aria-hidden')).toBe('true');
        expect(el('p').hasAttribute('tabindex')).toBe(false);
        expect(el('p').hasAttribute('role')).toBe(false);
    });

    it('a label icon keeps its text exposed and does not become a tab stop', () => {
        expect(el('m').hasAttribute('aria-hidden')).toBe(false);
        expect(el('l').hasAttribute('aria-hidden')).toBe(false);
        expect(el('l').hasAttribute('tabindex')).toBe(false);
        expect(el('l').hasAttribute('role')).toBe(false);
    });

    it('a clickable label is a keyboard button named by its text, with no nested tab stop', () => {
        ['a', 's'].forEach(id => {
            expect(el(id).getAttribute('role')).toBe('button');
            expect(el(id).getAttribute('tabindex')).toBe('0');
            expect(el(id).hasAttribute('aria-label')).toBe(false);
            expect(el(id).hasAttribute('aria-hidden')).toBe(false);
            const inner = el(id).querySelector('svg-icon');
            expect(inner.getAttribute('aria-hidden')).toBe('true');
            expect(inner.hasAttribute('tabindex')).toBe(false);
            expect(el(id).textContent).toContain(id === 'a' ? 'Add Artifact' : 'Add');
        });
        el('a').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        expect(f.componentInstance.added).toBe(1);
    });
});

@Component({ template: `
    <span id="wrap" (click)="outer = outer + 1">
        <svg-icon id="x" name="trash-o" [clickable]="true" [disabled]="off" ariaLabel="Delete" (click)="n = n + 1"></svg-icon>
    </span>
    <svg-icon-label id="y" name="plus" [clickable]="true" [disabled]="true" label="Add" (click)="n = n + 1"></svg-icon-label>` })
class DisabledHostComponent { n = 0; outer = 0; off = true; }

describe('SvgIconComponent disabled mouse clicks', () => {
    let f: ComponentFixture<DisabledHostComponent>;
    // Click the rendered icon, which is what a mouse hits: jsdom 11 runs listeners at the target in
    // registration order, so a click dispatched on the host itself reaches the consumer handler first.
    const icon = (id: string) => f.nativeElement.querySelector('#' + id + ' .svg-icon') as HTMLElement;
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [SvgIconModule], declarations: [DisabledHostComponent] });
        f = TestBed.createComponent(DisabledHostComponent);
        f.detectChanges();
    });

    it('a disabled clickable icon swallows the click before the consumer and its ancestors see it', () => {
        icon('x').click();
        expect(f.componentInstance.n).toBe(0);
        expect(f.componentInstance.outer).toBe(0);
    });

    it('a disabled clickable label swallows the click', () => {
        icon('y').click();
        expect(f.componentInstance.n).toBe(0);
    });

    it('a re-enabled icon passes clicks through again', () => {
        f.componentInstance.off = false;
        f.detectChanges();
        icon('x').click();
        expect(f.componentInstance.n).toBe(1);
        expect(f.componentInstance.outer).toBe(1);
    });
});
