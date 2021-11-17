const getUserByLI = Core => (message, sender, sendResponse) => {
    Core.Request.get
    ('https://jobs-api.x-team.com/search/quick')
    (true)
    (`?value=${message.params}&_limit=10`)
    ()
    (sendResponse)
}


const messageHandler = Core => action => (message, sender, sendResponse) => ({
    getUserByLI: getUserByLI(Core),
    })[message.action](message, sender, sendResponse)

export default (Core) => ({
    module: 'Linkedin',
    messageHandler: messageHandler(Core),
})
