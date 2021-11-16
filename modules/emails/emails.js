const messageResponses = {
    getTemplates,
    postNote,
  };
  
  function getTemplates(Core) {
    return function (message, cb) {
      chrome.storage.sync.get(["save"], (res) => {
        //console.log(`retrieved: ${JSON.stringify(res, 0, 2)}`);
        cb(res.save);
      });
    };
  }
  
  function postNote(Core) {
    return function (message, cb) {
      //console.log("Posting Note");
      Core.Notes.post(`Bearer ${message.token}`)()(
        JSON.stringify({
          body: message.note,
          tags: message.tags,
          profile: message.profileId,
        })
      )(cb);
    };
  }
  
  // function GetNote(profileID){
  //    Core.Notes.get
  //    (`Bearer ${message.token}`)
  //    (`/?profile=${profileID}+&populate[]=tags`)
  //    ()
  //    (console.log)
  // }
  
  function handleMessage(Core) {
    return function (message, sender, sendResponse) {
      //console.log(`got message: ${JSON.stringify(message, 0, 2)}`);
      messageResponses[message.message](Core)(message, sendResponse);
      return true;
    };
  }
  
  export default (Core) => ({
    module: "Emails",
    listeners: {
      handleMessage: handleMessage(Core),
    },
  });
  