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

AI has made it easier to produce code. It has not made it easier to decide what belongs in a project, review it safely, or support it for years afterwards. In open source, that gap matters: a pull request is not just a patch. It is a request for someone else’s attention.

That is why Sindre Sorhus’s decision to disable external pull requests across his repositories caught my attention. He says he will continue maintaining his projects and handling issues, but no longer accept outside pull requests.[4] In a follow-up, he makes clear that this is not simply an anti-AI reaction: he believes contribution quality was declining before AI, while AI has accelerated that trend and made PR spam worse. He also uses AI himself, and says it can be quicker to generate, verify and ship a fix than to spend time reviewing a low-quality submission.[5]

It is a striking response, but the underlying pressure is not new. Open source has always depended on people donating more than code: they donate time to review, explain, coordinate, release and keep projects dependable. AI changes the price of producing a proposed change. It does not remove the work of deciding whether that change is useful.

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

[4] [Sindre Sorhus on disabling external pull requests](https://x.com/sindresorhus/status/2105693826690298314)

[5] [Sindre Sorhus on why he disabled external pull requests](https://x.com/sindresorhus/status/2105720399266984369)
