import userLocalModel from "../models/userLocal.js";
import userGlobalModel from "../models/userGlobal.js";


const map = new Map();

// read user Local and Global Collection
export const returnReadCollection = () => {
    console.log(map);
    return map;
}

export const readCollection = async () => {
    const arrayLocalModel = await userLocalModel.find({});
    const arrayGlobalModel = await userGlobalModel.find({});

    arrayGlobalModel.forEach((value, index) => {
        map.set(arrayGlobalModel[index].uniqueId, arrayLocalModel[index]._id.toString());
        map.set(arrayLocalModel[index]._id.toString(), arrayGlobalModel[index].uniqueId);
    });

    const returnedMap = returnReadCollection();
}

