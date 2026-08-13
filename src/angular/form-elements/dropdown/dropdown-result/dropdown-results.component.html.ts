export const template = `
  <ul *ngIf="options" class="dropdown-results dropdown-results__animation-open" [attr.id]="listboxId" role="listbox" [ngClass]="{
              'sdc-dropdown__options-list--headless': headless
              }">
    <li class="sdc-dropdown__option" [attr.data-tests-id]="option.value"
        *ngFor="let option of options; let optionIndex = index"
        [attr.id]="optionId(optionIndex)"
        [attr.role]="isPresentational(option) ? 'presentation' : 'option'"
        [attr.aria-selected]="isPresentational(option) ? null : option === selectedOption"
        [attr.aria-disabled]="option.type === DropDownOptionType.Disable ? 'true' : null"
        [ngClass]="{
                              'selected': option == selectedOption,
                              'active': option === activeOption,
                              'sdc-dropdown__option--group':isGroupDesign,
                              'sdc-dropdown__option--header': option.type && option.type === DropDownOptionType.Header,
                              'sdc-dropdown__option--disabled': option.type && option.type === DropDownOptionType.Disable,
                              'sdc-dropdown__option--hr': option.type && option.type === DropDownOptionType.HorizontalLine
                          }"
        (click)="onItemClicked(option)">{{option.label || option.value}}
    </li>
  </ul>
`;
