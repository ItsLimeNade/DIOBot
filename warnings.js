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

    }
}
