({
	navigatePrevNext : function(cmp, isNext) {
    var steps = cmp.get("v.steps");
    var index = cmp.get("v.index");
    var i = isNext ? 1 : -1;
    if (index > -1 && steps[index+i]) {
      this.navigateIndex(cmp, index+i);
    }
	},
  navigateIndex: function(cmp, index) {
    var steps = cmp.get("v.steps");
    var showing = steps[index];
    var type = showing.type;
    var options = {};
    if (showing && showing.bindings && showing.bindings.forEach) {
      showing.bindings.forEach(function(bind) {
        options[bind.to] = cmp.getReference("v." + bind.from);
      });
    }
    this.createComponent(type, options).then(function(step) {
      cmp.set("v.showing", step);
      cmp.set("v.index", index);
    });
  }
})