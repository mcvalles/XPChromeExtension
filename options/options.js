//Constants  -----------------------------------------------------------------
var save = '';
const XPLogin = {
  username: null,
  password: null,
};
chrome.storage.sync.get(['save'], (res) => {
  save = res ?? '';
  console.log(save);

  if (save.save.spreadsheet)
    document.getElementById('spreadsheet').value = save.save.spreadsheet;
});

chrome.storage.sync.get('XPLogin', (res) => {
  console.log(`XCE :: XP Login: ${JSON.stringify(res || {}, 0, 2)}`);

  if (res.XPLogin.username)
    document.getElementById('xp_user').value = res.XPLogin.username;
  if (res.XPLogin.password)
    document.getElementById('xp_password').value = res.XPLogin.password;
  document.getElementById('xp_logged_in').checked = !!res.XPLogin.token;
  document.getElementById('xp_logged_in').setAttribute('disabled', true);
});

//On Page Load Add Event Listeners  ------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  //Main Tab Menu OnClick
  var mainTabs = document.querySelectorAll('#tab_main .w3-button');
  for (var i = 0; i < mainTabs.length; i++) {
    mainTabs[i].addEventListener('click', openMainTab);
  }

  //Email Tab Menu OnClick
  var emailTabs = document.querySelectorAll('#tab_emails .w3-button');
  for (var i = 0; i < emailTabs.length; i++) {
    emailTabs[i].addEventListener('click', openEmailTemplateTab);
  }

  //Email Subject OnChange
  var subjects = document.getElementsByName('subject');
  for (var i = 0; i < subjects.length; i++) {
    subjects[i].addEventListener('change', saveSubject);
  }

  //Email Body OnChange
  var emailTemplates = document.getElementsByName('emailBody');
  for (var i = 0; i < emailTemplates.length; i++) {
    emailTemplates[i].addEventListener('change', saveEmailTemplate);
  }

  //Note Body OnChange
  var noteTemplates = document.getElementsByName('noteBody');
  //TODO: Leaving for statement in case additional note templates are added in the future
  for (var i = 0; i < noteTemplates.length; i++) {
    noteTemplates[i].addEventListener('change', saveNoteTemplate);
  }

  //Glossary Toggle
  document
    .getElementById('collapsible')
    .addEventListener('click', displayGlossary);

  //Calendly link OnChange
  document
    .getElementById('my_calendly')
    .addEventListener('change', saveCalendly);

  //XP Login OnChange
  document.getElementById('xp_user').addEventListener('change', saveXPUser);
  document
    .getElementById('xp_password')
    .addEventListener('change', saveXPPassword);

  //FAQ link OnChange
  document.getElementById('faq').addEventListener('change', saveFaq);

  //Spreadsheet link OnChange
  document
    .getElementById('spreadsheet')
    .addEventListener('change', saveSpreadsheet);

  //Select First Tab by Default
  mainTabs[0].click();
  emailTabs[0].click();
});

//XP User OnChange  ----------------------------------------------------
function saveXPUser() {
  console.log(this.value);
  XPLogin.username = this.value;

  chrome.storage.sync.set({ XPLogin }, () => {
    console.log(`XP Username set to ${XPLogin.username}`);
  });
}

//XP Password OnChange  ----------------------------------------------------
function saveXPPassword() {
  XPLogin.password = this.value;

  chrome.storage.sync.set({ XPLogin }, () => {
    console.log(`XP Password set to ${XPLogin.password}`);
  });
}

//Calendly link OnChange  ----------------------------------------------------
function saveCalendly() {
  save['myCalendly'] = this.value;

  chrome.storage.sync.set({ save }, () => {
    console.log(`Calendly link is set to ${save['myCalendly']}`);
  });
}

//FAQ link OnChange  ---------------------------------------------------------
function saveFaq() {
  save['faq'] = this.value;

  chrome.storage.sync.set({ save }, () => {
    console.log(`FAQ link is set to ${save['faq']}`);
  });
}

//Spreadsheet link OnChange  ---------------------------------------------------------
function saveSpreadsheet() {
  save['spreadsheet'] = this.value;

  chrome.storage.sync.set({ save }, () => {
    console.log(`Spreadsheet link is set to ${save['spreadsheet']}`);
  });
}

//Save Email Subject onChange  -----------------------------------------------
function saveSubject() {
  var subject = this.id;
  save[subject] = document.getElementById(subject).value;

  chrome.storage.sync.set({ save }, () => {
    console.log(`${subject} is set to ${save[subject]}`);
  });
}

//Save Email Body onChange  --------------------------------------------------
function saveEmailTemplate() {
  var emailType = this.id;
  var parser = new DOMParser();
  var text = document.getElementById(emailType).value;
  var emailBody = parser.parseFromString(text, 'text/html');
  save[emailType] = emailBody.body.outerHTML;

  chrome.storage.sync.set({ save }, () => {
    console.log(`${emailType} is set to ${save[emailType]}`);
  });
}

//Save Note onChange  --------------------------------------------------
function saveNoteTemplate() {
  var noteType = this.id;
  var parser = new DOMParser();
  var text = document.getElementById(noteType).value;
  var noteBody = parser.parseFromString(text, 'text/html');
  save[noteType] = noteBody.body.innerHTML;

  chrome.storage.sync.set({ save }, () => {
    console.log(`${noteType} is set to ${save[noteType]}`);
  });
}

//Toggle Glossary  -----------------------------------------------------------
function displayGlossary() {
  this.classList.toggle('active');
  var content = this.nextElementSibling;
  if (content.style.display === 'block') {
    content.style.display = 'none';
  } else {
    content.style.display = 'block';
  }
}

//Tab Email Menu -------------------------------------------------------------------
function openEmailTemplateTab() {
  var i;
  var emailType = this.id;
  var tabContent = document.getElementsByClassName('email');
  var tabMenu = document.querySelectorAll('#tab_emails .w3-bar-item');
  var parser = new DOMParser();
  //Clean Selected Tab
  for (i = 0; i < tabMenu.length; i++) {
    tabMenu[i].classList.remove('selected');
  }
  //Clean Displayed Tab Content
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = 'none';
  }
  document.getElementById('tab_' + emailType).style.display = 'block';
  document.getElementById(emailType).classList.add('selected');
  var subjectVariableName = 'eml_' + emailType + '_subj';
  var emailVariableName = 'tmp_' + emailType;
  chrome.storage.sync.get(['save'], (res) => {
    document.getElementById(subjectVariableName).value =
      res.save[subjectVariableName] ?? '';
    document.getElementById(emailVariableName).value =
      parser.parseFromString(res.save[emailVariableName], 'text/html').body
        .innerText ?? '';
    document.getElementById('my_calendly').value = res.save['myCalendly'] ?? '';
    document.getElementById('faq').value = res.save['faq'] ?? '';
  });
}

//Tab Notes Menu -------------------------------------------------------------------
function openMainTab() {
  var tab = this.id;
  var parser = new DOMParser();
  var clickedTab, unclickedTab, contentDisplay, contentHide, noteTemplateName;

  if (tab == 'emailTemplates') {
    clickedTab = document.getElementById('emailTemplates');
    unclickedTab = document.getElementById('noteTemplates');
    contentDisplay = document.getElementById('emailContent');
    contentHide = document.getElementById('noteContent');
  } else {
    clickedTab = document.getElementById('noteTemplates');
    unclickedTab = document.getElementById('emailTemplates');
    contentDisplay = document.getElementById('noteContent');
    contentHide = document.getElementById('emailContent');
    noteTemplateName = 'note_body';
    chrome.storage.sync.get(['save'], (res) => {
      document.getElementById(noteTemplateName).value =
        parser.parseFromString(res.save[noteTemplateName], 'text/html').body
          .innerText ?? '';
    });
  }
  contentDisplay.style.display = '';
  clickedTab.classList.add('selected');
  contentHide.style.display = 'none';
  unclickedTab.classList.remove('selected');
}
//End Tab Menu  -------------------------------------------------------------
