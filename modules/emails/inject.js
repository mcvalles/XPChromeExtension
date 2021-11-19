//Constants  -------------------------------------------------------------------------------------
const outreachSubjectKey = "eml_outreach_subj";
const outreachEmailKey = "tmp_outreach";
const referralSubjectKey = "eml_referral_subj";
const referralEmailKey = "tmp_referral";
const interviewSubjectKey = "eml_interview_subj";
const interviewEmailKey = "tmp_interview";
const rejectionSubjectKey = "eml_rejection_subj";
const rejectionEmailKey = "tmp_rejection";
const onHoldSubjectKey = "eml_onhold_subj";
const onHoldEmailKey = "tmp_onhold";
const acceptanceSubjectKey = "eml_acceptance_subj";
const acceptanceEmailKey = "tmp_acceptance";
const shortlistSubjectKey = "eml_shortlist_subj";
const shortlistEmailKey = "tmp_shortlist";
const updateSubjectKey = "eml_update_subj";
const updateEmailKey = "tmp_update";
const pasteContentMessage = "Paste email template from clipboard using Ctrl+V.";
const confirmNote = "Add default note documenting the email that got sent?";
var noteText = "Reached out through an [emailtype] email.";
var alternativeNoteText = "[emailtype] email sent.";
var templates;

//Event Listeners --------------------------------------------------------------------------------

const emailObserver = new MutationObserver((mutations) => {
  if (document.querySelector("div.Profile-module--email--1WtUw") != null) {
    afterEmailLoaded();
    emailObserver.disconnect();
  }
});

var profilePage = document.querySelector("body");
emailObserver.observe(profilePage, {
  subtree: true,
  childlist: true,
  attributes: true,
});

//When the user clicks on <span> (x), close the modal
document.querySelector(".close").addEventListener("click", CloseModal);

//Send Blank Email
document.getElementById("blankEmail").addEventListener("click", SendBlankEmail);

//Send Template Email
var modalButtons = document.getElementsByName("modalButton");
for (var i = 0; i < modalButtons.length; i++) {
  modalButtons[i].addEventListener("click", SendTemplateEmail);
}

//Functions --------------------------------------------------------------------------------------
function afterEmailLoaded() {
  chrome.runtime.sendMessage(
    {
      target: "emails",
      action: "getTemplates",
    },
    (res) => {
      templates = res;
      //console.log(`message: ${JSON.stringify(res)}`)
    }
  );

  document
    .querySelector(".Profile-module--email--1WtUw a")
    .addEventListener("click", OpenModal);
  //When the user clicks anywhere outside of the modal, close it
  //window.addEventListener('click', CloseModal);
}

function OpenModal(e) {
  if (document.querySelector("#emailModal") != null) {
    e.preventDefault(); //Prevent traditional redirection to email.
    var modal = document.getElementById("emailModal");
    modal.style.display = "block";
  }
}

function CloseModal(){
  if (document.querySelector("#emailModal") != null) {
    var modal = document.getElementById("emailModal");
    modal.style.display = "none";
  }
}

function SaveAndClose(note) {
  if (window.confirm("Would you like to add an automated Note?")) {
    AddEmailNote(note);
  }
  CloseModal();
  location.reload();
}

function SendBlankEmail() {
  window.location.href = GetEmailLink();
  CloseModal();
}

function SendTemplateEmail() {
  var subjectKey;
  var emailKey;
  var note;
  var emailType = this.id;
  switch (emailType) {
    case "eml_outreach":
      subjectKey = outreachSubjectKey;
      emailKey = outreachEmailKey;
      note = noteText.replace("[emailtype]", "outreach");
      break;
    case "eml_referral":
      subjectKey = referralSubjectKey;
      emailKey = referralEmailKey;
      note = alternativeNoteText.replace("[emailtype]", "referral");
      break;
    case "eml_interview":
      subjectKey = interviewSubjectKey;
      emailKey = interviewEmailKey;
      note = noteText.replace("[emailtype]", "interview request");
      break;
    case "eml_rejection":
      subjectKey = rejectionSubjectKey;
      emailKey = rejectionEmailKey;
      note = alternativeNoteText.replace("[emailtype]", "Rejection");
      break;
    case "eml_onhold":
      subjectKey = onHoldSubjectKey;
      emailKey = onHoldEmailKey;
      note = alternativeNoteText.replace("[emailtype]", "Role on hold");
      break;
    case "eml_acceptance":
      subjectKey = acceptanceSubjectKey;
      emailKey = acceptanceEmailKey;
      note = alternativeNoteText.replace("[emailtype]", "Acceptance");
      break;
    case "eml_shortlist":
      subjectKey = shortlistSubjectKey;
      emailKey = shortlistEmailKey;
      note = alternativeNoteText.replace("[emailtype]", "Shortlisted for role");
      break;
    case "eml_update":
      subjectKey = updateSubjectKey;
      emailKey = updateEmailKey;
      note = alternativeNoteText.replace("[emailtype]", "Role update");
      break;
  }

  var subject = GetEmailSubject(subjectKey);
  var content = GetEmailBody(emailKey);
  CopyRichText(content); //Copy Email Template to Clipboard
  //AddEmailNote(note);
  window.location.href =
    GetEmailLink() + "?subject=" + subject + "&body=" + pasteContentMessage;
  SaveAndClose(note);
}

//Email Template Getters--------------------------------------------------------------------------
function GetEmailBody(emailkey) {
  var emailBody = templates[emailkey] ?? "";
  if (emailBody) {
    emailBody = emailBody.replace("[candidate]", GetCandidateName());
    emailBody = emailBody.replace("[calendlyLink]", GetCalendlyLink());
    emailBody = emailBody.replace("[myCalendly]", GetMyCalendlyLink());
    emailBody = emailBody.replace("[interviewer]", GetInterviewerName());
    emailBody = emailBody.replace("[referral]", GetReferralName());
    emailBody = emailBody.replace("[role]", GetRoleName());
    emailBody = emailBody.replace("[techs]", GetTechList());
    emailBody = emailBody.replace("[faq]", GetFaq());
    emailBody = emailBody.replace(/\n/g, "<br />"); //add breaks where new lines are
  }
  return emailBody;
}

function GetCalendlyLink() {
  var link = document.getElementById("calendlyLink").value ?? "";
  var calendly = `<a href="${link}">Calendly link</a>`;
  return calendly;
}

function GetInterviewerName() {
  return document.getElementById("interviewer").value ?? "";
}

function GetReferralName() {
  return document.getElementById("referralName").value ?? "";
}

function GetRoleName() {
  return document.getElementById("role-name").value ?? "";
}

function GetTechList() {
  return document.getElementById("techList").value ?? "";
}

function GetEmailSubject(subjectKey) {
  var emailSubject = templates[subjectKey] ?? "";
  return emailSubject;
}

function GetFaq() {
  var link = templates["faq"] ?? "";
  var faq = `<a href="${link}">FAQ</a>`;
  return faq;
}

function GetMyCalendlyLink() {
  var link = templates["myCalendly"] ?? "";
  var myCalendly = `<a href="${link}">my Calendly</a>`;
  return myCalendly;
}

function GetCandidateName() {
  return document.querySelector("h2").textContent.split(/ /)[0];
}

function GetEmailLink() {
  return document.querySelector(".Profile-module--email--1WtUw a").href;
}

function GetProfileId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");
  return id;
}

//Copy HTML to Clipboard
function CopyRichText(text) {
  const listener = function (ev) {
    ev.preventDefault();
    ev.clipboardData.setData("text/html", text);
    ev.clipboardData.setData("text/plain", text);
  };
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
}

function AddEmailNote(noteContent) {
  if (noteContent.length > 0) {
    //document.getElementById("notes").nextSibling.querySelector('.ant-btn').click(); //click on create note
    var tagList;

    chrome.runtime.sendMessage(
      {
        target: "emails",
        action: "postNote",
        note: noteContent,
        profileId: GetProfileId(),
        tags: tagList,
      },
      (res) => {
        console.log(`message: ${JSON.stringify(res)}`);
      }
    );
  }
}
