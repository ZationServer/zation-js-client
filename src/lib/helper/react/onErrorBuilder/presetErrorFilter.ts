/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {AbstractErrorFilterBuilder} from "./abstractErrorFilterBuilder";
import ResponseReactAble          = require("../responseReactionEngine/responseReactAble");
import {ErrorFilter} from "../../filter/errorFilter";
import ErrorGroups = require("../../constants/errorGroups");
import ErrorTypes = require("../../constants/errorTypes");

export class PresetErrorFilter
{
    private readonly errorFilterBuilder : AbstractErrorFilterBuilder<ResponseReactAble>;
    private  readonly pushPreset : boolean;

    constructor(errorFilterBuilder : AbstractErrorFilterBuilder<ResponseReactAble>,pushPreset : boolean)
    {
        this.errorFilterBuilder  = errorFilterBuilder ;
        this.pushPreset = pushPreset;
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
    inputTypeError(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAString.
     * The task error can be thrown by input validation type:'string'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAString(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAString',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAInt.
     * The task error can be thrown by input validation type:'int'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAInt(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAInt',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAFloat.
     * The task error can be thrown by input validation type:'float'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAFloat(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAFloat',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotADate.
     * The task error can be thrown by input validation type:'date'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotADate(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotADate',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAEmail.
     * The task error can be thrown by input validation type:'email'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAEmail(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAEmail',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotABoolean.
     * The task error can be thrown by input validation type:'boolean'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotABoolean(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotABoolean',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotASha512.
     * The task error can be thrown by input validation type:'sha512'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotASha512(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotASha512',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotASha256.
     * The task error can be thrown by input validation type:'sha256'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotASha256(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotASha256',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotASha384.
     * The task error can be thrown by input validation type:'sha384'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotASha384(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotASha384',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotASha1.
     * The task error can be thrown by input validation type:'sha1'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotASha1(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotASha1',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAMd5.
     * The task error can be thrown by input validation type:'md5'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAMd5(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAMd5',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAHexColor.
     * The task error can be thrown by input validation type:'hexColor'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAHexColor(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAHexColor',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAHexadecimal.
     * The task error can be thrown by input validation type:'hexadecimal'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAHexadecimal(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAHexadecimal',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAIp4.
     * The task error can be thrown by input validation type:'ip4'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAIp4(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAIp4',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAIp6.
     * The task error can be thrown by input validation type:'ip6'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAIp6(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAIp6',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAIsbn10.
     * The task error can be thrown by input validation type:'isbn10'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAIsbn10(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAIsbn10',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAIsbn13.
     * The task error can be thrown by input validation type:'isbn13'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAIsbn13(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAIsbn13',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAJson.
     * The task error can be thrown by input validation type:'json'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAJson(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAJson',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAUrl.
     * The task error can be thrown by input validation type:'url'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAUrl(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAUrl',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAMimeType.
     * The task error can be thrown by input validation type:'mimeType'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAMimeType(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAMimeType',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAMacAddress.
     * The task error can be thrown by input validation type:'macAddress'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAMacAddress(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAMacAddress',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAMobileNumber.
     * The task error can be thrown by input validation type:'mobileNumber'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAMobileNumber(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAMobileNumber',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAUuid3.
     * The task error can be thrown by input validation type:'uuid3'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAUuid3(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAUuid3',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAUuid4.
     * The task error can be thrown by input validation type:'uuid4'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAUuid4(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAUuid4',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAUuid5.
     * The task error can be thrown by input validation type:'uuid5'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAUuid5(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAUuid5',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotALatLong.
     * The task error can be thrown by input validation type:'latLong'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotALatLong(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotALatLong',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotABase64.
     * The task error can be thrown by input validation type:'base64'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotABase64(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotABase64',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAAscii.
     * The task error can be thrown by input validation type:'ascii'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAAscii(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAscii',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotANumber.
     * The task error can be thrown by input validation type:'number'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotANumber(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotANumber',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotAUserId.
     * The task error can be thrown by input validation type:'userId'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAUserId(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotAUserId',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
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
    inputValueLengthError(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroups.VALUE_LENGTH_ERROR));
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
    inputNotMatchWithMinLength(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithMinLength',inputPath,inputValue,ErrorGroups.VALUE_LENGTH_ERROR));
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
    inputNotMatchWithMaxLength(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithMaxLength',inputPath,inputValue,ErrorGroups.VALUE_LENGTH_ERROR));
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
    inputNotMatchWithLength(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputNotMatchWithLength',inputPath,inputValue,ErrorGroups.VALUE_LENGTH_ERROR));
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
    inputLettersFormatError(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroups.LETTERS_FORMAT_ERROR));
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
    inputIsNotUppercase(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotUppercase',inputPath,inputValue,ErrorGroups.LETTERS_FORMAT_ERROR));
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
    inputIsNotLowercase(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotLowercase',inputPath,inputValue,ErrorGroups.LETTERS_FORMAT_ERROR));
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
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotContains(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
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
    inputIsNotEquals(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotEquals',inputPath,inputValue));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputNumberSizeError.
     * The task error can be thrown by input validation biggerThan,lesserThan.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputNumberSizeError(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroups.NUMBER_SIZE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotBiggerThan.
     * The task error can be thrown by input validation biggerThan:10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldBiggerThan
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotBiggerThan(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotBiggerThan',inputPath,inputValue,ErrorGroups.NUMBER_SIZE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotLesserThan.
     * The task error can be thrown by input validation lesserThan:10.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * shouldLesserThan
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotLesserThan(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotLesserThan',inputPath,inputValue,ErrorGroups.NUMBER_SIZE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputIsNotMatchWithRegex.
     * The task error can be thrown by input validation regex:'/^\/user\/.+/'.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * regex
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotMatchWithRegex(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotMatchWithRegex',inputPath,inputValue));
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
    inputIsNotStartsWith(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
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
    inputIsNotEndsWith(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
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
    inputEnumError(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroups.ENUM_ERROR));
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
    inputIsNotMatchWithEnum(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotMatchWithEnum',inputPath,inputValue,ErrorGroups.ENUM_ERROR));
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
    inputIsNotMatchWithPrivateEnum(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputIsNotMatchWithPrivateEnum',inputPath,inputValue,ErrorGroups.ENUM_ERROR));
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
    inputArrayLengthError(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        (undefined,inputPath,inputValue,ErrorGroups.ARRAY_LENGTH_ERROR));
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
    inputArrayNotMatchWithMaxLength(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputArrayNotMatchWithMaxLength',inputPath,inputValue,ErrorGroups.ARRAY_LENGTH_ERROR));
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
    inputArrayNotMatchWithMinLength(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputArrayNotMatchWithMinLength',inputPath,inputValue,ErrorGroups.ARRAY_LENGTH_ERROR));
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
    inputArrayNotMatchWithLength(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('inputArrayNotMatchWithLength',inputPath,inputValue,ErrorGroups.ARRAY_LENGTH_ERROR));
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
    noValidTypeWasFound(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._validationErrorBuild
        ('noValidTypeWasFound',inputPath,inputValue,ErrorGroups.TYPE_ERROR));
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
    controllerNotFound() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.INPUT_ERROR,'controllerNotFound'));
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
    systemControllerNotFound() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.INPUT_ERROR,'systemControllerNotFound'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for authControllerNotSet.
     * The task error can be thrown when no auth controller is set.
     */
    authControllerNotSet() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.INPUT_ERROR,'authControllerNotSet'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for systemNotFound.
     * The task error can be thrown when the system is not found.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * systemName
     */
    systemNotFound() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.COMPATIBILITY_ERROR,'systemNotFound'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for versionToOld.
     * The task error can be thrown when the version is to old.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * minVersion
     */
    versionToOld() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.COMPATIBILITY_ERROR,'versionToOld'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any code error.
     */
    codeError() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.CODE_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for authenticationError.
     * The task error can be thrown by trying to authenticate an sc.
     */
    authenticationError() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.SYSTEM_ERROR,'authenticationError'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any input error.
     */
    inputError() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.INPUT_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputMissing.
     * The task error can be thrown if input is missing.
     */
    inputMissing() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.INPUT_ERROR,'inputMissing'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for tooMuchInput.
     * The task error can be thrown if input is to much.
     */
    tooMuchInput() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.INPUT_ERROR,'tooMuchInput'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for arrayWasExpected.
     * The task error can be thrown if array was expected in the input.
     */
    arrayWasExpected() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.INPUT_ERROR,'arrayWasExpected'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for objectWasExpected.
     * The task error can be thrown if object was expected in the input.
     */
    objectWasExpected() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.INPUT_ERROR,'objectWasExpected'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for objectPropertyIsMissing.
     * The task error can be thrown if object property is missing.
     */
    objectPropertyIsMissing() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.INPUT_ERROR,'objectPropertyIsMissing'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownObjectProperty.
     * The task error can be thrown if input object has an unknow property.
     */
    unknownObjectProperty() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.INPUT_ERROR,'unknownObjectProperty'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for wrongPanelAuthData.
     * The task error can be thrown if the panel auth data is wrong.
     */
    wrongPanelAuthData() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.AUTH_ERROR,'wrongPanelAuthData'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for authStartActive.
     * The task error can be thrown if the server is in auth start mode
     * and you send an normal request.
     */
    authStartActive() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.TIME_ERROR,'authStartActive'));
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
    noAccessToController() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.AUTH_ERROR,'noAccessToController'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for wrongInputDataStructure.
     * The task error can be thrown if the request has a wrong structure.
     */
    wrongInputDataStructure() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.INPUT_ERROR,'wrongInputDataStructure'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for JSONParseSyntaxError.
     * The task error can be thrown if the json parse with the input thwors an error.
     */
    JSONParseSyntaxError() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.INPUT_ERROR,'JSONParseSyntaxError'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for inputPathInControllerNotFound.
     * The task error can be thrown if the input path in the controller is not found.
     * Can only throws by an validation request.
     * More info checks you need to do by yourself.
     * Possibilities are:
     * controllerName
     * inputPath
     */
    inputPathInControllerNotFound() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.INPUT_ERROR,'inputPathInControllerNotFound'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any protocol error.
     */
    protocolError() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.PROTOCOL_ERROR));
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
    noAccessWithProtocol() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.PROTOCOL_ERROR,'noAccessWithProtocol'));
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
    noAccessWithHttpMethod() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.PROTOCOL_ERROR,'noAccessWithHttpMethod'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any system error.
     */
    systemError() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.SYSTEM_ERROR));
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
    unknownError() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.SYSTEM_ERROR,'unknownError'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for any token error.
     */
    tokenError() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.TOKEN_ERROR));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownTokenVerifyError.
     * The task error can be thrown by any unknown error by verify a token.
     * More info checks you need to do by yourself.
     */
    unknownTokenVerifyError() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.TOKEN_ERROR,'unknownTokenVerifyError'));
        return this.errorFilterBuilder;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @description
     * Preset for unknownTokenSignError.
     * The task error can be thrown by any unknown error by sign a token.
     * More info checks you need to do by yourself.
     */
    unknownTokenSignError() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.TOKEN_ERROR,'unknownTokenSignError'));
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
    tokenExpiredError() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.TOKEN_ERROR,'tokenExpiredError'));
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
    jsonWebTokenError() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.TOKEN_ERROR,'jsonWebTokenError'));
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
    authenticateMiddlewareBlock() : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._zationErrorBuild
        (ErrorTypes.TOKEN_ERROR,'authenticateMiddlewareBlock'));
        return this.errorFilterBuilder;
    }

    // noinspection JSMethodCanBeStatic
    private _validationErrorBuild(name ?: string,inputPath ?: string,inputValue ?: string,group ?: string) : ErrorFilter
    {
        const preset : ErrorFilter = {};
        preset.fromZationSystem = true;
        preset.type = ErrorTypes.VALIDATION_ERROR;
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