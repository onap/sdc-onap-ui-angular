import { RegexPatterns } from '../../../common/enums';
import { CustomValidatorComponent } from './custom.validator.component';
import { LengthValidatorComponent } from './length.validator.component';
import { RegexValidatorComponent } from './regex.validator.component';
import { RequiredValidatorComponent } from './required.validator.component';

// The concrete validators share a base class and expose a single
// `validate(value)` method with no template dependency, so they are covered
// together by direct instantiation.
describe('Validators', () => {

    describe('RequiredValidatorComponent', () => {
        let validator: RequiredValidatorComponent;
        beforeEach(() => { validator = new RequiredValidatorComponent(); });

        it('starts valid and not disabled', () => {
            expect(validator.isValid).toEqual(true);
            expect(validator.disabled).toEqual(false);
        });

        it('is valid for a non-empty value', () => {
            expect(validator.validate('something')).toEqual(true);
            expect(validator.isValid).toEqual(true);
        });

        it('is invalid for an empty value', () => {
            expect(validator.validate('')).toEqual(false);
            expect(validator.isValid).toEqual(false);
        });
    });

    describe('RegexValidatorComponent', () => {
        let validator: RegexValidatorComponent;
        beforeEach(() => { validator = new RegexValidatorComponent(); });

        it('accepts a value matching the numbers pattern', () => {
            validator.pattern = new RegExp(RegexPatterns.numbers);
            expect(validator.validate('12345')).toEqual(true);
        });

        it('rejects a value not matching the numbers pattern', () => {
            validator.pattern = new RegExp(RegexPatterns.numbers);
            expect(validator.validate('12a45')).toEqual(false);
        });
    });

    describe('CustomValidatorComponent', () => {
        let validator: CustomValidatorComponent;
        beforeEach(() => { validator = new CustomValidatorComponent(); });

        it('delegates the verdict to the supplied callback', () => {
            validator.callback = (value: string) => value === 'ok';
            expect(validator.validate('ok')).toEqual(true);
            expect(validator.validate('nope')).toEqual(false);
        });
    });

    describe('LengthValidatorComponent', () => {
        let validator: LengthValidatorComponent;
        beforeEach(() => { validator = new LengthValidatorComponent(); });

        it('is valid with no bounds set', () => {
            expect(validator.validate('anything')).toEqual(true);
        });

        it('enforces a minimum length', () => {
            validator.minLength = 3;
            expect(validator.validate('ab')).toEqual(false);
            expect(validator.validate('abc')).toEqual(true);
        });

        it('enforces a maximum length', () => {
            validator.maxLength = 3;
            expect(validator.validate('abcd')).toEqual(false);
            expect(validator.validate('abc')).toEqual(true);
        });
    });
});
