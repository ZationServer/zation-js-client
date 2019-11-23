/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

// noinspection TypeScriptPreferShortImport
import {ErrorFilter} from "./errorFilter";
import {ErrorGroup}  from "../../constants/errorGroup";
import {ErrorType}   from "../../constants/errorType";

export abstract class PresetErrorLib<T>
{
    protected abstract self() : T;
    protected abstract _presetAdd(preset : ErrorFilter) : void;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any validation error.
     */
    validationError() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.VALIDATION_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputTypeError.
     * The BackError error can be thrown by input validation type.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputTypeError(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeObject.
     * The BackError error can be thrown by input validation type:'object'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeObject(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeObject',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeArray.
     * The BackError error can be thrown by input validation type:'array'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeArray(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeArray',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeString.
     * The BackError error can be thrown by input validation type:'string'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeString(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeString',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeChar.
     * The BackError error can be thrown by input validation type:'char'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeChar(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeChar',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeNull.
     * The BackError error can be thrown by input validation type:'null'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeNull(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeNull',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeInt.
     * The BackError error can be thrown by input validation type:'int'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeInt(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeInt',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeFloat.
     * The BackError error can be thrown by input validation type:'float'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeFloat(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeFloat',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeNumber.
     * The BackError error can be thrown by input validation type:'number'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeNumber(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeNumber',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeDate.
     * The BackError error can be thrown by input validation type:'date'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeDate(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeDate',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeEmail.
     * The BackError error can be thrown by input validation type:'email'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeEmail(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeEmail',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeBoolean.
     * The BackError error can be thrown by input validation type:'boolean'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeBoolean(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeBoolean',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeSha512.
     * The BackError error can be thrown by input validation type:'sha512'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeSha512(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeSha512',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeSha256.
     * The BackError error can be thrown by input validation type:'sha256'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeSha256(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeSha256',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeSha384.
     * The BackError error can be thrown by input validation type:'sha384'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeSha384(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeSha384',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeSha1.
     * The BackError error can be thrown by input validation type:'sha1'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeSha1(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeSha1',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeMd5.
     * The BackError error can be thrown by input validation type:'md5'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeMd5(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeMd5',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeHexColor.
     * The BackError error can be thrown by input validation type:'hexColor'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeHexColor(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeHexColor',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeHexadecimal.
     * The BackError error can be thrown by input validation type:'hexadecimal'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeHexadecimal(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeHexadecimal',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeIp4.
     * The BackError error can be thrown by input validation type:'ip4'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeIp4(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeIp4',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeIp6.
     * The BackError error can be thrown by input validation type:'ip6'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeIp6(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeIp6',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeIsbn10.
     * The BackError error can be thrown by input validation type:'isbn10'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeIsbn10(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeIsbn10',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeIsbn13.
     * The BackError error can be thrown by input validation type:'isbn13'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeIsbn13(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeIsbn13',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeJson.
     * The BackError error can be thrown by input validation type:'json'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeJson(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeJson',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeUrl.
     * The BackError error can be thrown by input validation type:'url'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeUrl(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeUrl',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeMimeType.
     * The BackError error can be thrown by input validation type:'mimeType'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeMimeType(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeMimeType',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeMacAddress.
     * The BackError error can be thrown by input validation type:'macAddress'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeMacAddress(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeMacAddress',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeMobileNumber.
     * The BackError error can be thrown by input validation type:'mobileNumber'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeMobileNumber(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeMobileNumber',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeUuid3.
     * The BackError error can be thrown by input validation type:'uuid3'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeUuid3(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeUuid3',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeUuid4.
     * The BackError error can be thrown by input validation type:'uuid4'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeUuid4(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeUuid4',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeUuid5.
     * The BackError error can be thrown by input validation type:'uuid5'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeUuid5(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeUuid5',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeBase64.
     * The BackError error can be thrown by input validation type:'base64'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeBase64(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeBase64',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeAscii.
     * The BackError error can be thrown by input validation type:'ascii'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeAscii(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypescii',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeUserId.
     * The BackError error can be thrown by input validation type:'userId'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeUserId(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeUserId',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeMongoId.
     * The BackError error can be thrown by input validation type:'mongoId'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeMongoId(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeMongoId',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotTypeLatLong.
     * The BackError error can be thrown by input validation type:'latLong'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotTypeLatLong(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotTypeLatLong',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputValueLengthError.
     * The BackError error can be thrown by input validation minLength,maxLength,minLength.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputValueLengthError(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.VALUE_LENGTH_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotMatchWithMinLength.
     * The BackError error can be thrown by input validation minLength:4.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * minLength
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNotMatchWithMinLength(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithMinLength',inputPath,inputValue,ErrorGroup.VALUE_LENGTH_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotMatchWithMaxLength.
     * The BackError error can be thrown by input validation maxLength:4.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * maxLength
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNotMatchWithMaxLength(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithMaxLength',inputPath,inputValue,ErrorGroup.VALUE_LENGTH_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotMatchWithLength.
     * The BackError error can be thrown by input validation length:4.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * length
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNotMatchWithLength(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithLength',inputPath,inputValue,ErrorGroup.VALUE_LENGTH_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputLettersFormatError.
     * The BackError error can be thrown by input validation isLetters.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputLettersFormatError(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.LETTERS_FORMAT_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotUppercase.
     * The BackError error can be thrown by input validation isLetters:'uppercase'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotUppercase(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotUppercase',inputPath,inputValue,ErrorGroup.LETTERS_FORMAT_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotLowercase.
     * The BackError error can be thrown by input validation isLetters:'lowercase'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotLowercase(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotLowercase',inputPath,inputValue,ErrorGroup.LETTERS_FORMAT_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotMatchWithCharClass.
     * The BackError error can be thrown by input validation charClass:'a-zA-Z0-9'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * regex
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotMatchWithCharClass(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotMatchWithCharClass',inputPath,inputValue));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputDateError.
     * The BackError error can be thrown by input validation before and after.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputDateError(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.DATE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputDateIsNotBefore.
     * The BackError error can be thrown by input validation before:Date.now().
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldBefore
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputDateIsNotBefore(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputDateIsNotBefore',inputPath,inputValue,ErrorGroup.DATE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputDateIsNotAfter.
     * The BackError error can be thrown by input validation after:Date.now().
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldAfter
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputDateIsNotAfter(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputDateIsNotAfter',inputPath,inputValue,ErrorGroup.DATE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotContains.
     * The BackError error can be thrown by input validation contains:'hallo'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldContain
     * missing
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotContains(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotContains',inputPath,inputValue));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotEquals.
     * The BackError error can be thrown by input validation equals:'hallo'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldEqual
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotEquals(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotEquals',inputPath,inputValue));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNumberSizeError.
     * The BackError error can be thrown by input validation minValue,maxValue.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNumberSizeError(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.NUMBER_SIZE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotMatchWithMinValue.
     * The BackError error can be thrown by input validation minValue:10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * minValue
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNotMatchWithMinValue(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithMinValue',inputPath,inputValue,ErrorGroup.NUMBER_SIZE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotMatchWithMaxValue.
     * The BackError error can be thrown by input validation maxValue:10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * maxValue
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNotMatchWithMaxValue(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithMaxValue',inputPath,inputValue,ErrorGroup.NUMBER_SIZE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotMatchWithRegex.
     * The BackError error can be thrown by input validation regex:'/^\/user\/.+/'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     * @param regexName
     * Parameter can be used to check the regexName in the info.
     */
    inputIsNotMatchWithRegex(inputPath ?: string,inputValue ?: any,regexName ?: string) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotMatchWithRegex',inputPath,inputValue,undefined,'regexName',regexName));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotStartsWith.
     * The BackError error can be thrown by input validation startsWith:'user'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldStartsWith
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotStartsWith(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotStartsWith',inputPath,inputValue));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotEndsWith.
     * The BackError error can be thrown by input validation endsWith:'user'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldEndsWith
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotEndsWith(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotEndsWith',inputPath,inputValue));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputEnumError.
     * The BackError error can be thrown by input validation enum,privateEnum.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputEnumError(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.ENUM_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotMatchWithEnum.
     * The BackError error can be thrown by input validation enum:['red','blue'].
     * More info checks you need to do by yourself.
     * Possibilities are:
     * enum (array)
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotMatchWithEnum(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotMatchWithEnum',inputPath,inputValue,ErrorGroup.ENUM_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotMatchWithPrivateEnum.
     * The BackError error can be thrown by input validation privateEnum:['red','blue'].
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotMatchWithPrivateEnum(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotMatchWithPrivateEnum',inputPath,inputValue,ErrorGroup.ENUM_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputArrayLengthError.
     * The BackError error can be thrown by array validation length,minLength,maxLength.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputArrayLengthError(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.ARRAY_LENGTH_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputArrayNotMatchWithMaxLength.
     * The BackError error can be thrown by array validation maxLength:10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * maxLength
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputArrayNotMatchWithMaxLength(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputArrayNotMatchWithMaxLength',inputPath,inputValue,ErrorGroup.ARRAY_LENGTH_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputArrayNotMatchWithMinLength.
     * The BackError error can be thrown by array validation minLength:5.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * minLength
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputArrayNotMatchWithMinLength(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputArrayNotMatchWithMinLength',inputPath,inputValue,ErrorGroup.ARRAY_LENGTH_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputArrayNotMatchWithLength.
     * The BackError error can be thrown by array validation length:10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * length
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputArrayNotMatchWithLength(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputArrayNotMatchWithLength',inputPath,inputValue,ErrorGroup.ARRAY_LENGTH_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotMatchWithMinByteSize.
     * The BackError error can be thrown by input validation minByteSize:100000.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * minByteSize
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNotMatchWithMinByteSize(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithMinByteSize',inputPath,inputValue,ErrorGroup.BYTE_SIZE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotMatchWithMaxByteSize.
     * The BackError error can be thrown by input validation maxByteSize:100000.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * maxByteSize
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNotMatchWithMaxByteSize(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithMaxByteSize',inputPath,inputValue,ErrorGroup.BYTE_SIZE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputByteSizeError.
     * The BackError error can be thrown by input validation minByteSize,maxByteSize.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputByteSizeError(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.BYTE_SIZE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotMatchWithMimeType.
     * The BackError error can be thrown by input validation mimeType:'image'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * mimeType
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNotMatchWithMimeType(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithMimeType',inputPath,inputValue,ErrorGroup.CONTENT_TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNotMatchWithMimeSubType.
     * The BackError error can be thrown by input validation mimeSubType:'jpg'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * mimeSubType
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNotMatchWithMimeSubType(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithMimeSubType',inputPath,inputValue,ErrorGroup.CONTENT_TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputContentTypeError.
     * The BackError error can be thrown by input validation mimeType,subType.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputContentTypeError(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroup.CONTENT_TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for noValidTypeWasFound.
     * The BackError error can be thrown by input validation type:['int','float'].
     * More info checks you need to do by yourself.
     * Possibilities are:
     * types (array)
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    noValidTypeWasFound(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('noValidTypeWasFound',inputPath,inputValue,ErrorGroup.TYPE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for noAnyOfMatch.
     * The BackError error can be thrown by input anyOf usage.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    noAnyOfMatch(inputPath ?: string,inputValue ?: any) : T {
        this._presetAdd(this._validationErrorBuild
        ('noAnyOfMatch',inputPath,inputValue));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for controllerNotFound.
     * The BackError error can be thrown when the controller is not found.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * controller
     */
    controllerNotFound() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'controllerNotFound'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for systemControllerNotFound.
     * The BackError error can be thrown when the system controller is not found.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * controller
     */
    systemControllerNotFound() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'systemControllerNotFound'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for apiLevelNotCompatible.
     * The BackError error can be thrown when the API level of the client is not compatible with the request.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * controller
     * apiLevel
     */
    apiLevelNotCompatible() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'apiLevelNotCompatible'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for authControllerNotSet.
     * The BackError error can be thrown when no auth controller is set.
     */
    authControllerNotSet() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'authControllerNotSet'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for noAccessWithSystem.
     * The BackError error can be thrown when the current system has no access to the controller.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * system
     */
    noAccessWithSystem() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.NO_ACCESS_ERROR,'noAccessWithSystem'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for noAccessWithVersion.
     * The BackError error can be thrown when the current version has no access to the controller.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * version
     */
    noAccessWithVersion() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.NO_ACCESS_ERROR,'noAccessWithVersion'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any code error.
     */
    codeError() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.CODE_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for authenticationError.
     * The BackError error can be thrown by trying to authenticate an sc.
     */
    authenticationError() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.SYSTEM_ERROR,'authenticationError'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any input error.
     */
    inputError() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputParamIsMissing.
     * The BackError error can be thrown if an input param is missing.
     * Possibilities are:
     * paramName (the name of the missing param)
     * input (the input object where the param is missing)
     */
    inputParamIsMissing() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'inputParamIsMissing'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownInputParam.
     * The BackError error can be thrown if the input object has an unknown input param.
     * Possibilities are:
     * paramName (the unknown input param name)
     */
    unknownInputParam() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'unknownInputParam'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputParamNotAssignable.
     * The BackError error can be thrown if you send input to a
     * parameter based input with data type array and the array
     * index is not assignable to a param name.
     * Possibilities are:
     * index (index of the input param that is not assignable)
     * value (input value of the input param that is not assignable)
     */
    inputParamNotAssignable() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'inputParamNotAssignable'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for arrayWasExpected.
     * The BackError error can be thrown if array was expected in the input.
     * Possibilities are:
     * inputPath (full path to the value where an array was expected)
     * inputValue (the input value that is not from type array)
     */
    arrayWasExpected() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'arrayWasExpected'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for objectWasExpected.
     * The BackError error can be thrown if object was expected in the input.
     * Possibilities are:
     * inputPath (full path to the value where an object was expected)
     * inputValue (the input value that is not from type object)
     */
    objectWasExpected() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'objectWasExpected'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for objectPropertyIsMissing.
     * The BackError error can be thrown if object property is missing.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * object (the input object where the property is missing)
     * propertyName (name of missing property)
     * inputPath (the full input path to missing property)
     */
    objectPropertyIsMissing() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'objectPropertyIsMissing'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownObjectProperty.
     * The BackError error can be thrown if input object has an unknow property.
     * Possibilities are:
     * propertyName (name of the unknown property)
     * inputPath (full input path to unknown property)
     */
    unknownObjectProperty() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'unknownObjectProperty'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for wrongPanelAuthData.
     * The BackError error can be thrown if the panel authData is wrong.
     */
    wrongPanelAuthData() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.AUTH_ERROR,'wrongPanelAuthData'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for panelIsNotActivated.
     * The BackError error can be thrown if you try to authenticate for the panel,
     * but the panel is not activated.
     */
    panelIsNotActivated() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'panelIsNotActivated'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for authStartActive.
     * The BackError error can be thrown if the server is in auth start mode
     * and you send an normal request.
     */
    authStartActive() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TIME_ERROR,'authStartActive'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for noAccessWithTokenState.
     * The BackError error can be thrown
     * if you have no access to the controller with your current token state.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * authIn (if you auth in)
     * authUserGroup (your auth user group)
     * userId (your user id)
     */
    noAccessWithTokenState() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.NO_ACCESS_ERROR,'noAccessWithTokenState'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for wrongInputDataStructure.
     * The BackError error can be thrown if the request has a wrong structure.
     */
    wrongInputDataStructure() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'wrongInputDataStructure'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for wrongInputTypeInParamBasedInput.
     * The BackError error can be thrown if the input in a param based input configuration is not an array or object.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * inputType
     */
    wrongInputTypeInParamBasedInput() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'wrongInputTypeInParamBasedInput'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for JSONParseSyntaxError.
     * The BackError error can be thrown if the json parse with the input thwors an error.
     */
    JSONParseSyntaxError() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'JSONParseSyntaxError'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for wrongValidationCheckStructure.
     * The BackError error can be thrown if the input validation check has a wrong structure.
     * Can only thrown by an validation request.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * checkIndex
     */
    wrongValidationCheckStructure() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'wrongValidationCheckStructure'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputPathNotResolvable.
     * The BackError error can be thrown if the input path is not resolvable.
     * Can only be thrown by a validation request.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * inputPath
     * checkIndex
     */
    inputPathNotResolvable() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'inputPathNotResolvable'));
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
    validationCheckLimitReached() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.INPUT_ERROR,'validationCheckLimitReached'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any protocol error.
     */
    protocolError() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.PROTOCOL_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for noAccessWithProtocol.
     * The BackError error can be thrown if you have no access to the controller
     * with the requested protocol.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * controller
     * protocol
     */
    noAccessWithProtocol() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.PROTOCOL_ERROR,'noAccessWithProtocol'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for noAccessWithHttpMethod.
     * The BackError error can be thrown if you have no access to the controller
     * with the requested http method.
     * The error can only throw by an HTTP request.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * controller
     * method
     */
    noAccessWithHttpMethod() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.PROTOCOL_ERROR,'noAccessWithHttpMethod'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any system error.
     */
    systemError() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.SYSTEM_ERROR));
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
    unknownError() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.SYSTEM_ERROR,'unknownError'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any token error.
     */
    tokenError() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TOKEN_ERROR));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownTokenVerifyError.
     * The BackError error can be thrown by any unknown error by verify a token.
     * More info checks you need to do by yourself.
     */
    unknownTokenVerifyError() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TOKEN_ERROR,'unknownTokenVerifyError'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownTokenSignError.
     * The BackError error can be thrown by any unknown error by sign a token.
     * More info checks you need to do by yourself.
     */
    unknownTokenSignError() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TOKEN_ERROR,'unknownTokenSignError'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for tokenExpiredError.
     * The BackError error can be thrown if a token is expired.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * expiredAt
     */
    tokenExpiredError() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TOKEN_ERROR,'tokenExpiredError'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for jsonWebTokenError.
     * The BackError error can be thrown by any json web token error on the server.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * message
     */
    jsonWebTokenError() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TOKEN_ERROR,'jsonWebTokenError'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for tokenClusterKeyIsInvalid.
     * The BackError error can be thrown by invalid token cluster key.
     * The error can only throw by an HTTP request.
     */
    tokenClusterKeyIsInvalid() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TOKEN_ERROR,'tokenClusterKeyIsInvalid'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for authenticateMiddlewareBlock.
     * The BackError error can be thrown by authenticate middleware block.
     * The error can only throw by an HTTP request.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * err
     */
    authenticateMiddlewareBlock() : T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TOKEN_ERROR,'authenticateMiddlewareBlock'));
        return this.self();
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
}