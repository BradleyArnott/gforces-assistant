var bindEvents = function() {

	var userKeyTimeout;
	$('.js-search-modules input').keyup(function(){

		var $this = $(this);
	    var filter = $this.val();
		if(userKeyTimeout) clearTimeout(userKeyTimeout);

		userKeyTimeout = setTimeout(function() {
			$this.parent().addClass('is-loading').find('.nd-icon').prepend('<div class="square-spin"><div></div></div>')
	        var jsonArr = {
	        	"action": "modules_search_tags",
	        	"data": {
	        		"action": "modules_search_tags",
	        		"tags": filter
	        	}
	        };
		    plugin.socket.postMessage(JSON.stringify(jsonArr));
		}, 2000);

    });

    $('body').on('click', '.js-module-tag', function(e) {
        e.preventDefault();

        var filter = $(this).text();
        $('.js-search-modules').addClass('is-loading').find('.nd-icon').prepend('<div class="square-spin"><div></div></div>');
        var jsonArr = {
        	"action": "modules_search_tags",
        	"data": {
        		"action": "modules_search_tags",
        		"tags": filter
        	}
        };
	    plugin.socket.postMessage(JSON.stringify(jsonArr));

    });

	$('body').on('click', '.js-close-modal', function(e) {
        e.preventDefault();
        $('.nd-modal').removeClass('in').addClass('nd-hide');
        plugin.modalBackdrop.removeClass('in').addClass('nd-hide');
    });

    $('body').on('click', '.js-insert-template', function(e) {
        e.preventDefault();

        var jsonArr = {
        	"action": "template_all_templates",
        	"data": {
        		"action": "template_all_templates"
        	}
        };
	    plugin.socket.postMessage(JSON.stringify(jsonArr));

        $('#nd-modal-templates').addClass('in').removeClass('nd-hide');
        plugin.modalBackdrop.addClass('in').removeClass('nd-hide');

    });

    $('body').on('click', '.js-template-version', function() {

        $('.ui-template').removeClass('ui-active');
        $(this).addClass('ui-active');

    });

    // save new template to Polish database then reload page
    $('body').on('click', '.js-add-predefined-template', function(e) {
        e.preventDefault();

        var ID = $(this).data('id');
        $('.ui-template').removeClass('ui-active');
        if(plugin.templateID != ID) {
            plugin.templateID = ID;
            $(this).addClass('ui-active');
            $('.js-confirm-template').prop('disabled', false);
        } else {
        	plugin.templateID = '';
        	$('.js-confirm-template').prop('disabled', true);
        }

    });

    $('body').on('click', '.js-confirm-template', function(e) {
        e.preventDefault();

        var jsonArr = {
        	"action": "template_search_templates",
        	"data": {
        		"action": "template_search_templates",
        		"id": plugin.templateID
        	}
        };
	    plugin.socket.postMessage(JSON.stringify(jsonArr));

    });

    // save template to CSS database
    $('body').on('click', '.js-save-confirm', function(e) {
        e.preventDefault();

        var jsonArr = {
        	"action": "template_all_versions",
        	"data": {
        		"action": "template_all_templates"
        	}
        };
	    plugin.socket.postMessage(JSON.stringify(jsonArr));

        $('#nd-modal-save-template').addClass('in').removeClass('nd-hide');
        plugin.modalBackdrop.addClass('in').removeClass('nd-hide');

    });

    $('body').on('click', '.js-save-template', function(e) {
        e.preventDefault();

        var $checked = $('[name="template-version"]:checked');
        var version = $checked.val();
        var id = $checked.attr('data-id');
        var bodyClass = $('body').attr('class');
        var bodyClassArr = bodyClass.split(' ');
        var section;

        if(version) {

        	$('#nd-modal-save-template').removeClass('in').addClass('nd-hide');
        	plugin.modalBackdrop.removeClass('in').addClass('nd-hide');
        	plugin.win = window.open(window.location.href);

        	screenShot('.nd-edit').then(function(canvas){

        		plugin.win.close();

        		plugin.sectionTypes.forEach(function(item){
        			var ignore = false;

        			if(item.ignore) {
						item.ignore.forEach(function(matches){
							var regex = matches.split(' ').join(').(');
							var regexOutput = bodyClass.match(new RegExp('(' + regex + ')', 'g'));
							if(regexOutput) if(regexOutput[0] == matches) ignore = true;
						});
					}

					if(ignore) return;

        			item.matches.forEach(function(matches){
						var regex = matches.split(' ').join(').(');
						var regexOutput = bodyClass.match(new RegExp('(' + regex + ')', 'g'));
						if(regexOutput) if(regexOutput[0] == matches) section = item.type;
					});

        		});

            	var jsonArr = {
	            	"action": "template_save",
	            	"data": {
	            		"id": id,
				    	"action": "template_save",
				    	"source": plugin.templateCode($('.nd-edit')),
				    	"img": section + version + ".jpg",
				    	"section": section,
				    	"version": version,
				    	"canvas": canvas.toDataURL()
	            	}
	            };

			    plugin.socket.postMessage(JSON.stringify(jsonArr));

        	});

		}

    });

    $('body').on('click', '.js-add-module', function(e) {
        e.preventDefault();

        var jsonArr = {
        	"action": "modules_all_tags",
        	"data": {
        		"action": "modules_all_tags"
        	}
        };
	    plugin.socket.postMessage(JSON.stringify(jsonArr));

        $('#nd-modal-predefined').addClass('in').removeClass('nd-hide');
        plugin.modalBackdrop.addClass('in').removeClass('nd-hide');

    });

    if(plugin.partials) {

    	$('body').on('click', '.js-update-modules', function(e){
	   		e.preventDefault();
	   		$('.nd-edit .container-wrap').not('[data-partial-id]').find('.module').each(function(){
	   			var $parent = $(this).parent();
		   		if(!$parent.hasClass('nd-partial') && !$(this).hasClass('ignore')) {
		   			var id = randString(10);
		   			var $this = $(this);
		   			var $wrap = $('<div class="nd-partial" data-partial-id="' + id + '" />');
		   			$this.find('> .nd-module-btns').append('<a class="js-module-edit" href="#"><i class="nd-icon-edit nd-icon-invert"></i></a>');
		   			$this.wrap($wrap);
		   		}
		   	});
	   	});

	   	$('body').on('click', '.js-module-edit', function(e){
	   		e.preventDefault();
	   		var $parent = ($(this).closest('[data-partial-id]').length) ? $(this).closest('[data-partial-id]') : $(this).parent().parent();
	   		if(!$parent.attr('data-partial-id') && !$parent.hasClass('container-wrap')) return;
	   		if(!$parent.attr('data-partial-id')) $parent.attr('data-partial-id', randString(10));
	   		if(plugin.moduleID == $parent.attr('data-partial-id')) return;
	   		plugin.moduleID = $parent.attr('data-partial-id');

	   		if($parent.length) {
		   		var jsonArr = {
			    	"action": "template_show_edit",
			    	"data": {
			    		action: "template_search_modules",
				    	id: plugin.moduleID
				    }
			    };
			    plugin.socket.postMessage(JSON.stringify(jsonArr));
			}

	   	});

	   	$('body').on('click', '.js-editor-close', function(e){
	   		e.preventDefault();
	   		$('body').css({'padding-bottom': '0'})
	   		$('.editor-modal').css({'visibility': 'hidden'});
	   	});

		$('body').on('click', '.js-remove-partial', function(e){
			e.preventDefault();
			var $parent = $(this).parents('.nd-partial');
			// need to add post message
		});

		$('body').on('click', '.js-save-partial', function(e){
			e.preventDefault();
			var takeScreenShot = ($(this).attr('data-screenshot')) ? true : false;

			document.getElementsByClassName('nd-btn-save')[0].click();

			var saveInterval = setInterval(function(){

				if($('#nd-modal-notify').hasClass('in')) {

					clearInterval(saveInterval);

					var id = $('.js-partial-id').val();
					var $parent = $('[data-partial-id="' + id + '"]');
					var $html = $parent.find('.module');

					var $name = $('.js-partial-name');
					var $tags = $('.js-partial-tags');
					var $version = $('.js-partial-version');
					var $css = $('#editorCSS');
					var $js = $('#editorJS');
					plugin.editorCSS.save();
					plugin.editorJS.save();
					var css = $css.val();
					var js = $js.val();

					$html.attr('data-partial-id', id);

					if(!$name.val() || !$version.val()) {
						console.log('Missing Details');
						return false;
					}

					$('[data-partial-id="' + id + '"]').attr('data-version', $version.val());

					var module = ($('[data-partial-id="' + id + '"]').hasClass('nd-partial')) ? true : false;
					var el = (module) ? '[data-partial-id="' + id + '"] > div:first-child' : '[data-partial-id="' + id + '"]';

					if(takeScreenShot) {
						plugin.win = window.open(window.location.href);
						screenShot(el).then(function(canvas){
							plugin.win.close();
						    saveModule(canvas);
						});
					} else {
						saveModule();
					}

					function saveModule(canvas) {

						var $widget = htmlToPartialWidgets($parent.clone());
					    var html = (module) ? String($.trim($widget.html())) : String($.trim($widget[0].outerHTML)) ;

					    var jsonArr = {
					    	"action": "template_save_module",
					    	"data": {
					    		action: "template_save_module",
						    	id: $parent.attr('data-partial-id'),
						    	editor_html: html,
						    	css: String(css),
						    	js: String(js),
						    	name: $name.val(),
						    	tags: $tags.val(),
						    	version: $version.val()
						    }
					    };

					    if(canvas) jsonArr.data.canvas = canvas.toDataURL();

					    plugin.socket.postMessage(JSON.stringify(jsonArr));

					}

				}

			}, 400);

		});

    }

    $('body').on('click', '.js-copy-css', function(e) {
		e.stopPropagation();
		e.stopImmediatePropagation();
		e.preventDefault();
		copyCode($(this));
	});

};
var clearEditor = function() {

	var plugin = window.codeBlocksSettings;
	$('.js-partial-name').val('');
	$('.js-partial-tags').val('');
	$('.js-partial-version').val('');
	plugin.editorCSS.setValue('');
	plugin.editorJS.setValue('');

};
var compileCSS = function(newLess) {

	var whiteLabelURL = '//nd-auto-styles-temp-production.s3.amazonaws.com/01.1%20Core%20Mobile';

	var files = [
		whiteLabelURL + '/src/auto.mixins.less',
		whiteLabelURL + '/src/scaffolding/grid.less',
		whiteLabelURL + '/src/scaffolding/icons.less',
		whiteLabelURL + '/src/auto.variables.less',
		whiteLabelURL + '/white-label/less/group/variables.less'
	];

	function getData() {

		return new Promise(function(resolve_scripts) {
			var iteration_attempts = [];
			var pending = files.length;
			var string = '';
			count = 0;

			loadScript();

			function loadScript() {

				$.get( files[count], function (data) {

					string += data;
					count++;
					if(count == pending) return resolve_scripts(string)
					else loadScript();

				});

			}

		});

	}

    getData().then(function(data) {

    	$.get(whiteLabelURL + '/src/scaffolding/responsive.less', function(responsive) {

    	data += '\n @import (reference) "' + whiteLabelURL +  '/src/modules/socialicons.01.less"; \n';
    	data += '\n @import (reference) "' + whiteLabelURL +  '/src/modules/button.01.less"; \n';

        // less options
        var options = {
            optimization  : 1,
            compress      : true,
            yuicompress   : true,
            paths         : [whiteLabelURL, '../01.1%20Core%20Mobile'],
            filename      : whiteLabelURL + "/src/",
        };

        newLess += '@button__padding: 0 10px; @button__line-height: 40px; body{ display: block !important; } .nd-module-btns{ display: none; }';

        var lessString = data.toString() + newLess + responsive.toString();

        // logs
        less.logger.addListener({
            debug: function(msg) {
                console.log(msg);
            },
            info: function(msg) {
                console.log(msg);
            },
            warn: function(msg) {
                console.log(msg);
            },
            error: function(msg) {
                console.log(msg);
            }
        });

        // render
        less.render(lessString, options).then(function(output) {
        	var CSS = output.css;
            // replace image url
            CSS = CSS.replace(/(\.\.\/images)[^\/]*/g, whiteLabelURL + "/images");
            $('[data-compiled-css]').text(CSS);
            document.body.setAttribute('style', 'display:block !important');
	    }, function(error) {
	    	console.log('Error ' + error);
	    });

        });

    });

};
var copyCode = function(el) {

	var $parent;

	if(el.data('partial-id')) $parent = el
	else $parent = (el.closest('[data-partial-id]').length) ? el.closest('[data-partial-id]') : el.parents('.js-add-predefined-module');
	var inp = ($parent.data('partial-id')) ? $('#clipboard_' + $parent.data('partial-id')) : $('#clipboard_' + $parent.data('id'));

	inp.css({'display': 'block', 'position': 'fixed', 'right': '100%', 'top': '100%'})

	// select text
 	inp.select();

  	try {
    	// copy text
    	document.execCommand('copy');
    	inp.blur();
    	alert('CSS Copied!')
  	} catch (err) {
    	alert('please press Ctrl/Cmd+C to copy');
  	}

  	inp.hide();

};
var customDragDrop = function() {

	$('.js-add-predefined-module[data-container="true"] .thumb').on('click', function(e) {
		e.preventDefault();
		var newContainer = $(this).parent().find('.container-wrap').insertAfter($('.nd-edit').find('.container-wrap').last());
		plugin.initContainer(newContainer);
		plugin.row(newContainer.find('.row-fluid'));
		if($('.nd-edit widget').length) loadWidgets();
	});

	$(plugin.moduleContainers).sortable({
      	connectWith: plugin.moduleContainers,
      	handle: '> .nd-module-btns .nd-module-drag',
      	items: '> [data-module]',
      	placeholder: 'ui-state-highlight',
      	cursorAt: {left: 5},
      	scroll: false,
      	start: function(e, ui) {
        	ui.placeholder.attr('data-module', ui.item.data('module'));
        	ui.placeholder.attr('class', ui.item.attr('class') + ' ui-state-highlight');
        	ui.placeholder.attr('style', 'height: ' + ui.item.height() + 'px !important');
        	ui.item.appendTo($('.nd-edit'));
      	},
      	receive: function(e, ui) {

        	var module = ui.item.data('module');
	        var $item = $(this).data('ui-sortable').currentItem;
	        // if (!ui.item.is('.nd-new-module')) return;
	        $item.parent().find('> .nd-module-btns').appendTo($item.parent());
	        $item.attr('data-modified', 'true');
	        plugin.updateModule($item, { module: { module: module }, nd_template_code: plugin.templateCode($item.closest('.nd-edit')) });

      	},
      	stop: function(e, ui) {
        	var item = $(this).data('ui-sortable').currentItem;
        	item.removeAttr('style');
        	item.parent().find('> .nd-module-btns').appendTo(item.parent());
      	}
    });

    $('.nd-predifined-module-list li > widget').draggable({
      	connectToSortable: plugin.moduleContainers,
      	helper: function(e) {
      		var placeholder = $('<div style="position: absolute" />');
      		$.each($(e.target).data(), function(key, val) {
		        placeholder.attr('data-' + key, val);
		    });
		    var id = $(this).attr('data-partial-id');
	        return placeholder.appendTo($('#page-wrap'));
	    },
	    zIndex: 2000,
	    scroll: false,
      	start: function(e, ui) {
        	$('#nd-modal-predefined').removeClass('in').addClass('nd-hide');
			plugin.modalBackdrop.removeClass('in').addClass('nd-hide');
      	}
    });

};
var getWidgets = function(data) {

	var widgets = data.match(/((<widget).[^<]+(<\/widget>))/g);
	return widgets;

};

var diffOutput = function(data, diff1, diff2) {

	if($('.nd-diff-wrap').length) $('.nd-diff-wrap').remove();
	var $diffWrap = $('<div class="nd-diff-wrap"></div>').insertAfter('.js-template-diff');
	var $diffModifiedList = $('<ul class="nd-diff-list js-modified-list" style="float: left; width: 49%;"></ul>');
	var $diffRemovedList = $('<ul class="nd-diff-list js-removed-list" style="float: right; width: 49%;"></ul>');
	var modified = 0;

	for (var type in data) {

		var w = data[type];
		var missing = w.missing;
		var different = w.different;
		// if data is all default dont add to DOM
		if(missing.length == 0 && different.length == 0 && !w.added && !w.removed) continue;
		var object = $(w.widget).data();
		var $widget = $('<li class="nd-diff-item">' + object.module + ' <small>index: ' + w.count + '</small></li>');

		if(w.added) $widget.addClass('nd-added').css({ 'background': 'rgba(139, 195, 74, 0.3)' }).prepend('Added: ');

		if(missing.length > 0) {
			var missingMarkup = '<ul class="nd-missing">';
			missing.forEach(function(value){
				missingMarkup += '<li><b>Added:</b> ' + value.type + '<div style="padding-left: 10px;"><b>Value:</b> ' + value.current + '</div></li>';
			});
			missingMarkup += '</ul>';
			$(missingMarkup).appendTo($widget);
		}

		if(different.length > 0) {
			var differentMarkup = '<ul class="nd-different"">';
			different.forEach(function(value){
				differentMarkup += '<li>';
				differentMarkup += '<b>Modified:</b> ' + value.type + '<div style="padding-left: 10px;"><b>Current:</b> ' + value.current + '</div><div style="padding-left: 10px;"><b>New:</b> ' + value.new + '</div>';
				differentMarkup += '</li>';
			});
			differentMarkup += '</ul>';
			$(differentMarkup).appendTo($widget);
		}

		if(w.removed) {
			modified++;
			$widget.addClass('nd-removed').css({ 'background': 'rgba(244, 67, 54, 0.3)' }).prepend('Removed: ');
			$widget.appendTo($diffRemovedList);
		} else {
			modified++;
			$widget.appendTo($diffModifiedList);
		}

	}

	if(modified > 0) {
		$($diffRemovedList).prependTo($diffWrap);
		$('<li class="nd-diff-item">Modules removed on your template when compared to original</li>').prependTo($diffRemovedList);
		$($diffModifiedList).prependTo($diffWrap);
		$('<li class="nd-diff-item">Modules modified or added on your template when compared to original</li>').prependTo($diffModifiedList);
		$('<h3 style="font-size: 20px; margin: 0; padding: 10px;">Diff Between ' + diff1 + ' to ' + diff2 + '</h3>').prependTo($diffWrap);
		$('<h4 style="clear: both;">Raw JSON Diff</h4><textarea style="width: 100%; height: 200px;" class="js-json-diff"></textarea>').appendTo($diffWrap);
	} else {
		$('<div class="nd-alert nd-alert-success nd-confirm-template">No Differences Found</div>').prependTo($diffWrap);
	}

	$('.js-json-diff').html(JSON.stringify(data, null, 4));

};

var diffObject = function(diff1, diff2) {

	// empty array so we can catch what module we are looking at later
	var diff1Modules = [];
	// map array to output new array with object data
	var diff = diff1.map(function(widget, i){

		var data = $(widget).data();
		var module = data.module;

		// default object to return
		var diffSettings = {
			widget: widget,
			missing: [],
			different: [],
			added: true,
			removed: false,
			count: i
		};

		// push module to array to check later
		diff1Modules.push(module);
		// create empty arr to catch modules looked at
		var diff2Modules = [];

		// go through each module and check agaisnt current module
		diff2.forEach(function(w){

			var object = $(w).data();

			// get how many of map module we have
			var diff1M = diff1Modules.filter(function(item){
				if(item == object.module) return item;
			});

			// push current module to array
			diff2Modules.push(object.module);

			// get how many of this module we have
			var diff2M = diff2Modules.filter(function(item){
				if(item == object.module) return item;
			});

			// if this isnt the same module dont continue
			if(object.module != module) return;
			// match against button action for multiple buttons
			if(object.button_action != data.button_action) return;
			// check we are on the right module number and havent
			// gone past
			if(diff1M.length != diff2M.length) return;

			// if this is the same module remove added value
			if(object.module == module) diffSettings.added = false;

			// loop through each setting within the module
			for (var type in data) {
				// some settings we dont need
				if(type == 'siteId' || type == 'button_form_url' || type == 'button_page_url' || type == 'requireModuleId') continue;
				// trim space from class setting
				var currentValue = (type == 'custom_class' && data[type]) ? data[type].trim() : data[type];
				var newValue = (type == 'custom_class' &&  object[type]) ? object[type].trim() : object[type];
				// if setting is undefined add to missing arr on object
				if(newValue == undefined) {
					diffSettings.missing.push({
						type: type,
						current: currentValue
					});
				}
				// if setting is different add to different arr on object
				if(newValue && newValue != currentValue) {
					diffSettings.different.push({
						type: type,
						current: currentValue,
						new: newValue
					});
				}
			}

		});

		return diffSettings;

	});

	return diff;

};

var diffTest = function(diff1, diff2) {

	// do a match both ways so we can find
	// the missing modules from the original template
	var currentOrginal = diffObject(diff1, diff2);
	var orginalCurrent = diffObject(diff2, diff1);

	// filter through orginal to current and if it is added
	// change it to removed then merge arrays
	var fullDiff = orginalCurrent.filter(function(item){
		if(item.added) {
			var newItem = item;
			newItem.added = false;
			newItem.removed = true;
			return newItem;
		}
	}).concat(currentOrginal);

	return fullDiff;

};

function getCookie(name) {
  	var value = "; " + document.cookie;
  	var parts = value.split("; " + name + "=");
  	if (parts.length == 2) return true;
}

var getParameterByName = function(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
};

var randString = function(x){
    var s = "";
    while(s.length<x&&x>0){
        var r = Math.random();
        s+= (r<0.1?Math.floor(r*100):String.fromCharCode(Math.floor(r*26) + (r>0.5?97:65)));
    }
    return s;
};

window.codeBlocksSettings = {
	backend: false,
	admin: (getParameterByName('editor') == 'admin') ? true : false,
	partials: (window.location.href.split('/')[3] == 'partials') ? true : false,
	scripts: [
		'https://cdn.jsdelivr.net/easyxdm/2.4.18/easyXDM.min.js'
	]
}

var plugin = window.codeBlocksSettings;

var codeBlocks = {
	init: function() {
		if (window.location.protocol === 'https:') return;
		if(!$('.header-container').length) return;
		if($('.nd-sidebar').length) return;
		if(!$('#nd-website-editor-wrap').length) {
			if(plugin.partials) {
					plugin.scripts = [
					'https://cdnjs.cloudflare.com/ajax/libs/less.js/2.6.1/less.min.js',
				].concat(plugin.scripts);
				loadScripts().then(function(){
					startSocket();
					$('body').on('click', '[data-partial-id] a', function(e) {
						e.preventDefault();
					});
					$('body').on('click', '[data-partial-id]', function(e) {
						e.preventDefault();
						e.stopPropagation();
						copyCode($(this));
					});
					var ids = '';
					$('[data-partial-id]').each(function(){
						ids += $(this).data('partial-id') + ' ';
					});
					var jsonArr = {
		            	"action": "template_show_less",
		            	"data": {
		            		"action": "template_search_modules",
		            		"id": ids.trim().split(' ').join(',')
		            	}
		            };
				    plugin.socket.postMessage(JSON.stringify(jsonArr));
				});
			} else {
				frontendButtons();
			}
		} else {
			if(plugin.partials) {
				plugin.scripts = [
					'https://cdnjs.cloudflare.com/ajax/libs/less.js/2.6.1/less.min.js',
					'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/codemirror.min.js',
					'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/mode/css/css.js',
					'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/mode/htmlmixed/htmlmixed.js',
					'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/mode/xml/xml.js',
					'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.18.2/mode/javascript/javascript.js',
				].concat(plugin.scripts);
			}
            loadScripts().then(function(){
            	setVariables();
                startSocket();
                renderCSS();
                renderMarkup();
                codeBlocksSettings.initDragDrop();
                bindEvents();
                if(codeBlocksSettings.partials) runEditor();
            });
		}
	},
};

var loadScripts = function() {

	return new Promise(function(resolve_scripts) {
		var iteration_attempts = [];
		var pending = plugin.scripts.length;
		var count = 0;

		loadScript();

		function loadScript() {

			if(count == pending) return resolve_scripts();

			// Adding the script tag to the head as suggested before
		    var head = document.getElementsByTagName('head')[0];
		    var script = document.createElement('script');

		    script.type = 'text/javascript';
		    script.src = plugin.scripts[count];
		    count++;

		    // Then bind the event to the callback function.
		    // There are several events for cross browser compatibility.
		    script.onreadystatechange = loadScript;
		    script.onload = loadScript;

		    // Fire the loading
		    head.appendChild(script);

		}

	});

};

var htmlToPartialWidgets = function($item) {
  	$('[contenteditable]', $item).removeAttr('contenteditable');
  	$('.nd-partial > div:first-child', $item).unwrap();
    $('.partial-id, .partial-name, .partial-version, .partial-tags, .partial-css, .js-module-edit', $item).remove();
  	$('.nd-module-btns, .nd-tab-remove, .nd-tab-add', $item).remove();
  	$('.sticky-module > .sticky-module-inset').removeAttr('style');
  	$('.ui-sortable', $item).removeClass('ui-sortable');
  	$('.fixed', $item).removeClass('fixed');
  	$('.container-wrap, .container, .row-fluid', $item).removeAttr('style');
  	$('[data-module]', $item).each(function eachModule(index, module) {
  	  	var $module = $(module);
    	var container = plugin.containerModuleInfo(module);
    	var $widget = $('<widget />');
    	$module.removeAttr('title').removeClass('lastItem');
    	if (container) {
      		if (!container.processInnerModules) {
        		$module.removeAttr('style');
        		return;
      		}
      		$widget.html(plugin.htmlToWidgets($module.find(container.inner)).html());
    	}
    	$module.removeAttr('class').removeAttr('style');
    	$.each(module.attributes, function eachAttribute(key, attr) {
      		$widget.attr(attr.name, $('<div />').html(attr.value).text());
    	});
    	$module.replaceWith($widget);
  	});
  	return $item;
};

var loadTags = function(data) {

	plugin.modulesModal.find('#predefined-module-tags').html('');
    var $tagList = $('<div id="nd-tags"><ul class="nd-tags-list"></ul></div>');
    data.forEach(function(item) {
    	if(item) {
        	var markup = '<li class="js-module-tag" data-id="' + item.tag_id + '">';
        	markup += item.name + '</li>';
            $(markup).appendTo($tagList.find('ul'));
		}
    });
    $tagList.appendTo(plugin.modulesModal.find('#predefined-module-tags'));

};

var loadModules = function(data) {

	plugin.modulesModal.find('#predefined-modules').html('');
    var $moduleList = $('<div style="position: static;" id="nd-modules"><ul class="nd-module-list nd-predifined-module-list"></ul></div>');
    data.forEach(function(item) {
    	if(item) {
    		var tags = item.tags.join(',');
    		var container = ($(item.html).hasClass('container-wrap')) ? true : false;
    		var img_url = '//css.blenheim.gforcestestlink.co.uk/wp-content/themes/css-wiki/template-editor/preview/' + item.id + '.png';
    		imageExists(img_url).then(function(resolve){
	    		var image = (resolve) ? img_url: item.canvas;
	        	var markup = '<li class="js-add-predefined-module" data-container="' + container + '" data-id="' + item.id + '" data-tags="' + tags + '">';
	        	markup += item.html;
	        	markup += '<textarea style="display: none;" id="clipboard_' + item.id + '" class="clipboard">' + item.css + '</textarea>';
	        	// markup += '<span style="margin-bottom: 5px" class="nd-btn-group">';
	        	// markup += '<a href="" class="nd-btn js-view-module"><i class="nd-icon-eye-open"></i></a>';
	        	// markup += '</span>';
	        	markup += '<span class="thumb"><img src="' + image + '" />';
	        	markup += '<span class="version">' + item.version + '</span>';
	        	markup += '</span>';
	        	markup += '<a href="" class="nd-btn-copy js-copy-css">Copy Less</a>';
	        	markup += '<span class="label">' + item.name + '</span>';
	        	markup += '</li>';
           		$(markup).appendTo($moduleList.find('ul'));
           		customDragDrop();
        	});
		}
    });
    $moduleList.appendTo(plugin.modulesModal.find('#predefined-modules'));
    $('#predefined-modules widget').addClass('nd-new-module');

};

var imageExists = function(image_url) {

	return new Promise(function(resolve, error) {

	    var img = new Image();
	   	img.onload = function() {
		   	resolve(true);
		}
		img.onerror = function() {
			resolve(false);
		}
	   	img.src = image_url;

   	});

}
var loadWidgets = function() {

	var el = $('.nd-edit widget').first();
	var module = el.data('module');
    var $item = el;
    $item.attr('data-modified', 'true');
    plugin.updateModule($item, { module: { module: module }, nd_template_code: plugin.templateCode($item.closest('.nd-edit')) }).then(function() {
    	if($('.nd-edit widget').length) {
    		loadWidgets();
    	} else {
    		$('#nd-modal-predefined').removeClass('in').addClass('nd-hide');
        	plugin.modalBackdrop.removeClass('in').addClass('nd-hide');
    	}
    });

};

var renderCSS = function() {

	var customcss = '<style>';
	customcss += '@import "https://cdnjs.cloudflare.com/ajax/libs/loaders.css/0.1.2/loaders.min.css";';
	customcss += '.ui-full-modal.in {width: 100%; left: 0; margin-left: 0; display: flex; flex-direction: column; height: calc(100% - 40px); top: 40px; border-radius: 0; justify-content: space-between;}';
	customcss += '.ui-full-modal .nd-modal-body { flex-grow: 1; max-height: none;}';
	customcss += '.ui-template {border: solid 1px #f1f1f1;cursor: pointer !important;position: relative;width: 200px !important;overflow: visible !important;}';
	customcss += '.ui-template span {display: block;}';
	customcss += '.ui-template input {z-index: 10;position: absolute;left: 0;top: 0;width: 100% !important;height: 100%;opacity: 0;}';
	customcss += '.ui-version {position: absolute; right: 0; top: 0; z-index: 10; background: #CDDC39; color: #fff; font-size: 20px; padding: 10px;}';
	customcss += '.ui-thumb {background: #000;height: 400px;overflow: hidden;}';
	customcss += '.ui-thumb img {background: #fff;}';
	customcss += '.ui-template:hover .ui-thumb {overflow: visible;z-index: 20}';
	customcss += '.ui-template:hover .ui-thumb img {position: absolute; left: 0; top: 0;}';
	customcss += '.empty .ui-thumb {background: none;}';
	customcss += '.empty .ui-thumb:before {content: "+";color: #000;transform: translate(-50%,-50%);left: 50%;top: 50%;position: absolute;font-size: 40px;}';
	customcss += '.ui-title {padding: 10px 0;}';
	customcss += '#nd-tags {width: 100%; overflow-y: auto; white-space: nowrap; margin-bottom: 5px;}';
	customcss += '#nd-tags ul {padding: 0; margin: 0; list-style-type: none;}';
	customcss += '#nd-tags li {display: inline-block; cursor: pointer; padding: 4px 6px; font-size: 12px; line-height: normal; margin: 2px; background: #f1f1f1; }';
	customcss += '.square-spin > div { height: 15px; width: 15px; }';
	customcss += '.is-loading .nd-add-on .nd-icon { background: none; }';
	customcss += '.nd-module-btns > * {width: auto !important;height: auto !important; line-height: 20px !important;}';
	customcss += '.ui-active.empty .ui-thumb:before {display: none;}';
	customcss += '.ui-active .ui-thumb img {opacity: .4}';
	customcss += '.ui-active .ui-tick {z-index: 5;left: 50%;top: 50%;height:150px;width:170px;position:absolute;-webkit-transform:scale(.2)translate(-50%,-50%);transform:scale(.2)translate(-50%,-50%);-webkit-transform-origin:top left;transform-origin:top left}';
	customcss += '.ui-active .ui-tick:before,.ui-active .ui-tick:after {content:"";background-color:#fff;height:30px;position:absolute}';
	customcss += '.ui-active.empty .ui-tick:before,.ui-active.empty .ui-tick:after {background-color:#000;}';
	customcss += '.ui-active .ui-tick:before {bottom:45px;left:20px;-webkit-transform:rotate(45deg);transform:rotate(45deg);-webkit-transform-origin:top left;transform-origin:top left;width:75px}';
	customcss += '.ui-active .ui-tick:after {bottom:0;left:52.5px;-webkit-transform:rotate(-45deg);transform:rotate(-45deg);-webkit-transform-origin:bottom left;transform-origin:bottom left;width:175px}';
	customcss += '.nd-btn-edit-layout{margin: 0 !important;}';
	customcss += 'widget.ui-sortable-placeholder{ visibility: visible !important; display: block; clear: both; width: 100%; height: 20px; background: #FF5722; margin: 10px 0; }';
	customcss += '#nd-modules .nd-predifined-module-list .nd-btn { font-size: 10px; margin-top: 5px; text-decoration: none; position: relative; z-index: 15; }';
	customcss += '#nd-modules .nd-predifined-module-list .nd-btn-copy { padding: 8px; background: #f1f1f1; cursor: pointer; position: relative; z-index: 15; display: block; margin-bottom: 10px; }';
	customcss += '#nd-modules .nd-predifined-module-list li { width: 32%; margin-right: 1%; position: relative; }';
	customcss += '#nd-modules .nd-predifined-module-list li > .container-wrap { display: none; }';
	customcss += '#nd-modules .nd-predifined-module-list li > .container-wrap div { display: none; }';
	customcss += '#nd-modules .nd-predifined-module-list li > widget { position: absolute;left: 0;top: 0;bottom: 0;right: 0;opacity: 0;z-index: 10; }';
	customcss += '#nd-modules .nd-predifined-module-list li .thumb { position: relative; box-sizing: border-box; border: solid 1px #f1f1f1; width: 100%; height: 100px; background: url(http://master.auto.gforcestestlink.co.uk/assets/86286f03/images/template-editor/sprite-modules.png) no-repeat left -660px; display: block; overflow: hidden; margin-bottom: 0; }';
	customcss += '#nd-modules .nd-predifined-module-list li .version { position: absolute; right: 0; top: 0; z-index: 20; background: #CDDC39; color: #fff; font-size: 10px; padding: 4px; }';
	customcss += '.nd-diff-wrap {}';
	customcss += '.nd-diff-list {height: 400px; border-radius: 5px; overflow: auto; border: solid 1px #f1f1f1; margin: 10px 0; padding: 0; list-style-type: none;}';
	customcss += '.nd-diff-list .nd-diff-item {padding: 10px; font-weight: bold; font-size: 15px;}';
	customcss += '.nd-diff-list .nd-diff-item ul {padding: 0; font-weight: normal; font-size: 12px; list-style-type: none; margin: 0;}';
	customcss += '.nd-diff-list .nd-diff-item .nd-missing { border-left: solid 10px rgba(139, 195, 74, 0.3); padding-left: 5px; }';
	customcss += '.nd-diff-list .nd-diff-item .nd-different { border-left: solid 10px rgba(255, 193, 7, 0.3); padding-left: 5px; }';

	// order css

	customcss += '.order-modal-overlay { display: none; position: fixed; z-index: 2999; top: 0; right: 0; bottom: 0; left: 0; }';
	customcss += '.order-modal { display: none; position: fixed; z-index: 3000; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; border: 1px solid #cacaca; border-radius: 3px; padding: 5px 10px 50px; background: #fff; }';
	customcss += '.order-modal span { display: block; padding: 5px 10px; line-height: normal; border-bottom: 1px solid #e5e5e5; cursor: move; }';
	customcss += '.order-modal span:last-child { border: none; }';
	customcss += '.order-modal a { position: absolute; bottom: 10px; width: 42%; text-align: center; line-height: 30px; background: #e5e5e5; color: #404040; text-decoration: none; }';
	customcss += '.order-modal a ~ a { right: 10px; }';
	customcss += '.order-modal a:hover { background: #ccc; }';

	if(plugin.partials) {

		if(!$('[data-compiled-css]').length) $('#content-wrap').prepend('<style data-compiled-css></style>');
		customcss += '.nd-edit .nd-partial {position: relative;border: dashed 1px #FFC107;margin: 10px;border-radius: 5px;clear: both;overflow: hidden;}';
		customcss += '.nd-edit .js-module-edit {float: right;font-size: 12px;text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);padding: 1px 10px !important;display: block;margin: 0 !important;line-height: 20px;opacity: 0.75;width: 14px;color: #fff;background-color: #3F51B5 !important;border-bottom-left-radius: 4px;}';
		customcss += '.editor-modal .CodeMirror {height: 236px;}';
		customcss += '.editor-modal .code-editor {width: 50%; float: left;}';

		$('body').append('<link rel="stylesheet" type="text/css" href="https:\/\/cdn.rawgit.com\/codemirror\/CodeMirror\/master\/lib\/codemirror.css">');
		$('body').append('<link rel="stylesheet" type="text/css" href="https:\/\/cdnjs.cloudflare.com\/ajax\/libs\/codemirror\/5.3.0\/theme\/tomorrow-night-eighties.min.css">');

	}


	customcss += '</style>';

	$('head').append(customcss);

};
var renderMarkup = function() {

	var modalBackdrop = '<div class="modal-backdrop nd-hide"></div>',
	modulesModal = 	'<div id="nd-modal-predefined" class="nd-modal nd-hide nd-fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                    '<div class="nd-modal-header">' +
                    '<h3>Predefined CodeBlocks</h3>' +
                    '</div>' +
                    '<div class="nd-modal-body">' +
                    '<div class="nd-alert nd-alert-info">Drag and Drop or click the CodeBlock you would like to add.</div>' +
                    '<div class="nd-controls nd-input-prepend js-search-modules"><div class="nd-add-on" style="line-height: 30px; height: 30px;"><i class="nd-icon nd-icon-search"></i></div><input type="text" placeholder="button,sidebar" /></div>' +
                    '<div id="predefined-module-tags"></div>' +
                    '<div id="predefined-modules"></div>' +
                    '</div>' +
                    '<div class="nd-modal-footer">' +
                    '<button class="nd-btn nd-btn-danger js-close-modal" data-dismiss="modal" aria-hidden="true">Cancel</button>' +
                    '</div>' +
                    '</div>',
    templatesModal = 	'<div id="nd-modal-templates" class="nd-modal nd-hide nd-fade ui-full-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                     	'<div class="nd-modal-header">' +
                     	'<h3>Templates</h3>' +
                     	'</div>' +
                     	'<div class="nd-modal-body">' +
                     	'<div class="nd-alert nd-alert-info">Click the template you would like to insert.</div>' +
                     	'<div class="nd-alert nd-alert-warning nd-confirm-template">This will overide all current modules on the page!</div>' +
                     	'<div id="predefined-templates"></div>' +
                     	'</div>' +
                     	'<div class="nd-modal-footer">' +
                     	'<button class="nd-btn nd-btn-danger js-close-modal" data-dismiss="modal" aria-hidden="true">Cancel</button>' +
                     	'<button class="nd-btn nd-btn-success js-confirm-template" disabled data-dismiss="modal" aria-hidden="true">Confirm</button>' +
                     	'</div>' +
                     	'</div>',
    saveTemplateModal = '<div id="nd-modal-save-template" class="nd-modal nd-hide nd-fade ui-full-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                     	'<div class="nd-modal-header">' +
                     	'<h3>Save Template</h3>' +
                     	'</div>' +
                     	'<div class="nd-modal-body">' +
                     	'<div id="nd-template-versions"></div>' +
                     	'</div>' +
                     	'<div class="nd-modal-footer">' +
                     	'<button class="nd-btn nd-btn-danger js-close-modal" data-dismiss="modal" aria-hidden="true">Cancel</button>' +
                     	'<button class="nd-btn nd-btn-success js-save-template" data-dismiss="modal" aria-hidden="true">Save</button>' +
                     	'</div>' +
                     	'</div>',
    settingsModal = '<div id="nd-modal-settings" class="nd-modal nd-hide nd-fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
                 	'<div class="nd-modal-header">' +
                 	'<h3>Custom Settins</h3>' +
                 	'</div>' +
                 	'<div class="nd-modal-body">' +
                 	'<label>Custom Class</label><input type="text" class="js-custom-class" />' +
                 	'</div>' +
                 	'<div class="nd-modal-footer">' +
                 	'<button class="nd-btn nd-btn-danger js-close-modal" data-dismiss="modal" aria-hidden="true">Cancel</button>' +
                 	'<button class="nd-btn nd-btn-success js-save-custom-settings" data-dismiss="modal" aria-hidden="true">Save</button>' +
                 	'</div>' +
                 	'</div>',
    newButtons = 	'<li class="nd-divider"></li><li><a href="" title="Insert Template" class="js-insert-template">Insert Template</a></li>' +
    				'<li><a href="" title="Add Predefined" class="js-add-module">Add CodeBlock</a></li>',
   	editorModal = '<div class="editor-modal" style="color: #fff; position: fixed; left: 0; height: 30%; right: 0; bottom: 0; background: #000; z-index: 9999; visibility: hidden;" />';

   	if(plugin.admin) newButtons += '<li><a href="" title="Save Template" class="js-save-confirm">Save Template</a></li>';

   	plugin.modalBackdrop = $(modalBackdrop).appendTo('body');
   	plugin.modulesModal = $(modulesModal).appendTo('#nd-modals');
	plugin.templatesModal = $(templatesModal).appendTo('#nd-modals');
    plugin.saveTemplateModal = $(saveTemplateModal).appendTo('#nd-modals');
    plugin.settingsModal = $(settingsModal).appendTo('#nd-modals');
    plugin.newButtons = $(newButtons).insertBefore($('.nd-dropdown-menu .nd-divider').first());

    if(plugin.partials) {
    	var $editorModal = $(editorModal);
    	$('.container-wrap, .module').not('.ignore').find('> .nd-module-btns').append('<a class="js-module-edit" href="#"><i class="nd-icon-edit nd-icon-invert"></i></a>');
    	$('.nd-partial').find('> .nd-module-btns .nd-module-drag, > .nd-module-btns .nd-module-remove').hide();
    	$('.row-fluid').find('> .nd-module-btns .nd-module-remove').hide();
    	$('.container-wrap').find('> .nd-module-btns .nd-module-remove').hide();
    	$('<input type="hidden" value="" class="js-partial-id" />').appendTo($editorModal);
		$('<div class="editor-controls nd-pull-right" style="padding: 10px;"><div class="js-save-partial nd-btn nd-btn-success" style="margin-right: 10px;" title="Save Module">Save</div><div class="js-save-partial nd-btn nd-btn-success" data-screenshot="true" style="margin-right: 10px;" title="Save Screenshot">Screenshot</div><div class="js-editor-close nd-btn nd-btn-danger" title="Cancel">Cancel</div></div>').appendTo($editorModal);
		var $editorInputs = $('<div class="row-fluid" style="padding: 10px 10px 0;" />').appendTo($editorModal);
		$(generateInput('Name', 'Name', 'js-partial-name')).appendTo($editorInputs);
		$(generateInput('Tags', 'Tags', 'js-partial-tags')).appendTo($editorInputs);
		$(generateInput('Version', 'Version', 'js-partial-version')).appendTo($editorInputs);
		$('<div class="editor-css code-editor"><textarea id="editorCSS"></textarea></div>').appendTo($editorModal);
		$('<div class="editor-js code-editor"><textarea id="editorJS"></textarea></div>').appendTo($editorModal);
		$editorModal.appendTo('#nd-website-editor-wrap');
		$('<div class="nd-pull-right"><a href="" title="Wrap Modules" class="js-update-modules nd-btn editor-only">Wrap Modules</a></div>').appendTo('#nd-website-editor-wrap .nd-editor-options');
    }

};

var generateInput = function(label, placeholder, jsClass) {
	return '<div style="display: inline-block; margin-right: 10px;"><div class="nd-control-label" style="display: inline-block; line-height: 20px; margin-right: 10px;">' + label + '</div><div class="nd-controls" style="display: inline-block;"><input type="text" style="margin: 0;" value="" placeholder="' + placeholder + '" class="' + jsClass + '" /></div></div>';
};
var runEditor = function() {

	var editorVars = {
        lineNumbers: true,
        matchBrackets : true,
        mode: "text/x-less",
        theme: 'tomorrow-night-eighties',
        tabSize: 4,
        indentUnit: 4
    };

    if($('.CodeMirror').length) $('.CodeMirror').remove();

   	plugin.editorCSS = CodeMirror.fromTextArea(document.getElementById('editorCSS'), editorVars);
   	editorVars.mode = "htmlmixed";
   	plugin.editorJS = CodeMirror.fromTextArea(document.getElementById('editorJS'), editorVars);

   	var ids = '';
	$('[data-partial-id]').each(function(){
		ids += $(this).data('partial-id') + ' ';
	});
   	var jsonArr = {
    	"action": "template_compile_less",
    	"data": {
    		"action": "template_search_modules",
    		"id": ids.trim().split(' ').join(',')
    	}
    };
    plugin.socket.postMessage(JSON.stringify(jsonArr));

};


var screenShot = function(selector) {

	return new Promise(function(resolve) {

    	$.get('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.5.0-beta4/html2canvas.min.js', function() {

			var win = plugin.win;

			win.addEventListener('load', function() {

				var templateEditor = win.document.querySelector('[href*="templateEditor.css"]');
				templateEditor.parentNode.removeChild(templateEditor);

				setTimeout(function() {

					var editorNav = win.document.getElementById('nd-website-editor-wrap');
					editorNav.parentNode.removeChild(editorNav);
					var backdrop = win.document.getElementsByClassName('nd-hide')[0];
					backdrop.parentNode.removeChild(backdrop);
					var moduleBtns = win.document.getElementsByClassName('nd-module-btns');
					while(moduleBtns.length > 0){
				        moduleBtns[0].parentNode.removeChild(moduleBtns[0]);
				    }
					var el = win.document.querySelector(selector);

					html2canvas(el, {
						timeout: 1000,
						allowTaint: false,
						logging: true,
						taintTest: false,
						background: '#ffffff',
						useCORS: true
					}).then(function(canvas) {
						resolve(canvas);
					});

				}, 10000);

			}, false);

    	});

	});

};
var setVariables = function() {
	var plugin = window.codeBlocksSettings;
	plugin.tabsModule = '.tabs[data-module]';
  	plugin.layoutModule = 'div[class*="layout"]';
  	plugin.containerModules = [
	    {module: plugin.layoutModule, inner: ' > div', initWithRow: false, processInnerModules: false},
    	{module: plugin.tabsModule, inner: '> .tab-content > .tab-pane > .tab-inset', initWithRow: false, processInnerModules: false},
    	{module: '.parallax', inner: ' > .inner', initWithRow: true, processInnerModules: true},
    	{module: '.listing.module', inner: ' > .inner > .list-item:first-child > .inset', initWithRow: true, processInnerModules: true, itemIdAttribute: 'listing_item_id'},
    	{module: '.used-list', inner: ' > .inner > .item:first-child > .listing-details > .inset', initWithRow: true, processInnerModules: true, itemIdAttribute: 'vehicle_id'},
    	{module: '.new-list', inner: ' > .inner > .item:first-child > .listing-details > .inset', initWithRow: true, processInnerModules: true, itemIdAttribute: 'new_vehicle_model_page_id'},
    	{module: '.loc-listing', inner: ' > .inner > .item:first-child > .item-inner', initWithRow: true, processInnerModules: true, itemIdAttribute: 'location_page_id'},
    	{module: '.sticky-module[data-module]', inner: ' > .sticky-module-inset', initWithRow: true, processInnerModules: false},
    	{module: '.toggle', inner: ' > .toggle-body > .toggle-pane', initWithRow: true, processInnerModules: true},
    	{module: '.offer-item', inner: ' > .inner', initWithRow: true, processInnerModules: true}
  	];
  	plugin.moduleSelector = 'div[data-module]';
  	plugin.rowContainersArray = ['.nd-edit > .container-wrap > .container', '.nd-edit #main-container'].concat(plugin.containerModules.map(function map(container) {
    	return container.module + container.inner;
  	}));
  	plugin.rowSelector = plugin.rowContainersArray.map(function map(s) {
    	return s + ' > .row-fluid';
  	}).join(', ');
  	plugin.rowContainers = plugin.rowContainersArray.join(', ');
  	plugin.moduleContainers = plugin.rowSelector;
  	plugin.sectionTypes = [
	    {
	    	type: 'used-listing',
	    	matches: ['usedcars listing', 'usedvans listing', 'usedbikes listing']
	    },
	    {
	    	type: 'used-detail',
	    	matches: ['usedcars details', 'usedvans details', 'usedbikes details']
	    },
	    {
	    	type: 'new-listing',
	    	matches: ['newcars listing', 'newvans listing', 'newbikes listing']
	    },
	    {
	    	type: 'new-detail',
	    	matches: ['newcars details', 'newvans details', 'newbikes details']
	    },
	    {
	    	type: 'homepage',
	    	matches: ['homepage']
	    },
	    {
	    	type: 'contentsection',
	    	matches: ['contentsection']
	    },
	    {
	    	type: 'location-listing',
	    	matches: ['locations listing']
	    },
	    {
	    	type: 'location-detail',
	    	matches: ['locations details']
	    },
	    {
	    	type: 'form',
	    	matches: ['cmfdetails'],
	    	ignore: ['usedcars', 'usedvans', 'usedbikes']
	    },
	    {
	    	type: 'thankyou',
	    	matches: ['cmfthankyou']
	    },
	    {
	    	type: 'cap-offer-listing',
	    	matches: ['capnewcaroffers listing', 'capnewvanoffers listing', 'capnewbikeoffers listing']
	    },
	    {
	    	type: 'cap-offer-detail',
	    	matches: ['capnewcaroffers details', 'capnewvanoffers details', 'capnewbikeoffers details']
	    },
	    {
	    	type: 'used-form',
	    	matches: ['usedcars cmfdetails', 'usedvans cmfdetails', 'usedbikes cmfdetails']
	    }
    ];
    plugin.templateID = '';
}
var startSocket = function() {

	plugin.socket = new easyXDM.Socket({
        remote: "http://www.css.blenheim.gforcestestlink.co.uk/template-editor/", // the path to the provider
        onMessage:function(message, origin) {

        	var json = $.parseJSON(message);

        	switch(json.action) {
        		case'template_show_less':
        			var code = '';
        			json.data.forEach(function(item) {
        				code += item.css;
        				$('<textarea style="display: none;" id="clipboard_' + item.id + '">' + item.css + '</textarea>').appendTo('body');
        			});
        			compileCSS(code);
        		break;
        		case'template_compile_less':
        			var code = '';
        			json.data.forEach(function(item) {
        				code += item.css;
        			});
        			compileCSS(code);
        		break;
        		case'modules_search_tags':
        			$('.square-spin').remove();
        			$('.is-loading').removeClass('is-loading');
        			loadModules(json.data);
        		break;
        		case'modules_all_tags':
        			loadTags(json.data);
        		break;
        		case'template_show_edit':
        			//console.log(json.data)
        			var el = json.data[0];
        			plugin.editorCSS.focus();
        			clearEditor();
			   		$('body').css({'padding-bottom': '30%'})
			   		$('.editor-modal').css({'visibility': 'visible'});
        			if(el) {
	        			$('.js-partial-id').val(el.id);
				   		$('.js-partial-name').val(el.name);
				   		$('.js-partial-tags').val(el.tags.join(','));
				   		$('.js-partial-version').val(el.version);
	        			if(el.css) plugin.editorCSS.setValue(el.css);
	        			if(el.js) plugin.editorJS.setValue(el.js);
				   	} else {
				   		$('.js-partial-id').val(plugin.moduleID);
				   	}
				   	plugin.editorCSS.refresh();
				   	plugin.editorJS.refresh();
        		break;
        		case'template_save_module':
        			//console.log(json.data);
        			var ids = '';
					$('[data-partial-id]').each(function(){
						ids += $(this).data('partial-id') + ' ';
					});
				   	var jsonArr = {
				    	"action": "template_compile_less",
				    	"data": {
				    		"action": "template_search_modules",
				    		"id": ids.trim().split(' ').join(',')
				    	}
				    };
				    plugin.socket.postMessage(JSON.stringify(jsonArr));
        		break;
        		case'template_all_templates':
        			loadTemplates(json.data);
        		break;
        		case'template_diff_templates':
        			var diff = diffTest(getWidgets(plugin.templateCode($('#content-wrap'))), getWidgets(json.data.source));
        			diffOutput(diff, 'Your Template', 'Template ' + $('.js-template-versions option:selected').text());
        		break;
        		case'template_search_templates':
        			addTemplate(json.data);
        		break;
        		case'template_all_versions':
        			addTemplateVersions(json.data);
        		break;
        		case'template_save':
        			//console.log(json.data); // !========= need to show message that template was saved
					$('.nd-modal').removeClass('in').addClass('nd-hide');
            		plugin.modalBackdrop.removeClass('in').addClass('nd-hide');
        		break;
        		default:
        			if(json.data.result == 'success') {
        				$('.nd-btn-save').click();
				        var modalInterval = setInterval(function(){
				        	if($('#nd-modal-notify').hasClass('in')) {
				        		$('#nd-modal-notify').modal('hide');
				        		$('.loading').hide();
				        	}
				        }, 400);
				        renderCSS();
        			} else {
				    	console.log(json.data.message);
				    }
        	}

        }
    });

};
plugin.updateModule = function(item, data) {
	// console.log(item)
	return new Promise(function(resolve) {
      	var _this = plugin;
      	var $item = $(item);
      	var postData = data;
      	$(_this.containerModules).each(function each(index, container) {
        	if ($item.parents(container.module).length && container.itemIdAttribute) {
          		postData.module[container.itemIdAttribute] = $item.closest('.item').data('id');
        	}
      	});
      	$.post(document.URL, postData, function post(html) {
        	var currentScriptsSrcs = [];
        	var nodes = $('<div></div>').append(html);
        	var $inner;
        	var container;
        	var $newItem = nodes.find('[data-modified=true]').removeAttr('data-modified').first();
        	$('#page-wrap').find('.lastItem').removeClass('lastItem');
        	$newItem.addClass('lastItem load');
        	$item.replaceWith($newItem);
        	$('script[src]').each(function each() {
          		currentScriptsSrcs.push($(this).attr('src'));
        	});
        	nodes.find('script[src]').each(function each() {
          		var scriptSrc = $(this).attr('src');
          		if (currentScriptsSrcs.indexOf(scriptSrc) === -1) {
            		$.getScript(scriptSrc);
          		}
        	});
        	plugin.module($newItem);
        	container = _this.containerModuleInfo($newItem);
        	if (container) {
          		if (container.initWithRow) {
            		$inner = $(container.inner, $newItem);
            		if ($inner.length > 0 && $inner.html().trim() === '') _this.row($('<div class="row-fluid row-' + _this.randomId() + ' ui-sortable"></div>').appendTo($inner));
          		}
	          	_this.row($(_this.rowSelector, $newItem));
	          	plugin.module($(_this.moduleSelector, $newItem));
	        }
	        plugin.initDragDrop();
	        addCloneButton();
	        resolve();
      	});
    });
};

plugin.initDragDrop = function() {
		var _this = plugin;
		$('.nd-edit').sortable({
		connectWith: '.nd-edit', handle: '> .nd-module-btns .nd-module-drag', items: '> .container-wrap', placeholder: 'ui-state-highlight', scroll: false, start: function start(e, ui) {
  			ui.placeholder.attr('style', 'height: 100px !important');
		}
		});

		$(plugin.rowContainers).sortable({
		connectWith: plugin.rowContainers, handle: '> .nd-module-btns .nd-module-drag', items: '> .row-fluid', placeholder: 'ui-state-highlight', scroll: false, start: function start(e, ui) {
  			ui.placeholder.attr('style', 'height: 100px !important');
		}
		});

		$(plugin.moduleContainers).sortable({
		connectWith: plugin.moduleContainers, handle: '> .nd-module-btns .nd-module-drag', items: '> [data-module]', placeholder: 'ui-state-highlight', cursorAt: { left: 5 }, scroll: false, start: function start(e, ui) {
  			ui.placeholder.attr('data-module', ui.item.data('module'));
  			ui.placeholder.attr('class', ui.item.attr('class') + ' ui-state-highlight');
  			ui.placeholder.attr('style', 'height: ' + ui.item.height() + 'px !important');
  			ui.item.appendTo($('#page-wrap'));
		},
		receive: function receive(e, ui) {
			console.log(ui);
  			var module = ui.item.data('module');
  			var $item = $(this).data('ui-sortable').currentItem;
  			if (!ui.item.is('.nd-new-module')) return;
  			$item.parent().find('> .nd-module-btns').appendTo($item.parent());
  			$item.attr('data-modified', 'true');
  			_this.updateModule($item, { module: { module: module }, nd_template_code: _this.templateCode($item.closest('.nd-edit')) });
		},
		stop: function stop() {
  			var item = $(this).data('ui-sortable').currentItem;
  			item.removeAttr('style');
  			item.parent().find('> .nd-module-btns').appendTo(item.parent());
		}
		});

		$('[data-module]').draggable({
		connectToSortable: plugin.moduleContainers,
		handle: '> .nd-module-btns .nd-module-drag',
		helper: function helper(e) {
  			return $('<div style="position: absolute;"></div>').data('module', $(e.target).data('module')).appendTo($('#page-wrap'));
		}, zIndex: 2000, scroll: false,
		start: function start() {
  			$('#nd-modules').modal('hide');
		}
		});

		$('.nd-module-list li div').draggable({
		connectToSortable: plugin.moduleContainers, helper: function helper(e) {
  			return $('<div style="position: absolute;"></div>').data('module', $(e.target).data('module')).appendTo($('#page-wrap'));
		}, zIndex: 2000, scroll: false,
		start: function start() {
  			$('#nd-modules').modal('hide');
		}
		});
};

plugin.module = function(container) {
		var $container = $(container);
		var _this = plugin;
		$container.append('<div class="nd-module-btns"><a class="nd-module-remove" href="#"><i class="nd-icon-remove nd-icon-invert"></i></a><span class="nd-module-drag"><i class="nd-icon-move nd-icon-invert"></i></span><a class="nd-module-settings" href="#"><i class="nd-icon-cog nd-icon-invert"></i></a></div>');
		$container.on('mouseover', function mouseover(e) {
  		e.stopPropagation();
  		$('.nd-module-btns').css('opacity', 0.2);
  		$('> .nd-module-btns', $(this)).css('opacity', 1);
	})
	.on('mouseout', function mouseout() {
  		$('.nd-module-btns', $(this)).css('opacity', 0.2);
	});
		$('> .nd-module-btns .nd-module-remove', $container).on('click', function click(e) {
			var $modalDelete = $('#nd-modal-delete');
			e.preventDefault();
			$(this).parent().parent().remove();
			// data attr not working think it might be case sensative
			// $modalDelete.data('removeElement', $(this).parents('[data-module]'));
			// $('.nd-modal-body p', '#nd-modal-delete').html(tb('This will permanently remove this module. Do you wish to do this?'));
			// $('h3', '#nd-modal-delete').html(tb('Delete Module'));
			// $modalDelete.modal('show');
		});
  	$('> .nd-module-btns > .nd-module-settings', $container).on('click', function click(e) {
    	var data = {};
    	var matches;
    	var $modalModuleSettingsBody = $('#nd-modal-module-settings .nd-modal-body');
    	var $modalModuleSettings = $('#nd-modal-module-settings');
    	e.preventDefault();
    	$modalModuleSettingsBody.html('<p>' + tb('Loading module settings ...') + '</p>');
    	$modalModuleSettings.data('element', $(this).parents('[data-module]'));
    	$.each($(this).parent().parent().get(0).attributes, function each(index, attr) {
     		matches = attr.name.match(/^data-(.*?)$/);
      		if (matches) data[matches[1]] = attr.value;
    	});
		$.post(urlPrefix + '/backend/template/module-settings/pageId/' + $(document.body).data('page-id'), data, function post(html) {
  			$modalModuleSettingsBody.html(html);
      		$('[data-show]', $modalModuleSettingsBody).hide();
      		$('input, select, textarea, button', $modalModuleSettingsBody).change(_this.settingsFormChange.bind(_this));
  			_this.settingsFormChange();
		}).always(function always(request) {
  			$modalModuleSettingsBody.html(request.responseText);
		});
		$modalModuleSettings.modal('show');
		$('#nd-modal-module-settings').one('click', '.nd-btn-success', function click(e) {
			e.preventDefault();
			e.stopPropagation();
        	_this.saveModuleSettings();
      	});
		});
		if ($container.is(_this.tabsModule)) plugin.tabs($container);
};

plugin.settingsFormChange = function() {
  	var $modalModuleSettings = $('#nd-modal-module-settings .nd-modal-body');
  	$('[data-show]', $modalModuleSettings).each(function eachData() {
    	var visible = false;
    	var field = $(this);
    	$('input, select, textarea, button', $modalModuleSettings).each(function eachField() {
      		var value = ($(this).val() !== null ? $(this).val().toLowerCase() : '');
      		var values = field.data('show').toLowerCase().split('|');
      		if ($.inArray(value, values) >= 0) visible = true;
    	});
    	field.toggle(visible);
  });
};

plugin.saveModuleSettings = function() {
  	var $modalModuleSettings = $('#nd-modal-module-settings');
  	var $item = $modalModuleSettings.data('element');
  	var data = { module: $($item).data('module') };
  	var container = plugin.containerModuleInfo($item);
  	$.each($('#nd-modal-module-settings form').serializeArray(), function each(index, param) {
    	data[param.name] = param.value;
  	});

  	if (!plugin.validateModuleName(data.name)) {
    	alert('Module name field can only contain alphanumeric characters');
    	return;
  	}

  	if (container && !container.processInnerModules) {
    	$item.removeClass().addClass(data.module.split('/')[1]);
    	if (data.span) $item.addClass(data.span);
    	if (data.custom_class) $item.addClass(data.custom_class);
    	if (data.custom_id) $item.attr('id', data.custom_id);
    	$.each(data, function each(key, value) {
      		$item.attr('data-' + key, value);
    	});
    	$modalModuleSettings.modal('hide');
    	return;
  	}

  	if (container && container.processInnerModules) {
    	data.innerHtml = plugin.htmlToWidgets($($item).find(container.inner)).html();
  	}
  	if (data.name) $item.attr('data-name', data.name);
  	$item.attr('data-modified', true);
  	if ($item.parents('#holder').length) {
    	$item.parents('#holder').data('originalItem').html($item.parents('#holder').find('.toggle-body').html());
  	}

  	plugin.updateModule($item, { module: data, nd_template_code: plugin.templateCode($item.closest('.nd-edit')) });
  	$modalModuleSettings.modal('hide');
  	$('.loading').remove();

};

plugin.templateCode = function(wrap) {
	var body = wrap.clone();
	plugin.htmlToWidgets(body);
	return $.trim(body.html());
};

plugin.containerModuleInfo = function(item) {
  	var i;
  	for (i in plugin.containerModules) {
    	if (plugin.containerModules.hasOwnProperty(i) && $(item).is(plugin.containerModules[i].module)) return plugin.containerModules[i];
  	}
  	return null;
};

plugin.validateModuleName = function(value) {
	return !/[^a-zA-Z0-9\/ \/g]/.test(value);
};

plugin.randomId = function randomId() {
  	var id = '';
  	var characters = '0123456789abcdefghijklmnopqrstuvwxyz';
  	var idLength = characters.length;
  	var i;
  	for (i = 0; i < 5; i++) {
    	id += characters.charAt(Math.floor(Math.random() * idLength));
  	}
  	return id;
};

plugin.saveTemplate = function saveTemplate() {
  	var data = {};
  	var item = $('.lastItem');
  	var _this = plugin;

  	if (item.parents('#holder').length) {
    	item.parents('#holder').data('originalItem').html(item.parents('#holder').find('.toggle-body').html());
  	}

  	$(plugin.editElements).each(function each() {
    	var id = $(this).attr('id');
    	$('[data-modified=true]', $(this)).removeAttr('data-modified');
    	data[this.tagName.toLowerCase() + (id ? '-' + id : '')] = _this.templateCode($(this));
  	});

  	$.ajax({
    	url: urlPrefix + '/backend/template/save-code/id/' + $(document.body).data('templateId') + '/',
    	type: 'post',
    	data: data,
    	success: function success() {
      		$('#nd-modal-notify h3').text(tb('Success'));
      		$('#nd-modal-notify .nd-modal-body p').text(tb('Template has been updated'));
      		$('#nd-modal-notify').modal('show');
      		spinner.removeSpinner();
    	}, error: function error(response) {
      		$('#nd-modal-notify h3').text('Error');
      		$('#nd-modal-notify .nd-modal-body p').text(tb('Template could not be updated: {value}', { value: response.responseText }));
      		$('#nd-modal-notify').modal('show');
      		spinner.removeSpinner();
    	}
  	});
};

plugin.openSaveConfirmationModal = function() {
  	var $modalConfirm = $('#nd-modal-confirm');
  	$modalConfirm.attr('data-confirmCallback', plugin.saveTemplate.bind(plugin));
  	$('.nd-modal-body p', '#nd-modal-confirm').html(tb('Some of the modules returned an error. Do you want to save the template?'));
  	$('h3', '#nd-modal-confirm').html(tb('Confirm Save'));
  	$modalConfirm.modal('show');
};

plugin.htmlToWidgets = function($item) {
  	var _this = plugin;
  	$('[contenteditable]', $item).removeAttr('contenteditable');
  	$('.nd-module-btns, .nd-tab-remove, .nd-tab-add', $item).remove();
  	$('.sticky-module > .sticky-module-inset').removeAttr('style');
  	$('.ui-sortable', $item).removeClass('ui-sortable');
  	$('.fixed', $item).removeClass('fixed');
  	$('.container-wrap, .container, .row-fluid', $item).removeAttr('style');
  	$('[data-module]', $item).each(function eachModule(index, module) {
  	  	var $module = $(module);
    	var container = _this.containerModuleInfo(module);
    	var $widget = $('<widget />');
    	$module.removeAttr('title').removeClass('lastItem');
    	if (container) {
      		if (!container.processInnerModules) {
        		$module.removeAttr('style');
        		return;
      		}
      		$widget.html(_this.htmlToWidgets($module.find(container.inner)).html());
    	}
    	$module.removeAttr('class').removeAttr('style');
    	$.each(module.attributes, function eachAttribute(key, attr) {
      		$widget.attr(attr.name, $('<div />').html(attr.value).text());
    	});
    	$module.replaceWith($widget);
  	});
  	return $item;
};

plugin.initContainer = function(container) {
		var $container = container;
    $container.append('<div class="nd-module-btns"><a class="nd-module-remove" href="#"><i class="nd-icon-remove nd-icon-invert"></i></a><span class="nd-module-drag"><i class="nd-icon-move nd-icon-invert"></i></span></div>');
    $container.on('mouseover', function mouseover(e) {
        e.stopPropagation();
        $('.nd-module-btns').css('opacity', 0.2);
        $('> .nd-module-btns', $(this)).css('opacity', 1);
    }).on('mouseout', function mouseout() {
        $('.nd-module-btns', $(this)).css('opacity', 0.2);
    });
    $('> .nd-module-btns > .nd-module-remove', $container).on('click', function click(e) {
        var $modalDelete = $('#nd-modal-delete');
        var $element = $(this);
        e.preventDefault();
        if ($element.closest('.container-wrap').siblings().length > 0) {
          	$modalDelete.data('removeElement', $element.closest('.container-wrap'));
          	$('.nd-modal-body p', '#nd-modal-delete').html(tb('This will permanently remove this container with all rows and modules within it. Do you wish to do this?'));
          	$('h3', '#nd-modal-delete').html(tb('Delete Container'));
          	$modalDelete.modal('show');
        } else {
          	$('#nd-modal-notify h3').text(tb('Delete Container Error'));
          	$('#nd-modal-notify .nd-modal-body p').text(tb('At least one container is needed in this section. You cannot delete this one.'));
          	$('#nd-modal-notify').modal('show');
      	}
    });
};

plugin.row = function(item) {
   	var $item = item;
    $item.append('<div class="nd-module-btns"><a class="nd-module-remove" href="#"><i class="nd-icon-remove nd-icon-invert"></i></a><span class="nd-module-drag"><i class="nd-icon-move nd-icon-invert"></i></span></div>');
    $item.on('mouseover', function mouseover(e) {
        e.stopPropagation();
        $('.nd-module-btns').css('opacity', 0.2);
        $('> .nd-module-btns', $(this)).css('opacity', 1);
    }).on('mouseout', function mouseout() {
        $('.nd-module-btns', $(this)).css('opacity', 0.2);
    });

    $('> .nd-module-btns > .nd-module-remove', $item).on('click', function click(e) {
        var $modalDelete = $('#nd-modal-delete');
        e.preventDefault();
        $modalDelete.data('removeElement', $(this).parent().parent());
        $('.nd-modal-body p', '#nd-modal-delete').html(tb('This will permanently remove this row and all modules within it. Do you wish to do this?'));
        $('h3', '#nd-modal-delete').html(tb('Delete Row'));
        $modalDelete.modal('show');
    });
};
var addTemplateVersions = function(data) {

	plugin.saveTemplateModal.find('#nd-template-versions').html('');
    var $templateList = $('<div style="position: static;" id="nd-modules"><ul class="nd-module-list nd-predifined-module-list"></ul></div>');
    var latestVersion, latestID = data.latestID;
    var templates = data.templates.filter(sectionTemplates);

    templates.forEach(function(template) {

    	latestVersion = template.version;
    	var markup = templateMarkup(template, 'js-template-version');
    	$(markup).appendTo($templateList.find('ul'));

    });

    if(!latestVersion) latestVersion = 0;

    var newmarkup = '<li class="js-template-version ui-template empty">';
	newmarkup += '<input type="radio" name="template-version" value="' +  (parseInt(latestVersion) + 1) + '" data-id="' + parseInt(latestID) + '" />';
	newmarkup += '<span class="ui-tick"></span>';
	newmarkup += '<span class="ui-thumb"></span>';
	newmarkup += '<span class="ui-version">+</span>';
	newmarkup += '</li>';
	$(newmarkup).appendTo($templateList.find('ul'));
    $templateList.appendTo(plugin.saveTemplateModal.find('#nd-template-versions'));

};

var sectionTemplates = function(template, i) {

	var bodyClass = $('body').attr('class');
	var pass = false;

	plugin.sectionTypes.forEach(function(item, i) {

		item.matches.forEach(function(matches){
			var regex = matches.split(' ').join(').(');
			var regexOutput = bodyClass.match(new RegExp('(' + regex + ')', 'g'));
			if(regexOutput) if(regexOutput[0] == matches && item.type == template.section) pass = true;
		});

		if(item.ignore) {
			item.ignore.forEach(function(matches){
				var regex = matches.split(' ').join(').(');
				var regexOutput = bodyClass.match(new RegExp('(' + regex + ')', 'g'));
				if(regexOutput) if(regexOutput[0] == matches && item.type == template.section) pass = false;
			});
		}

	});

	return pass;

};

var templateMarkup = function(template, classes) {

	var markup = '<li class="'+classes+' ui-template" data-id="' + template.id + '">';

    markup += '<input type="radio" name="template-version" value="' +  template.version + '" data-id="' + template.id + '" />';
    markup += '<span class="ui-tick"></span>';
    if(template.canvas) markup += '<span class="ui-thumb"><img src="'+template.canvas+'" /></span>';
    else markup += '<span class="ui-thumb"><img src="http://css.blenheim.gforcestestlink.co.uk/wp-content/themes/css-wiki/template-editor/preview/' + template.img + '" /></span>';
    markup += '<span class="ui-version">' + template.version + '</span>';
    markup += '</li>';

    return markup;

};

var loadTemplates = function(data) {

	plugin.templatesModal.find('#predefined-templates').html('');
    var $templateList = $('<div style="position: static;" id="nd-modules"><ul class="nd-module-list nd-predifined-module-list"></ul></div>');
    var templates = data.templates.filter(sectionTemplates);

    if($('.js-template-diff').length) {
    	$('.js-template-diff').remove();
    }

    var $templateDiff = $('<div class="js-template-diff" />');
    var $templateVersions = $('<select style="min-height: 0;" class="js-template-versions" />');
    $('<option value="">Select version to compare against</option>').appendTo($templateVersions);

    templates.forEach(function(template) {

    	var markup = templateMarkup(template, 'js-add-predefined-template');
    	$(markup).appendTo($templateList.find('ul'));
    	$('<option value="' + template.id + '">' + template.version + '</option>').appendTo($templateVersions);

    });

    if(templates.length > 0) {
    	$templateList.appendTo(plugin.templatesModal.find('#predefined-templates'));
    	$templateVersions.appendTo($templateDiff);
    	$('<button style="margin-bottom: 10px; margin-left: 10px;" class="nd-btn nd-btn-success js-compare-diff">Compare Diff</button>').appendTo($templateDiff);
    	$templateDiff.insertBefore(plugin.templatesModal.find('#predefined-templates'));
    }

    if(templates.length == 0) $('<div class="nd-alert">No templates exist for this section</div>').appendTo(plugin.templatesModal.find('#predefined-templates'));

    $('body').on('click', '.js-compare-diff', function(e) {
    	e.preventDefault();

    	var id = $('.js-template-versions option:selected').val();
        var jsonArr = {
        	"action": "template_diff_templates",
        	"data": {
        		"action": "template_search_templates",
        		"id": id
        	}
        };
	    plugin.socket.postMessage(JSON.stringify(jsonArr));

    });

};

var addTemplate = function(data) {

	var newData = {
		'div-content-wrap' : data.source
	};

    $.ajax({
      	url: urlPrefix + '/backend/template/save-code/id/' + $(document.body).data('templateId') + '/', type: 'post', data: newData, success: function(data) {
        	location.reload();
      	}, error: function(data) {
        	console.log(data);
      	}
    });

};

// codeBlocks.init();