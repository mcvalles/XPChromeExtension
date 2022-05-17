console.log('XCE :: Injected');

let name = '';

const linkedinObserver = new MutationObserver((mutation) => {
    if (
        document.querySelector('h1') != null &&
        name != document.querySelector('h1').innerText
    ) {
        name = document.querySelector('h1').innerText;
        //console.log(`XCE :: ${document.querySelector('h1').innerText}`);
        //var linkedinElems = document.location.href.split('/');
        //const vanityName = linkedinElems[linkedinElems.length - 2];
        askXP(name);
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
            const notificationDiv = document.createElement('div');
            notificationDiv.id = 'xpNotification';
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

            const mainElement = document.getElementById('main');
            mainElement.insertBefore(notificationDiv, mainElement.firstChild);
        }
    );

function getLinkedinUsername(url) {}