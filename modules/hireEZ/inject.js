let initialLength = 0;
const buttonAddText = 'Add on Sheet';

const hireEZObserver = new MutationObserver((mutation) => {
  if (document.querySelector('.talent-pool-list-v4') != null) {
    afterAllCandidatesLoaded();
  }

  if (document.querySelector('.infinite-scroll-component') != null 
      || document.querySelector('#candidate-profile-container')) {
    //var candidates = document.querySelectorAll('a[title=linkedin]:not(.check)');
    //initialLength = candidates.length; //this is my initial li length items
    afterSourceSearchLoaded();
  }
});

hireEZObserver.observe(document.body, {
  attributes: true,
  childList: true,
  subtree: true,
});

function afterAllCandidatesLoaded() {
  var candidates = document.querySelectorAll('.text-blue-500:not(.check)')
  for (var i = 0; i < candidates.length; i++) {
    candidates[i].classList.add('check');
    candidates[i].addEventListener("click", findOnXP);
  }
}

function afterSourceSearchLoaded() {
  var candidates = document.querySelectorAll('a[title=linkedin]:not(.check)');
  for (var i = 0; i < candidates.length; i++) {
    candidates[i].addEventListener("click", findOnXP3(candidates[i].href));
    findOnXP2(candidates[i].href, candidates[i].closest('.candidatecard--info'));
    candidates[i].classList.add('check');
  }
}

function findOnXP3(linkedin) {
  setTimeout(function () {
    if (linkedin != null) {
      var linkedinElems = linkedin.split('/');
      
      const vanityName = linkedinElems[linkedinElems.length - 1];
      askSpreadsheet({ 
        linkedinName: vanityName,
        linkedinUrl: linkedin
      });
    }
  }, 2000);
};

function findOnXP2(url, element) {
  if(element) {
    openUserData(element);
    
    var linkedinElems = url.split('/');
    const vanityName = linkedinElems[linkedinElems.length - 1];
    askSpreadsheet({ 
      linkedinName: vanityName,
      linkedinUrl: url
    }, element);
  }
};

function findOnXP() {
  setTimeout(function () {
    var linkedin = document.querySelector('a[title=linkedin]');
    if (linkedin != null) {
      var linkedinElems = linkedin.href.split('/');
      const vanityName = linkedinElems[linkedinElems.length - 1];
      askSpreadsheet({ linkedinName: vanityName });
    }
  }, 2000);
};

const askSpreadsheet = ({ linkedinName, linkedinUrl }, element) =>
    chrome.storage.sync.get('spreadsheetLinkedins',
    ({ spreadsheetLinkedins }) => { 
      const findLinkedinOnSpreadsheet = spreadsheetLinkedins ? spreadsheetLinkedins.find(sheetLinkedin => 
        sheetLinkedin === linkedinUrl) : null

      const isUserProfile = !!document.querySelector('#candidate-profile-container');
      let createXPId = `create-xp-${linkedinName.replace(/[^a-zA-Z0-9 ]/g, '')}`;

      createXPId += isUserProfile ? '-user-profile' : '-sourcing-list';

      if(isUserProfile) {
        const notificationDivs = document.querySelectorAll('div[id*=user-profile]');

        if(notificationDivs.length > 0) {
          notificationDivs.forEach(notification => {
            notification.remove();
          })
        }
      }
      
      const notificationDiv = document.createElement('div');
      notificationDiv.id = `xpNotification-${createXPId}`;
      notificationDiv.classList.add("hireEZlink")
      let notificationString = '<table class="xp-profiles">';
      notificationString += findLinkedinOnSpreadsheet ?
         `<tr><td>Already added on sheet</td></tr>`
        :`<tr><td class="createXP" id="no-hits-${createXPId}">Not on Sheet <span>-</span> <button class="create-xp" id="${createXPId}" type="button">
            <div id="span-${createXPId}">${buttonAddText}</div></button></td></tr>`;
        notificationString += '</table>';
        notificationString = notificationString.replace(',', '');
        notificationDiv.innerHTML = notificationString;
        const mainElement = element ? element.parentElement 
          : document.querySelector('.candidate-profile--basic')?.parentElement;
        
        if(mainElement) {
          mainElement.insertBefore(notificationDiv, mainElement.firstChild);
        }

        if(!findLinkedinOnSpreadsheet) {
          const buttonAddOnXP = document.querySelector(`#${createXPId}`);
          buttonAddOnXP.addEventListener("click", async () => {
            if(element || isUserProfile) {
              const { name, email } = isUserProfile ? 
                getUserDataFromUserProfile() : 
                getUserDataFromSourcingList(element);

              if(name && email) {
                const divCreateXp = document.querySelector(`#span-${createXPId}`);
                divCreateXp.innerText = '';
                divCreateXp.classList.add('loader');
                
                const response = await chrome.runtime.sendMessage({
                  target: 'hireez',
                  action: 'addUserOnSpreadsheet',
                  body: {
                    name,
                    email,
                    linkedin: linkedinUrl
                  }
                })
          
                if(response.success) {
                  const tdCreateXp = document.querySelector(`#no-hits-${createXPId}`);
                  tdCreateXp.innerHTML = 'Already added on sheet'
                } else {
                  divCreateXp.classList.remove('loader');
                  divCreateXp.innerText = buttonAddText;
                }

                alert(response.message)
              }
            }
          });
        }
    }
  );

const askXP = ({ linkedinName, linkedinUrl }, element) =>
  chrome.runtime.sendMessage({
      target: 'hireez',
      action: 'getUserByLI',
      params: linkedinName,
    },
    (res) => {  
      const isUserProfile = !!document.querySelector('#candidate-profile-container');
      let createXPId = `create-xp-${linkedinName.replace(/[^a-zA-Z0-9 ]/g, '')}`;

      createXPId += isUserProfile ? '-user-profile' : '-sourcing-list';

      if(isUserProfile) {
        const notificationDivs = document.querySelectorAll('div[id*=user-profile]');

        if(notificationDivs.length > 0) {
          notificationDivs.forEach(notification => {
            notification.remove();
          })
        }
      }
      
      const notificationDiv = document.createElement('div');
      notificationDiv.id = `xpNotification-${createXPId}`;
      notificationDiv.classList.add("hireEZlink")
      let notificationString = '<table class="xp-profiles">';
      notificationString += !!res.length ?
        res
        .map(
          (p) => `<tr><td>${xpCavalryUrl(p)}</td></tr>`
        )
        :`<tr><td class="createXP" id="no-hits-${createXPId}">No hits in XP <span>-</span> <button class="create-xp" id="${createXPId}" type="button">
            <div id="span-${createXPId}">Create XP</div></button></td></tr>`;
        notificationString += '</table>';
        notificationString = notificationString.replace(',', '');
        notificationDiv.innerHTML = notificationString;
        const mainElement = element ? element.parentElement 
          : document.querySelector('.candidate-profile--basic')?.parentElement;
        
        if(mainElement) {
          mainElement.insertBefore(notificationDiv, mainElement.firstChild);
        }

        if(!res.length) {
          const buttonAddOnXP = document.querySelector(`#${createXPId}`);
          buttonAddOnXP.addEventListener("click", async () => {
            if(element || isUserProfile) {
              const { name, email, github, location, country } = isUserProfile ? 
                getUserDataFromUserProfile() : 
                getUserDataFromSourcingList(element);

              if(name && email) {
                const divCreateXp = document.querySelector(`#span-${createXPId}`);
                divCreateXp.innerText = '';
                divCreateXp.classList.add('loader');
                
                // const { XPUserId } = await chrome.storage.sync.get('XPUserId');

                const newUserResponse = await chrome.runtime.sendMessage({
                  target: 'hireez',
                  action: 'createNewProfile',
                  body: {
                    // fullName: name,
                    // email,
                    // linkedinAccount: linkedinUrl,
                    // created_origin_user: XPUserId,
                    // githubAccount: github,
                    // country,
                    // location,
                  }
                })

                // const newUserResponse = await chrome.runtime.sendMessage({
                //   target: 'hireez',
                //   action: 'addUserOnSpreadsheet',
                //   body: {
                //   }
                // })

                console.log(newUserResponse);
          
                // if(newUserResponse.id) {
                //   const tdCreateXp = document.querySelector(`#no-hits-${createXPId}`);
                //   tdCreateXp.innerHTML = xpCavalryUrl(newUserResponse)
                // } else {
                //   console.log(newUserResponse);
                //   divCreateXp.classList.remove('loader');
                //   divCreateXp.innerText = 'Create XP';
                //   alert(`There was an error on trying to add ${name} at xp-calvary, please try again.`)
                // }
              }
            }
          });
        }
    }
  );

  function openUserData(userElement) {
    // Open email
    const emailButtonSpan = userElement.querySelector('span[role=button]');
  
    if(emailButtonSpan) {
      emailButtonSpan.click();
    }
  }
  
  function getUserDataFromSourcingList(userElement) {
    const name = userElement.querySelector('.mb-1').innerText;  
  
    // get email
    let email;

    const contactDetails = userElement.querySelector('.contact-details-horizontal');
    const emailDiv = contactDetails.querySelector('.flexible-rigid-baseline');
  
    if(emailDiv) {
      email = emailDiv.title
    }

    // Get location
    let location;
    let country

    const userUl = userElement.querySelector('.d-flex, .flex-column, .list-unstyled, .text-gray, .mb-0, .flex-xl-row');

    if(userUl) {
      const locationIl = userUl.querySelectorAll('.body_1b');

      if(locationIl && locationIl[1]) {
        location = locationIl[1].innerText
        country = location.split(',')[2];
      }
    }

    // Get github
    let github;

    const githubLink = userElement.querySelector('a[title=github]');

    if(githubLink) {
      github = githubLink.href;
    }

    // Hireez 
    let hireez;

    const hireezLink = userElement.querySelector('a[title=hireEZ]');

    if(hireezLink) {
      hireez = hireezLink.href;
    }

    return {
      name, 
      email,
      location,
      github,
      hireez,
      country,
    }
  }

  function getUserDataFromUserProfile() {
    const candidateInfoDiv = document.querySelector('.candidate-profile--basic-info');
    const name = candidateInfoDiv.querySelector('.mt-2').innerText;
    
    //Get email
    let email;

    const contactDetails = document.querySelector('.contact-details');
    const emailDiv = contactDetails.querySelector('.flexible-rigid-base');
  
    if(emailDiv) {
      email = emailDiv.title
    }

    // Get location
    let location;
    let country;

    const userUl = document.querySelectorAll('.candidate-profile-basic--current-details');

    if(userUl && userUl[2]) {
      location = userUl[2].innerText
      country = location.split(',')[2];
    }

    // Get github
    let github;

    const githubLink = document.querySelector('a[title=github]');

    if(githubLink) {
      github = githubLink.href;
    }
  
    return {
      name, 
      email,
      github,
      location,
      country,
    }
  }

  function xpCavalryUrl(user) {
    return `<a href="https://xp-cavalry-dev.x-team.com/profile/?id=${user.id}">
      XP Profile: ${user.fullName}: ${user.email}</a>`
  }



