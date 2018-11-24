/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {AbstractErrorFilterBuilder} from "./abstractErrorFilterBuilder";
import {ErrorFilter} from "../../filter/errorFilter";
import {ErrorGroup}  from "../../constants/errorGroup";
import {ErrorType}   from "../../constants/errorType";

export class PresetErrorFilter<T>
{
    private readonly errorFilterBuilder : AbstractErrorFilterBuilder<T>;
    private  readonly pushPreset : boolean;

    constructor(errorFilterBuilder : AbstractErrorFilterBuilder<T>,pushPreset : boolean)
    {
        this.errorFilterBuilder  = errorFilterBuilder ;
        this.pushPreset = pushPreset;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any validation error.
     */
    validationError() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.VALIDATION_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputTypeError.
     * The task error can be thrown by input validation type.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputTypeError(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeObject.
     * The task error can be thrown by input validation type:'object'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeObject(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeObject',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeArray.
     * The task error can be thrown by input validation type:'array'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeArray(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeArray',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeString.
     * The task error can be thrown by input validation type:'string'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeString(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeString',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeChar.
     * The task error can be thrown by input validation type:'char'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeChar(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeChar',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeNull.
     * The task error can be thrown by input validation type:'null'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeNull(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeNull',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeInt.
     * The task error can be thrown by input validation type:'int'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeInt(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeInt',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeFloat.
     * The task error can be thrown by input validation type:'float'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeFloat(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeFloat',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeNumber.
     * The task error can be thrown by input validation type:'number'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeNumber(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeNumber',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeDate.
     * The task error can be thrown by input validation type:'date'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeDate(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeDate',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeEmail.
     * The task error can be thrown by input validation type:'email'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeEmail(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeEmail',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeBoolean.
     * The task error can be thrown by input validation type:'boolean'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeBoolean(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeBoolean',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeSha512.
     * The task error can be thrown by input validation type:'sha512'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeSha512(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeSha512',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeSha256.
     * The task error can be thrown by input validation type:'sha256'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeSha256(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeSha256',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeSha384.
     * The task error can be thrown by input validation type:'sha384'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeSha384(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeSha384',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeSha1.
     * The task error can be thrown by input validation type:'sha1'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeSha1(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeSha1',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeMd5.
     * The task error can be thrown by input validation type:'md5'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeMd5(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeMd5',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeHexColor.
     * The task error can be thrown by input validation type:'hexColor'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeHexColor(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeHexColor',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeHexadecimal.
     * The task error can be thrown by input validation type:'hexadecimal'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeHexadecimal(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeHexadecimal',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeIp4.
     * The task error can be thrown by input validation type:'ip4'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeIp4(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeIp4',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeIp6.
     * The task error can be thrown by input validation type:'ip6'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeIp6(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeIp6',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeIsbn10.
     * The task error can be thrown by input validation type:'isbn10'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeIsbn10(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeIsbn10',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeIsbn13.
     * The task error can be thrown by input validation type:'isbn13'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeIsbn13(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeIsbn13',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeJson.
     * The task error can be thrown by input validation type:'json'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeJson(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeJson',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeUrl.
     * The task error can be thrown by input validation type:'url'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeUrl(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeUrl',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeMimeType.
     * The task error can be thrown by input validation type:'mimeType'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeMimeType(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeMimeType',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeMacAddress.
     * The task error can be thrown by input validation type:'macAddress'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeMacAddress(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeMacAddress',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeMobileNumber.
     * The task error can be thrown by input validation type:'mobileNumber'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeMobileNumber(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeMobileNumber',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeUuid3.
     * The task error can be thrown by input validation type:'uuid3'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeUuid3(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeUuid3',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeUuid4.
     * The task error can be thrown by input validation type:'uuid4'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeUuid4(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeUuid4',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeUuid5.
     * The task error can be thrown by input validation type:'uuid5'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeUuid5(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeUuid5',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeBase64.
     * The task error can be thrown by input validation type:'base64'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeBase64(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeBase64',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeAscii.
     * The task error can be thrown by input validation type:'ascii'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeAscii(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypescii',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeUserId.
     * The task error can be thrown by input validation type:'userId'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeUserId(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeUserId',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputValueLengthError.
     * The task error can be thrown by input validation minLength,maxLength,minLength.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputValueLengthError(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.VALUE_LENGTH_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotMatchWithMinLength.
     * The task error can be thrown by input validation minLength:4.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * minLength
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNotMatchWithMinLength(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithMinLength',inputPath,inputValue,ErrorGroup.VALUE_LENGTH_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotMatchWithMaxLength.
     * The task error can be thrown by input validation maxLength:4.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * maxLength
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNotMatchWithMaxLength(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithMaxLength',inputPath,inputValue,ErrorGroup.VALUE_LENGTH_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotMatchWithLength.
     * The task error can be thrown by input validation length:4.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * length
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNotMatchWithLength(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithLength',inputPath,inputValue,ErrorGroup.VALUE_LENGTH_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputLettersFormatError.
     * The task error can be thrown by input validation isLetters.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputLettersFormatError(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.LETTERS_FORMAT_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotUppercase.
     * The task error can be thrown by input validation isLetters:'uppercase'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotUppercase(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotUppercase',inputPath,inputValue,ErrorGroup.LETTERS_FORMAT_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotLowercase.
     * The task error can be thrown by input validation isLetters:'lowercase'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotLowercase(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotLowercase',inputPath,inputValue,ErrorGroup.LETTERS_FORMAT_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotMatchWithCharClass.
     * The task error can be thrown by input validation charClass:'a-zA-Z0-9'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * regex
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotMatchWithCharClass(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotMatchWithCharClass',inputPath,inputValue));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputDateError.
     * The task error can be thrown by input validation before and after.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputDateError(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.DATE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputDateIsNotBefore.
     * The task error can be thrown by input validation before:Date.now().
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldBefore
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputDateIsNotBefore(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputDateIsNotBefore',inputPath,inputValue,ErrorGroup.DATE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputDateIsNotAfter.
     * The task error can be thrown by input validation after:Date.now().
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldAfter
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputDateIsNotAfter(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputDateIsNotAfter',inputPath,inputValue,ErrorGroup.DATE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotContains.
     * The task error can be thrown by input validation contains:'hallo'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldContain
     * missing
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotContains(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotContains',inputPath,inputValue));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotEquals.
     * The task error can be thrown by input validation equals:'hallo'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldEqual
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotEquals(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotEquals',inputPath,inputValue));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNumberSizeError.
     * The task error can be thrown by input validation minValue,maxValue.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNumberSizeError(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.NUMBER_SIZE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotMatchWithMinValue.
     * The task error can be thrown by input validation minValue:10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * minValue
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNotMatchWithMinValue(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithMinValue',inputPath,inputValue,ErrorGroup.NUMBER_SIZE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotMatchWithMaxValue.
     * The task error can be thrown by input validation maxValue:10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * maxValue
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNotMatchWithMaxValue(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithMaxValue',inputPath,inputValue,ErrorGroup.NUMBER_SIZE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotMatchWithRegex.
     * The task error can be thrown by input validation regex:'/^\/user\/.+/'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     * @param regexName
     * Parameter can be used to check the regexName in the info.
     */
    inputIsNotMatchWithRegex(inputPath ?: string,inputValue ?: any,regexName ?: string) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotMatchWithRegex',inputPath,inputValue,undefined,'regexName',regexName));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotStartsWith.
     * The task error can be thrown by input validation startsWith:'user'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldStartsWith
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotStartsWith(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotStartsWith',inputPath,inputValue));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotEndsWith.
     * The task error can be thrown by input validation endsWith:'user'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldEndsWith
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotEndsWith(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotEndsWith',inputPath,inputValue));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputEnumError.
     * The task error can be thrown by input validation enum,privateEnum.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputEnumError(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.ENUM_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotMatchWithEnum.
     * The task error can be thrown by input validation enum:['red','blue'].
     * More info checks you need to do by yourself.
     * Possibilities are:
     * enum (array)
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotMatchWithEnum(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotMatchWithEnum',inputPath,inputValue,ErrorGroup.ENUM_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotMatchWithPrivateEnum.
     * The task error can be thrown by input validation privateEnum:['red','blue'].
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotMatchWithPrivateEnum(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotMatchWithPrivateEnum',inputPath,inputValue,ErrorGroup.ENUM_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputArrayLengthError.
     * The task error can be thrown by array validation length,minLength,maxLength.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputArrayLengthError(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.ARRAY_LENGTH_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputArrayNotMatchWithMaxLength.
     * The task error can be thrown by array validation maxLength:10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * maxLength
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputArrayNotMatchWithMaxLength(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputArrayNotMatchWithMaxLength',inputPath,inputValue,ErrorGroup.ARRAY_LENGTH_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputArrayNotMatchWithMinLength.
     * The task error can be thrown by array validation minLength:5.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * minLength
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputArrayNotMatchWithMinLength(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputArrayNotMatchWithMinLength',inputPath,inputValue,ErrorGroup.ARRAY_LENGTH_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputArrayNotMatchWithLength.
     * The task error can be thrown by array validation length:10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * length
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputArrayNotMatchWithLength(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('inputArrayNotMatchWithLength',inputPath,inputValue,ErrorGroup.ARRAY_LENGTH_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for noValidTypeWasFound.
     * The task error can be thrown by input validation type:['int','float'].
     * More info checks you need to do by yourself.
     * Possibilities are:
     * types (array)
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    noValidTypeWasFound(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('noValidTypeWasFound',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for noAnyOfMatch.
     * The task error can be thrown by input anyOf usage.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    noAnyOfMatch(inputPath ?: string,inputValue ?: any) : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._validationErrorBuild
        ('noAnyOfMatch',inputPath,inputValue));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for controllerNotFound.
     * The task error can be thrown when the controller name is not found.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * controllerName
     */
    controllerNotFound() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'controllerNotFound'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for systemControllerNotFound.
     * The task error can be thrown when the system controller name is not found.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * controllerName
     */
    systemControllerNotFound() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'systemControllerNotFound'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for authControllerNotSet.
     * The task error can be thrown when no auth controller is set.
     */
    authControllerNotSet() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'authControllerNotSet'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for systemNotCompatible.
     * The task error can be thrown when the system is not compatible with the controller.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * system
     */
    systemNotCompatible() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.COMPATIBILITY_ERROR,'systemNotCompatible'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for versionNotCompatible.
     * The task error can be thrown when the version is not compatible with the controller.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * version
     */
    versionNotCompatible() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.COMPATIBILITY_ERROR,'versionNotCompatible'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any code error.
     */
    codeError() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.CODE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for authenticationError.
     * The task error can be thrown by trying to authenticate an sc.
     */
    authenticationError() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.SYSTEM_ERROR,'authenticationError'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any input error.
     */
    inputError() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputPropertyIsMissing.
     * The task error can be thrown if an input property is missing.
     * Possibilities are:
     * propertyName (the name of the missing property)
     * input (the input object where the property is missing)
     */
    inputPropertyIsMissing() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'inputPropertyIsMissing'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownInputProperty.
     * The task error can be thrown if the input object has an unknown input property.
     * Possibilities are:
     * propertyName (the unknown input property name)
     */
    unknownInputProperty() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'unknownInputProperty'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotAssignable.
     * The task error can be thrown if you send the input with type array and the input is not assignable.
     * Possibilities are:
     * index (index of input that is not assignable)
     * value (input value that is not assignable)
     */
    inputNotAssignable() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'inputNotAssignable'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for arrayWasExpected.
     * The task error can be thrown if array was expected in the input.
     * Possibilities are:
     * inputPath (full path to the value where an array was expected)
     * inputValue (the input value that is not from type array)
     */
    arrayWasExpected() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'arrayWasExpected'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for objectWasExpected.
     * The task error can be thrown if object was expected in the input.
     * Possibilities are:
     * inputPath (full path to the value where an object was expected)
     * inputValue (the input value that is not from type object)
     */
    objectWasExpected() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'objectWasExpected'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for objectPropertyIsMissing.
     * The task error can be thrown if object property is missing.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * object (the input object where the property is missing)
     * propertyName (name of missing property)
     * inputPath (the full input path to missing property)
     */
    objectPropertyIsMissing() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'objectPropertyIsMissing'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownObjectProperty.
     * The task error can be thrown if input object has an unknow property.
     * Possibilities are:
     * propertyName (name of the unknown property)
     * inputPath (full input path to unknown property)
     */
    unknownObjectProperty() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'unknownObjectProperty'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for wrongPanelAuthData.
     * The task error can be thrown if the panel auth authData is wrong.
     */
    wrongPanelAuthData() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.AUTH_ERROR,'wrongPanelAuthData'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for authStartActive.
     * The task error can be thrown if the server is in auth start mode
     * and you send an normal request.
     */
    authStartActive() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TIME_ERROR,'authStartActive'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for noAccessToController.
     * The task error can be thrown if you have no access to the controller.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * authIn (if you auth in)
     * authUserGroup (you auth user group)
     */
    noAccessToController() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.AUTH_ERROR,'noAccessToController'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for wrongInputDataStructure.
     * The task error can be thrown if the request has a wrong structure.
     */
    wrongInputDataStructure() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'wrongInputDataStructure'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for JSONParseSyntaxError.
     * The task error can be thrown if the json parse with the input thwors an error.
     */
    JSONParseSyntaxError() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'JSONParseSyntaxError'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for wrongValidationCheckStructure.
     * The task error can be thrown if the input validation check has a wrong structure.
     * Can only throw by an validation request.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * checkIndex
     */
    wrongValidationCheckStructure() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'wrongValidationCheckStructure'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputPathInControllerNotFound.
     * The task error can be thrown if the input path in the controller is not found.
     * Can only throw by an validation request.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * controllerName
     * inputPath
     * checkIndex
     */
    inputPathInControllerNotFound() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'inputPathInControllerNotFound'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputPathNotHasAtLeastOneEntry.
     * The task error can be thrown if the input path has not at least one entry.
     * Can only throw by an validation request.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * inputPath
     * checkIndex
     */
    inputPathNotHasAtLeastOneEntry() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'inputPathNotHasAtLeastOneEntry'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any protocol error.
     */
    protocolError() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.PROTOCOL_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for noAccessWithProtocol.
     * The task error can be thrown if you have no access to the controller
     * with the requested protocol.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * controllerName
     * protocol
     */
    noAccessWithProtocol() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.PROTOCOL_ERROR,'noAccessWithProtocol'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for noAccessWithHttpMethod.
     * The task error can be thrown if you have no access to the controller
     * with the requested http method.
     * So the error can only throws by an http request.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * controllerName
     * method
     */
    noAccessWithHttpMethod() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.PROTOCOL_ERROR,'noAccessWithHttpMethod'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any system error.
     */
    systemError() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.SYSTEM_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownError.
     * The task error can be thrown by any unknown error on the server.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * info (only server is running in debug mode)
     */
    unknownError() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.SYSTEM_ERROR,'unknownError'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any token error.
     */
    tokenError() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TOKEN_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownTokenVerifyError.
     * The task error can be thrown by any unknown error by verify a token.
     * More info checks you need to do by yourself.
     */
    unknownTokenVerifyError() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TOKEN_ERROR,'unknownTokenVerifyError'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownTokenSignError.
     * The task error can be thrown by any unknown error by sign a token.
     * More info checks you need to do by yourself.
     */
    unknownTokenSignError() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TOKEN_ERROR,'unknownTokenSignError'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for tokenExpiredError.
     * The task error can be thrown if a token is expired.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * expiredAt
     */
    tokenExpiredError() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TOKEN_ERROR,'tokenExpiredError'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for jsonWebTokenError.
     * The task error can be thrown by any json web token error on the server.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * message
     */
    jsonWebTokenError() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TOKEN_ERROR,'jsonWebTokenError'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for authenticateMiddlewareBlock.
     * The task error can be thrown by authenticate middleware block.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * err
     */
    authenticateMiddlewareBlock() : AbstractErrorFilterBuilder<T> {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TOKEN_ERROR,'authenticateMiddlewareBlock'));
        return this.errorFilterBuilder;
    }

    // noinspection JSMethodCanBeStatic
    private _validationErrorBuild(name ?: string,inputPath ?: string,inputValue ?: any,group ?: string,opInfoKey ?: string, opInfoValue ?: any) : ErrorFilter
    {
        const preset : ErrorFilter = {};
        preset.fromZationSystem = true;
        preset.type = ErrorType.VALIDATION_ERROR;
        if(name) {
            preset.name = name;
        }
        if(inputPath || inputValue)
        {
            let info = {};
            if(inputPath){
                info['inputPath'] = inputPath;
            }
            if(inputValue){
                info['inputValue'] = inputValue;
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
    private _zationErrorBuild(type ?: string,name ?: string,group ?: string) : ErrorFilter
    {
        const preset : ErrorFilter = {};
        preset.fromZationSystem = true;
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

    private _presetAdd(filter : ErrorFilter) : void
    {
        if(this.pushPreset) {
            this.errorFilterBuilder.addErrorFilter(filter);
        }
        else {
            this.errorFilterBuilder.setTmpFilter(filter);
        }
    }
}