"use strict";

define(['src/urlUtils', 'src/debug'], function (CSLEDIT_urlUtils, debug) {
	var cache = {},
		defaultStyleId = 'http://www.zotero.org/styles/apa';

	var getJSONData = function (path) {
		var url;
		if (!(path in cache)) {
			url = CSLEDIT_urlUtils.getResourceUrl(path);
			$.ajax({
				url : url,
				dataType : "json",
				async : false,
				success : function (data) {
					debug.log("fetched json: " + path);
					cache[path] = data;
				},
				error : function () {
					debug.log("WARNING: error fetching " + url);
				},
				cache : true
			});
		}
		return cache[path];
	};

	// used to generate the ids in the Zotero style repository
	var getNormalisedStyleTitle = function (styleTitle) {
		return styleTitle.
			replace(/&/g, "and").
			replace(/\(.*\)/g, ""). // remove everything in parentheses
			replace(/[\(\)\[\]]/g, ""). // remove any unmatches parentheses ,'\.
			replace(/[,'\.]/g, ""). // remove other chars
			replace(/[\\\/:"*?<>\| ]+/g, "-").
			replace(/--+/g, "-").
			replace(/-$/, "").
			toLowerCase().
			replace(/[����]|ã|á|à/g, "a").
			replace(/[����]|é|è/g, "e").
			replace(/[����]/g, "i").
			replace(/[����]/g, "o").
			replace(/[����]/g, "u").
			replace(/[�]/g, "n").
			replace(/[�]|ç/g, "c");
	};

	var generateStyleId = function (styleTitle) {
		return "http://www.zotero.org/styles/" + getNormalisedStyleTitle(styleTitle);
	};

	var localURLFromZoteroId = function (styleId) {
		var baseUrl = "external/csl-styles/";
		if (styles().masterIdFromId[styleId] !== styleId) {
			baseUrl += "dependent/";
		}

		return CSLEDIT_urlUtils.getResourceUrl(
			styleId.replace("http://www.zotero.org/styles/", baseUrl) + ".csl");
	};

	var fetchCslCode = function (styleId, success, error) {
		var localURL = localURLFromZoteroId(styleId);
		
		$.ajax({
			url : localURL,
			dataType : "text",
			success : success,
			error : error
		});
	};

	var styles = function () {
		return getJSONData('generated/cslStyles.json');
	};
	var exampleCitations = function () {
		return getJSONData('generated/preGeneratedExampleCitations.json');
	};

	return {
		styles : styles,
		exampleCitations : exampleCitations,
		defaultStyleId : defaultStyleId,
		defaultStyleURL : function () {
			return localURLFromZoteroId(defaultStyleId)
		},
		generateStyleId : generateStyleId,
		fetchCslCode : fetchCslCode,
		localURLFromZoteroId : localURLFromZoteroId
	};
});
