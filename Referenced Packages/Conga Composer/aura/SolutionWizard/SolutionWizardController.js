({
	init : function(cmp, e, helper) {
    helper.navigateIndex(cmp, 0);
	},
  prev: function(cmp, e, helper) {
    helper.navigatePrevNext(cmp, false);
  },
  next: function(cmp, e, helper) {
    helper.navigatePrevNext(cmp, true);
  },
  jump: function(cmp, e, helper) {
    var target = e.target;
    var index = target.getAttribute("data-step");
    if (index && index.length > 0) {
      helper.navigateIndex(cmp, parseInt(index));
    }
  }
})