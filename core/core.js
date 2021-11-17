import Request from './request/request.js'
import Notes from './notes/notes.js'
import Login from './login/login.js'

const Core = {
    module: 'Core',
    Request,
    Notes,
    Login,
}

Core.Request = Request(Core)
Core.Notes = Notes(Core)
Core.Login = Login(Core)

Core.handleMessage = messageHandlers => (message, sender, sendResponse) => {
    messageHandlers[message.target.toLowerCase()](Core)(message, sender, sendResponse)
    return true
}

export default Core