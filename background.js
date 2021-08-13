//Work in progress - Now being used for testing purposes only

chrome.storage.sync.get(null, function callback(items) { console.log(items) });
    
var emailSubject = ""; 
var test = "eml_outreach_subj"
chrome.storage.sync.get(["save"],(res) => {
        emailSubject = res.save[test] ?? ""
        console.log(emailSubject); 
})