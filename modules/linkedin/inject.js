console.log('XCE :: Injected');

const linkedinObserver = new MutationObserver((mutation) => {
    if (
        document.querySelector('h1') != null &&
        name != document.querySelector('h1').innerText &&
        document.location.href.indexOf('https://www.linkedin.com/in') != -1 //only consider profile pages
    ) {
        name = document.querySelector('h1').innerText;
        console.log(`XCE :: ${document.querySelector('h1').innerText}`);
        var linkedinElems = document.location.href.split('/');
        const vanityName = linkedinElems[linkedinElems.length - 2];
        askXP(vanityName);
    }
});

linkedinObserver.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
});

const askXP = (linkedinUrl) =>
    chrome.runtime.sendMessage({
            target: 'linkedin',
            action: 'getUserByLI',
            params: linkedinUrl,
        },
        (res) => {
            console.log(res);
            var notificationDiv = document.createElement('div');
            notificationDiv.id = 'xpNotification';
            var notificationString = '<table>';
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
            const mainElement = document.getElementById('main');
            mainElement.insertBefore(notificationDiv, mainElement.firstChild);
        }
    );

function getLinkedinUsername(url) {}