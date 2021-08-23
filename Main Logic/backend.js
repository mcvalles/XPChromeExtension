//Constants  -------------------------------------------------------------------------------------
const outreachSubjectKey = "eml_outreach_subj";
const outreachEmailKey = "tmp_outreach";
const referralSubjectKey = "eml_referral_subj";
const referralEmailKey = "tmp_referral";
const interviewSubjectKey = "eml_interview_subj";
const interviewEmailKey = "tmp_interview";
const rejectionSubjectKey = "eml_rejection_subj";
const rejectionEmailKey = "tmp_rejection";
const acceptanceSubjectKey = "eml_acceptance_subj";
const acceptanceEmailKey = "tmp_acceptance";
const pasteContentMessage = "Paste email template from clipboard using Ctrl+V."
//Event Listeners --------------------------------------------------------------------------------  

//On Document Ready
if (document.readyState !== 'complete') {
    window.addEventListener('load', afterWindowLoaded);
} else {
    afterWindowLoaded;
}

//When the user clicks on <span> (x), close the modal
document.querySelector(".close").addEventListener('click', CloseModal);

//When the user clicks anywhere outside of the modal, close it
//window.addEventListener('click', CloseModal);

//Send Blank Email
document.getElementById("blankEmail").addEventListener('click', SendBlankEmail);

//Send Template Email
var modalButtons = document.getElementsByName("modalButton");
for (var i = 0; i < modalButtons.length; i++) {
    modalButtons[i].addEventListener('click', SendTemplateEmail);
}

//Functions --------------------------------------------------------------------------------------
function afterWindowLoaded() {
   chrome.runtime.sendMessage(
       { 
           message: 'getTemplates',
           data: {
               emailKey: 'outreachEmailKey'
           }
        }, (res) => console.log(`message: ${JSON.stringify(res)}`))

    //Open Modal when email element gets clicked
    //Even though it is being called after the document is ready, rendering takes so long the html element does not yet exist when the script is being called
    //TODO: Find a better way to solve this. Currently getting by with a timeout.
    setTimeout(function () {
        document.querySelector(".Profile-module--email--1WtUw a").addEventListener('click', OpenModal)
    }, 5000);
}

function OpenModal(e) {
    if (document.querySelector("#emailModal") != null) {
        e.preventDefault(); //Prevent traditional redirection to email.
        var modal = document.getElementById("emailModal");
        modal.style.display = "block";
    }
}

function CloseModal() {
    if (document.querySelector("#emailModal") != null) {
        var modal = document.getElementById("emailModal");
        modal.style.display = "none";
    }
}

function SendBlankEmail() {
    window.location.href = GetEmailLink();
    CloseModal();
}

function SendTemplateEmail() {
    var subjectKey;
    var emailKey;
    switch (this.id) {
        case "eml_outreach":
            subjectKey = outreachSubjectKey;
            emailKey = outreachEmailKey;
            break;
        case "eml_referral":
            subjectKey = referralSubjectKey;
            emailKey = referralEmailKey;
            break;
        case "eml_interview":
            subjectKey = interviewSubjectKey;
            emailKey = interviewEmailKey
            break;
        case "eml_rejection":
            subjectKey = rejectionSubjectKey;
            emailKey = rejectionEmailKey;
            break;
        case "eml_acceptance":
            subjectKey = acceptanceSubjectKey;
            emailKey = acceptanceEmailKey;
            break;
    }

    var subject = GetEmailSubject(subjectKey);
    var content = GetEmailBody(emailKey);
    CopyRichText(content); //Copy Email Template to Clipboard
    window.location.href = GetEmailLink() + "?subject=" + subject + "&body=" + pasteContentMessage;
    CloseModal();
}
//Email Template Getters--------------------------------------------------------------------------
function GetEmailBody(emailkey) {
    var emailBody = "";
    chrome.storage.sync.get(["save"], (res) => {
        //This line is not being excecuted - currently working on figuring this out
        //Email Body not being retrieved (but it is correctly saved)
        emailBody = res.save[emailkey] ?? ""
    })
    if (emailBody) {
        emailBody = emailBody.replace("[candidate]", GetCandidateName());
        emailBody = emailBody.replace("[calendlyLink]", GetCalendlyLink());
    }
    return emailBody;
}

function GetEmailSubject(subjectKey) {
    var emailSubject = "";
    chrome.storage.sync.get(["save"], (res) => {
        //This line is not being excecuted - currently working on figuring this out
        //Email Subject not being retrieved (but it is correctly saved)
        emailSubject = res.save[subjectKey] ?? ""
    })
    return emailSubject;
}

function GetCandidateName() {
    return document.querySelector('h2').textContent.split(/ /)[0];
}

function GetEmailLink() {
    return document.querySelector('.Profile-module--email--1WtUw a').href;
}

//Copy HTML to Clipboard
function CopyRichText(text) {
    const listener = function (ev) {
        ev.preventDefault();
        ev.clipboardData.setData('text/html', text);
        ev.clipboardData.setData('text/plain', text);
    };
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);
}