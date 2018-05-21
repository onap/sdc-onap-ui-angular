import { Component } from "@angular/core";
import { Mode, Placement, Size } from "../../../src/angular/common/enums";
import { SvgIconComponent } from "../../../src/angular/svg-icon/svg-icon.component";
import { IDropDownOption, DropDownOptionType, DropDownTypes } from "../../../src/angular/form-elements/dropdown/dropdown-models";

const options1: IDropDownOption[] = [
    {
        label: 'First Option',
        value: 'First Option',
    },
    {
        label: 'Second Option',
        value: 'Second Option',
    },
    {
        label: 'Third Option',
        value: 'Third Option',
        type: DropDownOptionType.Simple
    }
];

@Component({
    selector: "svg-icons-table",
    template: `
        <div class="icon-showcase">
            <div>
                <svg-icon [name]="selectedIcon" [mode]="defaultIconSettings.mode" [size]="defaultIconSettings.size"></svg-icon>
                Selected icon: <b *ngIf="selectedIcon">{{selectedIcon}}</b><i *ngIf="!selectedIcon">None</i>
            </div>

            <div class="icon-options-wrapper">

                <div class="icon-options">
                    <div class="icon-options-dropdowns">
                        <sdc-dropdown label="Mode" [selectedOption]="{'value': mode, 'label': mode}" [options]="modeOptions" (changed)="mode = $event.value"></sdc-dropdown>
                        <sdc-dropdown label="Label Placement" [selectedOption]="{'value': labelPlacement, 'label': labelPlacement}" [options]="labelPlacementOptions" [selectedOption]="labelPlacement" (changed)="labelPlacement = $event.value"></sdc-dropdown>
                        <sdc-dropdown label="Size" [selectedOption]="{'value': size, 'label': size}" [options]="sizeOptions" [selectedOption]="size" (changed)="size = $event.value"></sdc-dropdown>
                    </div>
                    <div class="icon-options-checkboxes-wrapper">
                        <div class="icon-options-checkboxes">
                            <sdc-checkbox label="Clickable" [checked]="clickable" (checkedChange)="clickable = $event"></sdc-checkbox>
                            <sdc-checkbox label="Disabled" [checked]="disabled" (checkedChange)="disabled = $event"></sdc-checkbox>
                        </div>
                        <div class="icon-options-label">
                            <sdc-input label="Label" [(value)]="label"></sdc-input>
                        </div>
                        <svg-icon-label [name]="selectedIcon" [mode]="mode" [size]="size" [clickable]="clickable" [disabled]="disabled" [label]="label" [labelPlacement]="labelPlacement"></svg-icon-label>
                    </div>
                </div>

                <div class="icon-code">
                    <pre>
                        &lt;svg-icon-label
                            [name]="{{selectedIcon}}"
                            [mode]="{{mode}}"
                            [size]="{{size}}"
                            [clickable]="{{clickable}}"
                            [disabled]="{{disabled}}"
                            [label]="{{label}}"
                            [labelPlacement]="{{labelPlacement}}"&gt;
                        &lt;/svg-icon-label&gt;
                    </pre>
                </div>
            </div>

        </div>
        <div class="svg-icons-table">
            <div *ngFor="let iconName of iconsNames" class="svg-icon-cell" [ngClass]="{'selected': selectedIcon === iconName}" (click)="selectIcon(iconName)">
                <svg-icon-label [name]="iconName" [label]="iconName" labelPlacement="right"></svg-icon-label>
            </div>
        </div>
`,
    styles: [`
    .svg-icons-table {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: stretch;
        overflow-y: auto;
    }
    .svg-icons-table .svg-icon-cell {
        border: 1px solid #999;
        padding: 5px;
        margin: 5px;
        width: 250px;
        overflow: hidden;
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    .svg-icons-table .svg-icon-cell.selected {
        border-color: #1eb9f3;
        background-color: #1eb9f3;
    }
    .icon-showcase {
        margin: 20px 10px;
        padding: 10px;
        border: 1px solid #999;
        background: #eee;
    }
    .icon-options-wrapper {
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        margin-top: 10px;
    }

    .icon-options-checkboxes-wrapper {
        display: flex;
        flex-flow: row;
        margin-top: 10px;
    }

    .icon-options-checkboxes {
        margin-top: 27px;
        margin-right: 30px;
    }

    .icon-options-label {
        margin-right: 30px;
    }

    .icon-code pre {
        user-select: text;
    }

    sdc-dropdown {
        display: inline-block;
        min-width: 160px;
    }

    sdc-dropdown .sdc-dropdown {
    }
`]
})
export class SvgIconsTableComponent {
    public iconsNames: string[];
    public selectedIcon: string;

    public modeOptions;
    public sizeOptions;
    public labelPlacementOptions;

    private mode: Mode;
    private size: Size;
    private labelPlacement: Placement;
    private clickable: boolean;
    private disabled: boolean;
    private label: string;

    private defaultIconSettings: {mode: Mode, size: Size};

    constructor() {
        this.iconsNames = Object.keys(SvgIconComponent.Icons);
        this.mode = null;
        this.size = Size.medium;
        this.clickable = false;
        this.disabled = false;
        this.defaultIconSettings = { mode: Mode.info, size: Size.small };

        this.modeOptions = [{value: null, label: 'NONE'}].concat(Object.keys(Mode).map((modeKey) => ({
            value: modeKey,
            label: Mode[modeKey]
        })));

        this.sizeOptions = Object.keys(Size).map((sizeKey) => ({
            value: sizeKey,
            label: Size[sizeKey]
        }));

        this.labelPlacementOptions = Object.keys(Placement).map((placementKey) => ({
            value: placementKey,
            label: Placement[placementKey]
        }));

        this.setDefaults();
    }

    private setDefaults = (): void => {
        this.label = 'Some label';
        this.selectedIcon = "attachment";
        this.mode = Mode.primary;
        this.labelPlacement = Placement.right;
    }

    public selectIcon(iconName) {
        this.selectedIcon = iconName;
    }
}
