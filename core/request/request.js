const request = method => path => authorization => endpoint => data => cb => {
    const opts = {
        method: method.toUpperCase(),
        headers: {
            'Content-Type': 'application/json'
        },
        body: typeof data == 'string'
        ? data
        : JSON.stringify(data),
    }
    
    return chrome.storage.sync.get('XPLogin')
    .then(( loginInfo ) => {
        const token = loginInfo?.XPLogin?.token
        const bearer = `Bearer ${token}`

        if (authorization) opts.headers.authorization = bearer

        fetch(path + (endpoint ?? ''), opts)
        .then(r => r.json())
        .then(cb)
        .catch(e => console.error(e))
    })
}

function Request(Core) {
  //console.log('Loading Request')
  return {
    module: "Request",
    request,
    get: request("get"),
    post: request("post"),
  };
}

export default Request;
