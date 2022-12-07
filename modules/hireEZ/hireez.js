
const getUserByLI = Core => (message, sender, sendResponse) => Core.Request.get
    ('https://jobs-api-dev.x-team.com/profiles')
    (true)
    (`?linkedinAccount_contains=${message.params}`)
    ()
    (sendResponse)

  const createNewProfile = Core => (message, sender, sendResponse) => Core.Request.post
    ('https://jobs-api-dev.x-team.com/profiles')
    (true)
    ()
    ({
      ...message.body,
      created_origin_type: 'LEAD_AUTOMATION',
      lead: true,
      source: 'OTHER',
      sourcedFrom: 'Source from HireEasy',
    })
    (sendResponse)

/*const getUserByLI = (Core) => (message, sender, sendResponse) =>
    Core.Request.get('https://jobs-api-dev.x-team.com/search/quick')(true)(
        `?value=${message.params}&_limit=10`
    )()(sendResponse);*/

export default (Core) => ({
    module: 'HireEZ',
    messageHandlers: {
        getUserByLI,
        createNewProfile
    },
});
