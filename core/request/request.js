const _post = origin => authority => contentType => authorization => endpoint => data => cb => {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            cb(this.responseText);
        }
    });

    xhr.open("POST", endpoint);
    xhr.setRequestHeader("origin", origin);
    xhr.setRequestHeader("authority", authority);
    xhr.setRequestHeader("authorization", authorization);
    xhr.setRequestHeader("content-type", contentType);

    xhr.setRequestHeader("accept", "application/json, text/plain, */*");
    xhr.setRequestHeader("sec-ch-ua", "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"");
    xhr.setRequestHeader("dnt", "1");
    xhr.setRequestHeader("sec-ch-ua-mobile", "?0");
    xhr.setRequestHeader("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36");
    xhr.setRequestHeader("sec-fetch-site", "same-site");
    xhr.setRequestHeader("sec-fetch-mode", "cors");
    xhr.setRequestHeader("sec-fetch-dest", "empty");
    xhr.setRequestHeader("referer", "https://xp-cavalry.x-team.com/");
    xhr.setRequestHeader("accept-language", "en-US,en;q=0.9,de;q=0.8,sl-SI;q=0.7,sl;q=0.6,fr;q=0.5,es-ES;q=0.4,es;q=0.3,en-XA;q=0.2");

    xhr.send(data);
}

const _xp_post = _post("https://xp-cavalry.x-team.com")
    ("jobs-api.x-team.com")
    ("application/json;charset=UTF-8")

const _xp_post_notes = authorization => {
    if (!authorization) {
        console.error('No authorization token')
        throw "No authorization token"
    }

    return (data, cb) => _xp_post
        ("https://jobs-api.x-team.com/notes")
        (data)
        (cb)
}

const _xp_get_notes = () => { }
const _xp_put_notes = () => { }
const _xp_delete_notes = () => { }


function Request(Core) {
    console.log('Loading Request')

    return ({
        module: 'Request',
        xp: authorization => ({
            notes: {
                post: _xp_post_notes(authorization),
                get: _xp_get_notes(authorization),
                update: _xp_put_notes(authorization),
                delete: _xp_delete_notes(authorization),
            }
        })
    })
}

export default Request
