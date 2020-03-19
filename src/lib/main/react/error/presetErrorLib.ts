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
    protected abstract self(): T;
    protected abstract _presetAdd(preset: ErrorFilter): void;

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any validation error.
     */
    validationError(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.ValidationError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for typeError.
     * The BackError error can be thrown by validation type.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    typeError(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        (undefined,path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeObject.
     * The BackError error can be thrown by input validation type:'object'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeObject(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeObject',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeArray.
     * The BackError error can be thrown by input validation type:'array'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeArray(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeArray',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeString.
     * The BackError error can be thrown by input validation type:'string'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeString(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeString',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeChar.
     * The BackError error can be thrown by input validation type:'char'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeChar(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeChar',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeNull.
     * The BackError error can be thrown by input validation type:'null'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeNull(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeNull',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeInt.
     * The BackError error can be thrown by input validation type:'int'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeInt(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeInt',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeFloat.
     * The BackError error can be thrown by input validation type:'float'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeFloat(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeFloat',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeNumber.
     * The BackError error can be thrown by input validation type:'number'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeNumber(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeNumber',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeDate.
     * The BackError error can be thrown by input validation type:'date'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeDate(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeDate',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeEmail.
     * The BackError error can be thrown by input validation type:'email'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeEmail(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeEmail',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeBoolean.
     * The BackError error can be thrown by input validation type:'boolean'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeBoolean(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeBoolean',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeSha512.
     * The BackError error can be thrown by input validation type:'sha512'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeSha512(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeSha512',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeSha256.
     * The BackError error can be thrown by input validation type:'sha256'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeSha256(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeSha256',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeSha384.
     * The BackError error can be thrown by input validation type:'sha384'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeSha384(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeSha384',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeSha1.
     * The BackError error can be thrown by input validation type:'sha1'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeSha1(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeSha1',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeMd5.
     * The BackError error can be thrown by input validation type:'md5'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeMd5(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeMd5',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeHexColor.
     * The BackError error can be thrown by input validation type:'hexColor'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeHexColor(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeHexColor',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeHexadecimal.
     * The BackError error can be thrown by input validation type:'hexadecimal'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeHexadecimal(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeHexadecimal',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeIp4.
     * The BackError error can be thrown by input validation type:'ip4'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeIp4(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeIp4',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeIp6.
     * The BackError error can be thrown by input validation type:'ip6'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeIp6(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeIp6',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeIsbn10.
     * The BackError error can be thrown by input validation type:'isbn10'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeIsbn10(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeIsbn10',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeIsbn13.
     * The BackError error can be thrown by input validation type:'isbn13'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeIsbn13(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeIsbn13',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeJson.
     * The BackError error can be thrown by input validation type:'json'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeJson(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeJson',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeUrl.
     * The BackError error can be thrown by input validation type:'url'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeUrl(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeUrl',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeMimeType.
     * The BackError error can be thrown by input validation type:'mimeType'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeMimeType(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeMimeType',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeMacAddress.
     * The BackError error can be thrown by input validation type:'macAddress'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeMacAddress(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeMacAddress',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeMobileNumber.
     * The BackError error can be thrown by input validation type:'mobileNumber'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeMobileNumber(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeMobileNumber',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeUuid3.
     * The BackError error can be thrown by input validation type:'uuid3'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeUuid3(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeUuid3',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeUuid4.
     * The BackError error can be thrown by input validation type:'uuid4'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeUuid4(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeUuid4',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeUuid5.
     * The BackError error can be thrown by input validation type:'uuid5'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeUuid5(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeUuid5',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeBase64.
     * The BackError error can be thrown by input validation type:'base64'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeBase64(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeBase64',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeAscii.
     * The BackError error can be thrown by input validation type:'ascii'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeAscii(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypescii',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeUserId.
     * The BackError error can be thrown by input validation type:'userId'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeUserId(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeUserId',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeMongoId.
     * The BackError error can be thrown by input validation type:'mongoId'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeMongoId(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeMongoId',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueIsNotTypeLatLong.
     * The BackError error can be thrown by input validation type:'latLong'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueIsNotTypeLatLong(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueIsNotTypeLatLong',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueLengthError.
     * The BackError error can be thrown by input validation minLength,maxLength,minLength.
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
     * The BackError error can be thrown by input validation minLength:4.
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
        ('valueNotMatchesWithMinLength',path,value,ErrorGroup.ValueLengthError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMaxLength.
     * The BackError error can be thrown by input validation maxLength:4.
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
        ('valueNotMatchesWithMaxLength',path,value,ErrorGroup.ValueLengthError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithLength.
     * The BackError error can be thrown by input validation length:4.
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
        ('valueNotMatchesWithLength',path,value,ErrorGroup.ValueLengthError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithLettersFormat.
     * The BackError error can be thrown by input validation isLetters.
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
        ('valueNotMatchesWithLettersFormat',path,value));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithCharClass.
     * The BackError error can be thrown by input validation charClass:'a-zA-Z0-9'.
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
        ('valueNotMatchesWithCharClass',path,value));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for dateError.
     * The BackError error can be thrown by input validation before and after.
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
     * The BackError error can be thrown by input validation before:Date.now().
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
        ('dateIsNotBefore',path,value,ErrorGroup.DateError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for dateIsNotAfter.
     * The BackError error can be thrown by input validation after:Date.now().
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
        ('dateIsNotAfter',path,value,ErrorGroup.DateError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithContains.
     * The BackError error can be thrown by input validation contains:'hallo'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldContain
     * missing
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithContains(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueNotMatchesWithContains',path,value));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithEquals.
     * The BackError error can be thrown by input validation equals:'hallo'.
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
        ('valueNotMatchesWithEquals',path,value));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for numberSizeError.
     * The BackError error can be thrown by input validation minValue,maxValue.
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
     * The BackError error can be thrown by input validation minValue:10.
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
        ('valueNotMatchesWithMinValue',path,value,ErrorGroup.NumberSizeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMaxValue.
     * The BackError error can be thrown by input validation maxValue:10.
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
        ('valueNotMatchesWithMaxValue',path,value,ErrorGroup.NumberSizeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithRegex.
     * The BackError error can be thrown by input validation regex:'/^\/user\/.+/'.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     * @param regexName
     * Parameter can be used to check the regexName in the info.
     */
    valueNotMatchesWithRegex(path?: string,value?: any,regexName?: string): T {
        this._presetAdd(this._validationErrorBuild
        ('valueNotMatchesWithRegex',path,value,undefined,'regexName',regexName));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithStartsWith.
     * The BackError error can be thrown by input validation startsWith:'user'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldStartsWith
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithStartsWith(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueNotMatchesWithStartsWith',path,value));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithEndsWith.
     * The BackError error can be thrown by input validation endsWith:'user'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldEndsWith
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithEndsWith(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueNotMatchesWithEndsWith',path,value));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inError.
     * The BackError error can be thrown by input validation in,privateIn.
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
     * The BackError error can be thrown by input validation in: ['red','blue'].
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
        ('valueNotMatchesWithIn',path,value,ErrorGroup.InError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithPrivateIn.
     * The BackError error can be thrown by input validation privateIn: ['red','blue'].
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    valueNotMatchesWithPrivateIn(path?: string, value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('valueNotMatchesWithPrivateIn',path,value,ErrorGroup.InError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for arrayLengthError.
     * The BackError error can be thrown by array validation length,minLength,maxLength.
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
     * The BackError error can be thrown by array validation maxLength:10.
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
        ('arrayNotMatchesWithMaxLength',path,value,ErrorGroup.ArrayLengthError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for arrayNotMatchesWithMinLength.
     * The BackError error can be thrown by array validation minLength:5.
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
        ('arrayNotMatchesWithMinLength',path,value,ErrorGroup.ArrayLengthError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for arrayNotMatchesWithLength.
     * The BackError error can be thrown by array validation length:10.
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
        ('arrayNotMatchesWithLength',path,value,ErrorGroup.ArrayLengthError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMinByteSize.
     * The BackError error can be thrown by input validation minByteSize:100000.
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
        ('valueNotMatchesWithMinByteSize',path,value,ErrorGroup.ByteSizeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMaxByteSize.
     * The BackError error can be thrown by input validation maxByteSize:100000.
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
        ('valueNotMatchesWithMaxByteSize',path,value,ErrorGroup.ByteSizeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for byteSizeError.
     * The BackError error can be thrown by input validation minByteSize,maxByteSize.
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
     * Preset for valueNotMatchesWithMimeType.
     * The BackError error can be thrown by input validation mimeType:'image'.
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
        ('valueNotMatchesWithMimeType',path,value,ErrorGroup.ContentTypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for valueNotMatchesWithMimeSubType.
     * The BackError error can be thrown by input validation mimeSubType:'jpg'.
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
        ('valueNotMatchesWithMimeSubType',path,value,ErrorGroup.ContentTypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for contentTypeError.
     * The BackError error can be thrown by input validation mimeType,subType.
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
     * Preset for noValidTypeWasFound.
     * The BackError error can be thrown by input validation type:['int','float'].
     * More info checks you need to do by yourself.
     * Possibilities are:
     * types (array)
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    noValidTypeWasFound(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('noValidTypeWasFound',path,value,ErrorGroup.TypeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for noAnyOfMatch.
     * The BackError error can be thrown by input anyOf usage.
     * @param path
     * Parameter can be used to check the path in the info.
     * @param value
     * Parameter can be used to check the value in the info.
     */
    noAnyOfMatch(path?: string,value?: any): T {
        this._presetAdd(this._validationErrorBuild
        ('noAnyOfMatch',path,value));
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
    controllerNotFound(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'controllerNotFound'));
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
    systemControllerNotFound(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'systemControllerNotFound'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for apiLevelIncompatible.
     * The BackError error can be thrown when the API level of the client is incompatible with the request.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * controller
     * apiLevel
     */
    apiLevelIncompatible(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'apiLevelIncompatible'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for authControllerNotSet.
     * The BackError error can be thrown when no auth controller is set.
     */
    authControllerNotSet(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'authControllerNotSet'));
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
    noAccessWithSystem(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.NoAccessError,'noAccessWithSystem'));
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
    noAccessWithVersion(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.NoAccessError,'noAccessWithVersion'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any code error.
     */
    codeError(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.CodeError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for authenticationError.
     * The BackError error can be thrown by trying to authenticate an sc.
     */
    authenticationError(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.SystemError,'authenticationError'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any input error.
     */
    inputError(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsMissing.
     * The BackError error can be thrown if a single input is missing.
     */
    inputIsMissing(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'inputIsMissing'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputParamIsMissing.
     * The BackError error can be thrown if an input param is missing.
     * Possibilities are:
     * paramName (the name of the missing param)
     */
    inputParamIsMissing(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'inputParamIsMissing'));
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
    unknownInputParam(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'unknownInputParam'));
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
    inputParamNotAssignable(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'inputParamNotAssignable'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for arrayWasExpected.
     * The BackError error can be thrown if array was expected in the input.
     * Possibilities are:
     * path (full path to the value where an array was expected)
     * value (the input value that is not from type array)
     */
    arrayWasExpected(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'arrayWasExpected'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for objectWasExpected.
     * The BackError error can be thrown if object was expected in the input.
     * Possibilities are:
     * path (full path to the value where an object was expected)
     * value (the input value that is not from type object)
     */
    objectWasExpected(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'objectWasExpected'));
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
     * path (the full input path to missing property)
     */
    objectPropertyIsMissing(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'objectPropertyIsMissing'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownObjectProperty.
     * The BackError error can be thrown if input object has an unknow property.
     * Possibilities are:
     * propertyName (name of the unknown property)
     * path (full input path to unknown property)
     */
    unknownObjectProperty(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'unknownObjectProperty'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for wrongPanelAuthData.
     * The BackError error can be thrown if the panel authData is wrong.
     */
    wrongPanelAuthData(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.AuthError,'wrongPanelAuthData'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for panelIsNotActivated.
     * The BackError error can be thrown if you try to authenticate for the panel,
     * but the panel is not activated.
     */
    panelIsNotActivated(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'panelIsNotActivated'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for authStartActive.
     * The BackError error can be thrown if the server is in auth start mode
     * and you send an normal request.
     */
    authStartActive(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TimeError,'authStartActive'));
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
    noAccessWithTokenState(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.NoAccessError,'noAccessWithTokenState'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for wrongInputDataStructure.
     * The BackError error can be thrown if the request has a wrong structure.
     */
    wrongInputDataStructure(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'wrongInputDataStructure'));
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
    wrongInputTypeInParamBasedInput(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'wrongInputTypeInParamBasedInput'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for JSONParseSyntaxError.
     * The BackError error can be thrown if the json parse with the input thwors an error.
     */
    JSONParseSyntaxError(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'JSONParseSyntaxError'));
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
    wrongValidationCheckStructure(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'wrongValidationCheckStructure'));
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
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'pathNotResolvable'));
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
        this._presetAdd(this._zationErrorBuild
        (ErrorType.InputError,'validationCheckLimitReached'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any protocol error.
     */
    protocolError(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.ProtocolError));
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
    noAccessWithProtocol(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.ProtocolError,'noAccessWithProtocol'));
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
    noAccessWithHttpMethod(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.ProtocolError,'noAccessWithHttpMethod'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any system error.
     */
    systemError(): T {
        this._presetAdd(this._zationErrorBuild
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
        this._presetAdd(this._zationErrorBuild
        (ErrorType.SystemError,'unknownError'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any token error.
     */
    tokenError(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TokenError));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownTokenVerifyError.
     * The BackError error can be thrown by any unknown error by verify a token.
     * More info checks you need to do by yourself.
     */
    unknownTokenVerifyError(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TokenError,'unknownTokenVerifyError'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownTokenSignError.
     * The BackError error can be thrown by any unknown error by sign a token.
     * More info checks you need to do by yourself.
     */
    unknownTokenSignError(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TokenError,'unknownTokenSignError'));
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
    tokenExpiredError(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TokenError,'tokenExpiredError'));
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
    jsonWebTokenError(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TokenError,'jsonWebTokenError'));
        return this.self();
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for tokenClusterKeyIsInvalid.
     * The BackError error can be thrown by invalid token cluster key.
     * The error can only throw by an HTTP request.
     */
    tokenClusterKeyIsInvalid(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TokenError,'tokenClusterKeyIsInvalid'));
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
    authenticateMiddlewareBlock(): T {
        this._presetAdd(this._zationErrorBuild
        (ErrorType.TokenError,'authenticateMiddlewareBlock'));
        return this.self();
    }

    // noinspection JSMethodCanBeStatic
    private _validationErrorBuild(name?: string,path?: string,value?: any,group?: string,opInfoKey?: string, opInfoValue?: any): ErrorFilter
    {
        const preset: ErrorFilter = {};
        preset.fromZationSystem = true;
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
    private _zationErrorBuild(type?: string,name?: string,group?: string): ErrorFilter
    {
        const preset: ErrorFilter = {};
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