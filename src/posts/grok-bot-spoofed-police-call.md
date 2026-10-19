---
title: 'Spoofed Police Call? What Grok Bot Did and What It Missed'
seoTitle: 'Spoofed Police Call? What Grok Bot Did and What It Missed'
description: 'A spoofed GMP call, a follow-up email to verify, and an AI agent doing the legwork. The short version of what Grok Bot did and what to check yourself.'
date: '2026-10-19'
categories:
  - artificial-intelligence
  - security
published: true
---

<script>
	import XPostEmbed from '$lib/components/XPostEmbed.svelte'
</script>

A call from what looked like a Greater Manchester Police (GMP) number turned out to be a scam, and Grok Bot did most of the work of proving it. This is the short version. The [full write-up](/police-scam-call-grok-bot/) has the detail.

## What happened

A woman calling herself “Emily from Manchester Police” rang me from a number that belonged to GMP. It sounded wrong, so I hung up. GMP has warned that scammers are phoning people from spoofed GMP numbers.[1] I posted about it on X at the time:[3]

<XPostEmbed
	lines={[
		'A great @bot use case:',
		'I got a spoofed call from a number belonging to @gmpolice. The call sounded suspicious, so I hung up.',
		'@bot investigated the number, submitted a report through the police website and verified the follow-up email with Cyber Crime via live chat, including the officer’s collar number and PIN. That meant I could safely call back and report the incident.',
		'Watch out for scammers! — they’re spoofing real police numbers now. #ScamAware'
	]}
	author="Luke O’Regan"
	handle="lukeoregan88"
	date="October 16, 2026"
	url="https://x.com/lukeoregan88/status/2111079484992397663"
/>

## What Grok Bot did

I handed the legwork to [Grok Bot](https://x.ai/news/introducing-grok-bot), and it:

- investigated the number
- submitted a report through GMP’s website
- checked a follow-up email from the Cyber Crime team through the live chat, giving the operator the investigator’s collar number and PIN, which they matched to a GMP employee

That meant I could safely call back and talk to the real police.

## Where it slipped

Grok Bot could not find the email sender’s address online, so it told me to be wary of an email that was genuine. Not finding something on the web is a reason to check, not proof that it is fake. The [full article](/police-scam-call-grok-bot/) covers how that happened.

## If you get a call like this

1. Hang up and call 101 yourself, from a different phone if you can.
2. If the force offers live chat, use it to check a name, collar number and PIN.
3. Text 7726 with “Call” followed by the number to report it to your network.
4. Report it to Report Fraud on 0300 123 2040.

Grok Bot is in beta, and I pay for my own subscription.[2]

## Sources

[1] [Police urge public to remain vigilant following several scam calls across GM, Greater Manchester Police](https://www.gmp.police.uk/news/greater-manchester/news/news/2026/october/police-urge-public-to-remain-vigilant-following-several-scam-calls-across-gm/)

[2] [Introducing Grok Bot, xAI](https://x.ai/news/introducing-grok-bot)

[3] [Post by Luke O’Regan on X](https://x.com/lukeoregan88/status/2111079484992397663)
