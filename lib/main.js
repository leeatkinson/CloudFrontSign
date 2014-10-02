"use strict"

var crypto = require('crypto');
var querystrings = require('querystring');
var urls = require('url');

function getTimeStamp(date) {
	return Math.round((new Date(date)).getTime() / 1000);
}
function makeUrlFriendly(string) {
	return string.replace(/\+/g, "-").replace(/=/g, "_").replace(/\//g, "~");
}
function isStringOrNumber(o) {
	var t = typeof o;
	return (t === "string") || (t === "number");
}

function sign(url, resource, dateLessThan, dateGreaterThan, ipAddress, keyPairId, privateKey) {
	var parsedUrl = urls.parse(url);	
	if (typeof resource == "undefined") resource = url;
	var isCustomPolicy = dateGreaterThan || ipAddress;
	if (isStringOrNumber(dateLessThan)) dateLessThan = new Date(dateLessThan);
	else if (typeof dateLessThan !== "date") {
		dateLessThan = new Date();
		dateLessThan.setMinutes(dateLessThan.getMinutes() + 5);
	}
	if (isStringOrNumber(dateGreaterThan)) dateGreaterThan = new Date(dateGreaterThan);
	var result = {
		url: url,
		resource: resource,
		dateLessThan: dateLessThan,
		dateGreaterThan: dateGreaterThan,
		ipAddress: ipAddress,
		keyPairId: keyPairId		
	}
	var dateLessThanTimeStamp = getTimeStamp(dateLessThan);
	var condition = { DateLessThan: { "AWS:EpochTime": dateLessThanTimeStamp } };
	if (dateGreaterThan)  condition.DateGreaterThan = { "AWS:EpochTime": getTimeStamp(dateGreaterThan) };
	if (ipAddress)  condition.IpAddress = { "AWS:SourceIp": ipAddress };
	result.policy = { Statement: [ { Resource: resource, Condition: condition } ] };
	var policyString = JSON.stringify(result.policy);
	var signature = makeUrlFriendly(crypto.createSign("RSA-SHA1").update(policyString).sign(privateKey, "base64"));
	var querystring = { "Key-Pair-Id": keyPairId, Signature: signature };
	if (isCustomPolicy) querystring.Policy = makeUrlFriendly(new Buffer(policyString, "utf8").toString("base64"));
	else querystring.Expires = dateLessThanTimeStamp;
	result.signedUrl = url + (parsedUrl.path.indexOf('?') > 0 ? '&' : '?') + querystrings.stringify(querystring);
	return result;
}

module.exports = sign;