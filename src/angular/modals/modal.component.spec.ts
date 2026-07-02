import { async, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ModalService } from './modal.service';
import { ModalComponent } from './modal.component';
import { CreateDynamicComponentService } from "../utils/create-dynamic-component.service";

// Minimal ComponentRef-like stand-in returned by the mocked dynamic-component
// service. The real CreateDynamicComponentService walks ApplicationRef to find
// a bootstrapped root view container, which does not exist under TestBed, so it
// is replaced here.
const testModalInstance = {
    instance: {
        closeAnimationComplete: {
            subscribe: () => {
                return true;
            },
        },
        modalVisible: true
    }
};

class CreateDynamicComponentServiceMock {
    public createComponentDynamically = (componentType, options?) => testModalInstance;
    public insertComponentDynamically = (componentType, options?, vcRef?) => testModalInstance;
}

describe("Modal unit-tests", () => {
    let testService: ModalService;
    const testInputModal = {
        size: 'xl', // 'xl|l|md|sm|xsm'
        title: 'Test_Title',
        message: 'Test_Message',
        modalVisible: true
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                ModalService,
                { provide: CreateDynamicComponentService, useClass: CreateDynamicComponentServiceMock }
            ],
            declarations: [],
            schemas: [NO_ERRORS_SCHEMA]
        });
        testService = TestBed.get(ModalService);
    }));

    it('Modal should be open test', () => {
        const modalInstance = testService.openModal(testInputModal);
        expect(modalInstance).toBeTruthy();
    });

    it('Modal warning window test', () => {
        const modalInstance = testService.openWarningModal('Worning title', 'testAlert', 'testMessage');
        expect(modalInstance).toBeTruthy();
    });

    it('Modal info window test', () => {
        const modalInstance = testService.openErrorModal('Error title', 'testMessage', 'sampleTestId');
        expect(modalInstance).toBeTruthy();
    });

    it('opens an info modal', () => {
        const modalInstance = testService.openInfoModal('Info title', 'testMessage', 'infoTestId');
        expect(modalInstance).toBeTruthy();
    });

    it('opens a success modal', () => {
        const modalInstance = testService.openSuccessModal('Success title', 'testMessage', 'successTestId');
        expect(modalInstance).toBeTruthy();
    });

    it('opens an error-detail modal (custom inner component)', () => {
        const modalInstance = testService.openErrorDetailModal('Error title', 'testMessage', 'errorDetailTestId', { code: 500 });
        expect(modalInstance).toBeTruthy();
    });

    it('opens a custom modal and inserts the inner component', () => {
        const modalInstance = testService.openCustomModal(testInputModal, ModalComponent, { foo: 'bar' });
        expect(modalInstance).toBeTruthy();
    });
});
