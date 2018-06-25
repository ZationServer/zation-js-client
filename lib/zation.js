/*
Zation JavaScript Client 1.0.0
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */


//WebApi

class ZationFile extends RequestAble
{
    constructor(file)
    {
        super();
        this._file = file;
    }

    getJson()
    {
        return new Promise((resolve, reject) =>
        {
            if(this._file instanceof File)
            {
                let fileReader = new FileReader();
                // noinspection SpellCheckingInspection
                fileReader.onloadend = () => {
                    let file =
                        {
                            name: this._file.name,
                            size: this._file.size,
                            lastModified: this._file.lastModified,
                            type: this._file.type,
                            data: fileReader.result
                        };

                    console.log(file);

                    resolve(file);
                };

                // noinspection SpellCheckingInspection
                fileReader.onerror = () => {
                    reject();
                };

                fileReader.readAsArrayBuffer(this._file);
            }
            else
            {
                reject();
            }
        })
    }
}


//SOCKET CLUSTER DATA
