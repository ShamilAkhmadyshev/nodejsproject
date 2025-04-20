const professionsMock = require("../mock/profession.json")
const qualitiesMock = require("../mock/qualities.json")
const Professions = require("../models/professions")
const Qualities = require("../models/qualities")

module.exports = async() =>{
const professions = await Professions.find()
    if(professions.length !== professionsMock.length){
        await createInitialEntity(Professions, professionsMock)
    }

const qualities= await Qualities.find()
if(qualities.length !== qualitiesMock.length){
    await createInitialEntity(Qualities, qualitiesMock)

}
}

async function createInitialEntity(Model, data){
    await Model.collection.drop()
    return Promise.all(
        data.map(async item =>{
            try {
                delete item._id
                const newItem = Model(item)
                await newItem.save()
                return newItem
            }catch (e){
                return e
            }
        })
    )
}