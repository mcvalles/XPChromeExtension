//Work in progress - Now being used for testing purposes only

function handleMessage (message, sender, sendResponse) {
        console.log(`got message: ${JSON.stringify(message, 0, 2)}`)
        messageResponses[message.message](message, sendResponse)

        return true
}

const messageResponses = {
        getTemplates,
}

function getTemplates (message, cb) {
        chrome.storage.sync.get(["save"], (res) => {
                console.log(`retrieved: ${JSON.stringify(res, 0, 2)}`)
                cb(res.save)
            })
}
      
chrome.runtime.onMessage.addListener(handleMessage)

chrome.storage.sync.get(null, function callback(items) {
        console.log(items)
});

var emailSubject = "";
var test = "eml_outreach_subj"
chrome.storage.sync.get(["save"], (res) => {
        emailSubject = res.save[test] ?? ""
        console.log(emailSubject);
})