import Request from './request/request.js'
import Notes from './notes/notes.js'

const Core = {
    module: 'Core',
    Request,
    Notes,
}

Core.Request = Request(Core)
Core.Notes = Notes(Core)

export default Core