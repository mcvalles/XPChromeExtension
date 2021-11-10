import Core from '/core/core.js'
import Emails from '/modules/emails/emails.js'

const imports = [Emails(Core)]

function registerListeners () {
        imports
        .reduce((p, c) => {
                console.log(`processing listeners from ${c.module}`)
                p = p.concat(Object.entries(c.listeners))
                return p
        }, [])
        .forEach(listener => {
                console.log(`adding listener ${listener[0]}`)
                chrome.runtime.onMessage.addListener(listener[1])
        })
}

registerListeners()

// Core.Notes.get
// ('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQ3NSwiaWF0IjoxNjM0NzcwMDQzLCJleHAiOjE2MzczNjIwNDN9.cEfqUw1rq45m_z3AD4H4neqrJlYY3DY-ZDfVhYJxPUg')
// ('/?profile=241019&populate[]=tags')
// ()
// (console.log)

// Core.Notes.post
// ('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQ3NSwiaWF0IjoxNjM0NzcwMDQzLCJleHAiOjE2MzczNjIwNDN9.cEfqUw1rq45m_z3AD4H4neqrJlYY3DY-ZDfVhYJxPUg')
// ()
// (JSON.stringify({
//         body: `test note ${Date.now()} from extension`,
//         tags: [77],
//         profile: '241019'
// }))
// (console.log)