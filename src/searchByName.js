"use strict";

var CSLEDIT = CSLEDIT || {};

CSLEDIT.findByNamePage = (function () {
	var nameSearchTimeout;

	// --- Functions for style name search ---
	
	var searchForStyleName = function () {
		var searchQuery = $("#styleNameQuery").val(),
			searchQueryLower = searchQuery.toLowerCase(),
			result = [],
			styleId,
			styleName,
			masterId,
			masterStyleName;

		if (searchQuery.length === 0) {
			$("#styleNameResult").html("");
			return;
		}

		if (searchQuery.length < 3) {
			$("#styleNameResult").html("<p>Query too short<\/p>");
			return;
		}
		
		console.time("searchByStyleName");

		// dumb search, just iterates through all the names
		for (styleId in exampleCitations.styleTitleFromId) {
			if (exampleCitations.styleTitleFromId.hasOwnProperty(styleId)) {
				styleName = exampleCitations.styleTitleFromId[styleId];

				if (styleName.toLowerCase().indexOf(searchQueryLower) > -1 ||
					styleId.toLowerCase().indexOf(searchQueryLower) > -1) {
					masterId = exampleCitations.masterIdFromId[styleId];
					if (masterId !== styleId) {
						masterStyleName = ' (same as <a href="' + masterId + '">' +
							exampleCitations.styleTitleFromId[masterId] + '<\/a>)';
					} else {
						masterStyleName = "";
					}
					result.push({
							styleId : styleId,
							masterId : masterId
						});
				}
			}
		}

		CSLEDIT.searchResults.displaySearchResults(result, $("#styleNameResult"));

		console.timeEnd("searchByStyleName");
	};

	return {
		init : function () {
			// delayed search after typing
			$("#styleNameQuery").on("input", function(){
				clearTimeout(nameSearchTimeout);
				nameSearchTimeout = setTimeout(searchForStyleName, 500);
			});
				
			// instant search after typing enter
			$("#styleNameQuery").on("change", function(){
				console.log("on change");
				searchForStyleName();
			});

			// instant search after clicking button
			$("#searchButton").on("click", function(){
				console.log("button click");
				searchForStyleName();
			});


			$("#styleNameQuery").focus();
		
			searchForStyleName();
		}
	};
}());

$(document).ready(function () {
	CSLEDIT.findByNamePage.init();		
});


