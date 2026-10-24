---
title: 'PHP2Shell: What a Week of Patching Actually Looked Like'
seoTitle: 'PHP2Shell Patching Notes: A Week on Real Servers | LBOR'
description: A first-hand account of patching PHP2Shell across several servers, the mistake I caught on re-check, and the Node.js Brotli release that landed the same day.
date: '2026-10-24'
categories:
  - security
  - php
  - nodejs
published: true
---

<script>
	import XPostEmbed from '$lib/components/XPostEmbed.svelte'
</script>

On Wednesday 21 October, PHP fixed two remote code execution bugs. Node.js published a security release the same day. I spent most of the following days on the PHP one and squeezed the Node one in around it.

This is an account of what that looked like on a handful of real servers. I have left out hostnames, client names and anything else that would identify a system.

## I saw it coming the night before

I found out on X, on the evening of Tuesday 20 October, the night before the fixes shipped. At that point nothing was confirmed. A security account was passing on a rumour that two critical PHP remote code execution bugs were on the way, and it pointed at a [Hacker News thread](https://news.ycombinator.com/item?id=50167754) and nothing else:[6](#source-6)

<XPostEmbed
	lines={[
		'Rumours of 2 Critical CVSS 10 PHP >= 5 RCE vulnerabilities to be released on October 22nd are starting to circulate 👀',
		'No further details at this time, other than the Hacker News post.'
	]}
	author="Previdian"
	handle="PrevidianCyber"
	date="October 20, 2026"
	url="https://x.com/PrevidianCyber/status/2112608004134805619"
/>

A couple of hours later the same account posted the two CVE numbers. That was all I needed. I already knew what it meant for the servers I look after: an unauthenticated remote code execution bug in the PHP engine, on every box that serves a website. I did not see PHP's own pre-announcement until later, when I went looking for something official. It had gone out that same evening.[7](#source-7)

The rumour had the details slightly off. It said CVSS 10 and the 22nd, and the real ratings were 9.2 with fixes on the 21st.

The next morning the UK's National Cyber Security Centre published an alert.[8](#source-8) That is aimed at people who already follow security news, and it was not mainstream news. The BBC and Sky did not cover it until the afternoon of Wednesday 21 October, after 2pm. By then I had been working on it for the best part of a day. Knowing early did not make the patching any quicker, but it meant the news was no surprise when it landed.

## What PHP2Shell is

The two bugs are [CVE-2026-109618](https://nvd.nist.gov/vuln/detail/CVE-2026-109618) and [CVE-2026-109619](https://nvd.nist.gov/vuln/detail/CVE-2026-109619), nicknamed PHP2Shell after the exploit tool that chains them. The PHP security team rates both 9.2 on CVSS v4.0, and they allow unauthenticated code execution.[1](#source-1) The flaws sit in the PHP engine, so a WordPress site with spotless code is still exposed on an unpatched server.[2](#source-2)

The fixed releases are 8.2.35, 8.3.36, 8.4.27 and 8.5.12. PHP.net published nothing for 8.1 or older. The security team released source patches for 7.4, 8.0 and 8.1, and some package maintainers backported the fix into older versions.[2](#source-2)

The timing was unpleasant. Cloudflare reported early attacks at 07:43 UTC on release day, hours before the public release.[2](#source-2) Tenable's write-up goes back further and says Amazon Threat Intelligence saw an attempt on 17 October.[3](#source-3) Nobody was ahead of this one.

Sansec's update the next day was calmer. The public exploits needed specific conditions and did not work against a default PHP install, so mass exploitation looked less likely than first feared.[2](#source-2) That helped me judge how fast to move. It did not change the plan, because every server still needed the update.

## The first pass

I looked after five servers: four on [CloudPanel](https://www.cloudpanel.io/) and one on [CyberPanel](https://cyberpanel.net/). We worked through them on the 22nd. On the CloudPanel machines we upgraded PHP 8.2 to 8.5 to the fixed builds. On the CyberPanel machine the 8.2 and 8.3 builds were already the fixed ones, so there was nothing newer to install.

We also set [`session.upload_progress.enabled = 0`](https://www.php.net/manual/en/session.configuration.php#ini.session.upload-progress.enabled) in a small drop-in file for each PHP version. That is a stopgap. Vendor research says it does not fully protect you, so I treated it as a second layer behind the patched package.

I wrote it all up as done.

## The mistake

The next day I re-checked the first server and the drop-ins were missing on 8.2 to 8.5. Only the old 5.6 install had one. My notes said otherwise, and I had believed my notes.

The fix was quick: add the file to each version, restart PHP-FPM and test again. The useful part was how to test. Running `php -i` on the command line reads the CLI configuration, so it reports upload progress as On even when the FPM drop-in is correct. You have to ask the FPM binary, for example `php-fpm8.3 -i | grep upload_progress`, and you should see Off. If the drop-in shows On there, the service usually was not restarted.

After that I re-verified every other server from live output instead of from my log. The log had been wrong once, so I stopped trusting it.

## Turning things off instead of patching them

Each server had several PHP versions installed and only 8.3 was serving sites. The rest were left over from earlier jobs. Instead of keeping a patching job alive for versions nobody used, I disabled the idle ones with [`systemctl disable --now`](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html). A stopped PHP-FPM cannot be attacked, and `enable --now` undoes it. I checked the pools and site configs first, and I uninstalled and deleted nothing.

It was the cleanest result of the week, and it came from asking what was in use.

## The parts I could not fully fix

CloudPanel runs its own PHP for the control panel. On these servers it shares a binary with the system 8.1 package, and the CloudPanel repository has no fixed 8.1 build. I left the panel's PHP alone on purpose. For now it relies on a firewall that limits access to my IP, plus basic auth. That is a mitigation, and I have only tested the gating from outside on one server.

One server still runs an end-of-life PHP version for a legacy site, and upstream offers no fix for it. I have written that down as the real remaining risk.

A self-hosted file-sharing app I use needed a different approach. Its upstream had not released since January and the image bundled PHP 8.3.14. I rebuilt it on a newer [Alpine](https://alpinelinux.org/) base, which brought in 8.3.36, had the change reviewed and deployed it. I then confirmed the version from the running container.

There have been further updates and re-checks as recently as yesterday. The work is not finished, and it will not be until the legacy site is dealt with.

## Then Node.js

While the PHP work was still open, the Node.js project published a security release for the 26.x, 24.x and 22.x lines. One of the issues was a Brotli decoder flaw, [CVE-2026-111497](https://nvd.nist.gov/vuln/detail/CVE-2026-111497), rated high. Malformed compressed input could write past the end of an internal buffer, which could lead to a crash, memory disclosure or code execution in applications that decompress Brotli data with [`node:zlib`](https://nodejs.org/api/zlib.html).[4](#source-4)

I run two small Node apps under [PM2](https://pm2.keymetrics.io/), one on Node 22 and one on Node 24, so both needed updating. Installing the new versions was easy. Both processes were still running the old binary, because PM2 had pinned each one to the exact Node it was started with. A new install changes what `node` means in a fresh shell and leaves the running process alone. I recreated each PM2 entry with explicit paths to the new Node and npm binaries, checked the apps and saved the process list.[5](#source-5)

My first `pm2 list` showed nothing useful because I had run it as root. PM2 keeps a separate instance per user, and the apps lived under their own site accounts.

## The outage I caused

Partway through, an Nginx package update stopped halfway. Nginx failed its configuration test because the config held a [`limit_req_zone`](https://nginx.org/en/docs/http/ngx_http_limit_req_module.html) directive that the installed build did not support. It would not start, and every site behind it went down.

Neither vulnerability caused the only outage of the week. My response to them did. I backed up the config, commented out the unused directive, confirmed the config test passed, finished the interrupted package setup and restarted Nginx. The sites came back. The deprecation and OCSP messages that scrolled past were warnings and had nothing to do with it.

One app also printed a warning that its in-memory PM2 was out of date. The daemon and the local CLI were on different versions. Updating the daemon can restart every managed app, and everything was working, so I left it and noted it as a separate maintenance job.

## What I would do differently

I would verify from the machine every time, because my notes said a job was done when it was not. I would keep a config file for each long-lived Node process, so I never have to rebuild one from memory. I would run `nginx -t` before any package update that touches Nginx. And I would write the patch routine down once, so the fifth server takes no longer than the second.

Two critical advisories in a day felt like a rhythm more than an emergency: patch, check, find the next thing, repeat. The checking was where the week was won or lost.

## Sources

<ol>
	<li id="source-1"><a href="https://github.com/NCSC-NL/php2shell" rel="noopener noreferrer" target="_blank">php2shell vulnerabilities (CVE-2026-109618, CVE-2026-109619), NCSC-NL</a></li>
	<li id="source-2"><a href="https://sansec.io/research/php2shell" rel="noopener noreferrer" target="_blank">PHP2Shell: PHP RCE, Sansec</a></li>
	<li id="source-3"><a href="https://www.tenable.com/blog/php2shell-cve-2026-109618-cve-2026-109619-frequently-asked-questions-about-critical-php-remote" rel="noopener noreferrer" target="_blank">php2shell FAQ, Tenable</a></li>
	<li id="source-4"><a href="https://nodejs.org/en/blog/vulnerability/october-2026-security-releases" rel="noopener noreferrer" target="_blank">Node.js October 21, 2026 Security Releases</a></li>
	<li id="source-5"><a href="https://www.cloudpanel.io/docs/v2/nodejs/deployment/pm2/" rel="noopener noreferrer" target="_blank">CloudPanel PM2 deployment guide</a></li>
	<li id="source-6"><a href="https://x.com/PrevidianCyber/status/2112608004134805619" rel="noopener noreferrer" target="_blank">Previdian (@PrevidianCyber) on X, 20 October 2026</a></li>
	<li id="source-7"><a href="https://news-web.php.net/php.announce/509" rel="noopener noreferrer" target="_blank">Upcoming Critical PHP Security Release, php.announce, 20 October 2026</a></li>
	<li id="source-8"><a href="https://www.ncsc.gov.uk/news/critical-security-issue-affecting-php" rel="noopener noreferrer" target="_blank">Critical security issue affecting PHP, NCSC, 21 October 2026</a></li>
</ol>
