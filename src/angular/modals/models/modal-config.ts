import { IButtonComponent } from "../../buttons/ibutton.interface";

export interface IModalConfig {
    size?: string; // xl|l|md|sm|xsm
    title?: string;
    titleIcon?: TitleIconDetails;
    message?: string;
    buttons?: IModalButtonComponent[];
    testId?: string;
    type?: ModalType;
}

export interface IModalButtonComponent extends IButtonComponent {
    id?: string;
    // Deliberately the loose `Function` rather than `() => void`: ModalButtonComponent declares
    // `@Input() callback: Function`, and `Function` is not assignable to `() => void`. Narrowing
    // here would stop callers from handing a real ModalButtonComponent instance to the
    // ModalService shortcut methods, which accept this interface.
    callback?: Function;
    closeModal?: boolean;
}

export interface TitleIconDetails {
    iconName?: string;
    iconMode?: string;
    iconSize?: string;
}

export enum ModalType {
    info = 'info',
    warning = 'warning',
    error = 'error',
    success = 'success',
    action = 'action',
    custom = 'custom'
}

export enum ModalSize {
    xlarge = "xl",
    large = "l",
    medium = "md",
    small = "sm",
    xsmall = "xsm"
}


