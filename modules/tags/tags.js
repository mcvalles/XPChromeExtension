const filter = ['downvote', 'do-not-hire'];

//On Document Ready
const tagObserver = new MutationObserver((mutations) => {
  SetRedTags();
});

var currentPage = document.querySelector('body');
tagObserver.observe(currentPage, {
  subtree: true,
  childlist: true,
  attributes: true,
});

function SetRedTags() {
  var tags = document.querySelectorAll('.ant-tag-green');
  for (i = 0; i < tags.length; i++) {
    if (filter.indexOf(tags[i].innerText) > -1) {
      tags[i].classList.add('ant-tag-red');
      tags[i].classList.remove('ant-tag-green');
    }
  }
}
