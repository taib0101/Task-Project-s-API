import userLocalModel from "../models/userLocal.js";
import userGlobalModel from "../models/userGlobal.js";


// read user Local and Global Collection

export const exportReadCollection = (map) => {
    console.log(map);
    return map;
}

export const readCollection = async () => {
    const arrayLocalModel = await userLocalModel.find({});
    const arrayGlobalModel = await userGlobalModel.find({});
    const map = new Map();

    arrayGlobalModel.forEach((value, index) => {
        map.set(arrayGlobalModel[index].uniqueId, arrayLocalModel[index]._id.toString());
        map.set(arrayLocalModel[index]._id.toString(), arrayGlobalModel[index].uniqueId);
    });

    const returnedMap = exportReadCollection(map);
}

