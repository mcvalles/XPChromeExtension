let initialLength = 0;

const hireEZObserver = new MutationObserver((mutation) => {
  if (document.querySelector('.talent-pool-list-v4') != null) {
    afterAllCandidatesLoaded();
  }

  if (document.querySelector('.infinite-scroll-component') != null) {
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
      askXP({ 
        linkedinName: vanityName,
        linkedinUrl: linkedin
      });
    }
  }, 2000);
};

function findOnXP2(url, element) {
    openUserData(element);

    var linkedinElems = url.split('/');
    const vanityName = linkedinElems[linkedinElems.length - 1];
    askXP({ 
      linkedinName: vanityName,
      linkedinUrl: url
    }, element);
};

function findOnXP() {
  setTimeout(function () {
    var linkedin = document.querySelector('a[title=linkedin]');
    if (linkedin != null) {
      var linkedinElems = linkedin.href.split('/');
      const vanityName = linkedinElems[linkedinElems.length - 1];
      askXP({ linkedinName: vanityName });
    }
  }, 2000);
};

const askXP = ({ linkedinName, linkedinUrl }, element) =>
  chrome.runtime.sendMessage({
      target: 'hireez',
      action: 'getUserByLI',
      params: linkedinName,
    },
    (res) => {
      const createXPId = `create-xp-${linkedinName.replace(/[^a-zA-Z0-9 ]/g, '')}`;
      
      const notificationDiv = document.createElement('div');
      notificationDiv.id = 'xpNotification';
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
            if(element) {
              const { name, email } = getUserData(element);

              if(name && email) {
                const divCreateXp = document.querySelector(`#span-${createXPId}`);
                divCreateXp.innerText = '';
                divCreateXp.classList.add('loader');
          
                const { XPUserId } = await chrome.storage.sync.get('XPUserId');
                    
                const newUserResponse = await chrome.runtime.sendMessage({
                  target: 'hireez',
                  action: 'createNewProfile',
                  body: {
                    fullName: name,
                    email,
                    linkedinAccount: linkedinUrl,
                    created_origin_user: XPUserId,
                  }
                })
          
                if(newUserResponse.id) {
                  const tdCreateXp = document.querySelector(`#no-hits-${createXPId}`);
                  tdCreateXp.innerHTML = xpCavalryUrl(newUserResponse)
                } else {
                  divCreateXp.classList.remove('loader');
                  divCreateXp.innerText = 'Create XP';
                  alert(`There was an error on trying to add ${name} at xp-calvary, please try again.`)
                }
              }
            }
          });
        }
    }
  );

  function openUserData(userElement) {
    const emailButtonSpan = userElement.querySelector('span[role=button]');
  
    if(emailButtonSpan) {
      emailButtonSpan.click();
    }
  }
  
  function getUserData(userElement) {
    const name = userElement.querySelector('.mb-1').innerText;  
  
    const contactDetails = userElement.querySelector('.contact-details-horizontal');
    const emailDiv = contactDetails.querySelector('.flexible-rigid-baseline');
  
    let email;
  
    if(emailDiv) {
      email = emailDiv.title
    }
  
    return {
      name, 
      email,
    }
  }

  function xpCavalryUrl(user) {
    return `<a href="https://xp-cavalry-dev.x-team.com/profile/?id=${user.id}">
      XP Profile: ${user.fullName}: ${user.email}</a>`
  }



