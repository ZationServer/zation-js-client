/*
Author: Luca Scaringella
GitHub: LucaCode
©Copyright by Luca Scaringella
 */

class Box
{
    constructor(validator = () => {return true;})
    {
        this._validator = validator;
        this._itemsWithKey = {};
        this._items = [];
        this._fixedItems = [];
    }

    // noinspection JSUnusedGlobalSymbols
    forEach(func)
    {
        for(let i = 0; i < this._fixedItems.length; i++)
        {
            func(this._fixedItems[i]);
        }

        for(let i = 0; i < this._items.length; i++)
        {
            func(this._items[i]);
        }

        for(let k in this._itemsWithKey)
        {
            if(this._itemsWithKey.hasOwnProperty(k))
            {
                func(this._itemsWithKey[k]);
            }
        }
    }

    // noinspection JSUnusedGlobalSymbols
    addItem(item,key,overwrite = true)
    {
        if(key !== undefined)
        {
            return this.addKeyItem(key,item,overwrite);
        }
        else
        {
            return this.addIndexItem(item)
        }
    }

    // noinspection JSUnusedGlobalSymbols
    removeItem(key)
    {
        if(Number.isInteger(key))
        {
            return this.removeIndexItem(key);

        }
        else
        {
            return this.removeKeyItem(key);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    getItem(key)
    {
        if(Number.isInteger(key))
        {
            return this.getIndexItem(key);

        }
        else
        {
            return this.getKeyItem(key);
        }
    }

    // noinspection JSUnusedGlobalSymbols
    addFixedItem(item)
    {
        if(this._validator(item))
        {
            return this._fixedItems.push(item) -1;
        }
        else
        {
            return false;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    getFixedItem(index)
    {
        return this._fixedItems[index];
    }

    // noinspection JSUnusedGlobalSymbols
    removeAllItems()
    {
        this._items = [];
        this._itemsWithKey = {};
    }

    getIndexItem(index)
    {
        if(index < this._items.length)
        {
            return this._items[index];
        }
        else
        {
            return false;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    removeIndexItem(index)
    {
        if(index < this._items.length)
        {
            this._items = this._items.splice(index,1);
            return true;
        }
        else
        {
            return false;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    addIndexItem(item)
    {
        if(this._validator(item))
        {
            return this._items.push(item) -1;
        }
        else
        {
            return false;
        }
    }

    getKeyItem(key)
    {
        return this._itemsWithKey[key];
    }

    // noinspection JSUnusedGlobalSymbols
    removeKeyItem(key)
    {
        if(this._itemsWithKey.hasOwnProperty(key))
        {
            delete this._itemsWithKey[key];
            return true;
        }
        else
        {
            return false;
        }
    }

    // noinspection JSUnusedGlobalSymbols
    addKeyItem(key,item,overwrite = true)
    {
        if(this._validator(item))
        {
            if((this._itemsWithKey.hasOwnProperty(key) && overwrite) ||
                !this._itemsWithKey.hasOwnProperty(key))
            {
                this._itemsWithKey[key] = item;
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
}

module.exports  = Box;