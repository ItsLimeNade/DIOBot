const { QuickDB } = require('quick.db')
let db = new QuickDB()

class Leveling {

    constructor(startingXP, neededXP, gainedXP, xpRate, startingLevel, levelingRate) {
        if (typeof startingXP != "number") return console.error(new Error('MinusJs Error: Starting XP must be a number'))
        if (typeof neededXP != "number") return console.error(new Error('MinusJs Error: Needed XP must be a number'))
        if (typeof gainedXP != "number") return console.error(new Error('MinusJs Error: Gained XP must be a number'))
        if (typeof xpRate != "number") return console.error(new Error('MinusJs Error: XP Rate must be a number'))
        if (typeof levelingRate != "number") return console.error(new Error('MinusJs Error: Leveling Rate must be a number'))
        if (typeof startingLevel != "number") return console.error(new Error('MinusJs Error: Starting Level must be a number'))

        this.startingXP = startingXP
        this.neededXP = neededXP
        this.gainedXP = gainedXP
        this.xpRate = xpRate
        this.levelingRate = levelingRate
        this.startingLevel = startingLevel
    }

    async checkData(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`

        if (!await db.has(dbKey)) {
            await db.set(dbKey, {
                currentXP: this.startingXP,
                neededXP: this.neededXP,
                gainedXP: this.gainedXP,
                xpRate: this.xpRate,
                levelingRate: this.levelingRate,
                currentLevel: this.startingLevel
            })
        }

        let userData = await db.get(dbKey)
        userData.currentXP += userData.gainedXP * userData.xpRate
        await db.set(dbKey, userData)

        if (userData.currentXP >= userData.neededXP) {
            userData.currentXP = userData.currentXP - userData.neededXP
            userData.currentLevel += 1
            userData.neededXP = userData.neededXP * userData.levelingRate
            await db.set(dbKey, userData)
        }

        console.log(await db.get(dbKey))

    }
    async setXpRate(userID, guildID, newXpRate) {
        if (!userID) return console.error(new Error('MinusJs Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs Error: Guild ID was not povided.'))
        if (!newXpRate) return console.error(new Error('MinusJs Error: XP Rate was not povided.'))
        if (typeof newXpRate != "number") return console.error(new Error('MinusJs Error: XP Rate must be a number'))


        const dbKey = `${userID}-${guildID}-minusJsLeveling`

        if (!await db.has(dbKey)) {
            await db.set(dbKey, {
                currentXP: this.startingXP,
                neededXP: this.neededXP,
                gainedXP: this.gainedXP,
                xpRate: this.xpRate,
                levelingRate: this.levelingRate,
                currentLevel: this.startingLevel
            })
        }


        let userData = await db.get(dbKey)
        userData.xpRate = newXpRate
        await db.set(dbKey, userData)
        console.log(await db.get(dbKey))

    }
    async deleteUserData(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`

        if (!await db.has(dbKey)) {
            return console.error(new Error('MinusJs Error: Wrong database entry given, cannot delete an unexisting entry.'))
        }
        await db.delete(dbKey)
    }

    async clearDatabase() {
        await db.deleteAll() //Dangerous method lol
    }

    async getUserLevel(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`
        let userData = await db.get(dbKey)
        return userData.currentLevel
    }

    async getUserXp(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`
        let userData = await db.get(dbKey)
        return userData.currentXP
    }

    async getUserNeededXp(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`
        let userData = await db.get(dbKey)
        return userData.neededXP
    }

    async getUserXpRate(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`
        let userData = await db.get(dbKey)
        return userData.xpRate
    }

    async getUserLevelingRate(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`
        let userData = await db.get(dbKey)
        return userData.levelingRate
    }

    async getUserData(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-minusJsLeveling`
        let userData = await db.get(dbKey)
        return userData
    }
}

// async function createLeveling() {
//     let leveling = new Leveling(0, 100, 1, 1, 1, 1.2)
//     await leveling.checkData(1, 1)
// await leveling.setXpRate(1, 1, 2)
// await leveling.clearDatabase()
// await leveling.deleteUserData(1, 1)
// }
// createLeveling()

module.exports = Leveling