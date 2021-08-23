import Emails from '/modules/emails/background.js'

const imports = [Emails]

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