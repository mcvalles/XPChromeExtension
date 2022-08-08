
const getUserByLI = Core => (message, sender, sendResponse) => Core.Request.get
    ('https://jobs-api.x-team.com/profiles')
    (true)
    (`?linkedinAccount_contains=${message.params}`)
    ()
    (sendResponse)

/*const getUserByLI = (Core) => (message, sender, sendResponse) =>
    Core.Request.get('https://jobs-api.x-team.com/search/quick')(true)(
        `?value=${message.params}&_limit=10`
    )()(sendResponse);*/

export default (Core) => ({
    module: 'HireEZ',
    messageHandlers: {
        getUserByLI,
    },
});