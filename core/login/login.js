const getXPLoginToken = Core => chrome.storage.sync.get('XPLogin')
    .then(({ XPLogin }) => doLoginRequest(Core)(XPLogin || {}))
    
const setXPLoginToken = token => chrome.storage.sync.get('XPLogin')
    .then(xli => chrome.storage.sync.set({ XPLogin: { token: token, ...xli.XPLogin }}))


const doLoginRequest = Core => ({ username, password }) => Core.Request.post
    ('https://jobs-api.x-team.com/auth/local')
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
    .then(({ XPLogin }) => Core.Request.get('https://jobs-api.x-team.com/users/me')
    (true)
    ()
    ()
    (r => {
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
        return null
    }))

function Login(Core) {
    console.log('XCE :: Core :: Loading Login')
    testXPLoginToken(Core)
    
    return ({
        module: 'Login'
    })
}

export default Login
