var preX,min = 5,$active;

$(document).on("mousedown", ".switch >.slider", function() {
   if (parseInt($(this).parent().attr("enabled")) == 1 && true) {
      if (form.getCheckbox($(this).parent().attr("form-name")) > 0) {
         $(this).parent().attr("value", 0);
         $(this).parent().addClass("switch").removeClass("checked").removeClass("null").addClass("unchecked");
      } else if(form.getCheckbox($(this).parent().attr("form-name")) == 0) {
         if(form.getTristateCheckbox($(this).parent().attr("form-name"))) {
            $(this).parent().attr("value", -1);
            $(this).parent().addClass("switch").removeClass("unchecked").removeClass("checked").addClass("null");
         } else {
            $(this).parent().attr("value", 1);
            $(this).parent().addClass("switch").removeClass("unchecked").removeClass("null").addClass("checked");
         }
      } else {
         $(this).parent().attr("value", 1);
         $(this).parent().addClass("switch").removeClass("unchecked").removeClass("null").addClass("checked");
      }
   }
});

/*Still have the docs to write and it isn't finished - just the design and fetching data on the front end v*/

$(".button").click(function(){/*For examples*/
   switch($(this).find("span").attr("id")) {
      case "checkbox1value":
         $("#checkbox1value").text(form.getCheckbox("checkbox1"));
         break;
      case "checkbox4enabledvalue":
         $("#checkbox4enabledvalue").text(form.getEnableCheckbox("checkbox4"));
         break;
      case "checkbox2valuesettrue":
         $("#checkbox2valuesettrue").text(form.setCheckbox("checkbox2", 1));
         break;
      case "checkbox2valuesetfalse":
         $("#checkbox2valuesetfalse").text(form.setCheckbox("checkbox2", false));
         break;
   }
});

var form = function() {};
form.getCheckbox = function(name) {
   if ($(".switch[form-name=" + name + "]").length > 0) {
      return parseInt($(".switch[form-name=" + name + "]").attr("value"));
   } else {
      return null;
   }
};
form.getEnableCheckbox = function(name) {
   if ($(".switch[form-name=" + name + "]").length > 0) {
      return parseInt($(".switch[form-name=" + name + "]").attr("enabled")) == 1 ? true : false;
   } else {
      return null;
   }
};
form.setCheckbox = function(name, val) {
   if ($(".switch[form-name=" + name + "]").length > 0) {
      var val2 = isNaN(val) ? val.toLowerCase() == "true" ? 1 : val.toLowerCase() == "false" ? 0 : -1 : val == null ? -1 : val ? 1 : !val ? 0 : val == null ? -1 : val;
      switch (val2) {
         case 0:
            $(".switch[form-name=" + name + "]").addClass("switch").removeClass("checked").removeClass("null").addClass("unchecked");
            break;
         case 1:
            $(".switch[form-name=" + name + "]").addClass("switch").removeClass("unchecked").removeClass("null").addClass("checked");
            break;
         case -1:
            $(".switch[form-name=" + name + "]").addClass("switch").removeClass("unchecked").removeClass("checked").addClass("null");
            break;
      }
      return true;
   } else {
      return false;
   }
};
form.setEnableCheckbox = function(name, val) {
   if ($(".switch[form-name=" + name + "]").length > 0) {
      return parseInt($(".switch[form-name=" + name + "]").attr("enabled", isNaN(val) ? (val.toLowerCase() == "true" ? 1 : (val.toLowerCase() == "false" ? 0 : -1)) : parseInt(val)));
      switch (isNaN(val) ? (val.toLowerCase() == "true" ? 1 : (val.toLowerCase() == "false" ? 0 : 2)) : parseInt(val)) {
         case 0:
            $(this).parent().addClass("disabled");
            break;
         case 1:
            $(this).parent().removeClass("disabled");
            break;
      }
   } else {
      return null;
   }
};
form.getTristateCheckbox = function(name) {
   if ($(".switch[form-name=" + name + "]").length > 0) {
      return $(".switch[form-name=" + name + "]").attr("form-checkbox-tri") == "true" ? true : false;
   } else {
      return null;
   }
};