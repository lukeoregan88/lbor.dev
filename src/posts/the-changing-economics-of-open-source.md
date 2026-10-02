---
title: 'The Changing Economics of Open Source'
seoTitle: 'The Changing Economics of Open Source Maintenance'
description: 'AI can make code cheaper to produce, but open source maintainers still pay the cost of review. What happens when contributor volume outgrows maintainer time?'
date: '2026-10-02'
categories:
  - open-source
  - software-development
  - artificial-intelligence
published: true
---

<script>
	import XPostEmbed from '$lib/components/XPostEmbed.svelte'
</script>

I stumbled across a post from an open-source maintainer announcing that external pull requests were disabled across their repositories, while issues and ongoing maintenance would continue.[4]

It made me take a step back. In a follow-up, the maintainer explained the decision in terms of time: they use AI to generate, verify and ship fixes rather than spend time reviewing low-quality submissions. They also made clear that the problem was not caused by AI alone; in their view, contribution quality had been declining already, and AI accelerated the trend.[5]

That made the current capability of AI feel concrete to me. The striking part was not just that AI can produce code, but that an experienced maintainer might find it faster to produce and verify a fix than to review an outside contribution. That is one person’s experience, not a verdict on every project—but it made me think about what happens when producing code gets cheaper while reviewing and maintaining it still costs human time.

<XPostEmbed />

The pressure behind that decision is not new. Open source has always depended on people donating more than code: they donate time to review, explain, coordinate, release and keep projects dependable. AI changes the price of producing a proposed change. It does not remove the work of deciding whether that change is useful.

## Code is not the whole contribution

From the contributor’s point of view, a pull request can feel like a gift: time spent finding a problem, writing a fix and preparing it for someone else’s project. From the maintainer’s point of view, it is also an obligation to assess. Does it solve a real problem? Does it fit the project’s direction? Is it secure? Will it work on supported platforms? What new behaviour will need documenting and maintaining?

Those questions existed before generative AI. What has changed is the ease with which a plausible-looking patch can be produced and submitted. When creating a patch gets cheaper, the number of patches may rise faster than a maintainer’s capacity to assess them. That is not an argument that AI-generated contributions are inherently poor. It is a reminder that more output is not automatically more useful work.

Research on open source maintenance has described maintainer time and labour as resources that can be depleted. A study based on interviews with ten maintainers across nine established projects found that project sustainability depends on supporting both maintainer and contributor labour—and that too little or too much contributor activity can create problems. More contributions can bring value, but they can also bring more technical work and community interaction to manage.[1]

The Linux Foundation’s interviews with 32 maintainers of critical open source projects found that the demands on maintainers’ time grow as projects become more complex. The report also notes that timely responses to pull requests affect the contributor experience. There is a tension here: maintainers need the freedom to protect their limited time, while projects need a way to welcome and develop the contributors who may share that work in future.[2]

## The hidden cost of “free” software

Open source is often described in terms of the code: it is available to use, inspect, modify and share. But the ongoing economics are human. Someone has to decide which changes fit, deal with regressions, respond to users, prepare releases and keep dependencies current. Some maintainers are paid to do that work; many are not.

In Tidelift’s 2023 survey of 339 maintainers, 60% described themselves as unpaid hobbyists, and 77% of unpaid respondents said they would prefer to be paid. The survey also found that maintainers who receive compensation tend to spend more time on open source work.[3] Those results are not a census of every project, but they underline a basic constraint: goodwill does not create unlimited hours.

When the review queue grows, the cost is not only the minutes spent reading code. It can include context-switching, explaining decisions, checking edge cases, maintaining changes after merge, and the social work of declining a contribution respectfully. A maintainer who spends every available hour processing submissions has less time for planned work, documentation, security, or simply stepping away.

This is why the question is not just whether AI can write a good patch. It is whether the whole contribution is worth the attention it asks of someone else—and whether the project has the capacity to take responsibility for it.

## A boundary is not the end of open source

Disabling external pull requests is a significant boundary, and it will disappoint some contributors. But it does not make a project’s code private, revoke its licence, or stop people from using and forking it. Nor does every project owe every proposed change a review. Open source gives people rights over the code under its licence; it does not guarantee that maintainers will incorporate a contribution.

At the same time, closing the pull-request door has costs. It can make it harder for newcomers to learn through real contributions, reduce the range of perspectives a project sees, and leave maintainers with fewer paths to share the workload. A boundary can be reasonable for one maintainer or project without being the best model for every community.

There may be ways to make participation more useful without treating every patch as a ready-to-merge request. A detailed issue with a reliable reproduction can help a maintainer understand and prioritise a problem. Smaller changes, clear tests, project-specific contribution guidance and staged trust can lower review friction. Automation can check formatting or run tests, while people retain responsibility for design and acceptance. Non-code work—documentation, support, triage and reproductions—can also help a project, if its maintainers say that help is wanted.

None of these practices makes review free. They can only make the attention spent on it more likely to produce something useful. And they need to fit the project: a one-person library, a company-backed framework and a community-governed platform do not have the same resources or obligations.

## Maintainer attention is the scarce resource

AI makes it tempting to measure contribution by how much code can be generated. Open source may need a different measure: how much useful, maintainable progress can a community make with the attention it actually has?

That shifts some responsibility onto contributors. Before opening a pull request, it is worth asking whether the project invites that kind of change, whether the issue has been discussed, and whether the patch is small, tested and explained well enough to review. It also shifts responsibility onto organisations that depend on open source: if critical projects matter to your business, funding maintenance and sharing stewardship are more durable forms of support than sending more code over the wall.

Sorhus’s decision is one response to a changing balance of costs, not a universal prescription. The harder question is what a healthy contribution model should look like when generating code becomes easier but human attention remains finite.

If you maintain or contribute to open source, what should change first: who can submit code, how contributions are reviewed, or what maintainers are expected to take on?

## Sources

[1] [Sustaining Maintenance Labor for Healthy Open Source Software Projects through Human Infrastructure: A Maintainer Perspective](https://arxiv.org/abs/2408.06723)

[2] [Open Source Maintainers: Exploring the people, practices, and constraints facing the world’s most critical open source software projects](https://project.linuxfoundation.org/hubfs/LF%20Research/Open%20Source%20Maintainers%202023%20-%20Report.pdf)

[3] [The 2023 Tidelift State of the Open Source Maintainer Report](https://www.sonarsource.com/open-source-maintainer-survey-2023.pdf)

[4] [Original post on X](https://x.com/sindresorhus/status/2105693826690298314)

[5] [Follow-up on X](https://x.com/sindresorhus/status/2105720399266984369)
