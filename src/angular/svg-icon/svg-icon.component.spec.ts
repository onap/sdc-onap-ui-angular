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
    <svg-icon id="c" name="close" [clickable]="true" ariaLabel="Close" testId="close-icon" (click)="n = n + 1"></svg-icon>
    <svg-icon id="d" name="close" [clickable]="true" [disabled]="true" (click)="n = n + 1"></svg-icon>
    <svg-icon id="p" name="close"></svg-icon>
    <svg-icon id="f" name="close" clickable="false"></svg-icon>
    <svg-icon-label id="l" name="close" clickable="false" label="Update Failed"></svg-icon-label>
    <svg-icon-label id="m" name="alert-triangle" label="Required"></svg-icon-label>
    <svg-icon-label id="a" name="plus" [clickable]="true" label="Add Artifact" (click)="added = added + 1"></svg-icon-label>
    <svg-icon-label id="s" name="plus" clickable="true" label="Add" (click)="added = added + 1"></svg-icon-label>` })
class HostComponent { n = 0; added = 0; }

describe('SvgIconComponent accessibility', () => {
    let f: ComponentFixture<HostComponent>;
    const el = (id: string) => f.nativeElement.querySelector('#' + id) as HTMLElement;
    const inner = (id: string) => el(id).firstElementChild as HTMLButtonElement;
    const hostAttrs = ['role', 'tabindex', 'aria-disabled', 'aria-label'];
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [SvgIconModule], declarations: [HostComponent] });
        f = TestBed.createComponent(HostComponent);
        f.detectChanges();
    });

    it('a clickable icon renders a named native button and leaves the host plain', () => {
        expect(inner('c').tagName).toBe('BUTTON');
        expect(inner('c').getAttribute('type')).toBe('button');
        expect(inner('c').getAttribute('class')).toBe('svg-icon-wrapper');
        expect(inner('c').getAttribute('aria-label')).toBe('Close');
        expect(inner('c').getAttribute('data-tests-id')).toBe('close-icon');
        expect(inner('c').disabled).toBe(false);
        const icon = inner('c').firstElementChild;
        expect(icon.tagName).toBe('SPAN');
        expect(icon.classList.contains('svg-icon')).toBe(true);
        expect(icon.classList.contains('clickable')).toBe(true);
        expect(icon.hasAttribute('data-tests-id')).toBe(false);
        expect(icon.querySelector('svg')).not.toBeNull();
        hostAttrs.forEach(a => expect(el('c').hasAttribute(a)).toBe(false));
        expect(el('c').hasAttribute('aria-hidden')).toBe(false);
    });

    it("a click on the icon's button reaches the consumer's (click) on the host once", () => {
        inner('c').click();
        expect(f.componentInstance.n).toBe(1);
    });

    it('a disabled clickable icon is a disabled native button', () => {
        expect(inner('d').tagName).toBe('BUTTON');
        expect(inner('d').disabled).toBe(true);
        expect(inner('d').firstElementChild.hasAttribute('disabled')).toBe(false);
        expect(inner('d').firstElementChild.classList.contains('clickable')).toBe(false);
        expect(inner('d').hasAttribute('aria-label')).toBe(false);
        hostAttrs.forEach(a => expect(el('d').hasAttribute(a)).toBe(false));
    });

    it('a presentational icon is a span, hidden from assistive tech and not focusable', () => {
        expect(el('p').getAttribute('aria-hidden')).toBe('true');
        expect(inner('p').tagName).toBe('SPAN');
        expect(el('p').querySelector('button, [tabindex], [role]')).toBeNull();
        expect(el('p').hasAttribute('tabindex')).toBe(false);
        expect(el('p').hasAttribute('role')).toBe(false);
    });

    it('clickable="false" renders a plain hidden icon, not a button', () => {
        expect(el('f').querySelector('button')).toBeNull();
        expect(inner('f').tagName).toBe('SPAN');
        expect(el('f').getAttribute('aria-hidden')).toBe('true');
    });

    it('a clickable icon or label button contains no div', () => {
        ['c', 'd', 'a', 's'].forEach(id => expect(inner(id).querySelector('div')).toBeNull());
    });

    it('a label icon keeps its text exposed and does not become a button', () => {
        expect(el('m').hasAttribute('aria-hidden')).toBe(false);
        expect(el('l').hasAttribute('aria-hidden')).toBe(false);
        expect(el('l').querySelector('button')).toBeNull();
        expect(inner('l').tagName).toBe('SPAN');
        expect(el('l').hasAttribute('tabindex')).toBe(false);
        expect(el('l').hasAttribute('role')).toBe(false);
    });

    it('a clickable label is a native button named by its text, with no nested tab stop', () => {
        ['a', 's'].forEach(id => {
            const button = inner(id);
            expect(button.tagName).toBe('BUTTON');
            expect(button.getAttribute('type')).toBe('button');
            expect(button.classList.contains('svg-icon-wrapper')).toBe(true);
            expect(button.hasAttribute('aria-label')).toBe(false);
            hostAttrs.forEach(a => expect(el(id).hasAttribute(a)).toBe(false));
            expect(el(id).hasAttribute('aria-hidden')).toBe(false);
            const icon = button.querySelector('svg-icon');
            expect(icon.getAttribute('aria-hidden')).toBe('true');
            expect(icon.querySelector('button')).toBeNull();
            expect(button.querySelector('.svg-icon-label').textContent).toBe(id === 'a' ? 'Add Artifact' : 'Add');
        });
        inner('a').click();
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
    const button = (id: string) => f.nativeElement.querySelector('#' + id + ' button') as HTMLButtonElement;
    beforeEach(() => {
        TestBed.configureTestingModule({ imports: [SvgIconModule], declarations: [DisabledHostComponent] });
        f = TestBed.createComponent(DisabledHostComponent);
        f.detectChanges();
    });

    it('a click on a disabled clickable icon reaches neither the consumer nor its ancestors', () => {
        button('x').click();
        expect(f.componentInstance.n).toBe(0);
        expect(f.componentInstance.outer).toBe(0);
    });

    it('a click on a disabled clickable label reaches no consumer', () => {
        expect(button('y').disabled).toBe(true);
        button('y').click();
        expect(f.componentInstance.n).toBe(0);
    });

    it('a re-enabled icon passes clicks through again', () => {
        f.componentInstance.off = false;
        f.detectChanges();
        expect(button('x').disabled).toBe(false);
        button('x').click();
        expect(f.componentInstance.n).toBe(1);
        expect(f.componentInstance.outer).toBe(1);
    });
});
