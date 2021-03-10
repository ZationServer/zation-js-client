/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection TypeScriptPreferShortImport
import {BackErrorFilter} from "./backErrorFilter";
import {ErrorGroup}  from "../definitions/errorGroup";
import {ErrorType}   from "../definitions/errorType";

export abstract class PresetBackErrorLib<T>
{
    protected abstract self(): T;
    protected abstract _presetAdd(preset: BackErrorFilter): void;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any validation error.
     */
    validationError(): T {
        this._presetAdd(this._coreErrorBuild
        (ErrorType.ValidationError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithType.
     * The BackError error can be thrown by value model validation: type.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithType(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithType',path,value));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueLengthError.
     * The BackError error can be thrown by value model validation: minLength, maxLength and length.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueLengthError(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        (undefined,path,value,ErrorGroup.ValueLengthError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMinLength.
     * The BackError error can be thrown by value model validation: minLength: 4.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * minLength
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithMinLength(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithMinLength',path,value,ErrorGroup.ValueLengthError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMaxLength.
     * The BackError error can be thrown by value model validation: maxLength: 4.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * maxLength
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithMaxLength(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithMaxLength',path,value,ErrorGroup.ValueLengthError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithLength.
     * The BackError error can be thrown by value model validation: length: 4.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * length
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithLength(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithLength',path,value,ErrorGroup.ValueLengthError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithLettersFormat.
     * The BackError error can be thrown by value model validation: isLetters.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * format
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithLettersFormat(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithLettersFormat',path,value));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithCharClass.
     * The BackError error can be thrown by value model validation: charClass: 'a-zA-Z0-9'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * regex
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithCharClass(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithCharClass',path,value));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for dateError.
     * The BackError error can be thrown by value model validation: before and after.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    dateError(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        (undefined,path,value,ErrorGroup.DateError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for dateIsNotBefore.
     * The BackError error can be thrown by value model validation: before: Date.now().
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldBefore
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    dateIsNotBefore(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('DateIsNotBefore',path,value,ErrorGroup.DateError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for dateIsNotAfter.
     * The BackError error can be thrown by value model validation: after: Date.now().
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldAfter
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    dateIsNotAfter(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('DateIsNotAfter',path,value,ErrorGroup.DateError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithContains.
     * The BackError error can be thrown by value model validation: contains: 'hallo'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldContain
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithContains(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithContains',path,value));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithEquals.
     * The BackError error can be thrown by value model validation: equals: 'hallo'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldEqual
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithEquals(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithEquals',path,value));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for numberSizeError.
     * The BackError error can be thrown by value model validation: minValue and maxValue.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    numberSizeError(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        (undefined,path,value,ErrorGroup.NumberSizeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMinValue.
     * The BackError error can be thrown by value model validation: minValue: 10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * minValue
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithMinValue(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithMinValue',path,value,ErrorGroup.NumberSizeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMaxValue.
     * The BackError error can be thrown by value model validation: maxValue: 10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * maxValue
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithMaxValue(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithMaxValue',path,value,ErrorGroup.NumberSizeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithRegex.
     * The BackError error can be thrown by value model validation: regex: '/^\/user\/.+/'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     * @param regexName
     * Parameter can be used to check the regexName in the info.
     */
    valueNotMatchesWithRegex(path?: string,value?: any,regexName?: string): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithRegex',path,value,undefined,'regexName',regexName));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithStartsWith.
     * The BackError error can be thrown by value model validation: startsWith: 'user'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldStartWith
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithStartsWith(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithStartsWith',path,value));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithEndsWith.
     * The BackError error can be thrown by value model validation: endsWith: 'user'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldEndWith
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithEndsWith(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithEndsWith',path,value));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inError.
     * The BackError error can be thrown by value model validation: in and privateIn.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    inError(path?: string, value?: any): T {
        this._presetAdd(this._validationErrorBuild
        (undefined,path,value,ErrorGroup.InError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithIn.
     * The BackError error can be thrown by value model validation: in: ['red','blue'].
     * More info checks you need to do by yourself.
     * Possibilities are:
     * values (In-Values Array)
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithIn(path?: string, value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithIn',path,value,ErrorGroup.InError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithPrivateIn.
     * The BackError error can be thrown by value model validation: privateIn: ['red','blue'].
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithPrivateIn(path?: string, value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithPrivateIn',path,value,ErrorGroup.InError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for byteSizeError.
     * The BackError error can be thrown by value model validation: minByteSize and maxByteSize.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    byteSizeError(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        (undefined,path,value,ErrorGroup.ByteSizeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMinByteSize.
     * The BackError error can be thrown by value model validation: minByteSize: 100000.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * minByteSize
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithMinByteSize(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithMinByteSize',path,value,ErrorGroup.ByteSizeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMaxByteSize.
     * The BackError error can be thrown by value model validation: maxByteSize: 100000.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * maxByteSize
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithMaxByteSize(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithMaxByteSize',path,value,ErrorGroup.ByteSizeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for contentTypeError.
     * The BackError error can be thrown by value model validation: mimeType and subType.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    contentTypeError(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        (undefined,path,value,ErrorGroup.ContentTypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMimeType.
     * The BackError error can be thrown by value model validation: mimeType: 'image'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * mimeType
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithMimeType(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithMimeType',path,value,ErrorGroup.ContentTypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMimeSubType.
     * The BackError error can be thrown by value model validation: mimeSubType: 'jpg'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * mimeSubType
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithMimeSubType(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueNotMatchesWithMimeSubType',path,value,ErrorGroup.ContentTypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for arrayLengthError.
     * The BackError error can be thrown by array model validation: length, minLength and maxLength.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    arrayLengthError(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        (undefined,path,value,ErrorGroup.ArrayLengthError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for arrayNotMatchesWithMaxLength.
     * The BackError error can be thrown by array model validation: maxLength: 10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * maxLength
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    arrayNotMatchesWithMaxLength(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ArrayNotMatchesWithMaxLength',path,value,ErrorGroup.ArrayLengthError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for arrayNotMatchesWithMinLength.
     * The BackError error can be thrown by array model validation: minLength: 5.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * minLength
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    arrayNotMatchesWithMinLength(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ArrayNotMatchesWithMinLength',path,value,ErrorGroup.ArrayLengthError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for arrayNotMatchesWithLength.
     * The BackError error can be thrown by array model validation: length: 10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * length
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    arrayNotMatchesWithLength(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('ArrayNotMatchesWithLength',path,value,ErrorGroup.ArrayLengthError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for noAnyOfMatch.
     * The BackError error can be thrown by anyOf model validation.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * canBeNull
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    noAnyOfMatch(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('NoAnyOfMatch',path,value));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotAllowed.
     * The BackError error can be thrown by input validation.
     */
    inputNotAllowed(): T {
        this._presetAdd(this._validationErrorBuild
        ('InputNotAllowed'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputRequired.
     * The BackError error can be thrown by input validation.
     */
    inputRequired(): T {
        this._presetAdd(this._validationErrorBuild
        ('InputRequired'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueRequired.
     * The BackError error can be thrown by input validation.
     */
    valueRequired(): T {
        this._presetAdd(this._validationErrorBuild
        ('ValueRequired'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for invalidType.
     * The BackError error can be thrown by input validation.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * expected
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    invalidType(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('InvalidType',path,value));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for missingObjectProperty.
     * The BackError error can be thrown by object model validation.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * object
     * propertyName
     * @param path
     * Parameter can be used to check the path in the info.
     */
    missingObjectProperty(path?: string): T {
        this._presetAdd(this._validationErrorBuild
        ('MissingObjectProperty',path));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownObjectProperty.
     * The BackError error can be thrown by object model validation.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * propertyName
     * @param path
     * Parameter can be used to check the path in the info.
     */
    unknownObjectProperty(path?: string): T {
        this._presetAdd(this._validationErrorBuild
        ('UnknownObjectProperty',path));
        return this.self();
    }

    //MainBackErrors

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any input error.
     */
    inputError(): T {
        this._presetAdd(this._coreErrorBuild
        (ErrorType.InputError));
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
        this._presetAdd(this._coreErrorBuild
        (ErrorType.InputError,'UnknownController'));
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
        this._presetAdd(this._coreErrorBuild
        (ErrorType.InputError,'UnknownReceiver'));
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
        this._presetAdd(this._coreErrorBuild
        (ErrorType.InputError,'ApiLevelIncompatible'));
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
        this._presetAdd(this._coreErrorBuild
        (ErrorType.InputError,'AuthControllerNotSet'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any access error.
     */
    accessError(): T {
        this._presetAdd(this._coreErrorBuild
        (ErrorType.AccessError));
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
        this._presetAdd(this._coreErrorBuild
        (ErrorType.AccessError,'AccessDenied'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for invalidPanelAuthData.
     * The BackError error can be thrown if the panel authData is invalid.
     */
    invalidPanelAuthData(): T {
        this._presetAdd(this._coreErrorBuild
        (ErrorType.AccessError,'InvalidPanelAuthData'));
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
        this._presetAdd(this._coreErrorBuild
        (ErrorType.InputError,'PanelDeactivated'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for invalidRequest.
     * The BackError error can be thrown if the request is invalid.
     */
    invalidRequest(): T {
        this._presetAdd(this._coreErrorBuild
        (ErrorType.InputError,'InvalidRequest'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for JSONParseSyntaxError.
     * The BackError error can be thrown if the sent JSON string is invalid.
     */
    JSONParseSyntaxError(): T {
        this._presetAdd(this._coreErrorBuild
        (ErrorType.InputError,'JSONParseSyntaxError'));
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
        this._presetAdd(this._coreErrorBuild
        (ErrorType.InputError,'InvalidValidationCheckStructure'));
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
        this._presetAdd(this._coreErrorBuild
        (ErrorType.InputError,'PathNotResolvable'));
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
        this._presetAdd(this._coreErrorBuild
        (ErrorType.InputError,'ValidationCheckLimitReached'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any code error.
     */
    codeError(): T {
        this._presetAdd(this._coreErrorBuild
        (ErrorType.CodeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any system error.
     */
    systemError(): T {
        this._presetAdd(this._coreErrorBuild
        (ErrorType.SystemError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownError.
     * The BackError error can be thrown by any unknown error on the server.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * info (only server is running in debug mode)
     */
    unknownError(): T {
        this._presetAdd(this._coreErrorBuild
        (ErrorType.SystemError,'UnknownError'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any token error.
     */
    tokenError(): T {
        this._presetAdd(this._coreErrorBuild
        (ErrorType.TokenError));
        return this.self();
    }

    // noinspection JSMethodCanBeStatic
    private _validationErrorBuild(name?: string,path?: string,value?: any,group?: string,opInfoKey?: string, opInfoValue?: any): BackErrorFilter
    {
        const preset: BackErrorFilter = {};
        preset.custom = false;
        preset.type = ErrorType.ValidationError;
        if(name) {
            preset.name = name;
        }
        if(path || value)
        {
            let info = {};
            if(path){
                info['path'] = path;
            }
            if(value){
                info['value'] = value;
            }
            if(opInfoKey !== undefined && opInfoValue !== undefined) {
                info[opInfoKey] = opInfoValue;
            }
            preset.info = [info];
        }
        if(group) {
            preset.group = group;
        }
        return preset;
    }

    // noinspection JSMethodCanBeStatic
    private _coreErrorBuild(type?: string,name?: string,group?: string): BackErrorFilter
    {
        const preset: BackErrorFilter = {};
        preset.custom = false;
        if(name) {
            preset.name = name;
        }
        if(type) {
            preset.type = type;
        }
        if(group) {
            preset.group = group;
        }
        return preset;
    }
}