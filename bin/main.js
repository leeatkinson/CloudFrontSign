#!/usr/bin/env node

"use strict";

var path = require("path"),
	fs = require("fs"),
	commander = require("commander"),
	lib = require(path.join(path.dirname(fs.realpathSync(__filename)), "../lib/main.js")),
	packageJson = require("../package.json");

commander.description("CloudFront Sign").version(packageJson.version)
	.usage("[options] <url>")
	.option("-r, --resource [resource]", "Resource [URL]")
	.option("-l, --date-less-than [date]", "Date & time until the signed URL is valid [5 mins from now]")
	.option("-g, --date-greater-than [date]", "Date & time after the signed URL becomes valid")
	.option("-a, --ip-address [n.n.n.n/nn]", "Client's IP address (in CIDR format) for signed URL to be valid")
	.option("-k, --key-pair-id <key-pair-id>", "CloudFront key pair ID")
	.option("-p, --private-key-path <private-key-path>", "Private key path")
	.parse(process.argv);

console.log(commander.description() + " " + commander.version());
var args = commander.args;
if (args.length === 0) {
	console.error("URL is missing");
	commander.help();
}
var url = args[0],
	path = fs.realpathSync(commander.privateKeyPath);
fs.readFile(path, function (err, data) {
	if (err) console.error(err);
	else {
		var privateKey = data.toString();
		var result = lib(url, commander.resource, commander.dateLessThan, commander.dateGreaterThan, commander.ipAddress, commander.keyPairId, privateKey);
		console.log(JSON.stringify(result, null, "\t"));
	}
});
