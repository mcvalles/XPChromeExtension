import Core from '/core/core.js'
import Emails from '/modules/emails/emails.js'
import Linkedin from '/modules/linkedin/linkedin.js'
import HireEZ from '/modules/hireEZ/hireez.js'

const modules = [Emails, Linkedin, HireEZ]
.map(i => i(Core))
.reduce((p, c) => {
        p[c.module] = c
        return p
}, {})

const messageHandlers = Object.values(modules)
.reduce((p, c) => {
        console.log(`Registering messageHandler for: ${c.module}`)
        p[c.module.toLowerCase()] = c.messageHandlers
        return p
}, {})

chrome.runtime.onMessage.addListener(Core.handleMessage(messageHandlers))

chrome.identity.getAuthToken({ 'interactive': true }, function (token) {
  chrome.storage.sync.set({
    googleAuthToken: token
  })
});
