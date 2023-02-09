console.log('XCE :: Injected');

const linkedinObserver = new MutationObserver((mutation) => {
    if (
        (document.querySelector('h1:not(.check)') != null ||
        url != document.location.href) &&
        document.location.href.indexOf('https://www.linkedin.com/in') != -1 //only consider profile pages        
    ) {   
        if (document.querySelector('h1') != null){
            url = document.location.href;
            document.querySelector('h1').classList.add('check');       
            var linkedinElems = document.location.href.split('/');
            const vanityName = linkedinElems[linkedinElems.length - 2];
            askXP(vanityName);
        }
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
            var notificationDiv = document.createElement('div');
            notificationDiv.id = 'xpNotification';
            var notificationString = '<table>';
            notificationString += !!res.length ?
                res
                .map(
                    (p) => `<tr><td>
                                <a href=" https://xp-cavalry.x-team.com/profile/?id=${p.id}">XP Profile: ${p.fullName}: ${p.email}</a>
                            </td></tr>`
                )
                :'<tr><td>No hits in XP</td></tr>';
            notificationString += '</table>';
            notificationString = notificationString.replace(',', '');
            if (document.querySelector('#xpNotification') != null){
                document.querySelector('#xpNotification').remove();
            }
            notificationDiv.innerHTML = notificationString;
            const mainElement = document.getElementById('main');
            mainElement.insertBefore(notificationDiv, mainElement.firstChild);
        }
    );

function getLinkedinUsername(url) {}
