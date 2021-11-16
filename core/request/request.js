const request =
  (method) => (path) => (authorization) => (endpoint) => (data) => (cb) => {
    //console.log({
    //    method, path, authorization,endpoint,data,cb
    //})

    const opts = {
      method: method.toUpperCase(),
      headers: {
        authorization,
        "Content-Type": "application/json",
      },
      body: data,
    };

    return fetch(path + endpoint, opts)
      .then((r) => r.json())
      .then(cb)
      .catch((e) => console.error(e));
  };

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
