function getTemplates(Core) {
  return function (message, sender, sendResponse) {
    chrome.storage.sync.get(["save"], (res) => {
      // console.log(`retrieved: ${JSON.stringify(res, 0, 2)}`);
      sendResponse(res.save);
    });

    return true
  };
}

function postNote(Core) {
  return function (message, sender, sendResponse) {
    //console.log("Posting Note");
    Core.Notes.post()(
      JSON.stringify({
        body: message.note,
        tags: message.tags,
        profile: message.profileId,
      })
    )(sendResponse);
  };
}

// function GetNote(profileID){
//    Core.Notes.get
//    (`/?profile=${profileID}+&populate[]=tags`)
//    ()
//    (console.log)
// }

export default (Core) => ({
  module: "Emails",
  messageHandlers: {
    getTemplates,
    postNote,
  },
});
