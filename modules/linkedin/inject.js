console.log('XCE :: Injected')

const linkedinObserver = new MutationObserver(mutation => {
    if (document.querySelector('h1') != null) {
        console.log(`XCE :: ${document.querySelector('h1').innerText}`)
        askXP(document.querySelector('h1').innerText)
        linkedinObserver.disconnect();
    }
})
linkedinObserver.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true
})

const askXP = user => chrome.runtime.sendMessage({
    target: 'linkedin',
    action: 'getUserByLI',
    params: user,
    authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjQ3NSwiaWF0IjoxNjM0NzcwMDQzLCJleHAiOjE2MzczNjIwNDN9.cEfqUw1rq45m_z3AD4H4neqrJlYY3DY-ZDfVhYJxPUg'
}, (res) => {
    console.log(res)

    const notificationDiv = document.createElement('div')
    notificationDiv.id = 'xpNotification'
    notificationDiv.innerHTML = '<table><tr>'
    notificationDiv.innerHTML += !!res.profiles.length
        ? res.profiles.map(p => `<td>
    <a href="https://xp-cavalry.x-team.com/profile/?id=${p.id}">XP Profile: ${p.fullName}: ${p.email}</a>
    </p>`).join('</tr><tr>')
        : '<td>No hits in XP</td>'
    notificationDiv.innerHTML += '</tr></table>'

    const mainElement = document.getElementById('main')
    mainElement.insertBefore(notificationDiv, mainElement.firstChild)
})