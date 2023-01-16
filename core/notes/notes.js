const path = "https://jobs-api-dev.x-team.com/notes";

const _xp_post_notes = (Core) => (_) => (data) => (cb) =>
  Core.Request.post(path)(true)("")(data)(cb);

const _xp_get_notes = (Core) => (endpoint) => (_) => (cb) =>
  Core.Request.get(path)(true)(endpoint)()(cb);

const Notes = (Core) => {
  //console.log("Loading Notes");

  return {
    module: "Notes",
    post: _xp_post_notes(Core),
    get: _xp_get_notes(Core),
  };
};

export default Notes;
