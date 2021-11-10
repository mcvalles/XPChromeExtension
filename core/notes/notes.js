const path = 'https://jobs-api.x-team.com/notes'

const _xp_post_notes = Core => authorization => _ => data => cb => Core.Request.post
    (path)
    (authorization)
    ('')
    (data)
    (cb)


const _xp_get_notes = Core => authorization => endpoint => _ => cb => Core.Request.get
    (path)
    (authorization)
    (endpoint)
    ()
    (cb)

const Notes = (Core) => {
    console.log('Loading Notes')
   
    return ({
        module: 'Notes',
        post: _xp_post_notes(Core),
        get: _xp_get_notes(Core),
    })
}

export default Notes
