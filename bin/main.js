#!/usr/bin/env node

"use strict";

var path = require("path");
var fs = require("fs");

var commander = require("commander");

var libPath = path.join(path.dirname(fs.realpathSync(__filename)), "../lib/main.js");
var lib = require(libPath);

var packageJson = require("../package.json");

commander.description("CloudFront Sign").version(packageJson.version)
	.option("-r --resource [resource]", "Resource. [Same as URL]")
	.option("-l --date-less-than [date]", "Date less than. [5 mins from now]")
	.option("-g --date-greater-than [date]", "Date greater than.")
	.option("-a --ip-address [n.n.n.n/nn]", "IP Address in CIDR format.")
	.option("-k --key-pair-id <key-pair-id>", "Key Pair ID.")
	.option("-p --private-key-path <private-key-path>", "Private Key Path.")
	.parse(process.argv);

console.log(commander.description() + " " + commander.version());
var url = commander.args[0];

fs.realpath(commander.privateKeyPath, function (err, path) {
	if (err) console.error(err)
	else fs.readFile(path, function (err, data) {
		if (err) console.error(err);
		else {
			var privateKey = data.toString();
			var result = lib(url, commander.resource, commander.dateLessThan, commander.dateGreaterThan, commander.ipAddress, commander.keyPairId, privateKey);
			console.log(JSON.stringify(result, null, "\t"));
		}
	});
});