---
title: 'Will AI Kill Paid Software? What an Open-Source Adobe Clone Shows'
seoTitle: 'Will AI Kill Paid Software? I Tried an Adobe Clone'
description: 'Will AI kill paid software? An AI-built, open-source Photoshop clone went viral. I tried it, and here is where Adobe still wins.'
date: '2026-10-13'
categories:
  - artificial-intelligence
  - software-development
  - open-source
published: true
---

<script>
	import XPostEmbed from '$lib/components/XPostEmbed.svelte'
</script>

Will AI kill paid software? The question was everywhere this month, after a developer released a suite of free, open-source apps that recreate Adobe’s creative tools from scratch in Rust, with Claude Opus 5.5 doing much of the coding.[1] DHH asked how many pencils, humans and hours it would once have taken to rebuild the Adobe suite by hand.[2] Others went further and declared paid software finished.

<XPostEmbed
	lines={[
		'How many pencils, how many humans, how many hours would it have taken to recreate the Adobe suite by hand?'
	]}
	author="DHH"
	handle="dhh"
	date="October 7, 2026"
	url="https://x.com/dhh/status/2107727330252874103"
/>

I tried the Photoshop one and then checked the big claims against the project’s own documentation. I don’t think paid software is going extinct, but what protects it has to change.

## What was actually built

The project is ArtCraft, from developer Brandon Thomas and a team. Its apps are called “Crafting Apps”, and the one that matters here is PhotoCraft, an open-source image editor aimed at Photoshop users.[3] It has layers, masks, adjustment layers, layer styles and support for real PSD files. The code is dual-licensed under MIT or Apache-2.0, so anyone can read it, fork it and build on it.[4]

It is also an early alpha. The project says so, and its documentation states that it is not yet a Photoshop replacement for daily professional work.[3][4]

Headlines tend to mix up “reverse engineered” and “clean-room”, which are different claims. The developer calls PhotoCraft a clean-room reimplementation, with its PSD support written from Adobe’s public file format specification.[4] Ars Technica describes the approach as AI-powered reverse engineering. It notes that reverse engineering “has generally been found legally acceptable”, but that the apps could still face trade dress claims if they copy Adobe’s look too closely.[1] Some readers question whether one team using AI against a finished product can ever be truly “clean”. I’m not a lawyer, so I’ll leave that argument to people who are.

## Why this was possible now

Photoshop makes an unusually good target. Adobe publishes its PSD file format specification, the feature set has been stable for decades, and every tool, panel and shortcut is covered by countless tutorials. An AI model with a clear reference to copy and a human steering it can cover a lot of ground quickly. The project even measures its roadmap in “Opus 5.5 agent wall-clock hours”.[4] Writing the code has become the cheap part.

## What I found when I tried it

PhotoCraft looks a lot like Photoshop, but I still found a learning curve despite the familiar layout.

Painting was the bigger problem. The app stuttered when I applied brush strokes. The project documents the same weakness: its roadmap reports meeting only 3 of 25 performance budgets, and its gap list includes open brush lag issues.[4] The team is moving quickly, and later release notes mention brush fixes.[5]

To me, this is the gap. AI got a lot of the features in, but it didn’t obviously supply the feel of a tool professionals have used every day for years. Someone has to sit with the software, notice that a brush stroke feels wrong and decide how to fix it, and today that still takes a human.

## Why Adobe still wins in the industry

I see three reasons companies will keep paying.

1. File exchange. Agencies and clients send around PSD, Illustrator, PDF and After Effects project files, and they expect them to open and behave correctly. The project reports that it round-trips 134 of 135 real-world PSD test files,[3] which is impressive, but its own gap list admits that PSDs it writes are not always accepted by Photoshop.[4] When a client’s file breaks, “almost compatible” isn’t good enough.
2. Generative tools in the subscription. Firefly credits are bundled into Creative Cloud plans, so people can generate images and video without buying a separate service.[6] PhotoCraft’s documentation lists generative fill and similar AI features as missing, with no machine-learning runtime yet.[4] ArtCraft’s own funding model is token-based access to its AI models, so it charges for generation too.[1]
3. Plug-ins and workflows. Photoshop’s third-party filters and scripts took decades to build. PhotoCraft doesn’t support Photoshop’s plug-in formats, only its own sandboxed plug-in system.[4]

Adobe isn’t visibly suffering yet, either. In the third quarter of its 2026 fiscal year it reported revenue of $6.76 billion, up 13% on the year before.[7] One viral clone doesn’t change a business that size overnight.

## Where the pressure is real

Adobe still has something to worry about. The people most likely to be tempted away have the least reason to be loyal: beginners, students and freelancers starting out, with no clients sending them project files.

Adobe has also given people reasons to resent it. In March 2026 the US Department of Justice announced a proposed settlement with Adobe over alleged violations of the Restore Online Shoppers’ Confidence Act, involving early termination fees and cancellation. It includes $75 million in civil penalties and $75 million in free services for qualifying customers, and takes effect if the court approves it.[8] Adobe has said it disagrees with the allegations.[9] A reputation like that makes alternatives more appealing, and several friends of mine are already exploring them.

Free tools aren’t new. Affinity is now free, although it requires a Canva account and keeps its AI features behind a paid plan.[10] GIMP, Krita and the browser-based Photopea have been around for years. What’s new is how quickly someone can produce a credible lookalike, and how many other products could be copied the same way.

## So, will AI kill paid software?

I don’t think so, but the easy version is in trouble. If a capable developer and an AI model can reproduce a product’s features in weeks, a subscription has to justify itself on something else. Small utilities and thin wrappers will find that hard.

Software that sells what code alone can’t copy looks much safer: years of polish and reliability, compatibility with the files everyone else uses, services and models that cost real money to run, and someone to call when it breaks. The code is getting cheaper, while trust and maintenance cost what they always did. I made a similar argument about [the changing economics of open source](/the-changing-economics-of-open-source/), where AI makes producing code cheaper but reviewing and maintaining it still takes human attention.

## What to watch next

PhotoCraft is moving fast, so any criticism I make has a short shelf life. I’ll be watching whether its performance catches up and whether it can exchange files reliably with Adobe’s products.

If you’re starting out, try it yourself, using the official project page or GitHub repository rather than a lookalike site. If you build software for a living, ask what your product offers that a clone can’t.

Do you think paid software has a long-term future? And if you were starting out as a freelancer today, would you pay for Adobe?

## Sources

[1] [“Software is over”: Bold AI developer takes aim at Adobe with open-source clones, Ars Technica](https://arstechnica.com/ai/2026/10/software-is-over-bold-ai-developer-takes-aim-at-adobe-with-open-source-clones/)

[2] [Post by DHH on X](https://x.com/dhh/status/2107727330252874103)

[3] [PhotoCraft, ArtCraft](https://getartcraft.com/apps/photocraft)

[4] [PhotoCraft repository, README, ROADMAP and gap documentation, GitHub](https://github.com/storytold/photocraft)

[5] [PhotoCraft releases, GitHub](https://github.com/storytold/photocraft/releases)

[6] [Generative credits FAQ, Adobe](https://helpx.adobe.com/creative-cloud/apps/generative-ai/generative-credits-faq.html)

[7] [Adobe Q3 FY2026 financial results, Adobe](https://news.adobe.com/news/2026/09/adobe-q3fy26-financial-results)

[8] [Adobe agrees to $150 million settlement and injunction, US Department of Justice](https://www.justice.gov/opa/pr/adobe-agrees-150-million-settlement-and-injunction-resolve-alleged-violations-restore-online)

[9] [Adobe statement on the settlement, Adobe](https://news.adobe.com/news/2026/03/adobe-statement)

[10] [Affinity free access, Affinity](https://www.affinity.studio/help/free-affinity-access/)
