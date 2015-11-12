$.fn.extend({
		loadDialog: function(options, flag) {
			if (typeof window.OPEN_DIALOG_NUM == 'undefined') {
				window.OPEN_DIALOG_NUM = 0;
			}
			if (options == 'close') {
				if ($(this).attr('id') == 'msg_dialog') {
					$(this).remove();
				} else {
					$(this).attr('pop_state', 'NO').hide();
				}
				OPEN_DIALOG_NUM -= 1;
				if (OPEN_DIALOG_NUM <= 0) {
					$('#dialog_overlay').remove();
					OPEN_DIALOG_NUM = 0;
				}
				return;
			}
			var setting = $.extend({
				opacity: 0.3,
				overlay: true,
				create: false
			}, options);
			var self = '';
			var winWidth = $(window).width(),
				winHeight = $(window).height(),
				scrLeft = $(window).scrollLeft(),
				scrTop = $(window).scrollTop();
			if (setting.create) {} else {
				self = $(this);
			}
			if (setting.overlay && !$('#dialog_overlay').length) {
				$('<div>').attr('id', 'dialog_overlay').css('opacity', setting.opacity).appendTo('body');
				//$('#dialog_overlay').bgiframe()
			}
			$('.close', self).unbind('click').click(function() {
				self.loadDialog('close');
			});
			self.addClass('dialog_layer');
			var out_width = parseInt(self.width());
			out_height = parseInt(self.height());
			var wl = parseInt((winWidth - out_width) / 2);
			if (winHeight > out_height) {
				var t = (scrTop + (winHeight - out_height) / 2);
			} else {
				var t = (scrTop + (winHeight / 10));
			}
			if (self.attr('pop_state') != 'YES') {
				OPEN_DIALOG_NUM += 1;
			}
			self.css({
				'left': wl,
				'top': t
			}).attr('pop_state', 'YES').show();
		},
		bdHover: function(hover) {
			this.hover(function() {
				var css = hover || $(this).attr('hover') || 'hover';
				$(this).addClass(css);
			}, function() {
				var css = hover || $(this).attr('hover') || 'hover';
				$(this).removeClass(css);
			});
			return this;
		},
		bdCheckSel: function(sel, callback) {
			typeof sel === 'function' && (callback = sel, sel = 'sel');
			this.click(function() {
				var $self = $(this),
					css = $self.attr('sel') || sel || 'sel';
				if ($self.hasClass(css)) {
					$self.removeClass(css);
					$.isFunction(callback) && callback.call(this, false);
				} else {
					$self.addClass(css);
					$.isFunction(callback) && callback.call(this, true);
				}
			});
			return this;
		},
		bdRadioSel: function(sel, callback) {
			var self = this;
			typeof sel === 'function' && (callback = sel, sel = 'sel');
			this.click(function() {
				var t = this;
				self.each(function() {
					if (t !== this) {
						var $t = $(this),
							cs = $t.attr('sel') || sel || 'sel';
						$t.removeClass(cs);
					}
				});
				var $self = $(this),
					css = $self.attr('sel') || sel || 'sel';
				if ($self.hasClass(css)) {
					$self.removeClass(css);
					$.isFunction(callback) && callback.call(t, false);
				} else {
					$self.addClass(css);
					$.isFunction(callback) && callback.call(t, true);
				}
			});
			return this;
		},
		center: function(options) {
			var offset = $.extend({
				top: 0,
				left: 0,
				css: {}
			}, options);
			var tmp = window._GLOBAL_ || {
				zIndex: 1000
			};
			var $w = $(window),
				$t = this;
			var css = {
				top: offset.top + $w.scrollTop() + ($w.height() - $t.outerHeight()) / 2,
				left: offset.left + $w.scrollLeft() + ($w.width() - $t.outerWidth()) / 2,
				zIndex: tmp.zIndex++
			};
			$t.show(), $t.css($.extend(css, offset.css));
			return this;
		}
	});