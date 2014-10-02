CloudFront Sign
===============

An Amazon CloudFront URL signer, supporting canned and custom policies.

Install
-------

```bash
npm install -g cloudfront-sign
```

Execution
---------

```bash
cfsign -r <resource> -l <date-less-than> -g <date-greater-than> -a <ip-address> -k <key-pair-id> -p <private-key-path> <url>
```

or, using the argument long names:

```bash
cfsign --resource <resource> --date-less-than <date-less-than> --date-greater-than <date-greater-than> --ip-address <ip-address> --key-pair-id <key-pair-id> --private-key-path <private-key-path> <url>
```

* If you do not specify a resource, the URL is used.
* If you do not specify a 'date-less-than', a value of five minutes from now is used.
