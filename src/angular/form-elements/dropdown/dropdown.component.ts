import { Component, EventEmitter, Input, Output, OnInit, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { IDropDownOption, DropDownOptionType, dropdownOptionId } from "./dropdown-models";
import { template } from './dropdown.component.html';
import {Size} from "../../common/enums";
import {BaseTextElementComponent} from "../text-elements/base-text-element.component";
import { InputComponent } from '../text-elements/input/input.component';

let nextListboxId = 0;

@Component({
    selector: 'sdc-dropdown',
    template: template
})
export class DropDownComponent extends BaseTextElementComponent implements OnInit, OnChanges {

    @ViewChild('dropdownInput') public dropdownInput: InputComponent;
    @Output('changed') changeEmitter:EventEmitter<IDropDownOption> = new EventEmitter<IDropDownOption>();
    @Input() options: IDropDownOption[];
    @Input() selectedOption: IDropDownOption;
    @Input() selectedOptionVal: string;
    @Input() size: Size;


    // Drop-down show/hide flag. default is false (closed)
    public show = false;

    // Configure unselectable option types
    private unselectableOptions = [
        DropDownOptionType.Disable,
        DropDownOptionType.Header,
        DropDownOptionType.HorizontalLine
    ];

    // Set or unset Group style on drop-down
    public isGroupDesign = false;
    public allOptions: IDropDownOption[];
    public filterValue: string;

    // Identifies the option list for aria-controls and aria-activedescendant. Unique per
    // instance, since a single form can hold several dropdowns.
    public listboxId: string = `sdc-dropdown-listbox-${nextListboxId++}`;

    // The option under the keyboard cursor while the list is open. Deliberately separate
    // from selectedOption: moving the cursor must not change the value.
    public activeOption: IDropDownOption;

    ngOnInit(): void {
        if (this.options) {
            this.allOptions = this.options;
            if (this.options.filter(option => option.type === DropDownOptionType.Header).length>0) {
                this.isGroupDesign = true;
            }
        }
        this.selectedOption = this.selectedOption || this.getSelectedOptionByVal(this.selectedOptionVal) || <IDropDownOption>{};
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(changes.selectedOptionVal && this.allOptions) {
            const newSelection = this.getSelectedOptionByVal(changes.selectedOptionVal.currentValue);
            this.selectOption(newSelection);
        }
    }

    public getValue(): any {
        return this.selectedOption && this.selectedOption.value;
    }

    private getSelectedOptionByVal = (value: string): IDropDownOption => {
        return this.allOptions.filter(item => item.value === value && this.isSelectable(item))[0];
    }

    public selectOption = (selectedOption: IDropDownOption): void => {
        if (this.isSelectable(selectedOption)) {
          this.selectedOption = selectedOption;
          this.show = false;
          this.changeEmitter.next(this.selectedOption);
        }
        this.valueChanged(this.getValue());
        this.dropdownInput.dirty = this.dirty;
        this.dropdownInput.valid = this.valid;
    }

    public toggleDropdown = (event?): void => {
        if (event) { event.stopPropagation(); }
        if (this.disabled) { return; }
        if (this.show) {
            this.closeListOptions();
        } else {
            this.openListOptions();
        }
    }

    private isSelectable = (dropDownOption: IDropDownOption): boolean => {
        // const option: IDropDownOption = this.options.filter(o => o.value === dropDownOption.value)[0];
        if (!dropDownOption) { return false; }
        return !this.unselectableOptions.filter(optionType => optionType === dropDownOption.type)[0];
    }

    public openListOptions = (): void => {
        if (this.disabled || this.show) { return; }
        this.show = true;
        // Match by identity in the list rather than asking isSelectable: with nothing chosen,
        // selectedOption is an empty placeholder object, which isSelectable happily accepts.
        const selectedIndex = this.allOptions ? this.allOptions.indexOf(this.selectedOption) : -1;
        this.activeOption = this.isSelectable(this.optionAt(selectedIndex))
            ? this.selectedOption
            : this.optionAt(this.nextSelectableIndex(0, 1));
    }

    public closeListOptions = () => {
      this.show = false;
      this.activeOption = undefined;
    }

    // Reported on the field rather than on the list, so focus never has to leave the
    // combobox for the user to walk the options.
    public get activeDescendantId(): string {
        const index = this.show && this.allOptions ? this.allOptions.indexOf(this.activeOption) : -1;
        return index === -1 ? null : dropdownOptionId(this.listboxId, index);
    }

    public onKeyDown = (event: KeyboardEvent): void => {
        if (this.disabled) { return; }
        switch (event.key) {
            case 'Escape':
            case 'Esc': // legacy key name, still emitted by IE and older Edge
                // Only consume Escape when it actually closed the list, or a surrounding
                // modal can no longer be dismissed with it.
                if (this.show) {
                    this.closeListOptions();
                    event.stopPropagation();
                }
                break;
            case 'Enter':
            case ' ':
            case 'Spacebar': // legacy key name
                // A bare Enter would submit the surrounding form and the space bar would
                // scroll the page.
                event.preventDefault();
                if (this.show) { this.selectActiveOption(); } else { this.openListOptions(); }
                break;
            case 'ArrowDown':
            case 'Down': // legacy key name
                event.preventDefault();
                if (this.show) { this.moveActiveOption(1); } else { this.openListOptions(); }
                break;
            case 'ArrowUp':
            case 'Up': // legacy key name
                event.preventDefault();
                if (this.show) { this.moveActiveOption(-1); } else { this.openListOptions(); }
                break;
            case 'Home':
                if (this.show) {
                    event.preventDefault();
                    this.setActiveOption(this.nextSelectableIndex(0, 1));
                }
                break;
            case 'End':
                if (this.show) {
                    event.preventDefault();
                    this.setActiveOption(this.nextSelectableIndex(this.allOptions.length - 1, -1));
                }
                break;
            case 'Tab':
                // No preventDefault: focus must stay free to leave the control.
                this.closeListOptions();
                break;
        }
    }

    private selectActiveOption = (): void => {
        if (this.activeOption) {
            this.selectOption(this.activeOption);
        } else {
            this.closeListOptions();
        }
    }

    private moveActiveOption = (step: number): void => {
        const from = this.allOptions.indexOf(this.activeOption) + step;
        this.setActiveOption(this.nextSelectableIndex(from, step));
    }

    private setActiveOption = (index: number): void => {
        const option = this.optionAt(index);
        if (option) { this.activeOption = option; }
    }

    private nextSelectableIndex = (from: number, step: number): number => {
        if (!this.allOptions) { return -1; }
        for (let index = from; index >= 0 && index < this.allOptions.length; index += step) {
            if (this.isSelectable(this.allOptions[index])) { return index; }
        }
        return -1;
    }

    private optionAt = (index: number): IDropDownOption => {
        return index === -1 ? undefined : this.allOptions[index];
    }

}
