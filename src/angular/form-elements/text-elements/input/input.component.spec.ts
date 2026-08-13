import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputComponent } from './input.component';
import { InputModule } from './input.module';

describe('Input component', () => {
    let fixture: ComponentFixture<InputComponent>;
    let component: InputComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                InputModule
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(InputComponent);
        component = fixture.componentInstance;
    }));

    const input = (): HTMLInputElement =>
        fixture.debugElement.query(By.css('input.sdc-input__input')).nativeElement;

    it('component should be created', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('is neither disabled nor read-only by default', () => {
        fixture.detectChanges();
        expect(input().hasAttribute('disabled')).toEqual(false);
        expect(input().hasAttribute('readonly')).toEqual(false);
    });

    // Plain consumers (sdc-file-upload, catalog-ui forms) rely on a view-mode field being left
    // out of the tab order and out of submitted form data.
    it('renders plain view mode as disabled', () => {
        component.isViewMode = true;
        fixture.detectChanges();
        expect(input().hasAttribute('disabled')).toEqual(true);
        expect(input().hasAttribute('readonly')).toEqual(false);
    });

    // Wrappers such as sdc-dropdown and sdc-combo-box put their own (click) handler on this
    // component's host and never see the event if the input is disabled.
    it('renders view mode as read-only when the wrapper asks for a focusable field', () => {
        component.isViewMode = true;
        component.focusableInViewMode = true;
        fixture.detectChanges();
        expect(input().hasAttribute('disabled')).toEqual(false);
        expect(input().readOnly).toEqual(true);
    });

    it('renders a disabled input as disabled even in focusable view mode', () => {
        component.disabled = true;
        component.isViewMode = true;
        component.focusableInViewMode = true;
        fixture.detectChanges();
        expect(input().hasAttribute('disabled')).toEqual(true);
        expect(input().hasAttribute('readonly')).toEqual(false);
    });

    it('keeps the isViewMode class so view-mode styling is unaffected', () => {
        component.isViewMode = true;
        fixture.detectChanges();
        expect(input().classList.contains('isViewMode')).toEqual(true);
    });

    it('dispatches click events from a focusable view-mode input', () => {
        component.isViewMode = true;
        component.focusableInViewMode = true;
        fixture.detectChanges();
        let clicks = 0;
        fixture.debugElement.nativeElement.addEventListener('click', () => clicks++);
        input().click();
        expect(clicks).toEqual(1);
    });

    it('swallows click events from a disabled input', () => {
        component.disabled = true;
        fixture.detectChanges();
        let clicks = 0;
        fixture.debugElement.nativeElement.addEventListener('click', () => clicks++);
        input().click();
        expect(clicks).toEqual(0);
    });

    it('associates the label with the input', () => {
        component.label = 'Artifact Type';
        fixture.detectChanges();
        const label: HTMLLabelElement = fixture.debugElement.query(By.css('label.sdc-input__label')).nativeElement;
        expect(label.id).toBeTruthy();
        expect(input().getAttribute('aria-labelledby')).toEqual(label.id);
    });

    // A <label for> would make the browser follow every label click with a second click on the
    // input, so a host handler that toggles sees two clicks and ends up where it started.
    it('reaches a host click handler once per click on the label', () => {
        component.label = 'Artifact Type';
        component.isViewMode = true;
        component.focusableInViewMode = true;
        fixture.detectChanges();
        let clicks = 0;
        fixture.debugElement.nativeElement.addEventListener('click', () => clicks++);
        fixture.debugElement.query(By.css('label.sdc-input__label')).nativeElement.click();
        expect(clicks).toEqual(1);
    });

    it('omits aria-labelledby when there is no label', () => {
        fixture.detectChanges();
        expect(input().hasAttribute('aria-labelledby')).toEqual(false);
    });

    it('gives every instance its own input id', () => {
        fixture.detectChanges();
        const other = TestBed.createComponent(InputComponent);
        other.detectChanges();
        const otherId = other.debugElement.query(By.css('input.sdc-input__input')).nativeElement.id;
        expect(otherId).not.toEqual(input().id);
    });

    it('omits aria attributes that the consumer did not supply', () => {
        fixture.detectChanges();
        ['role', 'aria-haspopup', 'aria-expanded', 'aria-controls', 'aria-activedescendant']
            .forEach(attribute => expect(input().hasAttribute(attribute)).toEqual(false));
    });

    it('renders the aria attributes a wrapper supplies', () => {
        component.ariaRole = 'combobox';
        component.ariaHasPopup = 'listbox';
        component.ariaExpanded = true;
        component.ariaControls = 'some-listbox-id';
        component.ariaActiveDescendant = 'some-option-id';
        fixture.detectChanges();
        expect(input().getAttribute('role')).toEqual('combobox');
        expect(input().getAttribute('aria-haspopup')).toEqual('listbox');
        expect(input().getAttribute('aria-expanded')).toEqual('true');
        expect(input().getAttribute('aria-controls')).toEqual('some-listbox-id');
        expect(input().getAttribute('aria-activedescendant')).toEqual('some-option-id');
    });

    // aria-expanded="false" is meaningful state, so it must be rendered rather than dropped.
    it('renders aria-expanded false instead of omitting it', () => {
        component.ariaRole = 'combobox';
        component.ariaExpanded = false;
        fixture.detectChanges();
        expect(input().getAttribute('aria-expanded')).toEqual('false');
    });
});
