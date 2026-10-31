import { TestBed } from '@angular/core/testing';
import { MultilineEllipsisComponent } from './multiline-ellipsis.component';

describe('MultilineEllipsisComponent query timing', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({ declarations: [MultilineEllipsisComponent] });
    });

    it('measures the container during initialization when no line height is supplied', () => {
        const fixture = TestBed.createComponent(MultilineEllipsisComponent);
        fixture.componentInstance.lines = 2;
        const container = fixture.nativeElement.querySelector('.multiline-ellipsis-container') as HTMLElement;
        container.style.lineHeight = '24px';
        fixture.detectChanges();
        expect(fixture.componentInstance.stylesContainer['max-height']).toBe('calc(2 * 24px)');
        expect(fixture.componentInstance.stylesContent['max-height']).toBe('calc(3 * 24px)');
    });

    it('reports clipped projected content after the view has initialized', () => {
        const fixture = TestBed.createComponent(MultilineEllipsisComponent);
        fixture.componentInstance.lines = 2;
        fixture.componentInstance.lineHeight = '24px';
        const container = fixture.nativeElement.querySelector('.multiline-ellipsis-container');
        const content = fixture.nativeElement.querySelector('.multiline-ellipsis-content');
        Object.defineProperty(container, 'offsetHeight', { value: 48 });
        Object.defineProperty(content, 'offsetHeight', { value: 72 });
        const results: boolean[] = [];
        fixture.componentInstance.hasEllipsisChanged.subscribe(value => results.push(value));
        fixture.detectChanges();
        expect(results).toEqual([true]);
    });
});