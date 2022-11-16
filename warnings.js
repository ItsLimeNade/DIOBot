const { QuickDB } = require('quick.db')
let db = new QuickDB({ filePath: 'moderation.sqlite' })

class Warnings {
    constructor(maxWarnings) {
        this.maxWarnings = maxWarnings
    }

    async warn(userID, guildID, reason) {
        if (!userID) return console.error(new Error('MinusJs/Warnings Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Warnings Error: Guild ID was not povided.'))
        if (!reason) return console.error(new Error('MinusJs/Warnings Error: Guild ID was not povided.'))

        const dbKey = `${userID}-${guildID}-MinusJsWarns`
        if (!await db.get(dbKey)) {
            await db.set(dbKey, { warns: 0, reasons: [] })
        }

        let userWarns = await db.get(dbKey)
        userWarns.warns += 1
        userWarns.reasons.push(reason)
        await db.set(dbKey, userWarns)
        return true

    }
    async removeWarns(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs/Warnings Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Warnings Error: Guild ID was not povided.'))

        const dbKey = `${userID}-${guildID}-MinusJsWarns`
        if (!await db.get(dbKey)) {
            await db.set(dbKey, { warns: 0, reasons: [] })
        }
        if (!await db.get(dbKey)) {
            await db.set(dbKey, { warns: 0, reasons: [] })
        }

        let userWarns = await db.get(dbKey)
        userWarns.warns += -1
        await db.set(dbKey, userWarns)

        return true
    }
    async clearDatabase() {
        await db.deleteAll()
        return true
    }
    async cleareUserData(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs/Warnings Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Warnings Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-MinusJsWarns`
        if (!await db.get(dbKey)) {
            await db.set(dbKey, { warns: 0, reasons: [] })
        }
        await db.delete(dbKey)
        return true
    }
    async getUserWarns(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs/Warnings Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Warnings Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-MinusJsWarns`
        if (!await db.get(dbKey)) {
            await db.set(dbKey, { warns: 0, reasons: [] })
        }
        let userWarns = await db.get(dbKey)
        return userWarns.warns
    }
    async getUserReasons(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs/Warnings Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Warnings Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-MinusJsWarns`
        if (!await db.get(dbKey)) {
            await db.set(dbKey, { warns: 0, reasons: [] })
        }
        const userWarns = await db.get(dbKey)
        return userWarns.reasons
    }
    async isUserPunishable(userID, guildID) {
        if (!userID) return console.error(new Error('MinusJs/Warnings Error: User ID was not povided.'))
        if (!guildID) return console.error(new Error('MinusJs/Warnings Error: Guild ID was not povided.'))
        const dbKey = `${userID}-${guildID}-MinusJsWarns`
        if (!await db.get(dbKey)) {
            await db.set(dbKey, { warns: 0, reasons: [] })
        }
        const userData = await db.get(dbKey)
        return userData.warns > this.maxWarnings
    }
}

module.exports = Warnings
