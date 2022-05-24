const hireEZObserver = new MutationObserver((mutation) => {
    if (document.querySelector('.index-module_pagination_container__content__qa4pB') != null) {
        afterCandidatesLoaded();
    }
});

hireEZObserver.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
});

function afterCandidatesLoaded() {
    var candidates = document.querySelectorAll('.text-blue-500')
    for (var i = 0; i < candidates.length; i++) {
        candidates[i].addEventListener("click", findOnXP);
    }
}

function findOnXP() {

    setTimeout(function () {
        var name = document.querySelector('.candidate-profile--basic-info h2')

        if (name != null) {
            //console.log(`XCE :: ${document.querySelector('h1').innerText}`);
            //var linkedinElems = document.location.href.split('/');
            //const vanityName = linkedinElems[linkedinElems.length - 2];
            askXP(name.textContent);
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
            console.log(res);
            const notificationDiv = document.createElement('div');
            notificationDiv.id = 'xpNotification';
            notificationDiv.classList.add("hireEZlink")
            notificationDiv.innerHTML = '<table><tr>';
            notificationDiv.innerHTML += !!res.profiles.length ?
                res.profiles
                .map(
                    (p) => `<td>
                        <a href="https://xp-cavalry.x-team.com/profile/?id=${p.id}">XP Profile: ${p.fullName}: ${p.email}</a>
                      </td>`
                )
                .join('</tr><tr>') :
                '<td>No hits in XP</td>';
            notificationDiv.innerHTML += '</tr></table>';

            const mainElement = document.querySelector('.candidate-profile--basic').parentElement;
            mainElement.insertBefore(notificationDiv, mainElement.firstChild);
        }
    );

function getLinkedinUsername(url) {}