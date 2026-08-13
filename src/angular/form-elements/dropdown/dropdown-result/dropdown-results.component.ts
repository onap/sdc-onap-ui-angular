import {template} from "./dropdown-results.component.html";
import {Component, EventEmitter, Input, Output} from "@angular/core";
import {DropDownOptionType, IDropDownOption, dropdownOptionId} from "../dropdown-models";

@Component({
  selector: 'dropdown-results',
  template: template
})
export class DropdownResultsComponent  {


  public DropDownOptionType = DropDownOptionType;

  @Input() selectedOption: IDropDownOption;
  @Input() isGroupDesign = false;
  @Input() options: IDropDownOption[];

  // The option under the keyboard cursor, owned by sdc-dropdown: this list only renders it.
  @Input() activeOption: IDropDownOption;
  @Input() listboxId: string;

  @Output() public onItemSelected: EventEmitter<IDropDownOption> = new EventEmitter<IDropDownOption>();

  public onItemClicked = (selectedOption: IDropDownOption) => {
    this.onItemSelected.emit(selectedOption)
  }

  public optionId = (optionIndex: number): string => {
    return dropdownOptionId(this.listboxId, optionIndex);
  }

  // Headers and separators are decorative: exposing them as options would misreport the
  // list size to assistive technology.
  public isPresentational = (option: IDropDownOption): boolean => {
    return option.type === DropDownOptionType.Header || option.type === DropDownOptionType.HorizontalLine;
  }
}
