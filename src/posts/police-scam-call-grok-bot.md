---
title: 'I Asked Grok Bot to Check a Police Scam Call. It Got One Thing Wrong'
seoTitle: 'Police Scam Call or Real? How Grok Bot Helped Me Check'
description: 'Is it a police scam call? Grok Bot did my fact-checking and wrongly doubted a genuine GMP email. What it got right, plus a UK checklist.'
date: '2026-10-19'
categories:
  - artificial-intelligence
  - security
published: true
---

<script>
	import XPostEmbed from '$lib/components/XPostEmbed.svelte'
</script>

Over two days I got a run of phone calls and an email, all supposedly from Greater Manchester Police. The first call was a scam. The rest turned out to be the real thing. Working out which was which would normally have eaten my morning, so I gave the job to [Grok Bot](https://x.ai/bot) and went back to work.

It did nearly everything I asked. It also talked me into doubting an email that was genuine. Both halves of that are worth knowing if you are thinking about handing this kind of job to an AI agent.

## What is Grok Bot?

I started using [Grok Bot](https://x.ai/news/introducing-grok-bot) after signing up to the X subscription. xAI launched it in beta in August and describes it as a team of always-on agents. Each one has its own computer, signs in to the tools you already use, and comes back to you when something needs your approval.[1]

In practice I message it like a colleague. I say what I need, it goes off and does the browsing, and it reports back.

## The call from “Emily from Manchester Police”

One evening a woman calling herself “Emily from Manchester Police” rang me. It sounded wrong, so I hung up. Grok Bot looked into the number and submitted a report through the contact portal on Greater Manchester Police’s (GMP) website. That one was a scam.

I posted about it on X at the time:[6]

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

The next morning more calls came in, this time from Manchester numbers. I had no idea whether they were the scammers trying again or someone from GMP responding to my report. Instead of searching each number myself, I asked Grok Bot to look into them.

## What Grok Bot found

The first number was +44 161 872 5050. Grok Bot confirmed it is a genuine GMP number, the one the force lists for people contacting it from abroad.[2] It also turned up GMP’s own warning, published recently, that scammers impersonating police officers are phoning people from spoofed GMP numbers.[3]

A second number was harder to pin down. Online reports were mixed, with some people calling it a genuine GMP callback line and others saying it had been spoofed.

Its advice was sensible:

1. Hang up and call 101 yourself instead of trusting the number on screen.
2. Text 7726 with “Call” followed by the number, to report a suspicious call to your mobile network.
3. Report it to Report Fraud on 0300 123 2040.[4]

It also fixed a mistake of mine. I had assumed report@phishing.gov.uk was somewhere to report police impersonation. It is for forwarding scam emails to the National Cyber Security Centre, and it is not a crime report.

## Then an email arrived

Next came an email from a GMP Cyber Crime address. It mentioned the report submitted the night before and said the Cyber Crime Unit had received several similar reports. It asked me to call back, and it said I could check the sender by giving their collar number to GMP call handlers, either on 101 or through the live chat on GMP’s website.

I asked Grok Bot to check it. It could not find the sender’s address published on GMP’s website. It found nothing about the callback number either, other than that it sits in a range some real GMP lines use. With a run of “police” numbers, it leaned towards this being the same scammers trying a new angle, and it told me to be wary.

That sounded reasonable to me. But the email had done something a scammer would be unlikely to do: it had given me a way to check it through a channel I controlled.

## Checking through GMP’s live chat

So I asked Grok Bot to open the live chat on GMP’s official website. It worked through the site’s security check and the cookie banner and reached the chat form. The form wanted a name, email address and mobile number before it would pass on a message. That is understandable for a police force, but you do hand over personal details before you have asked your question.

With my permission, Grok Bot read the email in my inbox so it could give the operator the investigator’s name and collar number. The operator asked whether a police call had been made the night before. The answer was that the report had gone through the web portal instead.

The operator then confirmed that the name and collar number matched a GMP employee. The email was genuine, from a real Cyber Crime Investigator following up on my report.

Then I rang GMP myself for the final conversation. That was the one step of the checking I did not hand over, and it was the one that mattered most.

Giving an AI agent access to your inbox is a real decision, even for one email. I made it knowingly, and you should decide for yourself how much access you are comfortable with.

## Where Grok Bot went wrong

Grok Bot did not get any of the facts wrong. GMP really has warned that its numbers are being spoofed. The email address really was not published on GMP’s website. Online reports about one of the morning numbers really were mixed. The mistake was in what it concluded from them.

“I couldn’t find this online” is not evidence that something is fake. Plenty of genuine email addresses and direct lines are never published, and an investigator’s working inbox is the last thing you would expect on a public web page. The bot read that gap as a warning sign, added it to the run of suspicious calls and saw a pattern that was not there.

Being over-cautious is the safer way to be wrong. If it had called a scam email genuine, this would be a very different post. Still, an agent searching the web can only tell you what is on the web. It cannot tell you the truth about a phone number or an email address nobody has written about.

## How much time it saved

Before tools like this, I would have spent the morning checking each number, reading forums, writing to GMP and phoning around until someone could confirm the email. Grok Bot looked up the numbers, found GMP’s warning, explained 7726 and Report Fraud, opened the live chat, pulled the details from my inbox and relayed them to the operator. All I had to do was ask.

The split worked. The bot did the legwork, and a person at GMP checked an internal record neither of us could see. It was also close to painless, which is not something I normally say about scam calls. I wrote recently about [how far AI has come at building software](/will-ai-kill-paid-software/), and this felt like the same shift arriving in everyday admin.

## Caller ID can’t be trusted either way

A phone number tells you nothing, because spoofing breaks it in both directions. A real GMP number on your screen does not prove a call is genuine, and an unfamiliar one does not prove it is fake. GMP’s own advice says scammers use software to make any number appear on your caller ID.[5] Its recent warning describes the same thing happening with GMP numbers.[3]

The only reliable check is one you start yourself. Hang up, then call 101 or use the live chat on the official website. The genuine email told me to do exactly that, and looking back, that advice was a better signal than anything Grok Bot found online.

## How to tell if a police call or email is a scam (UK checklist)

If you get a call, text or email claiming to be from the police:

1. Hang up, then call 101 yourself. Do not use a number the caller gives you. Use a different phone if you can, or wait a few minutes first, because scammers can keep a landline connected after you hang up.
2. If your force offers live chat, use it. Go to the force’s website directly, not through a link in a message.
3. Check a collar number through the force, not the caller. Give it to call handlers on 101 or through live chat.
4. Report suspicious calls to your network. Text 7726 with “Call” followed by the number.
5. Report fraud to Report Fraud on 0300 123 2040 or through its online reporting tool.[4] If you live in Scotland, report via 101.
6. Forward scam emails to report@phishing.gov.uk. It goes to the NCSC and is not a crime report.
7. Do not give bank details to someone who has phoned you.
8. Do not move money because a caller tells you to, however official they sound.
9. Never share passwords, recovery phrases or security codes. GMP says its officers will never ask for recovery phrases or security codes linked to cryptocurrency accounts.[3]

## Would I use Grok Bot for this again?

Yes. I would hand it the legwork again tomorrow: looking up numbers, gathering advice, opening the right page. What I will do differently is treat “I couldn’t find it” as a reason to check rather than a verdict, and make the final call myself.

Have you had a call or email claiming to be from the police? And would you trust an AI agent to tell you whether it was real? If you want to see what an agent like this can do for your own admin, [Grok Bot](https://x.ai/news/introducing-grok-bot) is in beta now. I pay for my own subscription.

## Sources

[1] [Introducing Grok Bot, xAI](https://x.ai/news/introducing-grok-bot)

[2] [Contact us, Greater Manchester Police](https://www.gmp.police.uk/contact/af/contact-us/)

[3] [Police urge public to remain vigilant following several scam calls across GM, Greater Manchester Police](https://www.gmp.police.uk/news/greater-manchester/news/news/2026/october/police-urge-public-to-remain-vigilant-following-several-scam-calls-across-gm/)

[4] [Report Fraud](https://www.reportfraud.police.uk/)

[5] [Common scamming tools, Greater Manchester Police](https://www.gmp.police.uk/advice/advice-and-information/fa/fraud/personal-fraud/common-scamming-tools/)

[6] [Post by Luke O’Regan on X](https://x.com/lukeoregan88/status/2111079484992397663)
