export enum DropDownTypes {
    Regular = "Regular",
    Auto = "Auto"
}

export enum DropDownOptionType {
    Simple = "Simple", // default
    Header = "Header",
    Disable = "Disable",
    HorizontalLine = "HorizontalLine"
}

export interface IDropDownOption {
    value: any;
    label: string;
    type?: DropDownOptionType;
}

// Shared by sdc-dropdown, which points aria-activedescendant at the active option, and by
// dropdown-results, which puts the id on the option itself. Both must agree.
export const dropdownOptionId = (listboxId: string, optionIndex: number): string => {
    return `${listboxId}-option-${optionIndex}`;
};
