const messageResponses = {
    getTemplates,
}

function getTemplates (message, cb) {
    chrome.storage.sync.get(["save"], (res) => {
        console.log(`retrieved: ${JSON.stringify(res, 0, 2)}`)
        cb(res.save)
    })
}

function handleMessage (message, sender, sendResponse) {
    console.log(`got message: ${JSON.stringify(message, 0, 2)}`)
    messageResponses[message.message](message, sendResponse)
    return true
}

export default ({
    module: 'Emails',
    listeners: {
        handleMessage,
    },
})