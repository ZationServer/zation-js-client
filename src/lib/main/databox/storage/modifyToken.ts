/*
Author: Luca Scaringella
GitHub: LucaCode
Copyright(c) Luca Scaringella
 */

export const enum ModifyLevel {
    NOTHING = 0,
    DATA_TOUCHED = 1,
    DATA_CHANGED= 2
}

export interface ModifyToken {
    level: ModifyLevel,
    potential?: boolean,
    actionUsed?: boolean,
    potentialUsed?: boolean,
    checkDataChange?: boolean
}

export const createUpdateInsertModifyToken: (checkDataChange: boolean) => ModifyToken =
    (checkDataChange) => {
    let level = ModifyLevel.NOTHING;

    return {
        potential: false,
        actionUsed: false,
        potentialUsed: false,
        checkDataChange,
        set level(value) {
            if(value > 0){
                if(this.potential){
                    this.potentialUsed = true;
                }
                else {
                    this.actionUsed = true;
                }
                if(value > level) level = value;
            }
        },
        get level(){
            return level;
        }
    }
};

export const createDeleteModifyToken: () => ModifyToken =
    () => {
        let level = ModifyLevel.NOTHING;

        return {
            set level(value) {
                if(value > level) level = value;
            },
            get level(){
                return level;
            }
        }
    };

export const createSimpleModifyToken: () => ModifyToken =
    () => {
        return {
            checkDataChange: false,
            set level(_) {},
        }
};

export const getModifyTokenReaons = (mt: ModifyToken,reason: number,potentialReason: number) => {
    let tmp: number[] = [];
    if(mt.actionUsed) tmp.push(reason);
    if(mt.potentialUsed) tmp.push(potentialReason);
    return tmp;
};