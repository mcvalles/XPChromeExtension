const getXPLoginToken = Core => chrome.storage.sync.get('XPLogin')
    .then(({ XPLogin }) => doLoginRequest(Core)(XPLogin || {}))
    
const setXPLoginToken = token => chrome.storage.sync.get('XPLogin')
    .then(xli => chrome.storage.sync.set({ XPLogin: { token, ...xli.XPLogin }}))


const doLoginRequest = Core => ({ username, password }) => Core.Request.post
    ('https://jobs-api-dev.x-team.com/auth/local')
    ()
    ('')
    ({
        identifier: username,
        password: password,
    })
    (r => setXPLoginToken(r.jwt))

const login = Core => getXPLoginToken(Core)
    .then(() => chrome.storage.sync.get('XPLogin'))


const testXPLoginToken = Core => chrome.storage.sync.get('XPLogin')
    .then(({ XPLogin }) => Core.Request.get('https://jobs-api-dev.x-team.com/users/me')
    (true)
    ()
    ()
    (async r => {
        if (!r?.id) {
            console.log(`XCE :: Login :: Bad token; refreshing...`)
            return chrome.storage.sync.set({
                XPLogin: {
                    username: XPLogin.username,
                    password: XPLogin.password,
                    token: undefined
                }
            })
            .then(r => login(Core))
        }
        console.log(`XCE :: Login :: Valid token`)

        await chrome.storage.sync.set({
          XPUserId: r.id
        })
        return null
    }))

async function Login(Core) {
    console.log('XCE :: Core :: Loading Login')
    await testXPLoginToken(Core)

    return ({
        module: 'Login'
    })
}

export default Login
