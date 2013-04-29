/*
 * jQuery Mobile Listomatic Plugin v0.5.3
 * Plugin to provide jquery mobile listview pagination
 * Copyright (c) Stakbit.com
 * Released under the MIT license.
 * http://listomatic.stakbit.com
 * **
 */
(function($) {
	var a, listOffset = 0, listOffsetSearch = 0, registeredAjax, registeredAjaxContext, searchTerm, cachedList;
	$.widget( "mobile.listomatic", $.mobile.widget, {
		options: {
			perPage: 10,
			btnLabel: 'Show More',
			refreshContent: false,
			noResultsFound: 'No Results Found',
			initSelector: "[data-listomatic],[data-type=search]"
		},
		_create: function(e) {
			var self = this;
			if (this.options.refreshContent) {
				self._refreshAt(00, 00, 00); // refresh at midnight - refreshAt(15,35,0); Will refresh the page at 3:35pm
			}
			if ($(this.element).is('[data-listomatic]')) {
				$.when(a = self._invokeAjaxCall())
				.then(function(){ 
					self._moreBtn(self.element);
					cachedList = $('[data-listomatic]').html();	
				});
				this.element.click(function(e){
					if ($(e.target).closest('li.listomatic').length > 0) {
						if (self._hasSearchTerm()) {
							self._setOffsetSearch();
						} else {
							self._setOffset();
						}
						$.when(a = self._invokeAjaxCall())
						.then(function(){
							self._moreBtn(self.element);
							if (!self._hasSearchTerm()) {
								cachedList = $('[data-listomatic]').html();
							}
						});
					} 
				});	
			} else if ($(this.element).is('[data-type=search]')) {
				var $datalistomatic = $('[data-listomatic]');
				$('[role=search] a').click(function() {
						self._resetSearchView($datalistomatic);
					}
				);
				this.element.keyup(function(){
					self._setSearchTerm($(this).val());
					if (self._hasSearchTerm()) {
						self._resetOffsetSearch();
						$datalistomatic.empty();
						$.when(a = self._invokeAjaxCall())
						.then(function(){
							self._moreBtn($datalistomatic);
						});
					} else {
						self._resetSearchView($datalistomatic);
					}
				});
			}
		},
		_moreBtn: function(e) {
			var aResp = $.parseJSON(a.responseText);
			if (aResp) {
				var totalAvailable = aResp.total;
				var totalDisplayed = $('li', e).not('li.listomatic').length;
				if (totalDisplayed < totalAvailable) {
					$(e).find('li.listomatic').remove();
					$(e).append('<li class="listomatic" data-theme="c" data-icon="false" ><a style="height: 1.5em; font-size:1.5em;; text-align:center;" href="#" data-role="button">' +  this.options.btnLabel + '</a></li>')
					.listview("refresh");
				} else {
					$(e).find('li.listomatic').remove();
				}
			}
			else {
				$(e).find('li.listomaticRemove').remove();
				$(e).append('<li class="listomaticRemove" data-theme="c" data-icon="false" ><a style="height: 1.5em; font-size:1.5em;; text-align:center;" href="#" data-role="button">' +  this.options.noResultsFound + '</a></li>')
				.listview("refresh");
			}
		},
		_refreshAt: function (hours, minutes, seconds) {
			var now = new Date();
			var then = new Date();
			if(now.getHours() > hours ||
				(now.getHours() == hours && now.getMinutes() > minutes) ||
				now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
				then.setDate(now.getDate() + 1);
			}
			then.setHours(hours);
			then.setMinutes(minutes);
			then.setSeconds(seconds);
			var timeout = (then.getTime() - now.getTime());
			setTimeout(function() { window.location.reload(true); }, timeout);
		},
		_setSearchTerm: function(t) {
			searchTerm = $.trim(t);
		},
		_getSearchTerm: function() {
			return searchTerm;
		},
		_resetSearchView: function($datalistomatic) {
			this._setSearchTerm('');
			this._resetOffsetSearch();
			$datalistomatic
			.empty()
			.html(cachedList)
			.listview("refresh");
		},
		_hasSearchTerm: function() {
			if (this._getSearchTerm()) {
				return true;
			} else {
				return false;
			}
		}, 
		_setOffset: function() {
			if (listOffset == undefined) {
				listOffset = 0;
			} else {
				listOffset = listOffset + this.options.perPage;
			}
		},
		_getOffset: function() {
			return listOffset;
		},
		_setOffsetSearch: function() {
			if (listOffsetSearch == undefined) { 
				listOffsetSearch = 0;
			} else {
				listOffsetSearch = listOffsetSearch + this.options.perPage;
			}
		},
		_getOffsetSearch: function() {
			return listOffsetSearch;
		},
		_resetOffset: function() {
			listOffset = 0;
		},
		_resetOffsetSearch: function() {
			listOffsetSearch = 0;
 		},
		registerAjaxCall: function(f, context) {
			registeredAjax = f;
			registeredAjaxContext = context;
		},
		_invokeAjaxCall: function() {
			var ajaxCallback = _getAjaxCall();
			if(registeredAjaxContext) {
				ajaxCallback.call(registeredAjaxContext);
			} else {
				ajaxCallback.call();
			}
		},
		_getAjaxCall: function() {
			return registeredAjax;
		},
		_getPerPage: function() {
			return this.options.perPage;
		},
		getResults: function() {
			if (this._hasSearchTerm()) {
				return {searchTerm: this._getSearchTerm(),
						perPage: this._getPerPage(), 
						listOffset: this._getOffsetSearch()};
			} else {
				return {perPage: this._getPerPage(), 
						listOffset: this._getOffset()};
			}
		}
	});
	$(document).on( "pageinit", function(e){
		$.mobile.listomatic.prototype.enhanceWithin(e.target, true);
	});
})(jQuery);
