/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

import {AbstractErrorFilterBuilder} from "./abstractErrorFilterBuilder";
import ResponseReactAble          = require("../responseReactionEngine/responseReactAble");
import {ErrorFilter} from "../../filter/errorFilter";

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
     * Preset for inputIsNotAString.
     * The task error can be thrown by input validation type:'string'.
     * @param inputPath
     * Parameter can be used to check the inputPath in the info.
     * @param inputValue
     * Parameter can be used to check the inputValue in the info.
     */
    inputIsNotAString(inputPath ?: string,inputValue ?: string) : AbstractErrorFilterBuilder<ResponseReactAble> {
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAString',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAInt',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAFloat',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotADate',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAEmail',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotABoolean',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotASha512',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotASha256',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotASha384',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotASha1',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAMd5',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAHexColor',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAHexadecimal',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAIp4',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAIp6',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAIsbn10',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAIsbn13',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAJson',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAUrl',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAMimeType',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAMacAddress',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAMobileNumber',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAUuid3',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAUuid4',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAUuid5',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotALatLong',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotABase64',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAscii',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotANumber',inputPath,inputValue));
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
        this._presetAdd(this._presetValidationErrorBuild('inputIsNotAUserId',inputPath,inputValue));
        return this.errorFilterBuilder;
    }



    private _presetValidationErrorBuild(name : string,inputPath ?: string,inputValue ?: string) : ErrorFilter
    {
        const preset : ErrorFilter = {};
        preset.fromZationSystem = true;
        preset.name = name;
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