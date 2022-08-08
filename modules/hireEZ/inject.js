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
      askXP(vanityName);
    }
  }, 2000);
};

function findOnXP2(url, element) {
    var linkedinElems = url.split('/');
    const vanityName = linkedinElems[linkedinElems.length - 1];
    askXP2(vanityName, element);
};

function findOnXP() {
  setTimeout(function () {
    var linkedin = document.querySelector('a[title=linkedin]');
    if (linkedin != null) {
      var linkedinElems = linkedin.href.split('/');
      const vanityName = linkedinElems[linkedinElems.length - 1];
      askXP(vanityName);
    }
  }, 2000);
};

const askXP = (linkedinUrl) =>
  chrome.runtime.sendMessage({
      target: 'hireez',
      action: 'getUserByLI',
      params: linkedinUrl,
    },
    (res) => {
      const notificationDiv = document.createElement('div');
      notificationDiv.id = 'xpNotification';
      notificationDiv.classList.add("hireEZlink")
      var notificationString = '<table class="xp-profiles">';
      notificationString += !!res.length ?
        res
        .map(
          (p) => `<tr><td>
                        <a href="https://xp-cavalry.x-team.com/profile/?id=${p.id}">XP Profile: ${p.fullName}: ${p.email}</a>
                  </td></tr>`
        )
        :'<tr><td>No hits in XP</td></tr>';
        notificationString += '</table>';
        notificationString = notificationString.replace(',', '');
        notificationDiv.innerHTML = notificationString;
      const mainElement = document.querySelector('.candidate-profile--basic').parentElement;
      mainElement.insertBefore(notificationDiv, mainElement.firstChild);
    }
  );

const askXP2 = (linkedinUrl, element) =>
  chrome.runtime.sendMessage({
      target: 'hireez',
      action: 'getUserByLI',
      params: linkedinUrl,
    },
    (res) => {
      var notificationDiv = document.createElement('div');
      notificationDiv.id = 'xpNotification';
      notificationDiv.classList.add("hireEZlink")
      var notificationString = '<table class="xp-profiles">';
      notificationString += !!res.length ?
        res
        .map(
          (p) => `<tr><td>
                        <a href="https://xp-cavalry.x-team.com/profile/?id=${p.id}">XP Profile: ${p.fullName}: ${p.email}</a>
                  </td></tr>`
        )
        :'<tr><td>No hits in XP</td></tr>';
      notificationString += '</table>';
      notificationString = notificationString.replace(',', '');
      notificationDiv.innerHTML = notificationString;
      const mainElement = element.parentElement;
      mainElement.insertBefore(notificationDiv, mainElement.firstChild);
    }
  );
