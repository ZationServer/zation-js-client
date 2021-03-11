/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

import {BackErrorFilter} from "./backErrorFilter";
import {ErrorGroup}      from "../definitions/errorGroup";
import {ErrorType}       from "../definitions/errorType";

export abstract class PresetBackErrorLib<T>
{
    protected abstract self(): T;
    protected abstract applyPreset(preset: BackErrorFilter): void;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any validation error.
     */
    validationError(): T {
        this.applyPreset({custom: false, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithType.
     * The BackError error can be thrown by value model validation: type.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * type
     */
    valueNotMatchesWithType(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithType', type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueLengthError.
     * The BackError error can be thrown by value model validation: minLength, maxLength and length.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     */
    valueLengthError(): T {
        this.applyPreset({custom: false, group: ErrorGroup.ValueLengthError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMinLength.
     * The BackError error can be thrown by value model validation: minLength: 4.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * minLength
     */
    valueNotMatchesWithMinLength(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithMinLength', group: ErrorGroup.ValueLengthError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMaxLength.
     * The BackError error can be thrown by value model validation: maxLength: 4.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * maxLength
     */
    valueNotMatchesWithMaxLength(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithMaxLength', group: ErrorGroup.ValueLengthError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithLength.
     * The BackError error can be thrown by value model validation: length: 4.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * length
     */
    valueNotMatchesWithLength(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithLength', group: ErrorGroup.ValueLengthError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithLettersFormat.
     * The BackError error can be thrown by value model validation: isLetters.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * format
     */
    valueNotMatchesWithLettersFormat(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithLettersFormat', type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithCharClass.
     * The BackError error can be thrown by value model validation: charClass: 'a-zA-Z0-9'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * regex
     */
    valueNotMatchesWithCharClass(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithCharClass', type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for dateError.
     * The BackError error can be thrown by value model validation: before and after.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     */
    dateError(): T {
        this.applyPreset({custom: false, group: ErrorGroup.DateError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for dateIsNotBefore.
     * The BackError error can be thrown by value model validation: before: Date.now().
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * shouldBefore
     */
    dateIsNotBefore(): T {
        this.applyPreset({custom: false, name: 'DateIsNotBefore', group: ErrorGroup.DateError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for dateIsNotAfter.
     * The BackError error can be thrown by value model validation: after: Date.now().
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * shouldAfter
     */
    dateIsNotAfter(): T {
        this.applyPreset({custom: false, name: 'DateIsNotAfter', group: ErrorGroup.DateError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithContains.
     * The BackError error can be thrown by value model validation: contains: 'hallo'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * shouldContain
     */
    valueNotMatchesWithContains(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithContains', type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithEquals.
     * The BackError error can be thrown by value model validation: equals: 'hallo'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * shouldEqual
     */
    valueNotMatchesWithEquals(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithEquals', type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for numberSizeError.
     * The BackError error can be thrown by value model validation: minValue and maxValue.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     */
    numberSizeError(): T {
        this.applyPreset({custom: false, group: ErrorGroup.NumberSizeError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMinValue.
     * The BackError error can be thrown by value model validation: minValue: 10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * minValue
     */
    valueNotMatchesWithMinValue(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithMinValue', group: ErrorGroup.NumberSizeError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMaxValue.
     * The BackError error can be thrown by value model validation: maxValue: 10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * maxValue
     */
    valueNotMatchesWithMaxValue(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithMaxValue', group: ErrorGroup.NumberSizeError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithRegex.
     * The BackError error can be thrown by value model validation: regex: '/^\/user\/.+/'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * regexName
     * regex
     */
    valueNotMatchesWithRegex(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithRegex', type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithStartsWith.
     * The BackError error can be thrown by value model validation: startsWith: 'user'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * shouldStartWith
     */
    valueNotMatchesWithStartsWith(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithStartsWith', type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithEndsWith.
     * The BackError error can be thrown by value model validation: endsWith: 'user'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * shouldEndWith
     */
    valueNotMatchesWithEndsWith(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithEndsWith', type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inError.
     * The BackError error can be thrown by value model validation: in and privateIn.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     */
    inError(): T {
        this.applyPreset({custom: false, group: ErrorGroup.InError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithIn.
     * The BackError error can be thrown by value model validation: in: ['red','blue'].
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * values (In-Values Array)
     */
    valueNotMatchesWithIn(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithIn', group: ErrorGroup.InError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithPrivateIn.
     * The BackError error can be thrown by value model validation: privateIn: ['red','blue'].
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     */
    valueNotMatchesWithPrivateIn(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithPrivateIn', group: ErrorGroup.InError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for byteSizeError.
     * The BackError error can be thrown by value model validation: minByteSize and maxByteSize.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     */
    byteSizeError(): T {
        this.applyPreset({custom: false, group: ErrorGroup.ByteSizeError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMinByteSize.
     * The BackError error can be thrown by value model validation: minByteSize: 100000.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * minByteSize
     */
    valueNotMatchesWithMinByteSize(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithMinByteSize', group: ErrorGroup.ByteSizeError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMaxByteSize.
     * The BackError error can be thrown by value model validation: maxByteSize: 100000.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * maxByteSize
     */
    valueNotMatchesWithMaxByteSize(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithMaxByteSize', group: ErrorGroup.ByteSizeError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for contentTypeError.
     * The BackError error can be thrown by value model validation: mimeType and subType.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     */
    contentTypeError(): T {
        this.applyPreset({custom: false, group: ErrorGroup.ContentTypeError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMimeType.
     * The BackError error can be thrown by value model validation: mimeType: 'image'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * mimeType
     */
    valueNotMatchesWithMimeType(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithMimeType', group: ErrorGroup.ContentTypeError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMimeSubType.
     * The BackError error can be thrown by value model validation: mimeSubType: 'jpg'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * mimeSubType
     */
    valueNotMatchesWithMimeSubType(): T {
        this.applyPreset({custom: false, name: 'ValueNotMatchesWithMimeSubType', group: ErrorGroup.ContentTypeError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for arrayLengthError.
     * The BackError error can be thrown by array model validation: length, minLength and maxLength.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     */
    arrayLengthError(): T {
        this.applyPreset({custom: false, group: ErrorGroup.ArrayLengthError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for arrayNotMatchesWithMaxLength.
     * The BackError error can be thrown by array model validation: maxLength: 10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * maxLength
     */
    arrayNotMatchesWithMaxLength(): T {
        this.applyPreset({custom: false, name: 'ArrayNotMatchesWithMaxLength', group: ErrorGroup.ArrayLengthError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for arrayNotMatchesWithMinLength.
     * The BackError error can be thrown by array model validation: minLength: 5.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * minLength
     */
    arrayNotMatchesWithMinLength(): T {
        this.applyPreset({custom: false, name: 'ArrayNotMatchesWithMinLength', group: ErrorGroup.ArrayLengthError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for arrayNotMatchesWithLength.
     * The BackError error can be thrown by array model validation: length: 10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * length
     */
    arrayNotMatchesWithLength(): T {
        this.applyPreset({custom: false, name: 'ArrayNotMatchesWithLength', group: ErrorGroup.ArrayLengthError, type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for noAnyOfMatch.
     * The BackError error can be thrown by anyOf model validation.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * canBeNull
     */
    noAnyOfMatch(): T {
        this.applyPreset({custom: false, name: 'NoAnyOfMatch', type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotAllowed.
     * The BackError error can be thrown by input validation.
     */
    inputNotAllowed(): T {
        this.applyPreset({custom: false, name: 'InputNotAllowed', type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputRequired.
     * The BackError error can be thrown by input validation.
     */
    inputRequired(): T {
        this.applyPreset({custom: false, name: 'InputRequired', type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueRequired.
     * The BackError error can be thrown by input validation.
     */
    valueRequired(): T {
        this.applyPreset({custom: false, name: 'ValueRequired', type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for invalidType.
     * The BackError error can be thrown by input validation.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * value
     * expected
     */
    invalidType(): T {
        this.applyPreset({custom: false, name: 'InvalidType', type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for missingObjectProperty.
     * The BackError error can be thrown by object model validation.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * object
     * propertyName
     */
    missingObjectProperty(): T {
        this.applyPreset({custom: false, name: 'MissingObjectProperty', type: ErrorType.ValidationError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownObjectProperty.
     * The BackError error can be thrown by object model validation.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * propertyName
     */
    unknownObjectProperty(): T {
        this.applyPreset({custom: false, name: 'UnknownObjectProperty', type: ErrorType.ValidationError});
        return this.self();
    }

    //MainBackErrors

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any input error.
     */
    inputError(): T {
        this.applyPreset({custom: false, type: ErrorType.InputError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownController.
     * The BackError error can be thrown when the controller is not found.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * identifier
     */
    unknownController(): T {
        this.applyPreset({custom: false, type: ErrorType.InputError, name: 'UnknownController'});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownReceiver.
     * The BackError error can be thrown when the receiver is not found.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * identifier
     */
    unknownReceiver(): T {
        this.applyPreset({custom: false, type: ErrorType.InputError, name: 'UnknownReceiver'});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for apiLevelIncompatible.
     * The BackError error can be thrown when the API level of the client is incompatible with the request.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * identifier
     * apiLevel
     */
    apiLevelIncompatible(): T {
        this.applyPreset({custom: false, type: ErrorType.InputError, name: 'ApiLevelIncompatible'});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for authControllerNotSet.
     * The BackError error can be thrown when no auth controller
     * is set and you had sent an auth request.
     */
    authControllerNotSet(): T {
        this.applyPreset({custom: false, type: ErrorType.InputError, name: 'AuthControllerNotSet'});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any access error.
     */
    accessError(): T {
        this.applyPreset({custom: false, type: ErrorType.AccessError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for accessDenied.
     * The BackError error can be thrown when access to a component is denied.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * reason
     */
    accessDenied(): T {
        this.applyPreset({custom: false, type: ErrorType.AccessError, name: 'AccessDenied'});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for invalidPanelAuthData.
     * The BackError error can be thrown if the panel authData is invalid.
     */
    invalidPanelAuthData(): T {
        this.applyPreset({custom: false, type: ErrorType.AccessError, name: 'InvalidPanelAuthData'});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for panelDeactivated.
     * The BackError error can be thrown if you try to authenticate to the panel,
     * but the panel is not activated.
     */
    panelDeactivated(): T {
        this.applyPreset({custom: false, type: ErrorType.InputError, name: 'PanelDeactivated'});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for invalidRequest.
     * The BackError error can be thrown if the request is invalid.
     */
    invalidRequest(): T {
        this.applyPreset({custom: false, type: ErrorType.InputError, name: 'InvalidRequest'});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for invalidValidationCheckStructure.
     * The BackError error can be thrown if the input validation check has a invalid structure.
     * Can only thrown by an validation check request.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * checkIndex
     */
    invalidValidationCheckStructure(): T {
        this.applyPreset({custom: false, type: ErrorType.InputError, name: 'InvalidValidationCheckStructure'});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for pathNotResolvable.
     * The BackError error can be thrown if the input path is not resolvable.
     * Can only be thrown by a validation request.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * path
     * checkIndex
     */
    pathNotResolvable(): T {
        this.applyPreset({custom: false, type: ErrorType.InputError, name: 'PathNotResolvable'});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for validationCheckLimitReached.
     * The BackError error can be thrown if the limit of validation checks is reached.
     * Can only thrown by an validation request.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * limit
     * checksCount
     */
    validationCheckLimitReached(): T {
        this.applyPreset({custom: false, type: ErrorType.InputError, name: 'ValidationCheckLimitReached'});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any code error.
     */
    codeError(): T {
        this.applyPreset({custom: false, type: ErrorType.CodeError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any system error.
     */
    systemError(): T {
        this.applyPreset({custom: false, type: ErrorType.SystemError});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownError.
     * The BackError error can be thrown by any unknown error on the server.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * info (The Exception only available when server runs in debug mode.)
     */
    unknownError(): T {
        this.applyPreset({custom: false, type: ErrorType.SystemError, name: 'UnknownError'});
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any token error.
     */
    tokenError(): T {
        this.applyPreset({custom: false, type: ErrorType.TokenError});
        return this.self();
    }
}