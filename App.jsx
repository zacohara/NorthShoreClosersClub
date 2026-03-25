import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { loadAllProgress, saveQuizResult, loadAnalyses, saveAnalysis, loadLatestDigest, loadAllAnalyses, loadProfile, loadAllProfiles, saveProfile, updateStreak, getPassword, setPassword, checkPassword } from "./supabase.js";

const Q = [{"quiz_number":1,"categories":"Advanced Techniques • Bonding & Rapport • Decision • Fulfillment • Up-Front Contract","questions":[{"number":1,"category":"Up-Front Contract","difficulty":"Intermediate","question":"You're meeting a homeowner whose insurance adjuster has approved $28,000 for chimney and masonry repair after storm damage. At the start of the meeting, the homeowner says: 'The adjuster said $28,000 is what we have to work with — just tell me if you can do it for that.' How do you set a UFC that keeps the conversation open while respecting their situation?","options":{"A":"Immediately agree to work within the $28,000 and proceed to discuss what work can be done for that amount","B":"Decline and explain that you don't do insurance work at adjuster-set prices","C":"Acknowledge the adjuster's number, then set a UFC that includes: you'll need to understand the full scope, you'll both figure out whether the approved amount is sufficient, and at the end you'll know whether a project makes sense — including the possibility that the scope needs to be re-submitted to the adjuster","D":"Ask for the adjuster's contact information so you can negotiate the scope directly with them before speaking with the homeowner further"},"correct":"C","explanation":"Insurance claims involve a complex three-party dynamic. A UFC should acknowledge the approved amount as a starting data point, not as a fixed ceiling. Often adjusters under-scope masonry work — the UFC gives you the opportunity to assess whether the approved scope is accurate and whether a supplemental claim is appropriate, all while managing the homeowner's expectations fairly.","tip":"Insurance adjusters frequently miss masonry items — they approve chimney cap repair but miss the flashing, or scope tuckpointing but miss the deteriorated lintels behind the brick. Your UFC should include: 'I want to make sure the approved scope actually matches what's needed. If I find something the adjuster missed, do I have your permission to help you get that added to the claim?'"},{"number":2,"category":"Decision","difficulty":"Intermediate","question":"Which of the following is NOT one of the Six Elements of the Decision Step (the 5 W's + H)?","options":{"A":"WHO — who is involved in the decision?","B":"WHEN — what is their timeline?","C":"WORTH — what is the project worth to them financially?","D":"HOW — how will they decide between contractors?"},"correct":"C","explanation":"The six Decision Step elements are: WHO, WHAT (what process do they follow?), WHEN, WHERE (where does the final decision happen?), WHY (why are they seeking multiple bids?), and HOW (what are their selection criteria?). 'WORTH' or financial value is addressed in the Budget step, not the Decision step.","tip":"For commercial masonry bids, the WHERE matters as much as the WHO. A decision made by a facilities manager at a Monday morning meeting is very different from a decision that goes to a quarterly board meeting. Knowing the WHERE tells you whether you have a three-day window or a six-week one."},{"number":3,"category":"Decision","difficulty":"Intermediate","question":"After walking a commercial property, the property manager says: 'We're also getting bids from two other masonry companies.' What is the Sandler response to this information?","options":{"A":"Ask for the names of the competing companies so you can research and counter their approach","B":"Acknowledge the competitive process, then ask: 'When you evaluate the bids, what matters most to you? What would a contractor need to demonstrate to be the obvious choice for your board?' This surfaces their real selection criteria","C":"Tell them you prefer not to participate in competitive bid situations and ask if there's a way to be considered as a sole-source contractor","D":"Offer a 'competitive bid guarantee' — promise to match any lower qualified bid"},"correct":"B","explanation":"Knowing there's competition is not a problem — it's an opportunity to understand the selection criteria so you can compete on the dimensions that matter most to the decision-maker. 'What would make the obvious choice' is an open-ended question that often produces a short list of criteria that you can address specifically in your proposal.","tip":"In a competitive bid for a North Shore commercial account, the property manager often has a contractor they'd prefer to use — they're getting bids for internal governance reasons. Asking what matters most frequently surfaces: 'We've had issues with contractors disrupting tenants' or 'our board wants someone with historic brick experience.' Those are the dimensions to dominate in your proposal."},{"number":4,"category":"Advanced Techniques","difficulty":"Intermediate","question":"Sandler Rule #12 states 'Answer every question with a question.' This technique is called Reversing. Which of the following is the CORRECT three-step structure of a proper Reverse?","options":{"A":"Deflect → Redirect → Close","B":"Stroke (acknowledge the question) → Soften ('before I answer, do you mind if I ask\\...?') → Ask the question that uncovers the intent behind their question","C":"Pause → Reverse → Answer immediately after getting their clarification","D":"Acknowledge → Challenge → Provide the correct information"},"correct":"B","explanation":"The three-step Reverse prevents the salesperson from answering prematurely (before understanding intent) while keeping the conversation respectful and conversational. The Stroke shows you heard the question. The Softener gives permission to answer with a question. The Question itself uncovers what the prospect is really asking or concerned about.","tip":"When a homeowner asks 'are you licensed and insured?' the Reverse gives you far more value than just saying 'yes': 'Absolutely — did you have an experience with a contractor who wasn't? What happened?' That question takes 5 seconds and opens a pain conversation about why they care, who let them down before, and what they're really trying to protect against."},{"number":5,"category":"Bonding & Rapport","difficulty":"Advanced","question":"You're meeting with the facilities director of a 12-building commercial condo association about ongoing masonry maintenance. In the first five minutes, she mentions that the association's previous masonry contractor 'always promised things they never delivered.' How should you handle this to build genuine rapport without over-promising or getting defensive?","options":{"A":"Immediately list your company's certifications, warranties, and references to prove you're different from the previous contractor","B":"Agree that many contractors overpromise, then use a third-party story about how a similar association resolved that trust issue by requiring milestone-based payment terms","C":"Assure her that North Shore Masonry always delivers and ask her to give you a chance to prove it","D":"Ask her to elaborate on what specifically wasn't delivered, then empathize and pivot immediately to discussing your proposal"},"correct":"B","explanation":"Sandler Rule #45 teaches using third-party stories to make points that would create resistance if stated directly. Agreeing with her frustration (Nurturing Parent) and then sharing how a similar client solved the trust problem through structure — rather than promises — builds credibility without triggering skepticism. It shows you understand the problem at a systems level.","tip":"Commercial property managers have been burned by contractors who talk a great game. Saying 'we're different' is what every contractor says. Saying 'I had a property manager in Evanston with the exact same concern — here's the accountability structure we built into their contract' is what actually builds trust with an S- or C-style commercial client."},{"number":6,"category":"Fulfillment","difficulty":"Advanced","question":"You're presenting a $195,000 facade restoration proposal to a commercial building owner. You've confirmed pain, budget, and decision process. After your presentation, the owner says: 'This looks great. I just want to have my attorney review the contract terms before we proceed.' How do you handle this?","options":{"A":"Agree and send the contract to their attorney without further discussion","B":"Treat this as a potential Post-Sell concern: acknowledge it as reasonable, confirm a specific timeline for attorney review ('When do you think they'll have it back to you?'), and establish what a 'yes' looks like after review — confirming this is a process step, not a delay tactic","C":"Offer to simplify the contract terms to avoid the attorney review delay","D":"Ask why they feel they need attorney review — it may signal they have concerns about the scope or your company's credibility"},"correct":"B","explanation":"Attorney review on a $195,000 contract is reasonable and professional — not a red flag. The Sandler move is to acknowledge it as appropriate, confirm a specific timeline, and establish what approval looks like after review. This converts an open-ended 'we'll get back to you' into a structured next step with a date and defined outcome — the core of a UFC.","tip":"On large commercial projects, attorney review is standard practice. The risk is that 'attorney review' becomes an indefinite delay with no momentum. Setting a clear next step — 'If the attorney clears the contract by Thursday, can we target a start date of the first week of next month?' — maintains momentum and ensures the attorney review has a business purpose and a timeline attached."}]},{"quiz_number":2,"categories":"Decision • Negative Reverse Selling • Pain / Pain Funnel • Post-Sell • Up-Front Contract","questions":[{"number":1,"category":"Pain / Pain Funnel","difficulty":"Beginner","question":"According to Sandler, what are the THREE levels of pain that a salesperson must uncover to create genuine buying urgency?","options":{"A":"Functional pain, Financial pain, and Future pain","B":"Surface pain (the stated problem), Business Impact (financial/operational consequences), and Personal Impact (how it affects the individual emotionally)","C":"Immediate pain, Long-term pain, and Hidden pain","D":"Prospect pain, Property pain, and Process pain"},"correct":"B","explanation":"Sandler's three pain levels move from WHAT (the surface problem) to WHY IT MATTERS (business impact) to HOW IT AFFECTS YOU PERSONALLY (emotional pain). Decisions are made at Level 3 — the personal emotional stake. A prospect who only has surface pain rarely buys with urgency.","tip":"A homeowner who says 'the chimney is cracking' has Level 1 pain. When they say 'we've had to redo two sections of drywall' they're at Level 2. When they say 'my wife refuses to use the fireplace now and we fight about it every winter' — that's Level 3, and that's where the buying decision lives."},{"number":2,"category":"Up-Front Contract","difficulty":"Beginner","question":"Which of the following is the most common mistake salespeople make when attempting an Up-Front Contract?","options":{"A":"Making the UFC too short — skipping the 'Appreciate' and 'Naturally' components","B":"Letting the prospect redefine the outcome as 'I'll think it over' or 'I'll get back to you' without addressing it","C":"Setting the UFC before establishing any rapport at all","D":"Using the UFC only during in-person meetings and not on phone calls"},"correct":"B","explanation":"The most destructive UFC mistake is accepting 'I'll think about it' as an outcome. This is a non-outcome that leaves you with no information, no next step, and no ability to advance or disqualify the opportunity. A properly trained Sandler salesperson addresses this immediately: 'Typically when I hear that, it means the fit isn't quite right — is that the case here?'","tip":"In the masonry business, 'I'll think about it' after a site visit costs you follow-up time chasing people who were never going to buy. Getting to a real yes or no — even a no — is more valuable than three weeks of unanswered texts to a homeowner who was price-shopping from the start."},{"number":3,"category":"Negative Reverse Selling","difficulty":"Beginner","question":"What is the psychological principle that makes Negative Reverse Selling effective?","options":{"A":"Prospects are more likely to agree when they feel the salesperson is being honest about limitations","B":"Psychological reactance — when people feel their freedom of choice is threatened (like being 'sold'), they instinctively push back; removing that pressure allows them to move forward voluntarily","C":"Negative statements create urgency because prospects fear missing out on a limited opportunity","D":"Prospects trust contractors who express doubt about their own capabilities"},"correct":"B","explanation":"Psychological reactance is the documented phenomenon where people push back against perceived attempts to influence their choices. By removing the 'sales pressure' dynamic and positioning statements so that 'no' is the expected response, Negative Reverse removes the resistance reflex — allowing prospects to move toward the salesperson without feeling manipulated.","tip":"The moment a homeowner senses you 'need' the job, their guard goes up. Negative Reverse signals the opposite: you're a busy professional who doesn't need any specific project. That posture alone makes you more attractive. 'I'm not sure this is the right fit for your timeline' said confidently creates more urgency than any pressure tactic."},{"number":4,"category":"Decision","difficulty":"Intermediate","question":"A homeowner says: 'My husband and I are both involved in the decision, but he's traveling for work and won't be back until next week.' You've just completed a full site assessment. What is the Sandler-correct approach?","options":{"A":"Present the proposal to the wife now and have her discuss it with her husband when he returns","B":"Delay the site visit entirely until both decision-makers are available","C":"Complete the discovery conversation with the wife, confirm her understanding of the scope and urgency, then schedule the proposal presentation for when both are present — framing this as serving them both rather than slowing things down","D":"Send the proposal digitally so the husband can review it remotely and they can make a decision before he returns"},"correct":"C","explanation":"Presenting to only one decision-maker puts your proposal in the hands of an internal advocate who may not represent your solution as well as you would. Completing discovery now and scheduling the presentation when both are present is not a delay — it's respecting the actual decision-making unit. A proposal delivered to a complete audience closes faster than one delivered to a proxy.","tip":"Sending a $35,000 proposal by email to a homeowner whose spouse wasn't present means your proposal sits in an inbox while the husband asks 'did you get three quotes?' and the wife says 'I'm not sure.' The Sandler move is to schedule a 30-minute call or meeting with both of them together — that's where proposals close."},{"number":5,"category":"Post-Sell","difficulty":"Intermediate","question":"Why does asking a buyer 'is there anything that might prevent this from moving forward?' actually BUILD trust rather than introduce doubt?","options":{"A":"Because it shows the salesperson is thorough and detail-oriented, which homeowners appreciate","B":"Because only someone who genuinely believes in their solution would invite doubt to be surfaced — it signals confidence and equal business stature rather than desperation","C":"Because it gives the buyer an opportunity to voice concerns that would otherwise be suppressed and resurface later","D":"Both B and C — the question signals confidence AND gives buyers a healthy outlet for concerns"},"correct":"D","explanation":"The Post-Sell question works on two levels simultaneously: it projects confidence (only a salesperson who believes in their solution asks this) and it provides a constructive outlet for doubts that would otherwise ferment. Both effects strengthen the deal — one psychologically and one practically.","tip":"A masonry contractor who asks 'before I put this into the schedule — is there anything that might change your mind about going forward?' sounds like a confident professional, not a salesperson desperate for the deposit. The homeowner feels respected, not pressured. That's the tone that earns referrals to neighbors before the project even starts."},{"number":6,"category":"Decision","difficulty":"Advanced","question":"A commercial property manager tells you they're the decision-maker, but when you ask about the process, they reveal that 'ownership reviews all contractor selections over $50,000.' Your project is estimated at $180,000. What is the Sandler-correct response?","options":{"A":"Accept their answer — property managers typically have implied authority even when formal approval is required","B":"Acknowledge the process, then explore two things: what information ownership needs to approve a selection, and whether there's an opportunity to meet with or present to ownership directly at any point in the process","C":"Scale down the scope to under $50,000 so the property manager can approve it independently, then add scope in future phases","D":"Ask the property manager to get pre-authorization from ownership before you invest time in a full proposal"},"correct":"B","explanation":"When ownership approval is required for the project size, your contact is an influencer, not the final decision-maker — regardless of their title or enthusiasm. The Sandler move is to map the internal process and find a way to ensure ownership has what they need to approve your recommendation. If ownership has concerns you never address, even a highly supportive property manager can't get you approved.","tip":"On $100K+ commercial projects in the North Shore market, the 'decision-maker' is often a committee, a board, or a management company principal who never visited the site. Building a proposal presentation package specifically for that audience — not just the facilities contact — can be the difference between approval and 'the board wants to re-bid this next quarter.'"}]},{"quiz_number":3,"categories":"Budget • Decision • Fulfillment • Pain / Pain Funnel • Sandler Rules & Principles","questions":[{"number":1,"category":"Decision","difficulty":"Beginner","question":"You've completed a thorough site inspection and Pain Funnel conversation with a homeowner about a $25,000 front steps and landing project. You're about to start scoping the proposal. Before you do, what Decision step question is most critical to ask?","options":{"A":"'When would you like the project to start?'","B":"'Besides yourself, is there anyone else who will be involved in choosing a contractor for this?'","C":"'What's your timeline for making a decision?'","D":"'Have you gotten other quotes yet?'"},"correct":"B","explanation":"Before investing time in a full proposal, knowing who the decision-maker(s) are is the most important protective question. Discovering after the proposal presentation that a spouse, parent, financial advisor, or board member also has to approve the decision means your proposal may be evaluated without you present — and without the full context of your discovery conversation.","tip":"On residential projects over $15,000, the 'besides yourself' question should be standard before every proposal. Asking it after presenting a $25,000 proposal to a homeowner whose spouse handles the finances means your best case is a second meeting you weren't prepared for. Ask it first, involve all decision-makers early, and close once."},{"number":2,"category":"Fulfillment","difficulty":"Beginner","question":"A homeowner couple is reviewing your $22,000 brick repair proposal. The husband asks: 'Do you also do concrete work? We might want to get that driveway looked at.' How should you handle this in the middle of the Fulfillment step?","options":{"A":"Enthusiastically explain your concrete capabilities and offer to add a driveway assessment to the current proposal to maximize the project scope","B":"Acknowledge the question briefly and redirect: 'Absolutely — happy to take a look at that separately. Let's make sure we've covered everything on the masonry proposal first, and then I'll walk the driveway before I leave.' Keep the focus on closing the current scope before opening new scope.","C":"Tell them you don't do concrete work and refer them to a concrete contractor","D":"Add the driveway to the current proposal scope to demonstrate your full-service capabilities"},"correct":"B","explanation":"Introducing new scope in the middle of a Fulfillment presentation dilutes focus and can create a reason to delay the current decision ('let's wait until we figure out the driveway too'). The correct move is to park the new topic with a clear commitment to address it — then bring the current presentation to a close before expanding the conversation.","tip":"New scope introductions during the close are common — homeowners sometimes bring them up as unconscious delay tactics. Acknowledging the topic and redirecting ('I'll walk the driveway before I leave') keeps the current close on track while showing you're not ignoring their interest. One close at a time; one upsell at a time."},{"number":3,"category":"Pain / Pain Funnel","difficulty":"Intermediate","question":"A homeowner tells you: 'We've had this tuckpointing issue for about three years. We had one contractor patch it two years ago but it started failing again after the first winter.' You're now at Pain Funnel question #5. What do you ask?","options":{"A":"'What did that contractor charge you for the patch?'","B":"'Has anything you've tried so far worked, or is the problem still getting worse?'","C":"'Why did you wait two years before getting another contractor out here?'","D":"'What kind of masonry contractor did the original patch — were they licensed?'"},"correct":"B","explanation":"Pain Funnel Question #5 confirms that prior attempts have failed and that the pain persists. 'Has anything you've tried so far worked?' validates the homeowner's frustration (the patch didn't solve it) and deepens emotional investment. It also sets up Question #6 (financial cost) by establishing that money was already spent without solving the problem.","tip":"A homeowner who has already spent money on a failed fix is a highly motivated buyer — they've demonstrated willingness to invest and they have proof that cheap solutions don't work. Question #5 surfaces this and opens the door to a conversation about doing it correctly this time. This prospect is worth your full discovery process."},{"number":4,"category":"Sandler Rules & Principles","difficulty":"Intermediate","question":"Sandler Rule #45 recommends becoming 'adept at using third-party stories.' What is the primary strategic advantage of a third-party story over a direct statement?","options":{"A":"Third-party stories are more memorable than direct statements and leave a stronger impression after the meeting","B":"Third-party stories bypass the prospect's resistance by conveying a point through a client's experience rather than a direct claim — which the prospect can accept without feeling pushed","C":"Third-party stories are legally safer than direct claims about capabilities or outcomes","D":"Third-party stories allow the salesperson to address objections indirectly and save the direct response for later"},"correct":"B","explanation":"When a salesperson says 'we do excellent work and our clients are always satisfied,' prospects are skeptical — it's self-interested. When a salesperson says 'I had a client in Evanston in a similar situation who was skeptical about the price — here's what happened,' the prospect processes it as objective evidence. The same information, delivered indirectly, produces far less resistance.","tip":"Build a library of 6--8 specific North Shore client stories covering common scenarios: the homeowner who chose the lowest bidder first and ended up calling you to fix the work; the commercial manager whose retaining wall failure was prevented by proactive inspection; the insurance claim where you found $22,000 in supplemental items the adjuster missed. Tell these stories early in discovery — they do the selling without the selling."},{"number":5,"category":"Pain / Pain Funnel","difficulty":"Advanced","question":"Sandler Rule #38 states: 'The problem the prospect brings you is never the real problem.' What does this mean in practice for a masonry salesperson?","options":{"A":"Prospects frequently misidentify masonry issues and you should correct their technical description before discussing solutions","B":"The surface-level issue the prospect describes (cracking chimney, spalling steps) is a symptom — the real problem lives at Level 2 (financial/operational impact) or Level 3 (personal consequences) and must be uncovered through the Pain Funnel","C":"The prospect usually wants more work done than they initially describe and you should always upsell during discovery","D":"Prospects are often dishonest about their problem and you should verify their claims physically before investing time in qualification"},"correct":"B","explanation":"The cracked chimney IS the stated problem, but it's not the real problem. The real problem might be: the homeowner's fear of a fire, the insurance issue, the water damage destroying a finished basement, or a home sale in 6 months that requires everything to be right. Treating the surface issue as the whole problem leads to proposals that don't address the true urgency.","tip":"A homeowner who calls about 'some cracks in the chimney' could be dealing with: a home inspection red flag before a sale, a CO concern after a scare, a water damage insurance claim, or an HOA violation letter. One Pain Funnel conversation reveals which it is — and which of those carries a $5,000 price tag versus a $50,000 one."},{"number":6,"category":"Budget","difficulty":"Advanced","question":"You've qualified a commercial HOA for a large facade project. The board president says: 'We're putting this out for bid to four contractors. We'll go with the lowest qualified bid.' How do you handle the budget conversation without simply racing to the bottom on price?","options":{"A":"Submit your most competitive number and let the work speak for itself","B":"Decline to participate in a pure low-bid process — Sandler teaches that you should only work with prospects who value quality","C":"Use a decision-step question embedded in the budget conversation: 'I appreciate that — can I ask what 'qualified' means to your board? What criteria matter beyond the number? Understanding that helps me make sure what I put together actually gives you what you need to evaluate fairly.'","D":"Offer a preliminary discount to make your bid more competitive before even submitting a formal proposal"},"correct":"C","explanation":"The phrase 'lowest qualified bid' contains an embedded opening — 'qualified' has criteria beyond price. Asking what those criteria are pivots the conversation from pure price competition to value-based evaluation. If they define 'qualified' as licensed, insured, with documented experience in historic masonry restoration and bonding capacity — you may be the only contractor who fully qualifies.","tip":"HOA boards on the North Shore rarely actually want the cheapest contractor — they want to defend their choice to 100 unit owners if something goes wrong. When you ask 'what does qualified mean to your board?' you learn whether they need insurance limits, warranty terms, historic preservation experience, or local references. Those are the differentiators that win $200K+ commercial bids against lower-priced competitors."}]},{"quiz_number":4,"categories":"Budget • Decision • Post-Sell • Transactional Analysis / DISC • Up-Front Contract","questions":[{"number":1,"category":"Budget","difficulty":"Beginner","question":"What is 'Price Bracketing' in the Sandler budget discussion?","options":{"A":"Offering two pricing tiers — standard and premium — and letting the prospect choose","B":"Anchoring a price range ('projects like this typically fall between $X and $Y') and letting the prospect indicate where they're comfortable within that range","C":"Showing the prospect a competitor's price first, then presenting your price as the benchmark","D":"Providing a detailed cost breakdown so the prospect understands every line item before making a decision"},"correct":"B","explanation":"Price Bracketing establishes a realistic range before either party commits to a specific number. It allows the prospect to self-select a comfort level (they usually gravitate toward the lower end), which gives the salesperson a working budget without directly asking 'what's your budget?' — a question that often triggers defensiveness.","tip":"On a phone pre-qualification call: 'Based on what you're describing — the tuckpointing plus the lintel work — you're probably looking somewhere between $8,000 and $18,000 depending on the extent of the damage. Does that sound like a range that would work for you?' Their answer tells you in 5 seconds whether the visit is worth your time."},{"number":2,"category":"Post-Sell","difficulty":"Beginner","question":"After getting a verbal commitment on a $18,000 tuckpointing project, you say: 'Before I lock in your spot on the schedule, I want to make sure we haven't missed anything — is there anyone else who needs to be comfortable with this before we move forward?' The homeowner pauses and says: 'Well, my wife hasn't seen the proposal yet.' What does this reveal and what do you do?","options":{"A":"The homeowner is stalling — proceed with scheduling since they gave a verbal commitment","B":"This reveals that the Decision step missed a key decision-maker; don't schedule until the wife reviews the proposal — offer to set a time to walk through it with both of them or answer her questions directly","C":"Email the proposal to the wife and ask the homeowner to call you after she reviews it","D":"Ask the homeowner to have his wife call you if she has questions, and proceed with scheduling"},"correct":"B","explanation":"The Post-Sell question has just uncovered what the Decision step should have caught — there's a second decision-maker who isn't yet part of the process. Scheduling a project the wife hasn't approved is a recipe for a cancellation call 24 hours later. The correct move is to get her into the conversation before locking in the start date.","tip":"Post-Sell questions regularly surface missed Decision step information — a spouse, a property manager, a parent who's co-owner on the title. This is why Post-Sell is essential even when everything seems smooth. Catching a second decision-maker at this stage is far easier to handle than catching them after you've mobilized a crew."},{"number":3,"category":"Up-Front Contract","difficulty":"Intermediate","question":"The ANOT framework is a memory aid for delivering a UFC. What do the four letters stand for?","options":{"A":"Acknowledge, Negotiate, Offer, Terms","B":"Appreciate, Naturally, Obviously, Typically","C":"Agenda, Needs, Outcomes, Timeline","D":"Ask, Note, Observe, Talk"},"correct":"B","explanation":"ANOT stands for: Appreciate (thank them for their time), Naturally (acknowledge they'll have questions), Obviously (state you'll have questions too), and Typically (describe how the meeting usually works and define the possible outcomes). This structure creates a conversational, non-scripted feel while covering all UFC elements.","tip":"The ANOT framework keeps your UFC from sounding like a script. 'I appreciate you having me out — naturally you'll want to know what we can do, and obviously I'll have a few questions about what you're dealing with. Typically by the end of our time here, we'll both know if it makes sense to talk about a project together.' Smooth, natural, in control."},{"number":4,"category":"Decision","difficulty":"Intermediate","question":"Sandler Rule #36 states: 'Only decision-makers can get others to make decisions.' What is the practical implication of this rule for a masonry salesperson?","options":{"A":"You should only meet with verified decision-makers — if the person can't sign the contract, don't take the meeting","B":"If the actual decision-maker isn't in the conversation, your contact (however enthusiastic) cannot effectively advocate for you — find a way to get the real decision-maker involved before investing in a full proposal","C":"Decision-makers are typically the most senior person at a company — always try to reach the CEO or property owner directly","D":"Never rely on referrals — only the person who hires you can ensure the project proceeds"},"correct":"B","explanation":"A very enthusiastic property manager may genuinely want to hire you, but if the ownership group or board has final authority, that manager cannot get others to make a decision they don't control. Your goal is to either get the real decision-maker involved, or equip your contact to sell on your behalf — which requires you to understand the internal decision process and give them the tools to navigate it.","tip":"Commercial property managers are often strong advocates but rarely final authorities. Before investing in a $150,000 bid, ask: 'When you recommend a contractor to ownership, what do they typically need to see to feel comfortable approving the spend?' That question maps the internal sell so you can support your contact with the right documentation."},{"number":5,"category":"Up-Front Contract","difficulty":"Advanced","question":"You're 20 minutes into a commercial masonry bid meeting with a property manager when you realize you never set a UFC at the start. The conversation is wandering — the manager keeps adding scope items and isn't focused. What is the Sandler move?","options":{"A":"Let the conversation continue naturally — interrupting to set a UFC at this point would seem awkward and damage rapport","B":"Set a 'mid-meeting UFC' by acknowledging the range of topics and proposing a focused structure: 'We've covered a lot of ground — can I suggest we take 5 minutes to define what we're trying to walk away from this meeting with? That way I make sure I'm building the right proposal.'","C":"Start taking extensive notes on all the scope additions to show you're engaged, then send a comprehensive proposal covering everything mentioned","D":"Schedule a second meeting specifically for the UFC and proposal scoping, and end this meeting politely"},"correct":"B","explanation":"It's never too late to establish structure. A mid-meeting UFC isn't awkward — it demonstrates leadership and professionalism. Allowing the meeting to continue unstructured risks producing a sprawling, mis-scoped proposal that doesn't match what the manager actually wants. The 'can I suggest' phrasing maintains Adult-to-Adult respect while taking control.","tip":"Commercial meetings for large North Shore properties can sprawl — a manager mentions the retaining wall, then the brick facade, then the parking structure. Without a UFC, you leave with three different scopes and no idea which one to price. A mid-meeting reset saves you 10 hours of proposal work on the wrong scope."},{"number":6,"category":"Transactional Analysis / DISC","difficulty":"Advanced","question":"You're qualifying an 'I' (Influencer) DISC-style homeowner — energetic, friendly, and telling you enthusiastically that 'this is going to be amazing' and 'I know we're going to work together.' They've agreed verbally to everything you've said. What is the Sandler risk with this prospect, and what do you do to protect the sale?","options":{"A":"There is no risk — an enthusiastic prospect is the best kind; proceed to proposal immediately","B":"The I-style prospect's enthusiasm is genuine but can evaporate quickly — they may agree verbally but not follow through; run a complete UFC and full qualification regardless of their excitement, get commitments in writing, and use the Post-Sell step rigorously","C":"The I-style prospect is likely exaggerating their enthusiasm to get a fast quote — push for more concrete responses by pressing them with direct budget and decision questions","D":"Let the enthusiasm build through the meeting and present immediately to capitalize on their emotional high-point"},"correct":"B","explanation":"I-style prospects are genuinely enthusiastic — but enthusiasm is not commitment. They agree easily in the moment, then lose focus or get distracted by the next shiny thing. They may forget what was agreed, fail to share the proposal with the co-decision-maker, or simply move on without malice. The Sandler protection is full qualification regardless of energy, written confirmation of everything agreed, and a strong Post-Sell before leaving.","tip":"The I-style homeowner who says 'you're definitely our guy' on Monday and doesn't answer texts by Wednesday is one of the most common frustrations in residential masonry sales. The fix isn't to chase them harder — it's to get concrete commitments while they're in the room: a signed scope of work, a deposit conversation, a specific next-step date. Enthusiasm that doesn't produce a deposit is not a sale."}]},{"quiz_number":5,"categories":"Budget • Post-Sell • Transactional Analysis / DISC • Up-Front Contract","questions":[{"number":1,"category":"Up-Front Contract","difficulty":"Beginner","question":"You call a homeowner to confirm a site visit for a retaining wall estimate. They confirm the appointment, but you haven't discussed what will happen during the visit. What should you do before ending the call?","options":{"A":"Nothing — the appointment confirmation is sufficient; the UFC can wait until you arrive at the property","B":"Set a phone-based mini-UFC: briefly describe the purpose of the visit, what you'll both learn, how long it will take, and what a good outcome looks like for both of you","C":"Email them your company brochure so they can review your capabilities before the visit","D":"Ask about their budget range on the phone to pre-qualify before investing the time to drive out"},"correct":"B","explanation":"A mini-UFC on the confirmation call sets expectations before you arrive, saving time and framing the visit as a structured conversation rather than a simple measuring appointment. It also gives you the prospect's agenda ('what do you want to figure out from today?') so you arrive prepared.","tip":"A 90-second UFC during the confirmation call does two things: it signals professionalism, and it gives you intelligence. 'What's most important to you to figure out when I come out?' tells you whether they're in decision mode or early information-gathering — which changes how you spend your time on a busy day with 10+ leads."},{"number":2,"category":"Budget","difficulty":"Beginner","question":"You've completed the Pain step with a homeowner whose brick steps need full replacement. They clearly have significant pain — the steps are crumbling, it's a safety issue, and they've been embarrassed by it for two years. How do you transition to the Budget conversation?","options":{"A":"Tell them the project will cost approximately $12,000 and ask if they'd like to proceed","B":"Say: 'Before I put anything on paper, I want to make sure I scope this in a way that actually makes sense for your situation. Have you had a chance to think about what kind of investment you're comfortable with for this?'","C":"Ask what other contractors have quoted so you know where to position your price","D":"Explain your pricing structure and materials cost so they understand the value before you discuss numbers"},"correct":"B","explanation":"The transition to budget should feel natural and respectful — framing it as wanting to 'scope it correctly' rather than as an interrogation about their finances. Asking 'what are you comfortable with?' is open-ended and non-threatening, and it gives the prospect the space to share their real number or ask for guidance.","tip":"The word 'investment' matters. 'What are you comfortable investing in this?' sounds different from 'What's your budget?' The word 'investment' implies return — they're investing in their property, their safety, their curb appeal. 'Budget' sounds like a limit. Small language choices like this matter across 10--20 daily conversations."},{"number":3,"category":"Budget","difficulty":"Beginner","question":"When in the Sandler sales process should you discuss budget with a prospect?","options":{"A":"After the presentation — once they see the value of your solution, the budget conversation becomes easier","B":"Only if the prospect brings it up first — asking about budget is presumptuous","C":"During the qualification phase — after establishing pain but before presenting your solution","D":"At the end of the meeting when both parties are comfortable and trust has been fully established"},"correct":"C","explanation":"Sandler places the Budget conversation in the qualification phase — after pain is established (so there's motivation to invest) and before the presentation (so there's no price shock at the end). Presenting before discussing budget is the traditional sales mistake that leads to 'that's more than we expected' objections after you've already invested hours in a proposal.","tip":"In a business where projects range from $5,000 to $500,000, knowing budget before you scope is critical. A homeowner who sees $45,000 for a full chimney rebuild before any budget discussion is likely to go cold. The same homeowner who said 'we know this isn't cheap — we're thinking somewhere in the $30--$50K range' buys with confidence."},{"number":4,"category":"Transactional Analysis / DISC","difficulty":"Intermediate","question":"You're meeting with a 'C' (Conscientious/Compliant) DISC-style prospect — an engineer who owns a commercial building and wants to discuss a $180,000 structural masonry repair. How should you adapt your approach for this behavioral style?","options":{"A":"Keep the meeting short and high-level — C-style prospects get impatient with detail and prefer to receive a written summary after the meeting","B":"Be direct and results-focused — C-style prospects respond best to bottom-line numbers and timelines with minimal explanation","C":"Bring detailed technical documentation, specifications, and references; welcome their detailed questions; be prepared for a slow decision process and help them understand that inaction also carries risk","D":"Open with strong personal rapport and storytelling — C-style prospects are relationship-driven and need to trust you personally before reviewing any technical information"},"correct":"C","explanation":"C-style (Conscientious) prospects are analytical, detail-oriented, and risk-averse. They ask deep technical questions and make decisions slowly. The sales approach must match their process: thorough documentation, patient question-answering, and logical risk framing ('the cost of delay' versus 'the cost of acting now'). Rushing or staying surface-level triggers distrust in a C-style buyer.","tip":"An engineer who owns a commercial building will ask questions most property managers never think of: mortar mix specifications, ASTM standards for joint depth, warranty terms for repointing in freeze-thaw conditions. Bring product data sheets, your warranty document, and a case study with photos. A C-style buyer who trusts your technical depth becomes a long-term commercial account — they refer other engineers."},{"number":5,"category":"Up-Front Contract","difficulty":"Advanced","question":"A salesperson consistently uses a UFC for first meetings but skips it for follow-up calls, thinking it's not necessary after rapport is established. What is the Sandler problem with this approach?","options":{"A":"There is no problem — the UFC is only required for initial meetings","B":"It creates inconsistency — the prospect comes to expect unstructured follow-ups and can use them to delay or deflect without consequence","C":"The salesperson should use even longer UFCs on follow-up calls to re-establish rapport that may have faded","D":"Follow-up calls should be replaced entirely by written proposals — UFCs are only for in-person meetings"},"correct":"B","explanation":"Sandler teaches that mini-UFCs should be used for every interaction — calls, emails, follow-ups. Without a defined purpose, agenda, and outcome for each follow-up, prospects can perpetually defer with no accountability. 'I just wanted to check in' follow-up calls have no defined outcome and produce no useful information.","tip":"Every follow-up call should open with a mini-UFC: 'I have about 10 minutes — I wanted to see where you landed on the proposal and figure out whether we have a next step or whether this isn't the right time. Is that okay?' That one sentence transforms a check-in call into a qualifying conversation."},{"number":6,"category":"Post-Sell","difficulty":"Advanced","question":"A homeowner signs a $42,000 contract for chimney rebuild and masonry repairs. Before leaving, you ask the Post-Sell question and they say: 'Honestly, I'm a little nervous about the cost. My neighbor had a similar job done for $28,000 two years ago.' How should you respond?","options":{"A":"Offer a price reduction to match the neighbor's number and protect the signed agreement","B":"Explain the differences in scope, materials, and labor costs that account for the price difference — then ask: 'Does understanding that change how you feel about our number?' Reinforce their original decision with facts while validating the concern","C":"Tell them the neighbor probably got substandard work for $28,000 and they'll regret it","D":"Acknowledge the concern, ask them to sleep on it, and follow up tomorrow to confirm they're still committed"},"correct":"B","explanation":"The Post-Sell has surfaced a real concern that could unravel the deal if left unaddressed. The Sandler response is to validate the concern (Nurturing Parent), provide the logical explanation that addresses it (Adult), and then check whether the concern has been resolved. Offering a price cut before the concern is even explored is a Sandler mistake — and sets a precedent for scope creep.","tip":"Price comparisons to neighbor's projects are extremely common on the North Shore — properties are similar, neighbors talk. Having a clear, confident answer about what drives your pricing (proper flashing installation vs. caulk, full joint removal vs. surface coating, warranty terms) addresses the comparison without being defensive. Document that explanation and keep it ready."}]},{"quiz_number":6,"categories":"Advanced Techniques • Budget • Decision • Fulfillment • Pain / Pain Funnel • Up-Front Contract","questions":[{"number":1,"category":"Pain / Pain Funnel","difficulty":"Intermediate","question":"Pain Funnel question #6 asks: 'How much do you think this has cost you?' What is the strategic purpose of quantifying financial impact at this stage of the conversation?","options":{"A":"To establish the prospect's budget limit so you don't propose more than they can afford","B":"To anchor a number in the prospect's mind that makes your price look small by comparison, and to move the conversation from abstract symptoms to concrete financial reality","C":"To confirm whether the prospect has insurance coverage that will pay for the repairs","D":"To identify whether the financial impact is enough to justify a large proposal"},"correct":"B","explanation":"When prospects calculate the financial cost of their problem themselves — two drywall repairs, one emergency plumber call, lost rental income, reduced property value — they're doing the ROI math in real time. The sum of those costs often exceeds the cost of properly fixing the masonry issue, which makes the investment feel rational rather than expensive.","tip":"Ask a homeowner whose brick is allowing water infiltration: 'What have you spent on interior repairs — drywall, paint, flooring — because of the water damage?' When they add it up and say '$4,500 over two years,' your $8,000 tuckpointing proposal just became a money-saver, not a cost."},{"number":2,"category":"Up-Front Contract","difficulty":"Intermediate","question":"A homeowner says 'I just want to get a few quotes and I'll get back to you' when you arrive for a chimney repair estimate. Using the Sandler approach, what is the best response?","options":{"A":"Say 'Of course — I'll get you the most competitive price I can' and proceed to inspect and quote as quickly as possible","B":"Establish a UFC: explain how the meeting will work, what you'll both learn, and clarify that at the end you'll both know whether it makes sense to talk further — including that it's completely fine if it doesn't","C":"Ask what the other contractors quoted so you know where to price your bid competitively","D":"Explain why getting multiple quotes for chimney work is risky because not all contractors understand masonry and you should be their only source"},"correct":"B","explanation":"A UFC establishes mutual expectations before diving into the project. It doesn't resist the prospect's process — it creates a structured container for the meeting so that at the end you get a real outcome rather than a vague 'I'll get back to you.' Setting the UFC is the salesperson's responsibility regardless of what the prospect says they're doing.","tip":"Homeowners on the North Shore often get 3--5 quotes as a matter of course. The UFC doesn't fight that — it ensures that YOUR conversation is structured, that you're learning what other contractors won't ask about, and that you leave with clarity on where you stand. You become the memorable contractor who actually had a real conversation."},{"number":3,"category":"Advanced Techniques","difficulty":"Intermediate","question":"The Dummy Curve describes three phases of a salesperson's development. Which phase produces the BEST sales results, and why?","options":{"A":"Phase 1 (Dummy Phase) — because the salesperson's lack of knowledge makes them appear humble and non-threatening","B":"Phase 3 (Professional Phase) — because the experienced salesperson deliberately asks questions and listens at the same ratio as Phase 1 (70% prospect talking), but does so intentionally rather than accidentally","C":"Phase 2 (Amateur Phase) — because the salesperson's growing knowledge allows them to educate prospects and overcome objections more effectively","D":"All three phases produce equal results; the curve simply describes different personality types"},"correct":"B","explanation":"In Phase 1, the salesperson doesn't know answers so they ask questions — accidentally keeping the prospect talking 70% of the time and achieving good close rates. In Phase 2, they know too much and talk constantly, causing close rates to drop. In Phase 3, they've recognized what worked in Phase 1 and do it deliberately — high close rates return. The 'dummy approach' is a professional strategy, not a deficiency.","tip":"After 15 years in masonry, you know everything about brick, stone, flashing, and mortar — which makes Phase 2 a constant trap. Every time you're tempted to explain what Type S mortar is or why parging deteriorates faster than tuckpointing, remember: that knowledge is better used asking a follow-up question than delivering a lecture the homeowner will forget in an hour."},{"number":4,"category":"Decision","difficulty":"Advanced","question":"You're bidding on a $400,000 historical restoration project for a large church property. The facilities committee chair tells you: 'The board votes on the contractor selection at our monthly meeting in three weeks. The committee will give them our recommendation.' What is the most important Sandler decision-step action to take before that board meeting?","options":{"A":"Submit the most competitive proposal possible before the meeting and wait for the committee to make their recommendation","B":"Ask the facilities chair: 'What would the board need to see to feel confident approving your committee's recommendation? And is there any chance I could do a 10-minute presentation to address their questions directly?' Then provide materials tailored to the board audience's concerns","C":"Find out which board members are most influential and reach out to them directly to build relationships before the vote","D":"Offer a 'board presentation special' discount to incentivize a favorable recommendation from the committee"},"correct":"B","explanation":"The board is the actual decision-maker — the committee is an influencer, however important. Your goal is to either get access to the board (even briefly) or arm your advocate with exactly what the board needs to approve the recommendation confidently. Understanding the board's specific concerns — insurance, warranty, historic preservation approach, disruption to services — lets you tailor your materials to their actual decision criteria.","tip":"Large institutional masonry projects at churches, schools, and HOAs often involve decision-makers who are volunteers, not construction professionals. They vote based on risk-comfort, not technical specifications. A one-page 'Board Summary' that covers: scope, timeline, how you protect their building during the work, your warranty, and references from similar projects — is worth more than a 40-page technical proposal."},{"number":5,"category":"Budget","difficulty":"Advanced","question":"You're in a commercial pre-bid meeting for a $250,000 masonry restoration project. The facilities director says: 'We've budgeted $120,000 for this.' You know that $120,000 is insufficient for the scope they've described. What is the Sandler response?","options":{"A":"Accept the $120,000 budget and scope the project down to fit within their constraint","B":"Tell them immediately that $120,000 is not enough and they'll need to increase the budget or reduce the scope","C":"Acknowledge the budget, then probe for flexibility: 'I appreciate knowing that. Based on what I'm seeing, I want to make sure I'm building the right scope for that number. If the honest assessment comes in above $120,000, is that a conversation you're able to have with ownership, or is $120,000 a hard ceiling?'","D":"Submit a $120,000 proposal that addresses the most critical items, and note that additional phases will be needed to complete the full scope"},"correct":"C","explanation":"The Sandler move is to acknowledge the stated budget without accepting it as final, then probe whether it's a real constraint or a starting position. Many 'hard budgets' are actually soft floors — the facilities director may have latitude to request more if the case is made correctly. Understanding whether it's truly a ceiling determines whether you scope down, walk away, or help them build a case for more funding.","tip":"In commercial masonry, budget 'ceilings' are often just the initial board approval — ownership can frequently authorize more if the contractor provides documentation of scope that wasn't anticipated. Asking 'is $120,000 a hard ceiling?' protects you from under-scoping a project you'll then have to eat cost overruns on, while opening the door to a better-funded engagement."},{"number":6,"category":"Fulfillment","difficulty":"Advanced","question":"During the Fulfillment presentation, you should ONLY present features and benefits that directly address the pain discovered in the Pain step. Why is presenting additional capabilities — beyond what the prospect needs — a Sandler mistake?","options":{"A":"It wastes time and risks making the proposal longer than necessary","B":"It introduces new information that was never qualified — potentially creating objections that didn't exist, raising price above the established budget, and shifting the focus from confirmed needs to unconfirmed wants","C":"It makes you appear uncertain about what the prospect actually needs","D":"It violates Sandler Rule #5 ('Never answer an unasked question') and risks opening discussions about competitive alternatives"},"correct":"B","explanation":"Sandler Rule #5 says 'never answer an unasked question' — and Rule #2 warns against candy-spilling. Adding capabilities the prospect never asked about introduces new variables to a qualified opportunity: new price increases above the established budget, new concerns the prospect didn't have before, and new reasons to delay. A targeted proposal closes faster than a comprehensive one.","tip":"If a homeowner hired you to fix their chimney and you present a proposal that also includes a recommendation for their retaining wall, you've now given them a reason to pause ('let me think about whether we want to do the wall too'). Save additional scope for a separate conversation after the chimney project is signed. One yes at a time."}]},{"quiz_number":7,"categories":"Advanced Techniques • Budget • Decision • Pain / Pain Funnel • Post-Sell • Up-Front Contract","questions":[{"number":1,"category":"Decision","difficulty":"Beginner","question":"What is the most important question in the Sandler Decision step, and why is its specific phrasing significant?","options":{"A":"'Are you the decision-maker?' — because it directly identifies whether you're talking to the right person","B":"'Besides yourself, who else is involved in making a decision like this?' — because the phrasing 'besides yourself' assumes the prospect has SOME role while still uncovering additional stakeholders without humiliating them","C":"'When will you make a decision?' — because timeline is the most actionable information in the decision step","D":"'What criteria will you use to choose?' — because understanding selection criteria allows you to tailor your proposal to win"},"correct":"B","explanation":"The phrasing 'besides yourself' is deliberately respectful — it assumes the person in front of you has authority while checking for others. Asking 'are you the decision-maker?' can be embarrassing for an influencer who has no final authority. The nuanced phrasing gets the same information without triggering defensiveness.","tip":"On a $60,000 chimney and facade project with a homeowner couple, discovering that 'my wife handles the finances and will need to be involved' after you've given a full presentation is a deal-killer. 'Besides yourself, is there anyone else who'll be involved in choosing a contractor?' asked early saves you from presenting to half the decision-making unit."},{"number":2,"category":"Post-Sell","difficulty":"Beginner","question":"What is the core purpose of the Post-Sell step in the Sandler system?","options":{"A":"To upsell additional services to a customer who has already signed the contract","B":"To proactively surface buyer's remorse and hidden doubts before the salesperson leaves — preventing the deal from unraveling after the meeting ends","C":"To document the sale and transfer the project to the operations team","D":"To get a signed testimonial or referral request while the buyer's enthusiasm is still high"},"correct":"B","explanation":"Sandler Rule #6 says 'don't buy back tomorrow what you sell today.' Every buying decision triggers some level of doubt. The Post-Sell step proactively surfaces doubt while you're still present — giving you the opportunity to address it rather than letting it fester overnight and unravel an agreed deal.","tip":"On a $55,000 chimney and facade project, the homeowner who seemed fully committed at 4pm can have second thoughts by 9pm when they're calculating the check they'll need to write. A 2-minute Post-Sell conversation before leaving — 'Is there anything that might come up between now and when we start that could change things?' — surfaces that concern while you're still there to address it."},{"number":3,"category":"Up-Front Contract","difficulty":"Intermediate","question":"What is the psychological reason that giving a prospect explicit permission to say 'no' during a UFC actually INCREASES the likelihood of getting a 'yes'?","options":{"A":"It creates a sense of urgency because they fear losing access to your services","B":"It removes defensive pressure by eliminating the threat of being 'sold,' which makes the prospect more open and honest about their real situation","C":"It signals to the prospect that you have so much business that you don't need their project","D":"It satisfies FTC disclosure requirements for home improvement contractors"},"correct":"B","explanation":"When people feel they could be manipulated or pushed, they activate psychological defenses that make them say less and resist more. The UFC's 'permission to say no' removes that threat. When prospects know they can say no without pressure, they relax — and relaxed prospects reveal real pain, real budget, and real decision authority.","tip":"Try this on your next commercial pre-bid meeting: 'If at any point you realize this isn't the right fit — budget, timing, whatever — it's completely fine to tell me. I'd rather know now.' Watch the property manager visibly relax. That's when the real conversation about what they actually need starts."},{"number":4,"category":"Budget","difficulty":"Intermediate","question":"During a site visit, a homeowner says: 'Is this something we could finance?' How should you handle this question in the context of the Sandler budget conversation?","options":{"A":"Tell them you don't offer financing and move on to discussing the scope","B":"Explain your financing partners and payment options in detail before continuing with discovery","C":"Reverse the question to understand what it reveals about their budget: 'That's a great question — can I ask what's driving that? Are you thinking about spreading the investment out, or is there a cash-flow consideration I should understand?' Then address their actual concern.","D":"Tell them financing is available and use it as a closing tool at the end of the proposal presentation"},"correct":"C","explanation":"A financing question is a budget signal disguised as a logistics question. The Sandler reversal uncovers whether the prospect is asking because they're budget-constrained, strategically prefer to preserve cash, or are managing a business investment cycle. Each answer changes how you scope and present — a budget-constrained prospect needs different options than a cash-rich investor who simply prefers to finance capital improvements.","tip":"On a $75,000 commercial project, 'can we finance this?' often means the board approved a capital budget but prefers not to draw down reserves. That's a very different situation from a homeowner who genuinely can't afford $15,000 out of pocket. Reversing the question tells you which situation you're in — and whether there's actually a budget constraint at all."},{"number":5,"category":"Pain / Pain Funnel","difficulty":"Advanced","question":"A commercial facilities manager says: 'I need the parking structure columns repaired before the annual board inspection in six weeks.' A Sandler-trained salesperson recognizes this as what level of pain, and what should they do next?","options":{"A":"Level 3 (Personal Impact) — the timeline reveals urgency; move directly to pricing","B":"Level 1 (Surface Pain) — the board inspection deadline is a symptom; use the Pain Funnel to uncover the financial impact of a failed inspection and the personal consequence for the facilities manager's career","C":"Level 2 (Business Impact) — the structural issue and timeline are both business concerns; proceed to Budget","D":"Skip the Pain Funnel — the stated urgency is sufficient to proceed to fulfillment"},"correct":"B","explanation":"A deadline reveals surface urgency but not the full picture. The Pain Funnel deepens it: What happens if the inspection fails? What does that cost the property? What happens to the facilities manager if the board is embarrassed in front of their unit owners? Level 3 pain for a facilities manager might be: 'My job is on the line if those columns don't pass.' That's the urgency that drives fast decisions.","tip":"When a facilities manager mentions a board inspection deadline, the gold is in asking: 'What happens if something comes up at the inspection that can't be explained?' That one question frequently surfaces Level 3 pain — career anxiety, ownership pressure, prior incidents. That's the pain that gets you authorized and on-site in three days instead of three weeks."},{"number":6,"category":"Advanced Techniques","difficulty":"Advanced","question":"After presenting a $110,000 masonry restoration proposal to a commercial building owner, you use the Thermometer Technique and ask: 'On a scale of 1 to 10, where are you?' They say: '5.' What does this number tell you, and what is your next move?","options":{"A":"A 5 is a polite way of saying no — thank them for their time and follow up next quarter","B":"A 5 means you're roughly halfway there — push for the close by offering incentives to move them toward a 10","C":"A 5 signals that something significant is unresolved — call a timeout: 'A 5 tells me I must have missed something important. Can you help me understand where we're off-track? What should we be focusing on?'","D":"A 5 is normal for a first presentation — schedule a second meeting to give them more time to review"},"correct":"C","explanation":"A Thermometer score of 0--5 signals major unresolved issues that require a full reset — not a push for the close. Asking 'what should we be focusing on?' returns control to the prospect and lets them direct you to the actual barrier. Pushing forward or offering incentives at a 5 signals desperation and further erodes confidence.","tip":"A commercial building owner who scores you a 5 on a $110,000 proposal is telling you they have a significant unresolved concern. It might be budget, timeline, scope clarity, or a competing relationship. The 'what are we missing?' question is the most valuable thing you can ask at this point — it often surfaces the one thing that, if addressed, moves the score to an 8 or 9."}]},{"quiz_number":8,"categories":"Budget • Decision • Pain / Pain Funnel • Post-Sell • Sandler Rules & Principles • Up-Front Contract","questions":[{"number":1,"category":"Up-Front Contract","difficulty":"Beginner","question":"What are the three and ONLY three valid outcomes of a properly structured Up-Front Contract (UFC), according to Sandler?","options":{"A":"Yes, Maybe, or No","B":"Yes, No, or a clearly defined next step with a scheduled date and purpose","C":"Proposal submitted, Proposal accepted, or Follow-up needed","D":"Interested, Not interested, or Needs more information"},"correct":"B","explanation":"Sandler Rule #4 states that 'a decision not to make a decision is a decision.' 'Maybe,' 'I'll think about it,' or 'I'll follow up with you' are not valid UFC outcomes. Every interaction must end with a clear Yes, a clear No, or a scheduled next step with an explicit purpose and date.","tip":"After every homeowner site visit, you should leave with one of three outcomes: they're moving forward (Yes), they're not the right fit (No), or you have a specific next step booked — 'We'll speak Thursday at 2pm after you've reviewed the proposal with your wife.' Anything else means you're chasing a ghost."},{"number":2,"category":"Sandler Rules & Principles","difficulty":"Beginner","question":"Sandler Rule #23 states: 'Defuse bombs early on.' What does this mean in a masonry sales context?","options":{"A":"Identify structural safety hazards at the beginning of every site inspection before discussing price","B":"Proactively raise potential objections or concerns before the prospect does — especially about price, competition, or past contractor experiences — so you control the narrative rather than reacting to surprises","C":"Avoid discussing controversial topics like insurance claims or HOA restrictions until late in the sales process","D":"Always have a response prepared for the most common objections in case they arise during the presentation"},"correct":"B","explanation":"Defusing bombs early means bringing up difficult topics yourself before they become objections. 'I want to be upfront — we're typically not the lowest number in a bid' said early is a bomb defused. Said after you've revealed the proposal price, it's a defensive response to an objection. Proactive honesty gives you control; reactive justification gives you none.","tip":"Before showing any price: 'I want to be upfront with you — we're not the cheapest contractor on the North Shore. I'd rather tell you that now than have you be surprised at the end. The reason we're priced where we are is\\...' That one sentence, said confidently before the proposal, prevents the most common price objection from ever landing as a surprise."},{"number":3,"category":"Pain / Pain Funnel","difficulty":"Advanced","question":"A commercial property owner says: 'The retaining wall along our parking lot has been failing for about two years. We've been told it needs full replacement, but we keep putting it off because of budget cycles.' You ask 'How much has this cost you so far?' and they say 'honestly, we've spent about $15,000 patching it and we're still having issues.' What is the best Sandler follow-up to this answer?","options":{"A":"Immediately present your solution and quote a full replacement price to show the ROI compared to their $15,000 in patches","B":"Ask Pain Funnel Question #7: 'How do you feel about having spent $15,000 without actually solving the problem?' — then listen fully before introducing any solution","C":"Tell them the good news: a full replacement will save them money long-term compared to continued patching","D":"Ask who made the decision to keep patching instead of replacing, so you can understand the internal decision dynamic"},"correct":"B","explanation":"Question #7 bridges the financial data to the emotional response. Their answer — frustration, regret, pressure from ownership, embarrassment — is the Level 3 personal pain that drives urgency. Jumping straight to your solution or ROI comparison bypasses this critical emotional step and reduces your proposal to a price comparison.","tip":"When a facilities manager has authorized $15,000 in failed patches, they're carrying personal accountability for that. Question #7 — 'how do you feel about that?' — gives them permission to express the frustration. When they say 'I'm honestly embarrassed I let it go this long,' you know the emotional stakes. That's the conversation that speeds decisions from months to weeks."},{"number":4,"category":"Budget","difficulty":"Advanced","question":"For an insurance claim masonry project, how does the budget conversation differ from a standard residential or commercial project?","options":{"A":"There is no difference — discuss budget the same way regardless of whether insurance is involved","B":"The budget conversation starts with the adjuster's approved scope and dollar amount as the known anchor, then explores whether the approved amount is accurate and whether a supplemental claim is warranted","C":"Budget discussions should be avoided with insurance claim clients because the insurance company sets the price and you have no influence over it","D":"Ask the homeowner to give you the adjuster's contact information and conduct all budget discussions directly with the insurance company"},"correct":"B","explanation":"Insurance claim projects have a known budget anchor — the adjuster's approved number — but that anchor is often too low because adjusters underscope masonry work. The Sandler budget conversation starts with 'what has the adjuster approved?' then moves to 'do you believe that number actually covers everything that needs to be fixed?' This opens the door to supplemental claims and prevents you from being locked into a number that doesn't cover proper work.","tip":"Adjusters routinely miss masonry items — they approve the visible spalling but miss the deteriorated lintels, flashing, or structural damage underneath. Your question: 'Based on my inspection, the adjuster's scope may be missing a few items — would you like me to document what I'm seeing and help you request a supplement?' can add $8,000 to $30,000 to an approved claim, and it positions you as the contractor who protects their interests."},{"number":5,"category":"Decision","difficulty":"Advanced","question":"You ask a homeowner 'what criteria will you use to choose between contractors?' and they say 'price.' What is the Sandler response, and what do you do with this information?","options":{"A":"Accept price as the primary criterion and focus on being competitive on cost","B":"Use a Negative Reverse: 'It sounds like price is the deciding factor — if that's the case, I want to be upfront that we're unlikely to be the lowest number you get. Does that mean we shouldn't spend more time on this?' Then listen for whether price is truly the only criterion or whether they named it as a default","C":"Educate them on why price is the wrong criterion for masonry work and why quality should matter more","D":"Ask them to delay the decision until you can present a full value analysis that goes beyond price"},"correct":"B","explanation":"When a prospect names price as their sole criterion, a Negative Reverse tests whether that's actually true or just a default answer. Most homeowners don't actually want the cheapest contractor — they're conditioned to say price first. The Negative Reverse often produces: 'Well, it's not just price — we want someone reliable who will actually show up.' That opens the real criteria conversation.","tip":"In 15 years on the North Shore, 'price' as the stated criterion almost never survives a single follow-up question. When you say 'if that's the case, we probably won't win,' most homeowners immediately backtrack to what they really care about: showing up on time, protecting their landscaping, fixing it once rather than twice. Surface the real criteria and compete on those."},{"number":6,"category":"Post-Sell","difficulty":"Advanced","question":"You receive a call from a homeowner two days after they signed a $65,000 contract. They say: 'We've been thinking about it and we'd like to hold off for now.' You didn't ask Post-Sell questions when you left. What does this tell you, and how should you handle the call?","options":{"A":"Accept their decision graciously — the contract may not have been as solid as it appeared","B":"Tell them that because a contract was signed, they are legally obligated to proceed","C":"Recognize this as buyer's remorse that could have been surfaced at signing; now run a belated Post-Sell on the call — ask open-endedly what's changed, listen fully without defensiveness, identify the specific concern, and address it if it's addressable. Don't pressure, but also don't immediately accept 'hold off' as a non-negotiable outcome","D":"Ask who convinced them to hold off and whether they'd consider meeting again to address any concerns"},"correct":"C","explanation":"Buyer's remorse is what Post-Sell is designed to prevent — but it can still be treated after the fact. Asking non-defensively what changed often reveals a specific, addressable concern (spouse pushed back, neighbor offered a lower number, HOA question arose). If the concern is addressable, you may save the deal. If it's not, you get closure. Either outcome is better than arguing about the contract.","tip":"When a homeowner calls to 'hold off,' don't immediately think about the deposit or the contract. Ask: 'I appreciate you calling me directly — can you help me understand what happened?' That one question surfaces the real issue 80% of the time. It might be as simple as the spouse having a concern that a 15-minute call could resolve."}]},{"quiz_number":9,"categories":"Bonding & Rapport • Budget • Fulfillment • Negative Reverse Selling • Pain / Pain Funnel","questions":[{"number":1,"category":"Bonding & Rapport","difficulty":"Beginner","question":"You call a homeowner who submitted an online inquiry about tuckpointing repairs. After a brief hello, you start asking about the scope of work and their timeline. The homeowner seems hesitant and gives very short answers. What is most likely happening and what should you do?","options":{"A":"They probably have limited knowledge of masonry, so you should slow down and explain what tuckpointing is","B":"You've moved too quickly into business without establishing any trust or rapport — slow down, show genuine interest in their situation, and ask a broader open-ended question","C":"They are not a serious buyer and you should qualify them out quickly to save time","D":"They are uncomfortable on the phone and you should immediately suggest a site visit instead"},"correct":"B","explanation":"Short, guarded answers are a classic signal that the prospect doesn't yet feel psychologically safe. You moved into business mode before establishing a basic human connection. A simple pivot — 'Before I jump into all the project questions, can I ask — how long have you been in the house?' — can shift the entire tone.","tip":"On the phone pre-qualification calls that are part of your 10--20 daily leads, the first 30 seconds of genuine curiosity ('What's been going on with it?' rather than 'What's the scope?') determines whether you get real information or clipped answers. Real information leads to real qualification."},{"number":2,"category":"Budget","difficulty":"Beginner","question":"You complete a Pain Funnel conversation with a homeowner who clearly wants their chimney rebuilt. As you move to the budget question, you feel uncomfortable asking about money and decide to skip it and go straight to preparing the proposal. What is the likely consequence of this decision?","options":{"A":"The proposal process will go smoothly because the homeowner's clear desire to fix the chimney will override any price concern","B":"You'll invest significant time in a proposal, only to face price shock when you present — 'We were thinking more like $10,000, not $40,000' — which could have been avoided with a two-minute budget discussion","C":"The homeowner will respect your professionalism for not pressuring them with financial questions","D":"Your proposal will be more competitive because you scoped it without the constraint of their budget"},"correct":"B","explanation":"Skipping the budget conversation is the single most costly mistake in the Sandler process. Investing hours in a detailed proposal only to discover the prospect's budget is 25% of your quote is avoidable waste. Two minutes of budget discussion on-site eliminates this risk and allows you to scope correctly from the start.","tip":"On a chimney rebuild where your number will be $35,000--$50,000, a two-minute budget conversation before proposal prep is worth $200 an hour in saved time. If the homeowner expected $10,000, you need to know that before you spend four hours on drawings, materials lists, and scope documentation — not after you've emailed the proposal and they've gone quiet."},{"number":3,"category":"Fulfillment","difficulty":"Beginner","question":"In the Sandler system, what should happen at the BEGINNING of the Fulfillment (presentation) step before you present any solution?","options":{"A":"Present your company's credentials and portfolio to establish credibility before getting into the project details","B":"Review and confirm the pain, budget, and decision process uncovered in prior steps — verify nothing has changed before presenting","C":"Show the prospect your written proposal document so they can follow along during the presentation","D":"Ask the prospect if they have any initial questions about your company before you begin"},"correct":"B","explanation":"The Fulfillment step opens with a Review — revisiting and confirming that the pain, budget, and decision process are as previously established. This protects against presenting a solution based on information that may have shifted. It also demonstrates that you listened during discovery, which reinforces trust before you make any recommendations.","tip":"Start every proposal presentation with: 'Before I get into what I'm recommending, let me make sure I understood you correctly. You mentioned the main concern was the water infiltration through the failing mortar joints, your budget range was $12,000--$18,000, and both you and your wife are making this decision together — is that all still accurate?' That single confirmation prevents 90% of proposal surprises."},{"number":4,"category":"Pain / Pain Funnel","difficulty":"Intermediate","question":"Pain Funnel question #8 is 'Have you given up trying to deal with this problem?' What is the strategic purpose of this question?","options":{"A":"To identify prospects who are too far gone to be helped and should be disqualified","B":"To create urgency and surface either resignation (they've accepted the pain) or motivation to finally act — both of which are actionable information","C":"To confirm that the prospect has not already hired a competitor","D":"To establish that the contractor is the only solution the prospect has left"},"correct":"B","explanation":"Question #8 is a powerful pattern-interrupt. A prospect who says 'pretty much, yeah' has normalized their pain — which means a good follow-up question ('What would it mean to you if it actually WERE resolved?') can generate powerful motivation. A prospect who says 'No, I need this fixed now' has just declared their urgency. Either way, you have actionable information.","tip":"For homeowners who've had crumbling tuckpointing for years without fixing it, 'Have you basically just gotten used to not using that entrance?' can land powerfully. When they say 'honestly, yeah' — follow up with: 'What would it mean to your family to actually have that fixed?' That answer is why they buy."},{"number":5,"category":"Budget","difficulty":"Intermediate","question":"Why does Sandler suggest that salespeople tend to avoid the budget conversation, and what does the system call this tendency?","options":{"A":"Salespeople avoid budget discussions because industry norms consider it impolite; Sandler calls this 'professional courtesy'","B":"Salespeople avoid budget discussions out of fear of learning the deal isn't viable or fear of seeming greedy; Sandler calls these fears 'monsters under the bed' — childhood conditioning that doesn't serve adult professionals","C":"Salespeople avoid budget because they're trained to present first and negotiate price at the end; Sandler calls this 'traditional sequence bias'","D":"Salespeople avoid budget because it's a legal liability in some states; Sandler calls this 'compliance risk avoidance'"},"correct":"B","explanation":"Sandler identifies budget avoidance as rooted in psychological conditioning — the cultural discomfort around money talk, fear of rejection, and the belief that a deal might evaporate if you ask too directly. These are 'monsters under the bed' — fears that feel real but don't reflect adult professional reality. Facing them directly is what separates effective from ineffective salespeople.","tip":"The fear of asking about budget is especially costly when you handle 10--20 leads daily. Spending time driving to a property, doing a full inspection, and writing a proposal for someone who has a $2,000 budget for a $20,000 job is a day wasted. Ask the budget question on the phone and save those hours for real opportunities."},{"number":6,"category":"Negative Reverse Selling","difficulty":"Advanced","question":"What is the single most important delivery requirement for Negative Reverse Selling to work effectively?","options":{"A":"It must be used sparingly — no more than once per sales conversation","B":"It must be delivered with calm, genuine confidence — NOT sarcasm, passive aggression, or desperation; tone is everything","C":"It must be followed immediately by a hard close to prevent the prospect from disengaging","D":"It must only be used when the prospect has explicitly expressed a price objection"},"correct":"B","explanation":"Negative Reverse delivered sarcastically or anxiously produces the opposite effect — it reads as manipulation, weakness, or passive aggression. The technique only works when the salesperson is genuinely comfortable with the 'no' outcome they're implying. Equal Business Stature and authentic confidence are prerequisites for effective Negative Reverse.","tip":"The Negative Reverse only works if you actually mean it. If you say 'maybe this project isn't a good fit for us' while internally panicking about hitting quota, the homeowner will sense the incongruence. The mindset has to come first: Les has 10--20 leads per day. He genuinely doesn't need any specific one. That reality is what makes Negative Reverse authentic, not manipulative."}]},{"quiz_number":10,"categories":"Bonding & Rapport • Budget • Decision • Fulfillment • Negative Reverse Selling • Pain / Pain Funnel","questions":[{"number":1,"category":"Bonding & Rapport","difficulty":"Beginner","question":"According to the Sandler Selling System, what is the PRIMARY purpose of Bonding & Rapport in a sales interaction?","options":{"A":"To make small talk so the prospect feels comfortable while you set up your proposal","B":"To establish psychological safety and genuine trust so the prospect will honestly share their real challenges and concerns","C":"To demonstrate your company's credentials and experience before discussing the project","D":"To identify the prospect's budget range before any in-depth conversation"},"correct":"B","explanation":"Sandler defines Bonding & Rapport not as casual small talk but as creating genuine psychological safety. Without this trust, prospects will not reveal their true pain, budget, or decision process — the very information you need to qualify them.","tip":"When you pull up to a North Shore property, resist the urge to immediately pull out your measuring tape. Spend 2--3 genuine minutes asking how long they've owned the home or what they love most about it. That emotional connection is what makes them choose you over the guy who showed up and started measuring."},{"number":2,"category":"Pain / Pain Funnel","difficulty":"Beginner","question":"A homeowner finishes describing their chimney water damage and you're ready to move forward. You say: 'That sounds really frustrating. Based on what you've described, we could do a full crown repair and repoint the top four courses for about $3,500.' What Sandler mistake have you just made?","options":{"A":"You gave a number that's too low for a chimney repair of this scope","B":"You moved from Surface Pain directly to a solution without completing the Pain Funnel — you haven't discovered business impact, financial cost, or personal emotional stake","C":"You framed the price before establishing the UFC","D":"You described the solution in technical terms the homeowner may not understand"},"correct":"B","explanation":"Jumping from the surface problem to a solution bypasses levels 2 and 3 of the pain funnel. Without uncovering how much the water damage has already cost them (Level 2) or the personal anxiety driving their call (Level 3), your $3,500 quote is just a number — there's no emotional anchor making it feel like relief. The full Pain Funnel builds the emotional urgency that makes price a minor factor.","tip":"A homeowner who mentions 'some water damage' might be describing $400 worth of drywall or $8,000 of finished basement repairs. Never quote off surface pain — finish the funnel first. The full picture almost always justifies a larger and better-scoped proposal, and the homeowner is more motivated to move forward."},{"number":3,"category":"Budget","difficulty":"Intermediate","question":"A homeowner says 'whatever it costs to fix it right.' How should a Sandler salesperson respond to this seemingly open-ended budget statement?","options":{"A":"Accept it at face value — this is the ideal prospect who values quality over price","B":"Validate but probe: acknowledge the statement, then ask a confirming question ('I appreciate that — help me understand: if it came in at $60,000, is that something you'd be comfortable with, or is there a range that would be a stretch?')","C":"Immediately scope the most comprehensive solution — they've given you permission to go full value","D":"Ask them to sign a letter of intent before providing a proposal, since they've expressed commitment to proceeding"},"correct":"B","explanation":"Sandler Rule #3 warns against 'no mutual mystification' — hearing what you want to hear. 'Whatever it costs' often means 'whatever it costs within a range I'm imagining.' Without testing the upper limit, you risk presenting a $65,000 proposal to someone who expected $20,000. A confirming question turns a vague commitment into actionable budget intelligence.","tip":"In 15 years of masonry sales, 'fix it right' has meant $8,000 to one homeowner and $150,000 to another. They're both sincere — they just have different mental ceilings. A single follow-up question: 'If I told you this was closer to $80,000 than $20,000, how would that land?' reveals everything you need to scope the proposal correctly."},{"number":4,"category":"Fulfillment","difficulty":"Intermediate","question":"Why does the Sandler system say that a properly run Fulfillment step should feel 'almost anti-climactic'?","options":{"A":"Because the salesperson should be so confident that they downplay the presentation to avoid seeming pushy","B":"Because if qualification was done correctly — pain confirmed, budget established, decision process mapped — the presentation is simply confirming what both parties have already concluded, not making a dramatic pitch","C":"Because in masonry sales, the technical scope is so straightforward that presentations rarely need much explanation","D":"Because using the Thermometer Technique during the presentation removes emotional tension and creates a calm decision environment"},"correct":"B","explanation":"When the submarine has been run correctly, the prospect already knows they have a problem, already knows they have a budget for solving it, and has already agreed to make a decision. Your presentation isn't convincing them of anything new — it's confirming that your solution addresses the pain they described, within the budget they confirmed. The 'close' is almost a formality.","tip":"When you hear a homeowner say 'this is exactly what we needed' during a proposal presentation — that's the anti-climactic fulfillment in action. They're not hearing it for the first time; they're having their own conclusions confirmed. The goal of every discovery conversation is to make the presentation feel like inevitable good news, not a sales pitch."},{"number":5,"category":"Negative Reverse Selling","difficulty":"Intermediate","question":"What is the 'Pendulum Theory' in Negative Reverse Selling?","options":{"A":"The buyer's motivation swings predictably between high and low — time your close when they're at peak motivation","B":"The salesperson should position themselves just behind the prospect's current level of interest — staying slightly less committed than the prospect so the prospect moves themselves forward","C":"Price negotiations should swing from high to low like a pendulum, with the final number landing in the middle","D":"Sales conversations should alternate between rapport-building and qualifying questions in a pendulum pattern"},"correct":"B","explanation":"The Pendulum Theory teaches that the salesperson's expressed interest level should be calibrated to be slightly behind the prospect's. If the prospect is enthusiastic, stay neutral. If neutral, be slightly disinterested. If negative, be slightly more negative. This positioning creates psychological space that pulls the prospect toward you rather than pushing them away.","tip":"When a homeowner calls excited about the chimney project they've been putting off for three years, don't match their excitement with 'great, we can start next month!' Stay measured: 'I appreciate the call — let's make sure this is a good fit for both of us before we get ahead of ourselves.' That neutral energy is actually more reassuring than equal enthusiasm."},{"number":6,"category":"Decision","difficulty":"Advanced","question":"A homeowner says they want to move forward but adds: 'I want to make sure the HOA doesn't object to the materials.' This is the first you're hearing about HOA involvement. What does this represent and what do you do?","options":{"A":"It's a minor administrative detail — ask them to check with the HOA and have them call you if there are concerns","B":"This is a newly revealed decision stakeholder (the HOA) that was not part of your original Decision step mapping; stop and re-map the decision: what HOA approval process exists, who within the HOA approves materials, what materials are acceptable, and what timeline that adds","C":"Tell them that as their contractor, you'll handle all HOA communications to keep things simple","D":"Reassure them that your materials are standard and unlikely to have any HOA issues"},"correct":"B","explanation":"An HOA approval requirement is a legitimate additional decision stakeholder that can delay or kill a project. Late revelation of stakeholders is a classic deal-killer in construction sales. Re-mapping the decision process before continuing protects you from completing a proposal and starting a project that stalls for 60 days waiting for HOA board approval.","tip":"North Shore residential projects — especially historic homes in Wilmette, Evanston, and Lake Forest — frequently have HOA, landmark commission, or historic preservation board requirements that add weeks or months to the approval timeline. Always ask: 'Are there any HOA, historical commission, or neighborhood association approvals that would need to happen before we start?' before finalizing any proposal."}]},{"quiz_number":11,"categories":"Budget • Fulfillment • Sandler Rules & Principles • Up-Front Contract","questions":[{"number":1,"category":"Budget","difficulty":"Intermediate","question":"A prospect says 'We haven't really thought about budget yet.' According to Sandler, what does this statement most likely signal, and how should you respond?","options":{"A":"They are highly motivated buyers who want to see options before thinking about money — proceed to the proposal","B":"It could signal limited urgency or early-stage research; use Price Bracketing to establish a range and observe their reaction — which will indicate whether they have real investment intent","C":"They are testing whether you'll give a low number before they commit to a budget — give a conservative estimate to anchor low","D":"Ask them to return when they have established a budget, since proceeding without one is a waste of both parties' time"},"correct":"B","explanation":"Sandler warns that 'no budget' often means 'no urgency' — but not always. The correct diagnostic tool is Price Bracketing: offer a range and watch the reaction. If they visibly wince at the low end of a range, you have budget information. If they say 'that's actually less than I expected,' you have a different kind of information. Either way, you've learned something critical.","tip":"For the 10--20 residential leads you're qualifying daily, price bracketing on the phone saves you from driving to a property where the homeowner was thinking $800 for a job that's realistically $12,000. 'Just so we're in the same ballpark — projects like this typically start around $5,000 for a basic repair. Does that sound like the range you're thinking?' takes 15 seconds."},{"number":2,"category":"Fulfillment","difficulty":"Intermediate","question":"You're presenting a $38,000 tuckpointing proposal to a homeowner couple. After you walk through the scope, you use the Thermometer Technique and ask: 'On a scale of 1--10, where 1 is definitely not right and 10 is ready to move forward, where are you?' The husband says 8 and the wife says 6. What do you do?","options":{"A":"Push for the close with the husband since he's already at an 8 — get his signature before the wife influences him downward","B":"Focus on the wife: 'Thank you — I want to make sure we're both comfortable. Can you help me understand what's keeping you at a 6? What would need to change to get you closer to a 8 or 9?'","C":"Offer a discount to raise both scores to a 10","D":"Schedule a follow-up meeting to give the couple time to discuss, then return when they're aligned"},"correct":"B","explanation":"The Thermometer reveals that the wife has an unresolved concern — ignoring it and closing the husband would violate the Decision step (she's a co-decision-maker) and invite Post-Sell buyer's remorse. The correct move is to surface and address her concern directly while both are present. Her 6 contains the real objection that needs to be resolved for a durable close.","tip":"On joint decisions, the lower Thermometer score is always the real close opportunity. The wife's 6 might be about timing, about a trusted second opinion, or about a specific element of scope she's uncertain about. Asking her directly — without pressure — often surfaces a concern that takes five minutes to address and moves her from 6 to 9."},{"number":3,"category":"Sandler Rules & Principles","difficulty":"Intermediate","question":"Sandler Rule #27 states: 'You can't sell anybody anything — they must discover they want it.' What behavioral change does this rule require from a masonry salesperson?","options":{"A":"Stop presenting solutions entirely and let the homeowner figure out the problem on their own","B":"Shift from the role of persuader/pitcher to the role of doctor/detective — asking questions that guide the prospect to their own conclusion that your solution addresses their pain","C":"Only present when the prospect explicitly requests a proposal — never volunteer your solution","D":"Reduce the number of features mentioned in proposals so prospects aren't overwhelmed with information"},"correct":"B","explanation":"Rule #27 reframes the salesperson's job entirely. Instead of building the most compelling pitch, the goal is to ask the questions that lead the prospect through their own discovery — of their problem's true extent, its cost, and what it would mean to solve it. When the prospect reaches the conclusion themselves, they own the decision and the commitment is far stronger.","tip":"A homeowner who says 'I think we really need to get this chimney fixed before the next winter — the water damage is getting worse and my wife is genuinely worried about CO now' has just told you everything you need for a proposal. You didn't pitch them — you asked questions until they sold themselves. That's Rule #27 in action."},{"number":4,"category":"Up-Front Contract","difficulty":"Advanced","question":"The 'Yes-No-Yes Sandwich' is a specific UFC structure. In correct order, what are its three components?","options":{"A":"Confirm the appointment is still happening (Yes) → state your proposal terms (No pressure) → ask for the order (Yes)","B":"Soft 'is this still a good time?' check-in (Soft Yes) → explicit permission to say no without awkwardness (The No Permission) → agreement that if it IS a fit, you'll define a clear next step before finishing (Hard Yes)","C":"Explain your company background (Yes, we're qualified) → acknowledge competitors exist (No, we're not perfect) → ask for a trial project to demonstrate value (Yes, give us a shot)","D":"Agree on meeting time (Yes) → establish that no commitment is expected today (No) → agree to follow up in one week (Yes)"},"correct":"B","explanation":"The Yes-No-Yes Sandwich establishes mutual engagement (Soft Yes), removes sales pressure by giving genuine permission to decline (The No Permission), and then establishes that if it IS a fit, a next step will be defined before leaving (Hard Yes). The structure creates a psychologically balanced conversation where both parties are comfortable with any outcome.","tip":"When walking into a commercial pre-bid meeting for a $150,000 parking structure repair: 'Is this still a good time for us to dig into the scope? \\[Soft Yes\\] And if for any reason — budget, timing, your existing contractor relationship — this doesn't make sense, just tell me and we'll both save time. \\[No Permission\\] But if we do see a fit, let's make sure we know exactly what the next step looks like before I leave. \\[Hard Yes\\] Fair?'"},{"number":5,"category":"Up-Front Contract","difficulty":"Advanced","question":"You're preparing to send a large commercial masonry proposal via email. The scope involves $380,000 of work on a multi-building HOA property. What is the Sandler-correct way to deliver this proposal?","options":{"A":"Email the detailed proposal with a cover letter explaining your qualifications and pricing rationale","B":"Never email a proposal of this size cold — set a Proposal Presentation meeting, set a UFC for that meeting ('at the end of our time together, we'll both know if this makes sense to move forward'), and review the proposal together live","C":"Mail a printed proposal package to appear more professional and permanent than an email","D":"Call the property manager, summarize the key numbers verbally, and email the full document as a follow-up after getting verbal interest"},"correct":"B","explanation":"Emailing a large proposal without a live presentation removes all UFC control — the prospect reads it alone, focuses on the bottom line, and either goes silent or calls to negotiate price. A Proposal Presentation meeting with its own UFC ensures you're present when questions and objections arise, and that a next step is defined before you leave the call.","tip":"A $380,000 proposal emailed cold to a HOA board has a close rate close to zero. Every committee member forms their own opinion without you in the room to shape context. Request a 30-minute Zoom or in-person presentation: 'I want to walk through this with you so your questions get answered in real time and you leave with everything you need to make a decision.'"},{"number":6,"category":"Budget","difficulty":"Advanced","question":"What is the Sandler 'High Anchor' budget technique and when is it most useful?","options":{"A":"Starting negotiations with your highest possible price so you have room to negotiate down","B":"Mentioning a high number (e.g., 'some projects like this run $150,000') first in the conversation, then working down — the high number anchors the prospect's reference point so that lower numbers feel relatively comfortable","C":"Anchoring the prospect to a competitor's high price to make your proposal look reasonable by comparison","D":"Setting a high budget expectation in the UFC so the prospect pre-approves a large investment before seeing the scope"},"correct":"B","explanation":"Psychological anchoring is well-documented: the first number introduced in a negotiation becomes the reference point for all subsequent numbers. By opening with a high anchor ('I've seen jobs like this run $100,000 to $200,000 depending on scope'), you recalibrate the prospect's mental ceiling — so when your actual proposal comes in at $130,000, it lands in the middle of their new frame rather than at the top of their old one.","tip":"For large commercial restoration projects, state the range proactively before the prospect has formed their own expectation. 'Facade restoration projects on buildings this size typically run $80,000 to $300,000 — depending on the extent of the damage and the spec. Does your ownership have a ballpark expectation for this?' surfaces their number within your anchor frame."}]},{"quiz_number":12,"categories":"Bonding & Rapport • Budget • Negative Reverse Selling • Pain / Pain Funnel • Post-Sell","questions":[{"number":1,"category":"Bonding & Rapport","difficulty":"Beginner","question":"In Sandler selling, what does it mean when a salesperson 'spills their candy in the lobby'?","options":{"A":"The salesperson rushes through the site inspection without proper documentation","B":"The salesperson shares too much product information, pricing, and capabilities before understanding the prospect's actual needs","C":"The salesperson arrives late and must quickly establish rapport to recover","D":"The salesperson talks about competitors in a way that backfires"},"correct":"B","explanation":"Sandler Rule #2 warns against 'spilling your candy in the lobby' — dumping features, case studies, portfolio photos, and pricing before understanding what the prospect actually needs. This eliminates your ability to tailor your approach and often triggers price comparisons before value is established.","tip":"Handing a homeowner your company brochure and rattling off your chimney, tuckpointing, and restoration services the moment you arrive is a candy-spill. It puts you in pitch mode before you know whether their real concern is safety, aesthetics, a home sale, or a water damage claim."},{"number":2,"category":"Budget","difficulty":"Intermediate","question":"A homeowner asks: 'Can you give me a ballpark before you put together a full proposal?' You're on the phone before any site visit. What is the Sandler-correct response?","options":{"A":"Decline to give any number until you've seen the property in person","B":"Give your lowest possible estimate to get the site visit — you can adjust once you see the scope","C":"Give a range using Price Bracketing ('Based on what you're describing, you're probably looking at somewhere between $X and $Y — does that work for your situation?'), then note what additional information would refine the number","D":"Explain that all masonry projects require a written quote and schedule the site visit without discussing price"},"correct":"C","explanation":"Refusing to give any number before a site visit frustrates prospects and doesn't serve either party. Price Bracketing provides useful orientation while being honest about uncertainty. The homeowner's reaction to the range is budget intelligence — if they immediately say 'that's way more than I expected,' you've just qualified out a non-opportunity before investing a site visit.","tip":"On a high-volume lead day, Phone Price Bracketing is a lead filter. 'Something like what you're describing usually starts around $6,000 for just the repair work — does that give you a useful frame?' takes 20 seconds and tells you whether the lead is worth a 40-minute drive. Use it on every phone pre-qualification call."},{"number":3,"category":"Budget","difficulty":"Intermediate","question":"A homeowner says: 'We got a quote from another company for $8,500. Can you beat that?' How should you respond using the Sandler approach to the budget conversation?","options":{"A":"Tell them you can try to match the number after you do your own assessment","B":"Reverse to gather intelligence: 'That's helpful to know — do you mind if I ask what their scope included? I want to make sure we're comparing the same work before I give you a number that might not be apples-to-apples.'","C":"Immediately quote below $8,500 to win the bid","D":"Explain why your company's work is higher quality than most competitors and therefore worth a premium over $8,500"},"correct":"B","explanation":"The competitor's number is a budget anchor — but only if the scopes match. Asking what the $8,500 includes simultaneously gives you the competitor's scope (intelligence), establishes that you don't compete on price alone, and positions you as thorough. You may discover the other quote missed 40% of the work — in which case your $13,000 quote is actually cheaper when measured by the same scope.","tip":"In competitive tuckpointing bids, scope differences of 30--50% are common. One contractor might quote 'repoint the visible joints' while another quotes 'full joint restoration including lintel inspection and flashings.' Asking 'what did their scope include?' before giving your number is the most efficient way to neutralize an apples-to-oranges price comparison."},{"number":4,"category":"Post-Sell","difficulty":"Intermediate","question":"You've just had a homeowner sign a $31,000 contract for front entry restoration on their Lake Forest home. They sign enthusiastically. What is the correct Post-Sell action before you leave the property?","options":{"A":"Celebrate the signed contract, thank them warmly, and leave before they change their mind","B":"Proactively ask: 'I appreciate the go-ahead — before I finalize the schedule, I want to ask directly: is there anything that might come up between now and when we start — timing, budget, anyone else who needs to weigh in — that could change things?' Then map the concrete next steps (deposit, start date, who to contact)","C":"Immediately ask for three referrals while the homeowner is feeling positive about their decision","D":"Leave behind a project binder with all documents and a handwritten thank-you note"},"correct":"B","explanation":"The Post-Sell question must come before you leave — not the next morning when the homeowner has had a chance to second-guess. After confirming there are no immediate doubts, mapping concrete next steps (deposit amount, start date, project contact) gives the homeowner a structured path forward that replaces abstract commitment with real action.","tip":"On a signed $31,000 contract, the next concrete step is the deposit — often 30--50% to schedule. Getting the deposit conversation handled before you leave the property converts a signed contract into an actual financial commitment. The homeowner who writes a check is far less likely to call the next morning with second thoughts than the one who just signed a paper."},{"number":5,"category":"Pain / Pain Funnel","difficulty":"Advanced","question":"You're on a site visit for a large commercial tuckpointing project. The property manager has answered all your Pain Funnel questions thoughtfully, and at Question #8 ('Have you given up trying to get this resolved?') she says: 'Honestly? Kind of. We've had three contractors walk the site and not one of them has followed up with a proposal.' What does this tell you, and how do you use it?","options":{"A":"The other contractors found problems during their walk and couldn't provide a competitive proposal — you should inspect carefully before committing to a number","B":"This reveals both deep frustration (Level 3 pain: she's been let down repeatedly) and an immediate opportunity — she is telling you that simply following through with a real proposal will differentiate you completely; acknowledge her frustration and commit to a specific follow-up date before leaving","C":"She is exaggerating to create urgency and pressure you to bid quickly — proceed normally","D":"Ask which three contractors walked the site so you can understand who you're competing against"},"correct":"B","explanation":"This response is pure Level 3 pain — she's been failed by contractors she trusted with her time. The emotional frustration of repeated disappointment creates a powerful opening for differentiation. Acknowledging her experience with genuine empathy and then making a specific, accountable commitment ('I'll have a full proposal on your desk by Thursday at noon — would that work?') turns your follow-through into the close.","tip":"When a commercial property manager tells you three contractors ghosted her, you don't have to be the best contractor — you have to be the one who actually does what you said you would. On large North Shore commercial accounts, reliability is the differentiator. Your proposal follow-through on that project could be worth $50K--$200K in annual work."},{"number":6,"category":"Negative Reverse Selling","difficulty":"Advanced","question":"A commercial property manager for a 6-building HOA calls to discuss an ongoing masonry maintenance contract. They seem interested but say: 'We've been with our current masonry contractor for six years.' What is the Sandler Negative Reverse response?","options":{"A":"'Six years is a long time — it sounds like you're very happy with them. Maybe we shouldn't even be talking.' \\[pause and wait for their response\\]","B":"'I can beat their pricing if you give us a chance to submit a comparison quote'","C":"List the reasons why North Shore Masonry is better than their current contractor","D":"'Six years is a great run. Out of curiosity, what made you decide to reach out to us today?' \\[surface their pain without introducing any pressure\\]"},"correct":"A","explanation":"The Negative Reverse ('sounds like you're very happy — maybe we shouldn't even be talking') creates psychological space that compels the prospect to either confirm they're satisfied (clean outcome) or defend their reason for calling (which surfaces the pain that prompted the call in the first place). It's delivered with a genuine pause — waiting for them to fill the silence.","tip":"A commercial property manager who has a 6-year contractor relationship and calls North Shore Masonry is almost certainly calling because something isn't working — reliability, responsiveness, pricing, quality of work. The Negative Reverse surfaces that pain without interrogating them. When they say 'well, there have been some issues lately,' you've found your opening without ever asking about pain directly."}]},{"quiz_number":13,"categories":"Advanced Techniques • Pain / Pain Funnel • Transactional Analysis / DISC","questions":[{"number":1,"category":"Pain / Pain Funnel","difficulty":"Beginner","question":"A homeowner shows you their chimney and says: 'The mortar is crumbling and we've had some water coming in.' Using the Pain Funnel, what is the correct FIRST question to ask?","options":{"A":"'How long has this been going on?'","B":"'Have you gotten any other quotes yet?'","C":"'Tell me more about that — what specifically are you seeing?'","D":"'What's your budget for getting this fixed?'"},"correct":"C","explanation":"Pain Funnel Question #1 is an open-ended invitation to describe the problem. 'Tell me more about that' or 'What specifically are you seeing?' gets the prospect talking in detail and reveals context you wouldn't get with a closed question. Starting with timeline or budget skips ahead in the funnel and produces incomplete discovery.","tip":"The homeowner's answer to 'tell me more' will frequently reveal Level 2 and Level 3 details without you having to probe — they'll mention the interior water damage, the failed repair attempt two years ago, or the fact that the house goes on the market in spring. Listen for those details rather than immediately asking specific questions."},{"number":2,"category":"Pain / Pain Funnel","difficulty":"Beginner","question":"What is the correct ORDER of the first three Pain Funnel questions?","options":{"A":"'How long has this been a problem?' → 'Tell me more about that' → 'Can you give me a specific example?'","B":"'Tell me more about that' → 'Can you be more specific / give me an example' → 'How long has that been a problem?'","C":"'What have you tried to do about it?' → 'Tell me more' → 'How long has this been going on?'","D":"'How much has this cost you?' → 'How long has this been going on?' → 'Tell me more about that'"},"correct":"B","explanation":"The Pain Funnel must follow its specific sequence because each question unlocks the door for the next. You start with broad invitation (Tell me more), move to concrete specifics (Give me an example), then establish duration (How long?) — before ever asking about cost, prior attempts, or emotional impact. Skipping the sequence produces incomplete discovery.","tip":"When a homeowner mentions the retaining wall is shifting, your first three words should almost always be 'Tell me more.' Not 'How big is it?' or 'When did that start?' — those are the second and third moves. 'Tell me more' is the move that gets them talking and keeps you learning."},{"number":3,"category":"Advanced Techniques","difficulty":"Beginner","question":"The Sandler 70/30 Rule states that in a properly run sales conversation, who should be talking 70% of the time and who should be talking 30% of the time?","options":{"A":"The salesperson should talk 70% and the prospect 30% — because the salesperson needs to educate the prospect to build value","B":"The prospect should talk 70% and the salesperson should talk 30% — and that 30% should be predominantly questions, not pitching","C":"The split should be equal (50/50) — a balanced conversation is the mark of a professional salesperson","D":"It varies by phase: 70/30 during rapport, 50/50 during discovery, 70/30 in favor of the salesperson during the presentation"},"correct":"B","explanation":"Sandler Rule #14 is blunt: 'A prospect who is listening is no prospect at all.' When prospects are listening, they're not processing their own needs, they're not building emotional investment, and they're not progressing toward a decision. The salesperson's 30% should consist almost entirely of questions — not pitching, explaining, or educating.","tip":"Record yourself on a site visit and time the ratio. Most contractors talk 60--70% of the time — filling silence with technical explanation, portfolio stories, and unsolicited recommendations. Flip that ratio for 30 days and track your close rate. The homeowner who does most of the talking tells you everything you need to scope a proposal they'll actually buy."},{"number":4,"category":"Advanced Techniques","difficulty":"Intermediate","question":"A homeowner calls and says: 'We've heard great things about North Shore Masonry from our neighbor. Why don't you come out and put together a proposal? We'll probably go ahead.' What is the Strip-Line response that deepens their commitment rather than simply scheduling the site visit?","options":{"A":"Thank them enthusiastically and schedule the site visit as quickly as possible before they change their mind","B":"'I appreciate that — what we did for your neighbor may or may not be exactly what you need. What specifically did they tell you that makes you think we're a good fit for your situation?'","C":"Ask for the neighbor's contact information so you can use them as a reference during the proposal process","D":"Tell them you'd be happy to schedule a visit and send them your company brochure and portfolio in advance"},"correct":"B","explanation":"Strip-Lining with an enthusiastic referral prospect prevents premature over-commitment and deepens their buy-in by getting them to articulate WHY they want to use you. When they describe your neighbor's experience in their own words, they're pre-selling themselves before you even visit the property — which creates stronger commitment than inherited enthusiasm.","tip":"Referral leads are the highest-quality prospects in residential masonry, but unqualified referrals still churn. A Strip-Line question — 'what specifically made them recommend us?' — often surfaces a specific service element (speed, clean job site, warranty follow-through) that tells you both what they value and what to emphasize when you visit."},{"number":5,"category":"Transactional Analysis / DISC","difficulty":"Advanced","question":"A homeowner says aggressively: 'Every contractor I talk to tells me they do quality work and then they don't. I just need a price. Stop wasting my time.' This is a Critical Parent ego state. What is the WRONG response and why?","options":{"A":"Responding from Adult ('I understand your frustration — can I ask what happened so I can address the concern directly?') — because it validates their anger","B":"Responding from Adapted Child ('Of course — let me get right to your number tonight') — because it surrenders all control and positions you as subservient to their Critical Parent, which eliminates any ability to qualify the lead","C":"Responding from Nurturing Parent ('I completely understand — this process can be exhausting') — because it concedes their complaint","D":"Responding with a Negative Reverse ('It sounds like you've been through this enough times that maybe a different kind of conversation isn't what you're looking for right now') — because it is too aggressive"},"correct":"B","explanation":"When a prospect operates from Critical Parent and you respond from Adapted Child (compliant, subservient), you've hooked into their frame completely. You've given up your right to ask questions, qualify the budget, or understand the decision process. You're now just a price-generating machine rather than a professional consultant. The correct response is Adult plus Nurturing Parent — empathetic but structured.","tip":"The homeowner who says 'stop wasting my time, just give me a price' has had bad contractor experiences and is protecting themselves. Capitulating (Adapted Child) doesn't serve either of you — it produces an unqualified quote and a frustrated follow-up. Adult + Nurturing Parent: 'I hear you — you've been through this. Can I ask what happened? I want to give you a number that actually means something.' That's how you earn the right to continue."},{"number":6,"category":"Advanced Techniques","difficulty":"Advanced","question":"A commercial property manager asks: 'How long have you been in business?' mid-conversation during a qualification call. Using the three-step Reverse, what is the ideal response?","options":{"A":"'We've been in business since 2008 — over 15 years of commercial and residential masonry work across the North Shore.'","B":"'That's a fair question. Before I answer — can I ask what's behind that? Are you concerned about something specific, like a contractor who didn't follow through on a project?'","C":"'Long enough to have seen every kind of masonry problem you'll ever run into. What's the project you're dealing with?'","D":"'I'd rather show you our work than tell you about our history — when can I see the property?'"},"correct":"B","explanation":"A question about years in business almost always has a concern behind it — often a bad experience with a contractor who was new, went out of business mid-project, or lacked the bonding for a large commercial job. The Reverse uncovers that concern so you can address the REAL issue rather than just stating your founding year. Once you know the underlying worry, your answer is infinitely more effective.","tip":"On large commercial accounts, 'how long have you been in business?' is often a proxy for 'will you still exist when I have a warranty claim in year two?' or 'do you have the financial stability for a $300K project?' Knowing which concern they're really asking about lets you address the actual risk they see — not just recite your company history."}]},{"quiz_number":14,"categories":"Bonding & Rapport • Negative Reverse Selling • Pain / Pain Funnel • Sandler Rules & Principles","questions":[{"number":1,"category":"Bonding & Rapport","difficulty":"Intermediate","question":"The DISC behavioral model recommends adapting your Bonding & Rapport approach to the prospect's style. Which approach is most appropriate for a 'D' (Dominant) prospect — such as a commercial developer who says 'I'm busy, let's get to it'?","options":{"A":"Spend extra time on warm small talk to soften their directness before discussing business","B":"Match their directness, acknowledge their time, and establish a focused peer-level agenda quickly","C":"Immediately pull out your portfolio to demonstrate credibility before asking any questions","D":"Apologize for taking their time and keep the meeting as short as possible by skipping questions"},"correct":"B","explanation":"D-style prospects respect assertiveness and equal business stature. They don't want to be warmed up — they want to see that you're competent and in control. Matching their direct style while establishing an organized agenda signals that you're their peer, not a salesperson trying to win their approval.","tip":"When a Park Ridge developer says 'I need three bids by Friday,' the Sandler-trained response isn't to scramble and comply — it's: 'Happy to do that. Before I put a number together, can I ask two quick questions so the number I give you is actually apples-to-apples?' That one sentence signals you're a different kind of contractor."},{"number":2,"category":"Pain / Pain Funnel","difficulty":"Intermediate","question":"After a prospect reveals deep emotional pain about their situation during the Pain step, what is the Sandler-correct next move?","options":{"A":"Transition immediately to presenting your solution — you've found the pain, so now close the deal","B":"Empathize with their pain, then ask one more deepening question — 'What would it mean to you if this were actually resolved?' — before moving to budget","C":"Pull out your portfolio to show similar projects you've completed successfully","D":"Begin discussing your pricing so they understand what the solution will cost"},"correct":"B","explanation":"Sandler explicitly warns against immediately pivoting to a solution pitch after uncovering emotional pain. The correct move is to empathize (Nurturing Parent) and then ask the prospect to articulate their own desired outcome. When prospects describe their vision of resolution in their own words, they sell themselves — which creates far stronger commitment than any pitch.","tip":"When a homeowner tells you they're embarrassed that the front steps have been crumbling since they bought the house 6 years ago, don't say 'we can fix that.' Say: 'That sounds genuinely frustrating. What would it mean to you to finally have that fixed?' Let them describe the pride, the curb appeal, the welcome their guests would feel. They write the sales pitch for you."},{"number":3,"category":"Negative Reverse Selling","difficulty":"Intermediate","question":"A homeowner on the North Shore who has seen your proposal for a $29,000 chimney rebuild says: 'We'll think about it and get back to you.' You've already been through full discovery and the scope is clear. What is the Negative Reverse response?","options":{"A":"'Of course — take all the time you need. I'll check in with you next week.'","B":"'Typically when I hear that, it means the fit isn't quite right or something isn't working for you. Can I assume that's the case here?'","C":"'I understand — would a 5% early-decision discount help move this forward?'","D":"'I'll hold your spot on the schedule for two weeks in case you decide to move forward.'"},"correct":"B","explanation":"The Negative Reverse on 'think it over' forces a real response. The prospect will either confirm they're out (giving you a clean no and saving follow-up time), or they'll defend their interest ('No, we want to do it — it's just the timing with the holidays') which surfaces the real objection you can actually address. Either outcome is better than two weeks of unanswered follow-ups.","tip":"On a busy day managing 10--20 leads, chasing 'I'll think about it' prospects with weekly emails is one of the biggest time wasters in contracting sales. The Negative Reverse either closes the loop quickly or moves it forward. 'Can I assume that means it's not the right fit?' costs you nothing to ask and can save you four weeks of dead-end follow-up."},{"number":4,"category":"Bonding & Rapport","difficulty":"Intermediate","question":"Which of the following best describes the Sandler distinction between traditional rapport and Sandler rapport?","options":{"A":"Traditional rapport involves industry-specific questions while Sandler rapport focuses on personal topics","B":"Traditional rapport is superficial conversation (weather, sports) while Sandler rapport establishes peer-level trust and genuine curiosity about the prospect's situation","C":"Traditional rapport takes longer because it involves more questions, while Sandler rapport is faster","D":"There is no meaningful difference — both approaches achieve the same level of trust"},"correct":"B","explanation":"Sandler distinguishes sharply between surface-level pleasantries ('Nice weather! How about those Cubs?') and genuine rapport that positions the salesperson as a peer and creates an atmosphere where the prospect feels understood rather than sold to.","tip":"With commercial property managers who handle 15 contractor calls per week, shallow small talk signals that you're 'just another contractor.' Open with a genuine observation about their building or their market pressures — 'I know the multi-family maintenance budget cycle is brutal right now' — and you become the contractor who actually listened."},{"number":5,"category":"Bonding & Rapport","difficulty":"Advanced","question":"During a site visit for a $200,000 historic facade restoration on a Lake Forest estate, you notice the homeowner keeps checking their phone and giving terse responses. You're 10 minutes in and haven't even started the UFC yet. What is the Sandler-correct response?","options":{"A":"Push forward with your qualification questions — the $200,000 project size justifies moving quickly despite the distraction","B":"Name the dynamic directly and give them permission to reschedule: 'It seems like you might have something urgent going on — I want to make sure I have your full attention for this. Should we find a better time?'","C":"Shift to talking about your portfolio and past historic restoration projects to re-engage their interest","D":"Leave detailed brochures behind and follow up by email with a preliminary proposal to keep the process moving"},"correct":"B","explanation":"Sandler's Adult-to-Adult communication requires mutual engagement. Naming the dynamic (without accusation) and offering to reschedule actually demonstrates confidence and equal business stature. A distracted homeowner will not give you the real information you need — and a proposal built on incomplete information is likely to miss. Rescheduling is not a loss; it's the professional move.","tip":"On a $200,000 historic restoration, every conversation matters. Pushing forward with a distracted prospect for a $200K job produces a weak proposal and a poor close rate. Rescheduling signals that your time is valuable — which is actually the message a high-net-worth Lake Forest homeowner respects."},{"number":6,"category":"Sandler Rules & Principles","difficulty":"Advanced","question":"Sandler Rule #40: 'It's OK to want the deal. It's just not OK to need it.' What is the psychological mechanism by which needing the deal actually reduces your chances of getting it?","options":{"A":"When salespeople need the deal, they price more aggressively to ensure they win, which reduces margin and signals low confidence","B":"Need triggers desperation behaviors — skipping qualification steps, accepting non-commitments, avoiding difficult budget/decision questions, and discounting unnecessarily — all of which signal weakness to prospects who then trust and value you less","C":"Prospects can detect neediness and it triggers a charitable response — they become less likely to say no out of sympathy","D":"Needing the deal causes salespeople to over-prepare, which creates artificial enthusiasm that prospects find off-putting"},"correct":"B","explanation":"Desperation is a self-sabotaging state. When you need the deal, you avoid the budget conversation (fear of disqualification), accept 'maybe' instead of demanding clarity, offer unnecessary discounts to remove friction, and present before properly qualifying. Prospects sense this subconscious neediness as weakness — and it reduces both their confidence in you and their willingness to invest.","tip":"Rule #40 is easier to internalize when you have a full pipeline. With 10--20 leads per day, no single project should create desperation. The contractor who genuinely doesn't need any specific job behaves differently on every call — asking harder questions, walking away from bad fits, and maintaining price integrity. That behavior pattern is what builds a premium brand on the North Shore."}]},{"quiz_number":15,"categories":"Bonding & Rapport • Negative Reverse Selling • Pain / Pain Funnel • Transactional Analysis / DISC • Up-Front Contract","questions":[{"number":1,"category":"Bonding & Rapport","difficulty":"Intermediate","question":"You arrive at a Wilmette homeowner's property for a chimney inspection. The homeowner opens the door and immediately says, 'Look, I've had three contractors out here already. I just need a price. I don't have a lot of time.' What is the best Sandler response to establish rapport without losing control of the conversation?","options":{"A":"Pull out your measuring tools and start inspecting immediately to show you respect their time, then email the proposal tonight","B":"Apologize for taking their time and ask what the other contractors quoted so you know where to price your bid","C":"Acknowledge their frustration, validate that the bidding process is exhausting, then ask one curious question about what's been happening before proposing a quick structured conversation","D":"Explain your qualifications and why North Shore Masonry is different from the other contractors they've seen"},"correct":"C","explanation":"Acknowledging their frustration puts you in Nurturing Parent mode and disarms the defensive posture. Asking one genuine question ('What's been the experience so far?') invites them to share — which leads naturally into rapport and then a proper UFC. Jumping to measuring or pitching credentials bypasses the trust-building that makes the rest of the conversation possible.","tip":"In a market where homeowners on the North Shore get 3--5 contractor quotes, being the one who says 'It sounds like you've been through this a few times — what's been the most frustrating part?' is an immediate differentiator. Most contractors just start measuring. You start listening."},{"number":2,"category":"Pain / Pain Funnel","difficulty":"Intermediate","question":"During a phone pre-qualification call, a homeowner says their front brick steps are spalling and 'look terrible.' You ask 'What's been the most frustrating part of dealing with this?' and they say: 'Honestly, we've been trying to sell the house for four months and our realtor thinks the steps are the first thing buyers see and it's killing our showings.' What level of pain has just been revealed, and what should you do next?","options":{"A":"Level 1 Surface Pain — ask about the scope of the repair before moving forward","B":"Level 3 Personal Impact — the home sale is deeply personal; empathize and then ask 'What would it mean to you if the steps were fixed and you could see buyers actually react positively when they pulled up?'","C":"Level 2 Business Impact — the home sale is primarily a financial transaction; pivot immediately to discussing your pricing and timeline","D":"Level 2 Business Impact — acknowledge the realtor's concern and ask how many months they've had the house on the market"},"correct":"B","explanation":"A failed home sale after four months is intensely personal — stress, financial pressure, feeling stuck. This is Level 3 pain. The correct move is empathy followed by a forward-looking question that lets them articulate their own vision of resolution. The more vividly they can describe the outcome they want, the stronger their commitment to the project.","tip":"Homeowners trying to sell have tight timelines and genuine urgency — they're motivated buyers who will often decide same-week if you can demonstrate credibility and fit. On a phone call like this, your goal isn't to book a site visit: it's to understand the full urgency so when you do visit, you walk in knowing exactly why they need this done before the next showing."},{"number":3,"category":"Transactional Analysis / DISC","difficulty":"Intermediate","question":"In Sandler's Transactional Analysis framework, which ego state makes the actual buying DECISION, and what implication does this have for the Pain step?","options":{"A":"The Adult ego state makes the buying decision — which is why the Budget and Decision steps (logical and analytical) are the most important","B":"The Child ego state makes the buying decision — which is why the Pain step must create genuine emotional investment ('I want this pain to go away') before any logical justification is possible","C":"The Parent ego state makes the buying decision — which is why trust and credibility established in Bonding & Rapport are ultimately determinative","D":"All three ego states share equal influence in the decision — which is why the entire submarine must be completed"},"correct":"B","explanation":"Sandler taught that 'no purchase begins until the Child says I want it.' The emotional desire for change — relief, pride, security, status — is what initiates the buying process. The Parent then evaluates whether it's appropriate (addressed by Rapport and credibility), and the Adult calculates whether it makes sense (addressed by Budget and Decision). But without the Child's emotional commitment, neither the Parent nor Adult will act.","tip":"When a homeowner's Child is engaged — 'I'm embarrassed about those steps every time guests arrive,' 'I'm scared every time we use the fireplace' — they're already emotionally bought. The subsequent Budget and Decision conversations feel lighter because the emotional commitment is already there. Rushing to the logical steps before engaging the Child produces polite but unmotivated prospects."},{"number":4,"category":"Up-Front Contract","difficulty":"Intermediate","question":"After presenting a $47,000 tuckpointing and lintel replacement proposal to a homeowner couple, they say: 'This looks great — we just need to think about it and we'll let you know.' What is the Sandler response?","options":{"A":"Thank them, leave your card, and plan to follow up in a week with a friendly check-in email","B":"Ask for a decision on the spot by explaining that your schedule fills up quickly and you may not be able to hold their start date","C":"Acknowledge their response, then refer back to the UFC you established: 'I totally understand. When we started, we said we'd both know at the end whether there was a next step. It sounds like something's unclear — what specifically would be most helpful to think through?' Then establish a concrete next step with a specific date and purpose.","D":"Offer a 5% discount if they decide today, since they seem close to a decision"},"correct":"C","explanation":"A proper UFC established at the beginning of the meeting gives you the right to revisit the outcome expectation at the end. 'Think it over' violates the UFC both parties agreed to. Referencing the UFC and asking what specifically needs to be thought through surfaces the real objection — whether it's a hidden decision-maker, a budget concern, or a competing bid.","tip":"On a $47,000 proposal in Winnetka, 'we'll think about it' usually means one of three things: the spouse wasn't part of the initial UFC, the budget wasn't properly qualified, or there's a competing bid. The UFC you set at the START of the meeting is your license to ask which of those it is."},{"number":5,"category":"Negative Reverse Selling","difficulty":"Intermediate","question":"After submitting a competitive proposal for a $75,000 masonry project, a commercial contact says: 'Your price is the highest of the three bids we received.' Using Strip-Lining (a form of Negative Reverse), what is the correct response?","options":{"A":"Immediately offer a 10% reduction to bring your price in line with competitors","B":"Explain at length why your quality and warranty justify the premium price","C":"'I understand — and I want to be upfront with you. If the lowest number is the deciding factor, we probably won't win this one. That's okay. Before we leave it there, can I ask — what matters most to you on a project like this beyond the number itself?'","D":"Ask to see the competing bids to verify the comparison is apples-to-apples before responding to the price gap"},"correct":"C","explanation":"Strip-Lining involves pulling back (acknowledging you likely won't win on price alone) before asking the question that reveals their real criteria. By accepting the 'loss' condition first, you remove the defensive pricing conversation and create space for the prospect to articulate why price isn't the only thing that matters — which is almost always true in commercial masonry.","tip":"In commercial masonry bids, being the highest qualified bidder with the right references and warranty terms frequently wins over the lowest bidder — but only if the decision-maker can articulate those criteria to ownership. Your Strip-Line response gives them the language to explain why they recommended you even though you weren't the lowest: 'They were the only contractor with our specific insurance requirements and a documented historic restoration portfolio.'"},{"number":6,"category":"Pain / Pain Funnel","difficulty":"Advanced","question":"You're qualifying a general contractor bidding a large institutional masonry project. When you ask 'How long has this been an issue?' the GC says: 'Look, I don't have a lot of time for this. I just need your number for the masonry scope by end of week.' How do you continue the Pain Funnel without triggering a defensive reaction?","options":{"A":"Respect their time and send them the number they asked for — GCs are procurement-driven and don't respond to consultative selling","B":"Acknowledge the deadline, then use a Dummy Curve question: 'Absolutely — I want to get you something accurate. Help me understand two things quickly: what are the biggest headaches on this project right now, and what would make this the kind of project you'd want to give us again?' That keeps discovery moving within their time constraints.","C":"Tell the GC that without a proper discovery process, you'll need to add a contingency to your number to cover unknowns","D":"Ask them to send you the drawings and specs so you can prepare a number independently without taking more of their time"},"correct":"B","explanation":"D-style GC prospects (direct, task-oriented) will shut down a traditional Pain Funnel, but they'll respond to efficient, business-focused questions. Reframing discovery as 'getting you an accurate number fast' and 'understanding what would make you want to work with us again' converts the Pain Funnel into a peer-level efficiency tool rather than a sales process.","tip":"GC relationships are among the most valuable in commercial masonry — a single GC relationship can produce $500K+ in annual work. Two focused discovery questions on a 5-minute call can be the difference between submitting a generic number and becoming the subcontractor they call first on every job."}]}];
const CYBER = "data:image/jpeg;base64,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";
const ICON = "data:image/png;base64,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";
const BG = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAF1AyADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDzCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKK0jod6BkiP8A77FA0S9PRY/++xVcsuxPMu5m0VpnQ70do/8AvsUh0S9AziP/AL7FHLLsHMu5m0Vf/si7zjCf99Uv9j3fon/fYo5X2HzIz6K0f7GvPRP++xR/Y156J/32KOV9hcyM6itL+xL30j/77FL/AGHe+kf/AH2KOV9g5l3MyitT+wb70j/77FH9g3392P8A77FHK+wcy7mXRWkdEvR1WP8A77FC6HfP91U/77o5X2DmXczaK0JtHu4MbxHz0w4NRf2dcei/99UrMd0VKKt/2fcei/8AfVJ9gn9F/wC+qLMLoq0VbGn3B7L/AN9Uv9nXHov/AH1RZhdFOirf9nXHov8A31R/Z9x6L/31RZhdFSirf9n3Hov/AH1R/Z9x6L/31RZhdFSirf8AZ9x6L/31R/Z9x6L/AN9UWYXRUoq3/Z8/ov8A31R/Z9x6L/31RZhdFSirf9n3Hov/AH1R/Z9x6L/31RZhdFSirf8AZ9x6L/31R/Z9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ACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9k=";
const LOGO_W = "data:image/png;base64,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";
const USERS = ["Devin","Jace","Les","Zac","Luke","Paul","Carlos","BJ"];
const PASS = 5;
const ADMIN_PW = "buildinggreatness";
const B = {
  navy:"#1B4F72",navyL:"#2471A3",sky:"#5DA5BA",skyL:"#D6EAF8",
  grn:"#27AE60",grnBg:"#EAFAF1",red:"#E74C3C",redBg:"#FDEDEC",
  gold:"#F39C12",goldBg:"#FEF9E7"
};
const LIGHT = {bg:"#0B1929",card:"rgba(255,255,255,0.04)",dk:"#fff",bdr:"rgba(255,255,255,0.08)",mut:"rgba(255,255,255,0.4)",inp:"rgba(255,255,255,0.06)"};
const DARK = {bg:"#0B1929",card:"rgba(255,255,255,0.04)",dk:"#fff",bdr:"rgba(255,255,255,0.08)",mut:"rgba(255,255,255,0.4)",inp:"rgba(255,255,255,0.06)"};
const DB = {
  Beginner:{bg:"#E8F8F5",fg:"#1ABC9C",bd:"#A3E4D7"},
  Intermediate:{bg:"#FEF9E7",fg:"#D4AC0D",bd:"#F9E79F"},
  Advanced:{bg:"#FDEDEC",fg:"#E74C3C",bd:"#F5B7B1"}
};
const CI = {"Up-Front Contract":"🤝","Decision":"⚖️","Pain / Pain Funnel":"🎯","Budget":"💰","Fulfillment":"✅","Post-Sell":"🛡️","Bonding & Rapport":"💬","Advanced Techniques":"🧠","Negative Reverse Selling":"🔀","Sandler Rules & Principles":"📖","Transactional Analysis / DISC":"🧬"};


const RESOURCES = {
  "categories": [
    {
      "name": "Sell Sheets",
      "icon": "📋",
      "docs": [
        {"name":"7 Things Before Hiring a Masonry Contractor","url":"https://cdn.jobtread.com/G28AUBSh0g2YV-qXJ7e1Oc0NwNMNjgO1BKIEA7AkkC8Qnr7pEUNz-yKHhn7Jz73KShAYoAHsNMd5L79owis1fGCWTB6jB5ksF-lVVUmeC2nPy0PKTRpdtkiddLNjmfc32VNUUGtZ4w8.jfOCP5Du81HlWms9W0bqjITyRnetCaUA3wTrNqN53XI","type":"pdf"},
        {"name":"Price Assurance","url":"https://cdn.jobtread.com/CyGAeyJiIjoiam9idHJlYWQiLCJrIjoiZmlsZXMvMjJOeFRjZ1Z5SmRBIiwibiI6IlByaWNlIEFzc3VyYW5jZS5wZGYifQM.0xwA9X7vgB70nOO_nv-LyMQwdBxWrfI-3Zpl1GJZnCw","type":"pdf"},
        {"name":"Enerbank Financing","url":"https://cdn.jobtread.com/iyKAeyJiIjoiam9idHJlYWQiLCJrIjoiZmlsZXMvMjJOeHpCQU5uOXFWIiwibiI6IkVuZXJiYW5rIEZpbmFuY2luZy5wZGYifQM.bae8JvZmWrAavRfCfQwVBnKnDgnZlsnwfihiYUp5WpM","type":"pdf"},
        {"name":"IL Residential Consumer Rights","url":"https://cdn.jobtread.com/G00AgBSh0tVtqS8fDm_atAnyEp7EgxZBUXTKcaBcCxILLdQ_BRlOf1ArmefBENGnrWtBcGS7WUTPzUl9txAwttT23bJEf0LkAw.OrE4DSBmTIPYVLEu6HbM5NjqR24CUP3iQBKkyVMeOBc","type":"pdf"}
      ]
    },
    {
      "name": "Fact Sheets",
      "icon": "📊",
      "docs": [
        {"name":"2025 Fact Sheet","url":"https://cdn.jobtread.com/CyGAeyJiIjoiam9idHJlYWQiLCJrIjoiZmlsZXMvMjJQNWo5Zkx2OUdVIiwibiI6IjIwMjUgRmFjdCBTaGVldC5wZGYifQM.WFyH9wABz4xn_fRJVJU4inHBinmL0AtjKsvDXFq9eVw","type":"pdf"},
        {"name":"2024 Fact Sheet","url":"https://cdn.jobtread.com/CyGAeyJiIjoiam9idHJlYWQiLCJrIjoiZmlsZXMvMjJOeDRwNVA5UlJ0IiwibiI6IkZhY3QgU2hlZXQgMjAyNC5wZGYifQM.AJYyOonnZUdO_JBRGPEQAu9Khtz7hzMJuL2dTY_0GX0","type":"pdf"},
        {"name":"NSTX Fact Sheet","url":"https://cdn.jobtread.com/CyGAeyJiIjoiam9idHJlYWQiLCJrIjoiZmlsZXMvMjJOeEp4S1dhTmNaIiwibiI6Ik5TVFggRmFjdCBTaGVldC5wZGYifQM.kThtQaoSr8ZST3W2IcA6rZ-d2n6pHGCBMLQ5qD4W1wQ","type":"pdf"}
      ]
    },
    {
      "name": "Educational Materials",
      "icon": "🎓",
      "docs": [
        {"name":"Lintel Capping","url":"https://cdn.jobtread.com/iyCAeyJiIjoiam9idHJlYWQiLCJrIjoiZmlsZXMvMjJQNGpWaGpWU0JEIiwibiI6IkxpbnRlbCBDYXBwaW5nLmpwZyJ9Aw.el_XubkgmcmAWmxPoSDpkfMKwj_djiLe4GYochW09s8","type":"jpg"},
        {"name":"Thin Stone Advantages","url":"https://cdn.jobtread.com/G0sAgMTaOa26WanPZJkUsf_w8YoUk3jAtdh25kSL0Qs4DtnzRURXnQdGgC4-robFgNm2I4pey9n1ShIwa6jJJSa3Pi8TFlIf.ophFvkLY262MP7Kb3FVJElreGdxJMFQ4jxPZoz1-DFQ","type":"jpg"},
        {"name":"Full Veneer vs Thin","url":"https://cdn.jobtread.com/CyOAeyJiIjoiam9idHJlYWQiLCJrIjoiZmlsZXMvMjJQNGpWdHFTbm5IIiwibiI6IkZ1bGwgVmVuZWVyIHZzIHRoaW4uanBnIn0D.xumXF-5XqZKVpB7VmFYUAgUwCqD49NF-3X6aSoaJdrE","type":"jpg"},
        {"name":"Shelf Angle Detail","url":"https://cdn.jobtread.com/G3kAUKwK7BbzT0I1lDU3rttSSXiNy9xGqY7RtQUxFNn5jjnQIpYMUwYJ0SWLTl-KHEH1UBTWGsjF8UD5wQY20O6S3Iopp9wWUVogLYTbD_7jK5y5y9XDLBDcI-PznVxE9kkdWok1xdbY-u7JHQah9wcP43CHULUMzRgluFQe.XJ3D-2CRkXpUazBezpkSLUhxVYM3vwoanaI6WR-gn6k","type":"pdf"},
        {"name":"Winter Maintenance Checklist","url":"https://cdn.jobtread.com/G1cAgMTaOe03K_WZDLsy2f8X9eoFAwk44ThQbVFiB7CD_p7D8nxKyLk9D4II7bJVBw4NZLs9UQ5a9mCth5DlLmFPvLrN-5pM0XbKOPsB.4XXuvHxxB0983Q2uQrsVw2gi3zqgYasEStiQWACE_R0","type":"jpg"},
        {"name":"BIA Residential Standard 01.410.0201","url":"https://cdn.jobtread.com/Cx-AeyJiIjoiam9idHJlYWQiLCJrIjoiZmlsZXMvMjJQQ1FrZExqWWd1IiwibiI6IjAxLjQxMC4wMjAxLnBkZiJ9Aw.LQiARI2IQd3k1QllkaKwvd8HlT5GwsKIcjh8iBpvgFw","type":"pdf"},
        {"name":"BIA Residential Standard 01.410.1001","url":"https://cdn.jobtread.com/Cx-AeyJiIjoiam9idHJlYWQiLCJrIjoiZmlsZXMvMjJQQ1FrZExqQkc1IiwibiI6IjAxLjQxMC4xMDAxLnBkZiJ9Aw.eb81ffE6Xm46aLDqzCgTQBW3olB1hgImkkeOy7N5FJM","type":"pdf"}
      ]
    }
  ]
};

function shuffle(opts) {
  const e = Object.entries(opts);
  for (let i = e.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [e[i], e[j]] = [e[j], e[i]];
  }
  return e.map(([orig, text], i) => ({
    dl: ["A","B","C","D"][i], ol: orig, text
  }));
}

// Storage is handled by src/supabase.js


const CSS = `
@keyframes slideUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes popIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}
@keyframes confetti{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(100vh) rotate(720deg)}}
@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
* { box-sizing: border-box; }
button { font-family: inherit; }
.quiz-card { transition: transform 0.15s ease, box-shadow 0.15s ease; }
.quiz-card:active { transform: scale(0.98) !important; }
button:focus-visible, div[role="radio"]:focus-visible { outline: 3px solid #5DA5BA; outline-offset: 2px; }
@media(max-width:400px){
  .qgrid{grid-template-columns:1fr !important}
  .hero-title{font-size:22px !important}
  .q-text{font-size:14px !important}
}
@media(max-width:600px){
  .qgrid{grid-template-columns:repeat(auto-fill,minmax(240px,1fr)) !important}
}
.opt-card:hover:not([data-locked="true"]){background:#EBF5FB !important;border-color:#2471A3 !important}
.quiz-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(27,79,114,0.10)}
.quiz-card{transition:transform 0.15s,box-shadow 0.15s}
.btn-primary:hover{filter:brightness(1.1)}
.btn-outline:hover{background:rgba(27,79,114,0.06)}
`;


function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{position:"fixed",inset:0,zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.5)",animation:"fadeIn 0.2s"}} onClick={onClose}>
      <div style={{background:"#132F44",borderRadius:16,padding:"28px 24px",maxWidth:400,width:"90%",boxShadow:"0 20px 60px rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.06)",animation:"popIn 0.25s ease"}} onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Confetti() {
  const colors = [B.navy, B.sky, B.gold, B.grn, B.skyL];
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:50,overflow:"hidden"}}>
      {Array.from({length:30}).map((_,i) => (
        <div key={i} style={{
          position:"absolute", top:-20, left:`${Math.random()*100}%`,
          width: 8+Math.random()*8, height: 8+Math.random()*8,
          background: colors[i % colors.length],
          borderRadius: Math.random()>0.5 ? "50%" : "2px",
          animation: `confetti ${2+Math.random()*2}s linear ${Math.random()*1.5}s forwards`,
          opacity: 0.8
        }}/>
      ))}
    </div>
  );
}

function NavBar({ left, center, right, progress }) {
  return (
    <div style={{background:B.navy,paddingTop:"max(12px, env(safe-area-inset-top, 12px))",paddingBottom:"12px",paddingLeft:"20px",paddingRight:"20px"}}>
      <div style={{maxWidth:720,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        {left}
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <img src={ICON} alt="" style={{width:24,height:24}} />
          <span style={{color:"#fff",fontWeight:700,fontSize:14}}>{center}</span>
        </div>
        {right}
      </div>
      {progress !== undefined && (
        <div role="progressbar" aria-valuenow={progress} aria-valuemax={100} style={{maxWidth:720,margin:"8px auto 0",height:3,background:"rgba(255,255,255,0.1)",borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${progress}%`,background:B.sky,borderRadius:2,transition:"width 0.4s ease"}}/>
        </div>
      )}
    </div>
  );
}

function StatPill({ label, value }) {
  return (
    <div style={{background:"rgba(255,255,255,0.08)",borderRadius:8,padding:"7px 14px",border:"1px solid rgba(255,255,255,0.1)"}}>
      <span style={{color:"rgba(255,255,255,0.45)",fontSize:11,fontWeight:600}}>{label}</span>
      <span style={{color:"#fff",fontSize:15,fontWeight:800,marginLeft:8}}>{value}</span>
    </div>
  );
}


export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try { return window.matchMedia('(prefers-color-scheme: dark)').matches; } catch(e) { return false; }
  });
  const C = {...B, ...(darkMode ? DARK : LIGHT)};
  useEffect(() => { document.body.style.background = C.bg; document.body.style.colorScheme = darkMode ? 'dark' : 'light'; }, [darkMode]);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState("login");
  const [user, setUser] = useState(null);
  const [userPassword, setUserPassword] = useState("");
  const [passwordMode, setPasswordMode] = useState(null); // null | "set" | "enter"
  const [pwInput, setPwInput] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwError, setPwError] = useState("");
  const [allProg, setAllProg] = useState({});
  const [quizIdx, setQuizIdx] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [locked, setLocked] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const [trail, setTrail] = useState([]);
  const [modal, setModal] = useState(null);
  const [adminPw, setAdminPw] = useState("");
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminErr, setAdminErr] = useState(false);
  const [bsTranscript, setBsTranscript] = useState("");
  const [bsAnalyzing, setBsAnalyzing] = useState(false);
  const [audioTranscribing, setAudioTranscribing] = useState(false);
  const audioInputRef = useRef(null);
  const [bsResult, setBsResult] = useState(null);
  const [bsHistory, setBsHistory] = useState([]);
  const [bsViewIdx, setBsViewIdx] = useState(null);
  const [digest, setDigest] = useState(null);
  const [adminAnalyses, setAdminAnalyses] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [myProfile, setMyProfile] = useState(null);
  const [streak, setStreak] = useState({current:0,best:0});
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoManualOpen, setPhotoManualOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [heatmapData, setHeatmapData] = useState(null);
  const [estScopes, setEstScopes] = useState([]);
  const [estInput, setEstInput] = useState("");
  const [estRecording, setEstRecording] = useState(false);
  const estRecRef = useRef(null);
  const [objSearch, setObjSearch] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [todayTasks, setTodayTasks] = useState([]);
  const [estMode, setEstMode] = useState("nlp");
  const [estBuilding, setEstBuilding] = useState("residential");
  const [estLoading, setEstLoading] = useState(false);
  const [heatmapMarket, setHeatmapMarket] = useState("Chicago");
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(null);
  const [cropSrc, setCropSrc] = useState(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropPos, setCropPos] = useState({x:0,y:0});
  const cropCanvasRef = useRef(null);
  const cropImgRef = useRef(null);
  const cropDragRef = useRef(null);
  const shuffleRef = useRef({});
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);

  // Daily Sandler tip from existing quiz data
  const dailyTip = useMemo(() => {
    const allTips = Q.flatMap(quiz => quiz.questions.map(q => ({ tip: q.tip, category: q.category, day: quiz.quiz_number })));
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,0)) / 86400000);
    return allTips[dayOfYear % allTips.length];
  }, []);

  // Transcript badge tiers
  const BADGE_TIERS = [
    {count:10,label:"Bronze Analyst",color:"#CD7F32",bg:"#FFF3E0"},
    {count:50,label:"Silver Analyst",color:"#A0A0A0",bg:"#F5F5F5"},
    {count:100,label:"Gold Analyst",color:"#D4AC0D",bg:"#FEF9E7"},
    {count:250,label:"Platinum Analyst",color:"#6C63FF",bg:"#EDE7F6"},
    {count:500,label:"Diamond Analyst",color:"#00BCD4",bg:"#E0F7FA"},
    {count:1000,label:"Legendary",color:"#FF5722",bg:"#FBE9E7"},
  ];

  // Load persisted progress + profiles
  useEffect(() => {
    loadAllProgress().then(d => { setAllProg(d); setLoading(false); }).catch(() => setLoading(false));
    loadAllProfiles().then(d => setProfiles(d)).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      loadLatestDigest(user).then(d => setDigest(d)).catch(() => {});
      loadProfile(user).then(p => {
        setMyProfile(p);
        if (!p || (!p.avatar && (p.pic_prompts_left === null || p.pic_prompts_left > 0))) {
          setShowPhotoModal(true);
        }
      }).catch(() => {});
      updateStreak(user).then(s => setStreak(s)).catch(() => {});
      loadAnalyses(user).then(d => setBsHistory(d)).catch(() => {});
    } else {
      setDigest(null); setMyProfile(null); setStreak({current:0,best:0}); setBsHistory([]);
    }
  }, [user]);

  // Keyboard shortcuts
  useEffect(() => {
    const h = (e) => {
      if (screen !== "quiz") return;
      const k = e.key.toUpperCase();
      if (["A","B","C","D"].includes(k) && !locked) {
        setPicked(k);
      }
      if (e.key === "Enter") {
        if (locked) advance();
        else if (picked) lock();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const myProg = allProg[user] || {};
  const passedCount = Object.values(myProg).filter(p => p.passed).length;
  const allPassed = passedCount === 15;
  const totalRight = Object.values(myProg).reduce((s,p) => s + (p.score||0), 0);
  const totalAns = Object.values(myProg).reduce((s,p) => s + (p.total||0), 0);
  const nextQuiz = Q.findIndex((_, i) => !myProg[i]?.passed);

  function getShuffled(qi) {
    if (!shuffleRef.current[qi]) {
      shuffleRef.current[qi] = shuffle(Q[quizIdx].questions[qi].options);
    }
    return shuffleRef.current[qi];
  }

  function launch(idx) {
    setQuizIdx(idx); setQIdx(0); setPicked(null);
    setLocked(false); setTipOpen(false); setTrail([]);
    shuffleRef.current = {};
    setScreen("quiz");
  }

  function lock() {
    if (picked === null) return;
    setLocked(true); setTipOpen(false);
  }

  function advance() {
    const opts = getShuffled(qIdx);
    const sel = opts.find(o => o.dl === picked);
    const q = Q[quizIdx].questions[qIdx];
    const next = [...trail, { picked: sel.ol, displayPicked: picked, correct: q.correct }];
    setTrail(next);

    if (qIdx + 1 < Q[quizIdx].questions.length) {
      setQIdx(qIdx + 1); setPicked(null);
      setLocked(false); setTipOpen(false);
      if (scrollRef.current) scrollRef.current.scrollIntoView({behavior:"smooth"});
    } else {
      const sc = next.filter(a => a.picked === a.correct).length;
      const passed = sc >= PASS;
      if (passed) {
        const result = { score: sc, total: next.length, passed: true, trail: next, ts: Date.now() };
        const newProg = { ...myProg, [quizIdx]: result };
        const updated = { ...allProg, [user]: newProg };
        setAllProg(updated);
        saveQuizResult(user, quizIdx, result);
        setScreen("pass");
      } else {
        // Save attempt but not passed (unless already passed)
        if (!myProg[quizIdx]?.passed) {
          const result = { score: sc, total: next.length, passed: false, trail: next, ts: Date.now() };
          const newProg = { ...myProg, [quizIdx]: result };
          const updated = { ...allProg, [user]: newProg };
          setAllProg(updated);
          saveQuizResult(user, quizIdx, result);
        }
        setScreen("fail");
      }
    }
  }

  function exitQuiz() {
    setModal(null); setScreen("home");
  }

  if (loading) {
    return (
      <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans','Outfit',sans-serif"}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{CSS}</style>
        <div style={{textAlign:"center"}}>
          <img src={ICON} alt="" style={{width:64,height:64,marginBottom:16,animation:"pulse 1.5s infinite"}}/>
          <div style={{color:C.navy,fontWeight:700,fontSize:16}}>Loading Closer’s Club...</div>
        </div>
      </div>
    );
  }


  // ═══ LOGIN ═══
  if (screen === "login") {
    return (
      <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif",display:"flex",flexDirection:"column"}}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{CSS}{`
          @keyframes loginFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        `}</style>

        {/* Cybertruck Video Hero */}
        <div style={{position:"relative",overflow:"hidden"}}>
          <video autoPlay muted loop playsInline poster={CYBER}
            style={{width:"100%",height:"clamp(280px, 50vh, 600px)",objectFit:"cover",objectPosition:"center 55%",display:"block"}}>
            <source src="/hero.mp4" type="video/mp4"/>
          </video>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(11,25,41,0.3) 0%, rgba(11,25,41,0.5) 40%, rgba(11,25,41,0.97) 100%)"}}/>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",paddingTop:"max(20px, env(safe-area-inset-top, 0px))"}}>
            <img src={ICON} alt="North Shore Masonry" style={{width:80,height:80,marginBottom:14,filter:"drop-shadow(0 4px 16px rgba(0,0,0,0.4))",animation:"loginFloat 4s ease-in-out infinite"}}/>
            <div style={{color:"rgba(255,255,255,0.45)",fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",marginBottom:6}}>North Shore Masonry</div>
            <div style={{color:"#fff",fontSize:36,fontWeight:900,letterSpacing:-0.5,lineHeight:1.1,textShadow:"0 2px 16px rgba(0,0,0,0.4)"}}>Closer's Club</div>
          </div>
        </div>

        {/* User Picker — Dark Theme */}
        <div style={{flex:1,padding:"24px 20px",position:"relative"}}>
          <div style={{maxWidth:420,margin:"0 auto"}}>
            <div style={{marginBottom:18}}>
              <div style={{fontSize:20,fontWeight:800,color:"#fff"}}>Welcome back,</div>
              <div style={{fontSize:15,color:"rgba(255,255,255,0.4)"}}>Who's closing today?</div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {USERS.map(u => (
                <button key={u} onClick={async() => { const pw = await getPassword(u); if (!pw) { setUser(u);setPasswordMode("set");setPwInput("");setPwConfirm("");setPwError(""); } else { setUser(u);setPasswordMode("enter");setPwInput("");setPwError(""); } }}
                  style={{
                    display:"flex",alignItems:"center",gap:14,
                    background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,
                    padding:"14px 18px",cursor:"pointer",transition:"all 0.2s",
                    boxShadow:"0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",width:"100%",textAlign:"left"
                  }}>
                  {profiles[u]?.avatar ? (
                    <img src={profiles[u].avatar} alt="" style={{width:44,height:44,borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(255,255,255,0.15)"}}/>
                  ) : (
                    <div style={{width:44,height:44,borderRadius:"50%",background:"rgba(93,165,186,0.2)",color:"#5DA5BA",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,flexShrink:0,border:"2px solid rgba(93,165,186,0.15)"}}>{u[0]}</div>
                  )}
                  <div style={{fontSize:17,fontWeight:700,color:"#fff"}}>{u}</div>
                </button>
              ))}
            </div>

            <button onClick={() => { setAdminAuth(false); setAdminPw(""); setAdminErr(false); setScreen("admin"); }}
              style={{width:"100%",marginTop:20,padding:"12px",borderRadius:10,background:"transparent",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.35)",fontSize:13,fontWeight:600,cursor:"pointer"}}>
              Admin Portal
            </button>

            <div style={{textAlign:"center",padding:"16px 0 8px",color:"rgba(255,255,255,0.25)",fontSize:11}}>
              Brick by brick. — North Shore Masonry
            </div>
          </div>
        </div>

        {/* Password Modal */}
        {passwordMode && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:"#132F44",borderRadius:20,maxWidth:380,width:"100%",padding:"32px 24px",boxShadow:"0 24px 48px rgba(0,0,0,0.5)",border:"1px solid rgba(255,255,255,0.06)"}}>
              <div style={{textAlign:"center",marginBottom:20}}>
                <div style={{fontSize:40,marginBottom:8}}>{passwordMode==="set"?"\ud83d\udd10":"\ud83d\udd11"}</div>
                <div style={{fontSize:20,fontWeight:800,color:"#fff"}}>{passwordMode==="set"?"Create Your Password":"Enter Password"}</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginTop:4}}>{passwordMode==="set"?"Set a password for your account":"Welcome back, "+user}</div>
              </div>
              <input type="password" value={pwInput} onChange={e=>{setPwInput(e.target.value);setPwError("");}}
                placeholder={passwordMode==="set"?"New password":"Password"} autoFocus
                style={{width:"100%",padding:"14px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",fontSize:16,marginBottom:10,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"rgba(255,255,255,0.05)",color:"#fff"}}/>
              {passwordMode==="set" && (
                <input type="password" value={pwConfirm} onChange={e=>{setPwConfirm(e.target.value);setPwError("");}}
                  placeholder="Confirm password"
                  style={{width:"100%",padding:"14px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",fontSize:16,marginBottom:10,outline:"none",fontFamily:"inherit",boxSizing:"border-box",background:"rgba(255,255,255,0.05)",color:"#fff"}}/>
              )}
              {pwError && <div style={{color:"#E74C3C",fontSize:13,fontWeight:600,marginBottom:10,textAlign:"center"}}>{pwError}</div>}
              <button onClick={async()=>{
                if (passwordMode==="set") {
                  if (pwInput.length<4) {setPwError("Password must be at least 4 characters");return;}
                  if (pwInput!==pwConfirm) {setPwError("Passwords don't match");return;}
                  const ok = await setPassword(user, pwInput);
                  if (ok) {setPasswordMode(null);updateStreak(user);setScreen("home");setShowWelcome(true);}
                  else setPwError("Failed to save. Try again.");
                } else {
                  const ok = await checkPassword(user, pwInput);
                  if (ok) {setPasswordMode(null);updateStreak(user);setScreen("home");setShowWelcome(true);}
                  else setPwError("Wrong password");
                }
              }} style={{width:"100%",padding:"14px",borderRadius:12,background:"linear-gradient(145deg, #5DA5BA 0%, #3D7A8E 100%)",color:"#fff",border:"none",fontSize:16,fontWeight:700,cursor:"pointer",marginBottom:10,boxShadow:"0 4px 16px rgba(93,165,186,0.25)"}}>
                {passwordMode==="set"?"Create Password":"Login"}
              </button>
              <button onClick={()=>{setPasswordMode(null);setUser(null);setPwInput("");setPwConfirm("");setPwError("");}}
                style={{width:"100%",padding:"10px",borderRadius:10,background:"transparent",color:"rgba(255,255,255,0.35)",border:"none",fontSize:13,cursor:"pointer"}}>
                Back to user select
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }




  // ═══ HOME ═══
  if (screen === "home") {
    const handlePhotoUpload = (e) => {
      const file = e.target.files?.[0]; if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        setCropSrc(ev.target.result);
        setCropZoom(1);
        setCropPos({x:0,y:0});
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    };
    const saveCrop = () => {
      const img = cropImgRef.current;
      if (!img) return;
      const canvas = document.createElement('canvas');
      const sz = 400; // output size
      const preview = 200; // preview circle size
      const ratio = sz / preview;
      canvas.width = sz; canvas.height = sz;
      const ctx = canvas.getContext('2d');
      ctx.beginPath(); ctx.arc(sz/2,sz/2,sz/2,0,Math.PI*2); ctx.clip();
      // Replicate the CSS fitting logic from the preview
      const aspect = img.naturalWidth / img.naturalHeight;
      let fitW, fitH;
      if (aspect > 1) { fitH = preview; fitW = preview * aspect; }
      else { fitW = preview; fitH = preview / aspect; }
      // Apply zoom
      const drawW = fitW * cropZoom * ratio;
      const drawH = fitH * cropZoom * ratio;
      // Center + offset (offset is in preview coords, scale to canvas)
      const ox = (sz - drawW) / 2 + cropPos.x * cropZoom * ratio;
      const oy = (sz - drawH) / 2 + cropPos.y * cropZoom * ratio;
      ctx.drawImage(img, ox, oy, drawW, drawH);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      saveProfile(user, { avatar: dataUrl, pic_prompts_left: 0 });
      setMyProfile(p => ({ ...p, avatar: dataUrl, pic_prompts_left: 0 }));
      setProfiles(p => ({ ...p, [user]: { ...p[user], avatar: dataUrl } }));
      setCropSrc(null);
      setShowPhotoModal(false);
    };
    const skipPhoto = () => {
      const left = Math.max(0, (myProfile?.pic_prompts_left ?? 3) - 1);
      saveProfile(user, { pic_prompts_left: left });
      setMyProfile(p => ({ ...p, pic_prompts_left: left }));
      setCropSrc(null);
      setShowPhotoModal(false);
    };
    const handleCropDrag = (e) => {
      e.preventDefault();
      const startX = e.clientX || e.touches?.[0]?.clientX;
      const startY = e.clientY || e.touches?.[0]?.clientY;
      const startPos = {...cropPos};
      const move = (ev) => {
        const cx = ev.clientX || ev.touches?.[0]?.clientX;
        const cy = ev.clientY || ev.touches?.[0]?.clientY;
        setCropPos({x: startPos.x + (cx - startX) / cropZoom, y: startPos.y + (cy - startY) / cropZoom});
      };
      const up = () => { document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); document.removeEventListener('touchmove',move); document.removeEventListener('touchend',up); };
      document.addEventListener('mousemove',move);
      document.addEventListener('mouseup',up);
      document.addEventListener('touchmove',move,{passive:false});
      document.addEventListener('touchend',up);
    };
    const currentBadge = [...BADGE_TIERS].reverse().find(t => bsHistory.length >= t.count);

    return (
      <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif"}}>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{CSS}{`
          @keyframes float{0%,100%{transform:translateY(0) rotate(12deg)}50%{transform:translateY(-6px) rotate(15deg)}}
          @keyframes breathe{0%,100%{opacity:0.04}50%{opacity:0.1}}
          .card-hover{transition:all 0.25s cubic-bezier(0.22,1,0.36,1) !important}
          .card-hover:hover{transform:translateY(-3px) !important;box-shadow:0 16px 40px rgba(0,0,0,0.5) !important}
          .card-hover:active{transform:scale(0.97) !important}
        `}</style>
        <input type="file" accept="image/*" ref={fileInputRef} style={{display:"none"}} onChange={handlePhotoUpload}/>

        {/* Photo Upload / Crop Modal */}
        {showPhotoModal && (
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:C.card,borderRadius:16,padding:"24px",maxWidth:380,width:"100%",textAlign:"center",animation:"popIn 0.3s ease"}}>
              {cropSrc ? (
                <>
                  <div style={{fontSize:15,fontWeight:800,color:C.dk,marginBottom:12}}>Resize & position</div>
                  <div style={{width:200,height:200,borderRadius:"50%",overflow:"hidden",margin:"0 auto 16px",position:"relative",border:`3px solid ${C.navy}`,cursor:"grab",touchAction:"none",background:"#000"}}
                    onMouseDown={handleCropDrag} onTouchStart={handleCropDrag}>
                    <img ref={cropImgRef} src={cropSrc} alt="" draggable={false}
                      style={{position:"absolute",left:"50%",top:"50%",transform:`translate(calc(-50% + ${cropPos.x * cropZoom}px), calc(-50% + ${cropPos.y * cropZoom}px)) scale(${cropZoom})`,maxWidth:"none",maxHeight:"none",width:"100%",height:"auto",pointerEvents:"none",userSelect:"none"}}
                      onLoad={(e) => {
                        const img = e.target;
                        const aspect = img.naturalWidth / img.naturalHeight;
                        if (aspect > 1) { img.style.width = "auto"; img.style.height = "100%"; }
                        else { img.style.width = "100%"; img.style.height = "auto"; }
                      }}
                    />
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,padding:"0 12px"}}>
                    <span style={{fontSize:11,color:C.mut}}>Zoom</span>
                    <input type="range" min="0.5" max="3" step="0.05" value={cropZoom}
                      onChange={e=>setCropZoom(parseFloat(e.target.value))}
                      style={{flex:1,accentColor:C.navy}}/>
                    <span style={{fontSize:11,color:C.mut,minWidth:30}}>{Math.round(cropZoom*100)}%</span>
                  </div>
                  <div style={{fontSize:10,color:C.mut,marginBottom:12}}>Drag to reposition. Slide to zoom.</div>
                  <div style={{display:"flex",gap:8}}>
                    <button onClick={()=>{setCropSrc(null);setCropZoom(1);setCropPos({x:0,y:0});}}
                      style={{flex:1,padding:"10px",borderRadius:8,background:"transparent",border:`1px solid ${C.bdr}`,color:C.mut,fontSize:13,fontWeight:600,cursor:"pointer"}}>
                      Cancel
                    </button>
                    <button onClick={saveCrop}
                      style={{flex:1,padding:"10px",borderRadius:8,background:C.navy,border:"none",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                      Save Photo
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{width:80,height:80,borderRadius:"50%",background:C.navy,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,fontWeight:800,margin:"0 auto 16px",overflow:"hidden"}}>
                    {myProfile?.avatar ? <img src={myProfile.avatar} alt="" style={{width:80,height:80,objectFit:"cover"}}/> : user?.[0]}
                  </div>
                  <div style={{fontSize:17,fontWeight:800,color:C.dk,marginBottom:4}}>Add your photo</div>
                  <div style={{fontSize:12,color:C.mut,marginBottom:20}}>Your photo shows on the leaderboard and login screen.</div>
                  <button onClick={()=>fileInputRef.current?.click()} className="btn-primary"
                    style={{width:"100%",padding:"12px",borderRadius:10,background:C.navy,color:"#fff",border:"none",fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:8}}>
                    Choose Photo
                  </button>
                  <button onClick={()=>{if(photoManualOpen){setShowPhotoModal(false);setPhotoManualOpen(false);}else{skipPhoto();}}}
                    style={{width:"100%",padding:"10px",borderRadius:10,background:"transparent",border:"none",color:C.mut,fontSize:12,cursor:"pointer"}}>
                    {photoManualOpen ? "Close" : (myProfile?.pic_prompts_left ?? 3) > 1 ? `Skip (${(myProfile?.pic_prompts_left ?? 3) - 1} left)` : "Don't ask again"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <div style={{position:"relative",overflow:"hidden"}}>
          <img src={CYBER} alt="" style={{width:"100%",height:"clamp(260px, 35vh, 400px)",objectFit:"cover",objectPosition:"center 55%",display:"block"}}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg, rgba(11,25,41,0.35) 0%, rgba(11,25,41,0.6) 50%, rgba(11,25,41,0.97) 100%)"}}/>
          <div style={{position:"absolute",top:0,left:0,right:0,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"max(14px, calc(env(safe-area-inset-top, 0px) + 8px)) 18px 14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              {myProfile?.avatar ? (
                <img src={myProfile.avatar} alt="" onClick={()=>{setPhotoManualOpen(true);setShowPhotoModal(true);}} style={{width:42,height:42,borderRadius:"50%",objectFit:"cover",cursor:"pointer",border:"2px solid rgba(255,255,255,0.2)",boxShadow:"0 2px 12px rgba(0,0,0,0.3)",flexShrink:0}}/>
              ) : (
                <div onClick={()=>{setPhotoManualOpen(true);setShowPhotoModal(true);}} style={{width:42,height:42,borderRadius:"50%",background:"rgba(255,255,255,0.1)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:800,cursor:"pointer",border:"2px dashed rgba(255,255,255,0.2)",flexShrink:0}}>{user?.[0]}</div>
              )}
              <span style={{color:"#fff",fontSize:20,fontWeight:800,letterSpacing:-0.3,textShadow:"0 2px 8px rgba(0,0,0,0.4)"}}>{user}'s Dashboard</span>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <button onClick={()=>setDarkMode(d=>!d)} style={{background:"none",border:"none",color:"rgba(255,255,255,0.5)",cursor:"pointer",fontSize:14,padding:4}}>{darkMode ? "\u2600\ufe0f" : "\ud83c\udf19"}</button>
              <button onClick={() => { loadAllProgress().then(d => setAllProg(d)); loadAllProfiles().then(d=>setProfiles(d)); setUser(null); setScreen("login"); setShowWelcome(true); }}
                style={{background:"rgba(255,255,255,0.06)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.1)",color:"rgba(255,255,255,0.6)",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:500}}>Logout</button>
            </div>
          </div>
        </div>

        {/* Frosted Stat Pills */}
        <div style={{display:"flex",gap:8,padding:"0 16px",marginTop:-22,position:"relative",zIndex:2}}>
          {[
            {icon:"✓",label:"Passed",val:`${passedCount}/15`,color:"#5DA5BA"},
            {icon:"◎",label:"Accuracy",val:totalAns>0?`${Math.round(totalRight/totalAns*100)}%`:"\u2014",color:"#F1C40F"},
            ...(streak.current>0?[{icon:"\ud83d\udd25",label:"Streak",val:`${streak.current}d`,color:"#E67E22",extra:"\ud83d\udd25"}]:[]),
          ].map((p,i)=>(
            <div key={i} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,
              padding:"11px 6px",borderRadius:12,
              background:"rgba(11,25,41,0.75)",backdropFilter:"blur(16px)",
              border:"1px solid rgba(255,255,255,0.08)",
              boxShadow:"0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)"}}>
              <span style={{fontSize:12,color:p.color,fontWeight:700}}>{p.icon}</span>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:500}}>{p.label}</span>
              <span style={{fontSize:16,fontWeight:900,color:"#fff"}}>{p.val}</span>
              {p.extra && <span style={{fontSize:11}}>{p.extra}</span>}
            </div>
          ))}
        </div>

        <div style={{maxWidth:960,margin:"0 auto",padding:"16px 16px 24px"}}>
                    {/* 6-Square Command Center */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <div onClick={()=>setScreen("training")} className="card-hover"
              style={{background:"linear-gradient(135deg, #1E8449 0%, #0E5A3A 100%)",borderRadius:18,padding:"22px 18px",cursor:"pointer",minHeight:145,position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end",boxShadow:"0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 30% 30%, #2ECC7125 0%, transparent 55%)",pointerEvents:"none"}}/>
              <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",pointerEvents:"none",mixBlendMode:"overlay"}}/>
              <div style={{position:"absolute",top:-8,right:-8,fontSize:75,opacity:0.1,lineHeight:1,pointerEvents:"none",animation:"float 6s ease-in-out infinite"}}>🧠</div>
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:"linear-gradient(90deg, transparent, #2ECC7130, transparent)",pointerEvents:"none"}}/>
              <div onClick={(e)=>{e.stopPropagation();loadAllProgress().then(d=>setAllProg(d));setScreen("leaderboard");}}
                style={{position:"absolute",top:12,left:12,display:"flex",alignItems:"center",gap:4,background:"rgba(0,0,0,0.3)",backdropFilter:"blur(6px)",borderRadius:8,padding:"4px 10px",cursor:"pointer",zIndex:2,border:"1px solid rgba(255,255,255,0.08)"}}>
                <span style={{fontSize:14}}>🏆</span>
                <span style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.85)"}}>Leaderboard</span>
              </div>
              <div style={{fontSize:38,marginBottom:12,position:"relative",filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.3))",marginTop:18}}>🧠</div>
              <div style={{fontSize:19,fontWeight:800,color:"#fff",position:"relative",textShadow:"0 1px 6px rgba(0,0,0,0.4)",letterSpacing:-0.2}}>Brain Training</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",fontWeight:500,marginTop:3,position:"relative"}}>{passedCount}/15 drills</div>
            </div>
            <div onClick={()=>{setBsTranscript("");setBsResult(null);setBsViewIdx(null);loadAnalyses(user).then(d=>setBsHistory(d));setScreen("blindspot");}} className="card-hover"
              style={{background:"linear-gradient(135deg, #1B4F72 0%, #0A2A3F 100%)",borderRadius:18,padding:"22px 18px",cursor:"pointer",minHeight:145,position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end",boxShadow:"0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 70% 20%, #5DA5BA25 0%, transparent 55%)",pointerEvents:"none"}}/>
              <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",pointerEvents:"none",mixBlendMode:"overlay"}}/>
              <div style={{position:"absolute",top:-8,right:-8,fontSize:75,opacity:0.1,lineHeight:1,pointerEvents:"none",animation:"float 6s ease-in-out infinite"}}>📈</div>
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:"linear-gradient(90deg, transparent, #5DA5BA30, transparent)",pointerEvents:"none"}}/>
              <div style={{fontSize:38,marginBottom:12,position:"relative",filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.3))"}}>📈</div>
              <div style={{fontSize:19,fontWeight:800,color:"#fff",position:"relative",textShadow:"0 1px 6px rgba(0,0,0,0.4)",letterSpacing:-0.2}}>Blind Spot</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",fontWeight:500,marginTop:3,position:"relative"}}>{bsHistory.length} analyses</div>
            </div>
            <div onClick={()=>setScreen("estimator")} className="card-hover"
              style={{background:"linear-gradient(135deg, #2980B9 0%, #0E3A56 100%)",borderRadius:18,padding:"22px 18px",cursor:"pointer",minHeight:145,position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end",boxShadow:"0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 80% 70%, #3498DB25 0%, transparent 55%)",pointerEvents:"none"}}/>
              <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",pointerEvents:"none",mixBlendMode:"overlay"}}/>
              <div style={{position:"absolute",top:-8,right:-8,fontSize:75,opacity:0.1,lineHeight:1,pointerEvents:"none",animation:"float 6s ease-in-out infinite"}}>🤖</div>
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:"linear-gradient(90deg, transparent, #3498DB30, transparent)",pointerEvents:"none"}}/>
              <div style={{fontSize:38,marginBottom:12,position:"relative",filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.3))"}}>🤖</div>
              <div style={{fontSize:19,fontWeight:800,color:"#fff",position:"relative",textShadow:"0 1px 6px rgba(0,0,0,0.4)",letterSpacing:-0.2}}>Estimator</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",fontWeight:500,marginTop:3,position:"relative"}}>Quick scope pricing</div>
            </div>
            <div onClick={()=>{if(!heatmapData)fetch('/heatmap.json').then(r=>r.json()).then(d=>setHeatmapData(d));setScreen("heatmap");}} className="card-hover"
              style={{background:"linear-gradient(135deg, #D4792A 0%, #7E4515 100%)",borderRadius:18,padding:"22px 18px",cursor:"pointer",minHeight:145,position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end",boxShadow:"0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 60% 80%, #F39C1225 0%, transparent 55%)",pointerEvents:"none"}}/>
              <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",pointerEvents:"none",mixBlendMode:"overlay"}}/>
              <div style={{position:"absolute",top:-8,right:-8,fontSize:75,opacity:0.1,lineHeight:1,pointerEvents:"none",animation:"float 6s ease-in-out infinite"}}>🗺️</div>
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:"linear-gradient(90deg, transparent, #F39C1230, transparent)",pointerEvents:"none"}}/>
              <div style={{fontSize:38,marginBottom:12,position:"relative",filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.3))"}}>🗺️</div>
              <div style={{fontSize:19,fontWeight:800,color:"#fff",position:"relative",textShadow:"0 1px 6px rgba(0,0,0,0.4)",letterSpacing:-0.2}}>Heat Map</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",fontWeight:500,marginTop:3,position:"relative"}}>580+ approved jobs</div>
            </div>
            <div onClick={()=>setScreen("resources")} className="card-hover"
              style={{background:"linear-gradient(135deg, #8E44AD 0%, #4A235A 100%)",borderRadius:18,padding:"22px 18px",cursor:"pointer",minHeight:145,position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end",boxShadow:"0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 20%, #A569BD25 0%, transparent 55%)",pointerEvents:"none"}}/>
              <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",pointerEvents:"none",mixBlendMode:"overlay"}}/>
              <div style={{position:"absolute",top:-8,right:-8,fontSize:75,opacity:0.1,lineHeight:1,pointerEvents:"none",animation:"float 6s ease-in-out infinite"}}>📁</div>
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:"linear-gradient(90deg, transparent, #A569BD30, transparent)",pointerEvents:"none"}}/>
              <div style={{fontSize:38,marginBottom:12,position:"relative",filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.3))"}}>📁</div>
              <div style={{fontSize:19,fontWeight:800,color:"#fff",position:"relative",textShadow:"0 1px 6px rgba(0,0,0,0.4)",letterSpacing:-0.2}}>Resources</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",fontWeight:500,marginTop:3,position:"relative"}}>Sell sheets & specs</div>
            </div>
            <div onClick={async()=>{
              setScreen("today");
              const JT_MAP={"Zac":"22Nxa2M8vDzG","Les":"22Nwt8wGjTEx","Luke":"22P92SdAQUQE","Jace":"22PTSGV5U7Rj","Paul":"22PGVz57tzke","Carlos":"22NxzADWDVVA","Devin":"22NztygQhunB","BJ":"22PHDEMpwFKR","Cortney":"22NxBXSxWBRq"};
              const mid=JT_MAP[user];
              if(mid){try{const r=await fetch("/.netlify/functions/tasks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({membershipId:mid})});const d=await r.json();if(d.tasks)setTodayTasks(d.tasks);}catch(e){console.error(e);}}
            }} className="card-hover"
              style={{background:"linear-gradient(135deg, #2C3E50 0%, #131A20 100%)",borderRadius:18,padding:"22px 18px",cursor:"pointer",minHeight:145,position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",justifyContent:"flex-end",boxShadow:"0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)"}}>
              <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 40% 60%, #5DA5BA25 0%, transparent 55%)",pointerEvents:"none"}}/>
              <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",pointerEvents:"none",mixBlendMode:"overlay"}}/>
              <div style={{position:"absolute",top:-8,right:-8,fontSize:75,opacity:0.1,lineHeight:1,pointerEvents:"none",animation:"float 6s ease-in-out infinite"}}>📋</div>
              <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:"linear-gradient(90deg, transparent, #5DA5BA30, transparent)",pointerEvents:"none"}}/>
              <div style={{fontSize:38,marginBottom:12,position:"relative",filter:"drop-shadow(0 2px 6px rgba(0,0,0,0.3))"}}>📋</div>
              <div style={{fontSize:19,fontWeight:800,color:"#fff",position:"relative",textShadow:"0 1px 6px rgba(0,0,0,0.4)",letterSpacing:-0.2}}>Today</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.55)",fontWeight:500,marginTop:3,position:"relative"}}>Tasks & to-do's</div>
            </div>
          </div>

          {/* Quick Tools Row */}
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            <div onClick={()=>setScreen("objections")} className="card-hover"
              style={{flex:1,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:14,padding:"16px 18px",cursor:"pointer",boxShadow:"0 2px 12px rgba(0,0,0,0.15)"}}>
              <div style={{fontSize:16,fontWeight:700,color:"#fff"}}>{"\ud83d\udde3\ufe0f"} Objection Playbook</div>
              <div style={{fontSize:13,color:"rgba(255,255,255,0.4)",marginTop:3}}>16 rebuttals with scripts</div>
            </div>
            <div onClick={()=>setShowQR(0)} className="card-hover"
              style={{minWidth:110,background:"linear-gradient(145deg, #F1C40F 0%, #D4AC0D 100%)",borderRadius:14,padding:"14px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",boxShadow:"0 4px 16px rgba(241,196,15,0.2)"}}>
              <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2}}>
                <svg viewBox="0 0 24 24" style={{width:18,height:18}}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span style={{fontSize:16}}>⭐</span>
              </div>
              <div style={{fontSize:13,fontWeight:700,color:"#2C3E50"}}>Get a Review</div>
            </div>
          </div>


{/* QR Code Review Modal */}
          {showQR !== false && (() => {
            const markets = [
              {name:"Chicago",pid:"ChIJG8-PDCelD4gRxQfXPgqHcw8",stars:"4.9",count:"275+"},
              {name:"Milwaukee",pid:"ChIJCcPGOosZBYgRJNWQWpRL9F8",stars:"5.0",count:"109"},
              {name:"Dallas",pid:"ChIJMX2yR4mDToYRsnTjXltsSxY",stars:"5.0",count:"19"},
              {name:"Indianapolis",pid:"ChIJSTDf3Pv7FYgRdEGKiT1fPYs",stars:"5.0",count:"8"},
            ];
            const idx = typeof showQR === "number" ? showQR : 0;
            const m = markets[idx];
            const reviewUrl = `https://search.google.com/local/writereview?placeid=${m.pid}`;
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(reviewUrl)}&color=1B4F72&bgcolor=FFFFFF&format=svg`;
            return (
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.88)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowQR(false)}>
              <div style={{background:"#fff",borderRadius:24,maxWidth:400,width:"100%",padding:"28px 24px",textAlign:"center",animation:"popIn 0.3s ease"}} onClick={e=>e.stopPropagation()}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:12}}>
                  <svg viewBox="0 0 24 24" style={{width:28,height:28}}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span style={{fontSize:26}}>⭐</span>
                </div>
                <div style={{fontSize:22,fontWeight:900,color:"#1B4F72",marginBottom:4}}>Leave Us a Review!</div>
                <div style={{fontSize:14,color:"#666",marginBottom:16,lineHeight:1.5}}>Show this QR code to the homeowner.</div>
                <div style={{display:"flex",gap:4,marginBottom:16,justifyContent:"center",flexWrap:"wrap"}}>
                  {markets.map((mk,i) => (
                    <div key={i} onClick={()=>setShowQR(i)}
                      style={{padding:"6px 14px",borderRadius:20,cursor:"pointer",fontSize:12,fontWeight:700,
                        background:idx===i?"#1B4F72":"#F0F4F8",color:idx===i?"#fff":"#1B4F72",transition:"all 0.2s"}}>
                      {mk.name}
                    </div>
                  ))}
                </div>
                <div style={{background:"#FAFBFC",borderRadius:16,padding:20,marginBottom:16,display:"inline-block",border:"1px solid #E8ECF0"}}>
                  <img src={qrUrl} alt="QR Code" style={{width:200,height:200,display:"block"}}/>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:16}}>
                  <img src={ICON} alt="" style={{width:32,height:32}}/>
                  <div style={{textAlign:"left"}}>
                    <div style={{fontSize:15,fontWeight:800,color:"#1B4F72"}}>North Shore Masonry — {m.name}</div>
                    <div style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{color:"#FBBC05",fontSize:14}}>{"★★★★★"}</span>
                      <span style={{fontSize:13,color:"#666",fontWeight:600}}>{m.stars} ({m.count} reviews)</span>
                    </div>
                  </div>
                </div>
                <button onClick={()=>setShowQR(false)} style={{width:"100%",padding:"14px",borderRadius:12,background:"#1B4F72",color:"#fff",border:"none",fontSize:16,fontWeight:700,cursor:"pointer"}}>
                  Done
                </button>
              </div>
            </div>
            );
          })()}

          {/* Welcome popup — Level Up of the Day */}
          {showWelcome && dailyTip && (
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:9998,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>setShowWelcome(false)}>
              <div style={{background:C.card,borderRadius:24,maxWidth:380,width:"100%",overflow:"hidden",animation:"popIn 0.3s ease",boxShadow:"0 24px 48px rgba(0,0,0,0.3)"}} onClick={e=>e.stopPropagation()}>
                <div style={{background:`linear-gradient(145deg, ${C.navy} 0%, #0D2B45 100%)`,padding:"32px 24px 24px",textAlign:"center"}}>
                  <img src={ICON} alt="" style={{width:56,height:56,marginBottom:12}}/>
                  <div style={{color:"rgba(255,255,255,0.5)",fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase"}}>Closer's Club</div>
                  <div style={{color:"#fff",fontSize:22,fontWeight:900,marginTop:4,letterSpacing:-0.3}}>Level Up of the Day</div>
                </div>
                <div style={{padding:"24px 24px 28px",textAlign:"center"}}>
                  <div style={{display:"inline-block",fontSize:9,fontWeight:700,color:C.navy,background:C.navy+"15",padding:"4px 14px",borderRadius:20,marginBottom:16,letterSpacing:0.5,textTransform:"uppercase"}}>{dailyTip.category}</div>
                  <div style={{fontSize:16,lineHeight:1.75,color:C.dk,textAlign:"left"}}>{dailyTip.tip}</div>
                  <button onClick={()=>setShowWelcome(false)}
                    style={{width:"100%",marginTop:24,padding:"16px",borderRadius:14,background:`linear-gradient(145deg, ${C.navy} 0%, #0D2B45 100%)`,color:"#fff",border:"none",fontSize:18,fontWeight:800,cursor:"pointer",letterSpacing:0.3}}>
                    Let's grow! 🚀
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Weekly Coaching Digest */}
          {digest && digest.active && (
            <div style={{background:"linear-gradient(145deg, #132F44 0%, #0B1F30 100%)",borderRadius:20,padding:"22px 20px",marginBottom:16,position:"relative",overflow:"hidden",border:"1px solid rgba(93,165,186,0.12)",boxShadow:"0 4px 24px rgba(0,0,0,0.2)"}}>
              <div style={{position:"absolute",inset:0,opacity:0.015,backgroundImage:"repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 20px)",pointerEvents:"none"}}/>
              <img src={ICON} alt="" style={{position:"absolute",bottom:-15,right:-10,width:130,height:130,opacity:0.04,animation:"breathe 4s ease-in-out infinite"}}/>
              <div style={{position:"relative"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,color:C.sky,letterSpacing:0.5,marginBottom:3}}>YOUR WEEKLY COACHING</div>
                    <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>Week of {new Date(digest.week_of + 'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <div style={{textAlign:"center",background:"rgba(255,255,255,0.08)",borderRadius:8,padding:"6px 12px"}}>
                      <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>{digest.quizzes_passed}/{digest.quizzes_total}</div>
                      <div style={{fontSize:9,color:"rgba(255,255,255,0.5)"}}>quizzes</div>
                    </div>
                    {digest.analyses_this_week > 0 && (
                      <div style={{textAlign:"center",background:"rgba(255,255,255,0.08)",borderRadius:8,padding:"6px 12px"}}>
                        <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>{digest.analyses_this_week}</div>
                        <div style={{fontSize:9,color:"rgba(255,255,255,0.5)"}}>appointments</div>
                      </div>
                    )}
                    {digest.accuracy > 0 && (
                      <div style={{textAlign:"center",background:"rgba(255,255,255,0.08)",borderRadius:8,padding:"6px 12px"}}>
                        <div style={{fontSize:16,fontWeight:800,color:"#fff"}}>{digest.accuracy}%</div>
                        <div style={{fontSize:9,color:"rgba(255,255,255,0.5)"}}>accuracy</div>
                      </div>
                    )}
                  </div>
                </div>
                {digest.weakest_step && (
                  <div style={{background:"rgba(255,255,255,0.06)",borderRadius:8,padding:"10px 12px",marginBottom:8}}>
                    <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",fontWeight:600,marginBottom:3}}>WEAKEST SANDLER STEP</div>
                    <div style={{fontSize:13,color:C.gold,fontWeight:700}}>{digest.weakest_step}</div>
                  </div>
                )}
                {digest.tip && (
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",lineHeight:1.5,fontStyle:"italic"}}>{digest.tip}</div>
                )}
              </div>
            </div>
          )}

          <div style={{height:32}}/>
        </div>
      </div>
    );
  }



  // ═══ BRAIN TRAINING ═══
  if (screen === "training") {
    return (
      <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif"}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{CSS}</style>
        <NavBar
          left={<button onClick={()=>setScreen("home")} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:500}}>← Back</button>}
          center="Brain Training"
          right={<span/>}
        />
        <div style={{maxWidth:960,margin:"0 auto",padding:"16px 16px 48px"}}>
          {/* Progress Path */}
          <div style={{background:C.card,borderRadius:12,padding:"16px",border:`1px solid ${C.bdr}`,marginBottom:16,overflowX:"auto"}}>
            <div style={{fontSize:12,fontWeight:700,color:C.mut,letterSpacing:0.5,marginBottom:10}}>YOUR JOURNEY</div>
            <div style={{display:"flex",alignItems:"center",minWidth:600}}>
              {Q.map((quiz, i) => {
                const p = myProg[i];
                const isActive = i === nextQuiz;
                const done = p?.passed;
                const tried = p && !p.passed;
                return (
                  <div key={i} style={{display:"flex",alignItems:"center",flex:1}}>
                    <div onClick={()=>launch(i)} style={{
                      width:done?36:isActive?40:30, height:done?36:isActive?40:30,
                      borderRadius:"50%",
                      background:done?C.grn:tried?C.gold:isActive?C.navy:"transparent",
                      border:done?`2px solid ${C.grn}`:tried?`2px solid ${C.gold}`:isActive?`2px solid ${C.navy}`:`2px solid ${C.bdr}`,
                      color:done||tried||isActive?"#fff":C.mut,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:done?14:isActive?14:11, fontWeight:700, cursor:"pointer",
                      transition:"all 0.2s",
                      boxShadow:isActive?"0 0 0 4px "+C.navy+"30":"none",
                      flexShrink:0
                    }}>
                      {done ? "\u2713" : i+1}
                    </div>
                    {i < Q.length - 1 && (
                      <div style={{flex:1,height:3,background:done?C.grn:C.bdr,borderRadius:2,margin:"0 2px",minWidth:8}}/>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div>
              <div style={{fontSize:18,fontWeight:800,color:C.dk}}>Daily Drills</div>
              <div style={{fontSize:13,color:C.mut}}>{passedCount} of 15 completed</div>
            </div>
            <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{Math.round(passedCount/15*100)}%</div>
          </div>
          <div className="qgrid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10}}>
            {Q.map((quiz, i) => {
              const p = myProg[i];
              const cats = quiz.categories.split(" \u2022 ").slice(0,3);
              const extra = quiz.categories.split(" \u2022 ").length - 3;
              return (
                <div key={i} onClick={()=>launch(i)} className="quiz-card"
                  style={{background:p?.passed?`linear-gradient(145deg, ${C.grn}08, ${C.grn}03)`:C.card,borderRadius:16,padding:"18px 18px 14px",cursor:"pointer",
                    border: p?.passed ? `1px solid ${C.grn}30` : p ? `1px solid ${C.gold}30` : `1px solid ${C.bdr}`,
                    boxShadow:i===nextQuiz?"0 4px 20px rgba(27,79,114,0.15)":"0 2px 8px rgba(0,0,0,0.04)",
                    position:"relative",overflow:"hidden"}}>
                  {i===nextQuiz && <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg, ${C.navy}, ${C.sky})`}}/>}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,
                        background:p?.passed?C.grn:p?C.gold:i===nextQuiz?C.navy:"transparent",
                        color:p||i===nextQuiz?"#fff":C.mut,
                        border:!p&&i!==nextQuiz?`2px solid ${C.bdr}`:"none"}}>
                        {p?.passed?"\u2713":quiz.quiz_number}
                      </div>
                      <div>
                        <div style={{fontSize:15,fontWeight:800,color:C.dk}}>Day {quiz.quiz_number}</div>
                        <div style={{fontSize:12,color:C.mut}}>{quiz.questions.length} questions</div>
                      </div>
                    </div>
                    {p?.passed && <span style={{fontSize:10,fontWeight:700,color:C.grn,background:C.grnBg,padding:"3px 8px",borderRadius:6}}>{p.score}/{p.total}</span>}
                    {p && !p.passed && <span style={{fontSize:10,fontWeight:700,color:C.gold,background:C.goldBg,padding:"3px 8px",borderRadius:6}}>{p.score}/{p.total}</span>}
                    {!p && i===nextQuiz && <span style={{fontSize:10,fontWeight:700,color:C.navy,background:C.navy+"12",padding:"3px 8px",borderRadius:6}}>Start →</span>}
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:12}}>
                    {cats.map((c,j)=>(
                      <span key={j} style={{fontSize:9,color:C.mut,background:darkMode?"#1A2332":"#F4F6F8",borderRadius:6,padding:"3px 8px",whiteSpace:"nowrap",fontWeight:600}}>
                        {CI[c.trim()]||"\ud83d\udccb"} {c.trim()}
                      </span>
                    ))}
                    {extra > 0 && <span style={{fontSize:9,color:C.mut,padding:"3px 4px",fontWeight:600}}>+{extra}</span>}
                  </div>
                  <div style={{display:"flex",gap:3}}>
                    {quiz.questions.map((q,qi)=>{
                      const right = p?.trail?.[qi]?.picked === p?.trail?.[qi]?.correct;
                      return <div key={qi} style={{flex:1,height:4,borderRadius:2,
                        background: p ? (right ? C.grn : C.red) : i===nextQuiz ? C.navy+"30" : C.bdr,
                        opacity: p ? 0.7 : 0.5}}/>;
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ═══ QUIZ ═══
  if (screen === "quiz") {
    const quiz = Q[quizIdx];
    const q = quiz.questions[qIdx];
    const d = DB[q.difficulty];
    const opts = getShuffled(qIdx);
    const selOpt = opts.find(o => o.dl === picked);
    const hit = selOpt && selOpt.ol === q.correct;
    const pct = ((qIdx + (locked ? 1 : 0)) / quiz.questions.length) * 100;

    return (
      <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif"}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{CSS}</style>
        <Modal open={modal==="exit"} onClose={()=>setModal(null)}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:28,marginBottom:8}}>🚪</div>
            <div style={{fontSize:17,fontWeight:700,color:C.dk,marginBottom:6}}>Leave this quiz?</div>
            <div style={{fontSize:13,color:C.mut,marginBottom:20}}>Your progress on this quiz won’t be saved.</div>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setModal(null)} style={{flex:1,padding:"12px",borderRadius:10,background:"transparent",border:`2px solid ${C.bdr}`,color:C.dk,fontSize:14,fontWeight:700,cursor:"pointer"}}>Stay</button>
              <button onClick={exitQuiz} className="btn-primary" style={{flex:1,padding:"12px",borderRadius:10,background:C.red,color:"#fff",border:"none",fontSize:14,fontWeight:700,cursor:"pointer"}}>Leave</button>
            </div>
          </div>
        </Modal>

        <div ref={scrollRef}>
          <NavBar
            left={<button onClick={()=>setModal("exit")} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:500}} aria-label="Exit quiz">← Exit</button>}
            center={`Day ${quiz.quiz_number}`}
            right={<span style={{color:"rgba(255,255,255,0.6)",fontSize:13,fontWeight:600}}>{qIdx+1}/{quiz.questions.length}</span>}
            progress={pct}
          />
        </div>

        <div style={{maxWidth:720,margin:"0 auto",padding:"20px 16px 40px"}}>
          <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
            <span style={{fontSize:12,fontWeight:600,color:d.fg,background:d.bg,border:`1px solid ${d.bd}`,borderRadius:6,padding:"3px 10px"}}>{q.difficulty}</span>
            <span style={{fontSize:12,color:C.mut,background:C.inp,borderRadius:6,padding:"3px 10px",border:`1px solid ${C.bdr}`}}>{CI[q.category]||"📋"} {q.category}</span>
            <span style={{fontSize:11,color:C.mut,marginLeft:"auto"}}>Need {PASS}/{quiz.questions.length} to pass</span>
          </div>

          <div style={{background:C.card,borderRadius:14,padding:"20px",marginBottom:14,border:`1px solid ${C.bdr}`,boxShadow:"0 1px 4px rgba(0,0,0,0.03)"}}>
            <p className="q-text" style={{fontSize:15,lineHeight:1.7,color:C.dk,margin:0}}>{q.question}</p>
          </div>

          <div role="radiogroup" aria-label="Answer options" style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
            {opts.map(opt => {
              const isSel = picked === opt.dl;
              const isAns = opt.ol === q.correct;
              let bg = C.card, bd = C.bdr;
              if (locked) {
                if (isAns) { bg = C.grnBg; bd = C.grn; }
                else if (isSel) { bg = C.redBg; bd = C.red; }
              } else if (isSel) { bg = C.skyL; bd = C.navy; }

              return (
                <div key={opt.dl} role="radio" aria-checked={isSel} aria-label={`Option ${opt.dl}`}
                  tabIndex={0} data-locked={locked}
                  className="opt-card"
                  onClick={()=>!locked && setPicked(opt.dl)}
                  onKeyDown={e=>e.key===" " && !locked && setPicked(opt.dl)}
                  style={{
                    display:"flex",gap:12,alignItems:"flex-start",
                    background:bg,borderRadius:11,padding:"13px 15px",
                    border:`2px solid ${bd}`,cursor:locked?"default":"pointer",
                    transition:"all 0.15s",opacity:locked&&!isAns&&!isSel?0.4:1
                  }}>
                  <div style={{
                    minWidth:30,height:30,borderRadius:7,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:13,fontWeight:700,
                    background:locked?(isAns?C.grn:isSel?C.red:"#F1F5F9"):(isSel?C.navy:"#F1F5F9"),
                    color:(locked&&(isAns||isSel))||(!locked&&isSel)?"#fff":C.dk
                  }}>
                    {locked && isAns ? "✓" : locked && isSel && !isAns ? "✗" : opt.dl}
                  </div>
                  <p style={{fontSize:14,lineHeight:1.55,color:C.dk,margin:0,paddingTop:4}}>{opt.text}</p>
                </div>
              );
            })}
          </div>

          {locked && (
            <div style={{marginBottom:18,animation:"slideUp 0.25s ease"}} aria-live="polite">
              <div style={{background:hit?C.grnBg:C.redBg,borderRadius:12,padding:"16px 18px",border:`1px solid ${hit?C.grn:C.red}40`,marginBottom:8}}>
                <div style={{fontWeight:700,fontSize:14,color:hit?C.grn:C.red,marginBottom:6}}>
                  {hit ? "✅ Correct!" : `❌ Incorrect — Answer was ${q.correct}`}
                </div>
                <p style={{fontSize:13,lineHeight:1.65,color:C.dk,margin:0}}>{q.explanation}</p>
              </div>
              {q.tip && (
                tipOpen ? (
                  <div style={{background:C.goldBg,borderRadius:12,padding:"14px 16px",border:`1px solid ${C.gold}40`,animation:"slideUp 0.2s ease"}}>
                    <div style={{fontWeight:700,fontSize:12,color:C.gold,marginBottom:5,letterSpacing:0.5}}>🧱 NORTH SHORE TIP</div>
                    <p style={{fontSize:13,lineHeight:1.6,color:C.dk,margin:0,fontStyle:"italic"}}>{q.tip}</p>
                  </div>
                ) : (
                  <button onClick={()=>setTipOpen(true)} style={{background:C.goldBg,border:`1px solid ${C.gold}60`,color:C.gold,borderRadius:8,padding:"8px 16px",cursor:"pointer",fontSize:12,fontWeight:700}}>🧱 Show NS Tip</button>
                )
              )}
            </div>
          )}

          {!locked ? (
            <button onClick={lock} disabled={!picked} className="btn-primary"
              style={{width:"100%",padding:"14px",borderRadius:10,background:picked?C.navy:"#CBD5E1",color:"#fff",border:"none",fontSize:15,fontWeight:700,cursor:picked?"pointer":"not-allowed"}}>
              Confirm Answer
            </button>
          ) : (
            <button onClick={advance} className="btn-primary"
              style={{width:"100%",padding:"14px",borderRadius:10,background:C.navy,color:"#fff",border:"none",fontSize:15,fontWeight:700,cursor:"pointer"}}>
              {qIdx+1<quiz.questions.length ? "Next Question →" : "Finish Quiz →"}
            </button>
          )}
        </div>
      </div>
    );
  }


  // ═══ PASS ═══
  if (screen === "pass") {
    const quiz = Q[quizIdx];
    const sc = trail.filter(a=>a.picked===a.correct).length;
    const pct = Math.round(sc/quiz.questions.length*100);
    const justFinishedAll = Object.values({...myProg, [quizIdx]:{passed:true}}).filter(p=>p.passed).length === 15;
    const nextIdx = quizIdx < 14 ? quizIdx + 1 : null;

    return (
      <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif"}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{CSS}</style>
        <Confetti />
        <div style={{position:"relative",overflow:"hidden",background:C.navy,textAlign:"center",padding:"40px 24px"}}>
          <div style={{position:"absolute",inset:0,backgroundImage:`url(${BG})`,backgroundSize:"cover",backgroundPosition:"center",opacity:0.15}}/>
          <div style={{position:"relative",animation:"popIn 0.4s ease"}}>
            <img src={ICON} alt="" style={{width:48,height:48,marginBottom:12}}/>
            <div style={{fontSize:52,marginBottom:6}}>🎉</div>
            <div style={{color:"#fff",fontSize:28,fontWeight:900}}>Quiz {quiz.quiz_number} Passed!</div>
            <div style={{color:C.grn,fontSize:16,fontWeight:700,marginTop:4}}>
              {sc === quiz.questions.length ? "Perfect Score!" : "Great work, Closer!"}
            </div>
          </div>
        </div>
        <div style={{maxWidth:720,margin:"0 auto",padding:"28px 16px 48px"}}>
          <div style={{display:"flex",gap:12,marginBottom:28,justifyContent:"center"}}>
            {[[`${sc}/${quiz.questions.length}`,"SCORE",C.navy],[`${pct}%`,"ACCURACY",C.grn]].map(([v,l,clr])=>(
              <div key={l} style={{background:C.card,borderRadius:12,padding:"16px 28px",textAlign:"center",border:`1px solid ${C.bdr}`}}>
                <div style={{fontSize:30,fontWeight:900,color:clr}}>{v}</div>
                <div style={{fontSize:11,color:C.mut,fontWeight:600,letterSpacing:1}}>{l}</div>
              </div>
            ))}
          </div>

          {justFinishedAll ? (
            <div style={{background:C.grnBg,borderRadius:14,padding:"24px",textAlign:"center",border:`1px solid ${C.grn}40`,marginBottom:20,animation:"slideUp 0.5s ease"}}>
              <div style={{fontSize:40,marginBottom:8}}>🏆</div>
              <div style={{fontSize:20,fontWeight:900,color:C.grn,marginBottom:6}}>ALL 15 QUIZZES PASSED!</div>
              <div style={{fontSize:14,color:C.dk}}>You’ve earned your North Shore Closer’s Club Certificate.</div>
              <button onClick={()=>setScreen("certificate")} className="btn-primary"
                style={{marginTop:16,padding:"14px 32px",borderRadius:10,background:C.grn,color:"#fff",border:"none",fontSize:15,fontWeight:700,cursor:"pointer"}}>
                View Certificate →
              </button>
            </div>
          ) : nextIdx !== null ? (
            <button onClick={()=>launch(nextIdx)} className="btn-primary"
              style={{width:"100%",padding:"14px",borderRadius:10,background:C.navy,color:"#fff",border:"none",fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:10}}>
              Start Day {Q[nextIdx].quiz_number} →
            </button>
          ) : null}

          <button onClick={()=>setScreen("home")} className="btn-outline"
            style={{width:"100%",padding:"14px",borderRadius:10,background:"transparent",color:C.navy,border:`2px solid ${C.navy}`,fontSize:14,fontWeight:700,cursor:"pointer"}}>
            Back to Dashboard
          </button>
          <div style={{textAlign:"center",marginTop:20,color:C.mut,fontSize:12}}>Brick by brick. — North Shore Masonry</div>
        </div>
      </div>
    );
  }


  // ═══ FAIL ═══
  if (screen === "fail") {
    const quiz = Q[quizIdx];
    const sc = trail.filter(a=>a.picked===a.correct).length;

    return (
      <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif"}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{CSS}</style>
        <div style={{background:C.navy,textAlign:"center",padding:"28px 24px"}}>
          <img src={ICON} alt="" style={{width:40,height:40,marginBottom:10}}/>
          <div style={{color:"#fff",fontSize:24,fontWeight:900}}>Day {quiz.quiz_number} — Not Yet</div>
          <div style={{color:C.gold,fontSize:15,fontWeight:600,marginTop:4}}>You scored {sc}/{quiz.questions.length} — need {PASS} to pass</div>
          <div style={{color:"rgba(255,255,255,0.5)",fontSize:12,marginTop:6}}>Review every answer below, then retake</div>
        </div>

        <div style={{maxWidth:720,margin:"0 auto",padding:"20px 16px 40px"}}>
          <div style={{fontSize:14,fontWeight:700,color:C.dk,marginBottom:14}}>Full Answer Review</div>

          {quiz.questions.map((q, qi) => {
            const a = trail[qi];
            const right = a.picked === a.correct;
            return (
              <div key={qi} style={{background:C.card,borderRadius:14,padding:"18px",marginBottom:12,border:`1px solid ${right ? C.grn : C.red}30`,animation:"slideUp 0.3s ease",animationDelay:`${qi*0.05}s`,animationFillMode:"both"}}>
                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
                  <span style={{fontSize:13,fontWeight:800,color:right?C.grn:C.red}}>{right?"✓":"✗"} Q{qi+1}</span>
                  <span style={{fontSize:11,color:C.mut}}>{q.category} · {q.difficulty}</span>
                </div>
                <p style={{fontSize:14,lineHeight:1.65,color:C.dk,margin:"0 0 12px"}}>{q.question}</p>

                <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:12}}>
                  {Object.entries(q.options).map(([letter, text]) => {
                    const isCorrect = letter === q.correct;
                    const isPicked = letter === a.picked;
                    let bg = C.inp, bd = C.bdr, fg = C.dk;
                    if (isCorrect) { bg = C.grnBg; bd = C.grn; }
                    else if (isPicked && !isCorrect) { bg = C.redBg; bd = C.red; }

                    return (
                      <div key={letter} style={{display:"flex",gap:10,alignItems:"flex-start",background:bg,borderRadius:8,padding:"10px 12px",border:`1.5px solid ${bd}`,opacity:!isCorrect&&!isPicked?0.5:1}}>
                        <div style={{minWidth:26,height:26,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,
                          background:isCorrect?C.grn:isPicked?C.red:"rgba(255,255,255,0.06)",color:isCorrect||isPicked?"#fff":C.dk}}>
                          {isCorrect?"✓":isPicked?"✗":letter}
                        </div>
                        <div>
                          <p style={{fontSize:13,lineHeight:1.5,color:fg,margin:0}}>{text}</p>
                          {isPicked && !isCorrect && <div style={{fontSize:11,color:C.red,fontWeight:600,marginTop:4}}>← Your answer</div>}
                          {isCorrect && <div style={{fontSize:11,color:C.grn,fontWeight:600,marginTop:4}}>← Correct answer</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{background:C.inp,borderRadius:10,padding:"12px 14px",border:`1px solid ${C.bdr}`,marginBottom:q.tip?8:0}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.navy,marginBottom:4}}>EXPLANATION</div>
                  <p style={{fontSize:12,lineHeight:1.6,color:C.dk,margin:0}}>{q.explanation}</p>
                </div>

                {q.tip && (
                  <div style={{background:C.goldBg,borderRadius:10,padding:"12px 14px",border:`1px solid ${C.gold}40`}}>
                    <div style={{fontSize:11,fontWeight:700,color:C.gold,marginBottom:4}}>🧱 NS TIP</div>
                    <p style={{fontSize:12,lineHeight:1.6,color:C.dk,margin:0,fontStyle:"italic"}}>{q.tip}</p>
                  </div>
                )}
              </div>
            );
          })}

          <button onClick={()=>launch(quizIdx)} className="btn-primary"
            style={{width:"100%",padding:"14px",borderRadius:10,background:C.navy,color:"#fff",border:"none",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:8,animation:"pulse 2s infinite"}}>
            Retake Quiz {quiz.quiz_number} →
          </button>
          <button onClick={()=>setScreen("home")} className="btn-outline"
            style={{width:"100%",padding:"12px",borderRadius:10,background:"transparent",color:C.mut,border:`1px solid ${C.bdr}`,fontSize:13,fontWeight:600,cursor:"pointer",marginTop:8}}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }


  // ═══ CERTIFICATE ═══
  if (screen === "certificate") {
    const d = new Date();
    const dateStr = d.toLocaleDateString("en-US", {month:"long",day:"numeric",year:"numeric"});
    return (
      <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif"}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap" rel="stylesheet"/>
        <style>{CSS}</style>
        <NavBar
          left={<button onClick={()=>setScreen("home")} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:500}}>← Back</button>}
          center="Certificate"
          right={<span/>}
        />
        <div style={{maxWidth:700,margin:"24px auto",padding:"0 16px 48px"}}>
          <div style={{background:C.card,borderRadius:16,overflow:"hidden",boxShadow:"0 8px 40px rgba(27,79,114,0.15)",border:`3px solid ${C.navy}`}}>
            {/* Top banner */}
            <div style={{background:C.navy,padding:"24px",textAlign:"center",position:"relative"}}>
              <div style={{position:"absolute",inset:0,opacity:0.06,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 18px,rgba(255,255,255,0.5) 18px,rgba(255,255,255,0.5) 20px),repeating-linear-gradient(90deg,transparent,transparent 38px,rgba(255,255,255,0.5) 38px,rgba(255,255,255,0.5) 40px)"}}/>
              <div style={{position:"relative"}}>
                <img src={ICON} alt="" style={{width:56,height:56,marginBottom:8}}/>
                <div style={{color:"rgba(255,255,255,0.55)",fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase"}}>North Shore Masonry</div>
                <div style={{color:"#fff",fontSize:24,fontWeight:900,letterSpacing:1}}>CLOSER’S CLUB</div>
              </div>
            </div>

            {/* Body */}
            <div style={{padding:"40px 32px",textAlign:"center"}}>
              <div style={{color:C.gold,fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",marginBottom:16}}>Certificate of Completion</div>
              <div style={{color:C.mut,fontSize:13,marginBottom:8}}>This certifies that</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:42,fontWeight:700,color:C.navy,marginBottom:8,fontStyle:"italic"}}>{user}</div>
              <div style={{width:200,height:2,background:C.skyL,margin:"0 auto 20px",borderRadius:1}}/>
              <div style={{color:C.dk,fontSize:14,lineHeight:1.8,maxWidth:460,margin:"0 auto 24px"}}>
                Has demonstrated mastery of the Sandler Selling System by successfully completing all 15 Daily Drill quizzes in the North Shore Closer’s Club training program.
              </div>
              <div style={{display:"flex",justifyContent:"center",gap:40,marginTop:32,marginBottom:16}}>
                <div style={{textAlign:"center"}}>
                  <div style={{width:140,borderBottom:`2px solid ${C.navy}`,paddingBottom:8,marginBottom:6}}>
                    <span style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:C.navy,fontStyle:"italic"}}>Zac O’Hara</span>
                  </div>
                  <div style={{fontSize:11,color:C.mut,fontWeight:600}}>COO, North Shore Masonry</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{width:140,borderBottom:`2px solid ${C.navy}`,paddingBottom:8,marginBottom:6}}>
                    <span style={{fontSize:14,color:C.navy}}>{dateStr}</span>
                  </div>
                  <div style={{fontSize:11,color:C.mut,fontWeight:600}}>Date</div>
                </div>
              </div>
              <div style={{color:C.mut,fontSize:12,fontStyle:"italic",marginTop:24}}>Brick by brick. Since 1978.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // ═══ LEADERBOARD ═══
  if (screen === "leaderboard") {
    const board = USERS.map(u => {
      const p = allProg[u] || {};
      const passed = Object.values(p).filter(x=>x.passed).length;
      const tr = Object.values(p).reduce((s,x)=>s+(x.score||0),0);
      const ta = Object.values(p).reduce((s,x)=>s+(x.total||0),0);
      const acc = ta > 0 ? Math.round(tr/ta*100) : 0;
      return { name: u, passed, acc, total: ta, certified: passed === 15 };
    }).sort((a,b) => b.passed - a.passed || b.acc - a.acc);

    return (
      <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif"}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{CSS}</style>
        <NavBar
          left={<button onClick={()=>setScreen(user?"home":"login")} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:500}}>← Back</button>}
          center="Leaderboard"
          right={<span/>}
        />
        <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px 48px"}}>
          {board.map((b, i) => (
            <div key={b.name} style={{
              display:"flex",alignItems:"center",gap:14,
              background:C.card,borderRadius:12,padding:"14px 18px",marginBottom:8,
              border: i===0 && b.passed > 0 ? `2px solid ${C.gold}` : `1px solid ${C.bdr}`,
              boxShadow: i===0 && b.passed > 0 ? "0 4px 16px rgba(243,156,18,0.15)" : "none"
            }}>
              <div style={{
                width:36,height:36,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:i<3?18:14,fontWeight:800,
                background: i===0?"#FEF9E7":i===1?"#F5F5F5":i===2?"#FDF2E9":C.inp,
                color: i===0?C.gold:i===1?"#7F8C8D":i===2?"#E67E22":C.mut
              }}>
                {i===0?"🥇":i===1?"🥈":i===2?"🥉":i+1}
              </div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:15,fontWeight:700,color:C.dk}}>{b.name}</span>
                  {b.certified && <span style={{fontSize:14}}>🏆</span>}
                </div>
                <div style={{fontSize:11,color:C.mut}}>{b.passed}/15 passed · {b.acc}% accuracy</div>
              </div>
              <div style={{display:"flex",gap:2}}>
                {Array.from({length:15}).map((_,qi)=>{
                  const up = allProg[b.name] || {};
                  return <div key={qi} style={{width:4,height:16,borderRadius:2,background:up[qi]?.passed?C.grn:up[qi]?C.gold:"rgba(255,255,255,0.1)"}}/>;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }


  // ═══ ADMIN ═══
  if (screen === "admin") {
    if (!adminAuth) {
      return (
        <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif",display:"flex",flexDirection:"column"}}>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
          <style>{CSS}</style>
          <NavBar
            left={<button onClick={()=>setScreen("login")} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:500}}>← Back</button>}
            center="Admin Portal" right={<span/>}
          />
          <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:C.card,borderRadius:16,padding:"32px 28px",maxWidth:380,width:"100%",textAlign:"center",border:`1px solid ${C.bdr}`,boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:32,marginBottom:12}}>🔒</div>
              <div style={{fontSize:17,fontWeight:700,color:C.dk,marginBottom:4}}>Admin Access</div>
              <div style={{fontSize:13,color:C.mut,marginBottom:20}}>Enter the admin password</div>
              <input
                type="password" value={adminPw} placeholder="Password"
                onChange={e=>{setAdminPw(e.target.value);setAdminErr(false);}}
                onKeyDown={e=>{if(e.key==="Enter"){if(adminPw===ADMIN_PW){setAdminAuth(true);loadAllAnalyses().then(d=>setAdminAnalyses(d));}else{setAdminErr(true);}}}}
                style={{width:"100%",padding:"12px 16px",borderRadius:10,border:`2px solid ${adminErr?C.red:C.bdr}`,fontSize:15,fontFamily:"inherit",outline:"none",marginBottom:12,textAlign:"center"}}
              />
              {adminErr && <div style={{color:C.red,fontSize:12,fontWeight:600,marginBottom:12}}>Incorrect password</div>}
              <button onClick={()=>{if(adminPw===ADMIN_PW){setAdminAuth(true);loadAllAnalyses().then(d=>setAdminAnalyses(d));}else{setAdminErr(true);}}} className="btn-primary"
                style={{width:"100%",padding:"12px",borderRadius:10,background:C.navy,color:"#fff",border:"none",fontSize:14,fontWeight:700,cursor:"pointer"}}>
                Unlock
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Authenticated admin view
    const teamStats = USERS.map(u => {
      const p = allProg[u] || {};
      const quizResults = Q.map((quiz, qi) => {
        const r = p[qi];
        return { quiz: qi, day: quiz.quiz_number, score: r?.score, total: r?.total, passed: r?.passed, ts: r?.ts };
      });
      const passed = quizResults.filter(r=>r.passed).length;
      const tr = Object.values(p).reduce((s,x)=>s+(x.score||0),0);
      const ta = Object.values(p).reduce((s,x)=>s+(x.total||0),0);
      const acc = ta > 0 ? Math.round(tr/ta*100) : 0;
      const lastActive = Object.values(p).reduce((max,x)=>Math.max(max,x.ts||0),0);
      // Category breakdown
      const catStats = {};
      Q.forEach((quiz, qi) => {
        const r = p[qi];
        if (!r?.trail) return;
        quiz.questions.forEach((q, qqi) => {
          const cat = q.category;
          if (!catStats[cat]) catStats[cat] = {right:0,total:0};
          catStats[cat].total++;
          if (r.trail[qqi]?.picked === r.trail[qqi]?.correct) catStats[cat].right++;
        });
      });
      return { name: u, quizResults, passed, acc, tr, ta, lastActive, certified: passed===15, catStats };
    });

    const teamPassed = teamStats.reduce((s,t)=>s+t.passed,0);
    const teamTotal = teamStats.length * 15;
    const teamAcc = teamStats.reduce((s,t)=>s+t.tr,0);
    const teamAns = teamStats.reduce((s,t)=>s+t.ta,0);

    return (
      <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif"}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{CSS}</style>
        <NavBar
          left={<button onClick={()=>{setAdminAuth(false);setAdminPw("");setScreen("login");}} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:500}}>← Exit Admin</button>}
          center="Admin Portal"
          right={<span style={{color:"rgba(255,255,255,0.5)",fontSize:11}}>🔓 Authenticated</span>}
        />

        <div style={{maxWidth:900,margin:"0 auto",padding:"20px 16px 48px"}}>
          {/* Team Summary */}
          <div style={{display:"flex",gap:12,marginBottom:24,flexWrap:"wrap"}}>
            {[
              ["Team Quizzes Passed",`${teamPassed}/${teamTotal}`,C.navy],
              ["Team Accuracy",teamAns>0?`${Math.round(teamAcc/teamAns*100)}%`:"—",C.sky],
              ["Certified",`${teamStats.filter(t=>t.certified).length}/${USERS.length}`,C.grn],
            ].map(([l,v,clr])=>(
              <div key={l} style={{flex:"1 1 150px",background:C.card,borderRadius:12,padding:"16px 20px",border:`1px solid ${C.bdr}`,textAlign:"center"}}>
                <div style={{fontSize:24,fontWeight:900,color:clr}}>{v}</div>
                <div style={{fontSize:11,color:C.mut,fontWeight:600,letterSpacing:0.5}}>{l}</div>
              </div>
            ))}
          </div>

          {/* Per-user detail */}
          {teamStats.map(ts => (
            <div key={ts.name} style={{background:C.card,borderRadius:14,marginBottom:12,border:`1px solid ${C.bdr}`,overflow:"hidden"}}>
              <div style={{padding:"16px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.bdr}`}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{width:38,height:38,borderRadius:9,background:C.navy,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800}}>{ts.name[0]}</div>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:15,fontWeight:700,color:C.dk}}>{ts.name}</span>
                      {ts.certified && <span>🏆</span>}
                    </div>
                    <div style={{fontSize:11,color:C.mut}}>
                      {ts.passed}/15 passed · {ts.acc}% accuracy
                      {ts.lastActive > 0 && ` · Last active: ${new Date(ts.lastActive).toLocaleDateString()}`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiz grid */}
              <div style={{padding:"12px 18px",display:"flex",gap:4,flexWrap:"wrap"}}>
                {ts.quizResults.map(r => (
                  <div key={r.quiz} title={`Day ${r.day}: ${r.passed?"Passed":r.score!=null?"Failed":"Not attempted"} ${r.score!=null?r.score+"/"+r.total:""}`}
                    style={{
                      width:32,height:32,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:10,fontWeight:700,
                      background:r.passed?C.grnBg:r.score!=null?C.redBg:C.inp,
                      color:r.passed?C.grn:r.score!=null?C.red:C.mut,
                      border:`1px solid ${r.passed?C.grn+"40":r.score!=null?C.red+"40":C.bdr}`
                    }}>
                    {r.passed?"✓":r.score!=null?`${r.score}`:r.day}
                  </div>
                ))}
              </div>

              {/* Category weaknesses */}
              {Object.keys(ts.catStats).length > 0 && (
                <div style={{padding:"8px 18px 14px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:C.mut,marginBottom:6}}>CATEGORY ACCURACY</div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                    {Object.entries(ts.catStats).sort((a,b)=>(a[1].right/a[1].total)-(b[1].right/b[1].total)).map(([cat,s])=>{
                      const pct = Math.round(s.right/s.total*100);
                      const clr = pct >= 80 ? C.grn : pct >= 60 ? C.gold : C.red;
                      return (
                        <span key={cat} style={{fontSize:10,padding:"3px 8px",borderRadius:4,background:`${clr}15`,color:clr,border:`1px solid ${clr}30`,fontWeight:600,whiteSpace:"nowrap"}}>
                          {cat.split("/")[0].trim()} {pct}%
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* ══ TRANSCRIPT FEED ══ */}
          {adminAnalyses.length > 0 && (() => {
            const parseA = (item) => { try { return typeof item.analysis === 'string' ? JSON.parse(item.analysis) : item.analysis; } catch(e) { return null; } };
            const gcA = (g) => { if (!g) return C.mut; if (g.startsWith('A')) return C.grn; if (g.startsWith('B')) return C.sky; if (g.startsWith('C')) return C.gold; return C.red; };
            const gcBgA = (g) => { if (!g) return "rgba(255,255,255,0.04)"; if (g.startsWith('A')) return "rgba(46,204,113,0.1)"; if (g.startsWith('B')) return "rgba(93,165,186,0.1)"; if (g.startsWith('C')) return "rgba(241,196,15,0.1)"; return "rgba(231,76,60,0.1)"; };
            const byUser = {};
            adminAnalyses.forEach(a => { if (!byUser[a.user_name]) byUser[a.user_name] = []; byUser[a.user_name].push(a); });

            const downloadAll = () => {
              const rows = adminAnalyses.map(a => {
                const p = parseA(a);
                return { rep: a.user_name, date: new Date(a.created_at).toISOString().split('T')[0], grade: a.overall_grade || p?.grade || '?', summary: p?.summary || '', transcript_excerpt: a.transcript?.substring(0, 200)?.replace(/\n/g, ' ') || '', strengths: (p?.strengths || []).join('; '), blind_spots: (p?.blindSpots || []).map(b => `${b.label}: ${b.detail}`).join('; '), fix: p?.fix?.headline || '', scorecard: (p?.scorecard || []).map(s => `${s.step}:${s.grade}`).join(', ') };
              });
              const headers = Object.keys(rows[0] || {});
              const csv = [headers.join(','), ...rows.map(r => headers.map(h => `"${(r[h]||'').replace(/"/g,'""')}"`).join(','))].join('\n');
              const blob = new Blob([csv], {type:'text/csv'});
              const url = URL.createObjectURL(blob);
              const el = document.createElement('a'); el.href = url; el.download = `closer-club-transcripts-${new Date().toISOString().split('T')[0]}.csv`; el.click();
              URL.revokeObjectURL(url);
            };

            const downloadOne = (item) => {
              const p = parseA(item);
              let text = `SANDLER ANALYSIS — ${item.user_name}\nDate: ${new Date(item.created_at).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}\nGrade: ${item.overall_grade || p?.grade || '?'}\n`;
              if (p?.summary) text += `Summary: ${p.summary}\n`;
              text += `\n${'='.repeat(50)}\nTRANSCRIPT\n${'='.repeat(50)}\n${item.transcript}\n`;
              if (p?.scorecard) { text += `\nSCORECARD\n`; p.scorecard.forEach(s => { text += `${s.step}: ${s.grade} — ${s.note}\n`; }); }
              if (p?.strengths) { text += `\nSTRENGTHS:\n`; p.strengths.forEach(s => { text += `• ${s}\n`; }); }
              if (p?.blindSpots) { text += `\nBLIND SPOTS:\n`; p.blindSpots.forEach(b => { text += `• ${b.label}: ${b.detail}\n`; }); }
              if (p?.fix) { text += `\nFIX: ${p.fix.headline}\nScript: ${p.fix.script}\n`; }
              const blob = new Blob([text], {type:'text/plain'});
              const url = URL.createObjectURL(blob);
              const el = document.createElement('a'); el.href = url; el.download = `${item.user_name.toLowerCase()}-analysis-${new Date(item.created_at).toISOString().split('T')[0]}.txt`; el.click();
              URL.revokeObjectURL(url);
            };

            return (
              <div style={{marginTop:24}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                  <div style={{fontSize:16,fontWeight:800,color:C.dk}}>Transcript Feed</div>
                  <button onClick={downloadAll} className="btn-outline" style={{background:C.card,border:`1px solid ${C.navy}30`,borderRadius:8,padding:"7px 14px",cursor:"pointer",fontSize:11,fontWeight:700,color:C.navy}}>Download All (CSV)</button>
                </div>
                <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
                  {Object.entries(byUser).map(([name, analyses]) => {
                    const grades = analyses.map(a => a.overall_grade || parseA(a)?.grade).filter(Boolean);
                    const avg = grades.length > 0 ? grades.reduce((s,g) => { const map = {'A':4,'A-':3.7,'B+':3.3,'B':3,'B-':2.7,'C+':2.3,'C':2,'C-':1.7,'D':1,'F':0}; return s + (map[g]||0); }, 0) / grades.length : 0;
                    const avgLetter = avg >= 3.7 ? 'A' : avg >= 3 ? 'B' : avg >= 2 ? 'C' : avg >= 1 ? 'D' : grades.length > 0 ? 'F' : '—';
                    return (
                      <div key={name} style={{flex:"1 1 90px",background:C.card,borderRadius:10,padding:"10px 12px",border:`1px solid ${C.bdr}`,textAlign:"center",minWidth:80}}>
                        <div style={{fontSize:10,fontWeight:700,color:C.mut,marginBottom:3}}>{name}</div>
                        <div style={{fontSize:18,fontWeight:800,color:gcA(avgLetter)}}>{avgLetter}</div>
                        <div style={{fontSize:9,color:C.mut}}>{analyses.length} call{analyses.length!==1?'s':''}</div>
                      </div>
                    );
                  })}
                </div>
                {adminAnalyses.map((item) => {
                  const p = parseA(item);
                  const grade = item.overall_grade || p?.grade || '?';
                  const dateStr = new Date(item.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric'});
                  return (
                    <div key={item.id} style={{background:C.card,borderRadius:10,marginBottom:6,border:`1px solid ${C.bdr}`,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
                        <div style={{width:30,height:30,borderRadius:7,background:C.navy,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,flexShrink:0}}>{item.user_name[0]}</div>
                        <div style={{minWidth:0,flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <span style={{fontSize:12,fontWeight:700,color:C.dk}}>{item.user_name}</span>
                            <span style={{fontSize:10,fontWeight:700,color:gcA(grade),background:gcBgA(grade),padding:"1px 6px",borderRadius:3}}>{grade}</span>
                            <span style={{fontSize:10,color:C.mut}}>{dateStr}</span>
                          </div>
                          <div style={{fontSize:10,color:C.mut,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p?.summary || item.transcript?.substring(0,80)}</div>
                        </div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0,marginLeft:8}}>
                        {p?.scorecard && <div style={{display:"flex",gap:1}}>{p.scorecard.map((s,i) => <div key={i} title={`${s.step}: ${s.grade}`} style={{width:5,height:16,borderRadius:1,background:gcA(s.grade)+"60"}}/>)}</div>}
                        <button onClick={()=>downloadOne(item)} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,padding:"2px 4px",color:C.mut}} title="Download analysis">↓</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  // ═══ BLIND SPOT REVEALER ═══
  if (screen === "blindspot") {
    const analyzeTranscript = async () => {
      if (!bsTranscript.trim() || bsTranscript.trim().length < 50) return;
      setBsAnalyzing(true);
      setBsResult(null);
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript: bsTranscript, userName: user }),
        });
        const data = await res.json();
        if (data.error) {
          setBsResult({ error: data.error });
        } else {
          const a = data.analysis;
          const grade = a.grade || '?';
          await saveAnalysis(user, bsTranscript.substring(0, 500), JSON.stringify(a), grade);
          setBsResult({ data: a, grade });
          loadAnalyses(user).then(d => setBsHistory(d));
        }
      } catch (err) {
        setBsResult({ error: 'Network error. Check your connection and try again.' });
      }
      setBsAnalyzing(false);
    };

    const gc = (g) => {
      if (!g) return "rgba(255,255,255,0.4)";
      if (g.startsWith('A')) return "#2ECC71";
      if (g.startsWith('B')) return "#5DA5BA";
      if (g.startsWith('C')) return "#F1C40F";
      return "#E74C3C";
    };
    const gcBg = (g) => {
      if (!g) return "rgba(255,255,255,0.04)";
      if (g.startsWith('A')) return "rgba(46,204,113,0.1)";
      if (g.startsWith('B')) return "rgba(93,165,186,0.1)";
      if (g.startsWith('C')) return "rgba(241,196,15,0.1)";
      return "rgba(231,76,60,0.1)";
    };

    const parseStored = (item) => {
      try { return typeof item.analysis === 'string' ? JSON.parse(item.analysis) : item.analysis; }
      catch(e) { return null; }
    };

    const AnalysisCard = ({ a, date }) => {
      if (!a) return null;
      const [showExpanded, setShowExpanded] = useState(false);

      const gc = (g) => {
        if (!g) return "rgba(255,255,255,0.4)";
        if (g.startsWith('A')) return "#2ECC71";
        if (g.startsWith('B')) return "#5DA5BA";
        if (g.startsWith('C')) return "#F1C40F";
        return "#E74C3C";
      };

      // Support both old format (strengths/blindSpots) and new format (wentWell/wentPoorly)
      const wellItems = a.wentWell || (a.strengths || []).slice(0,2).map(s => ({label:"Strength",detail:typeof s==="string"?s:s.detail||"",quote:null}));
      const poorItems = a.wentPoorly || (a.blindSpots || []).slice(0,2).map(b => ({label:b.label||"Issue",detail:b.detail||"",quote:null}));
      const action = a.actionItem || a.fix?.headline || null;
      const expanded = a.expanded || null;
      const scorecard = expanded?.scorecard || a.scorecard || [];
      const missed = expanded?.missedOpportunities || [];
      const script = expanded?.scriptToPractice || a.fix?.script || null;

      return (
        <div style={{animation:"slideUp 0.3s ease"}}>
          {/* GRADE + SUMMARY */}
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:72,height:72,borderRadius:18,background:"rgba(255,255,255,0.04)",fontSize:32,fontWeight:900,color:gc(a.grade),border:`2px solid ${gc(a.grade)}40`,marginBottom:10,boxShadow:`0 0 24px ${gc(a.grade)}15`}}>{a.grade}</div>
            {a.summary && <div style={{fontSize:16,fontWeight:700,color:"#fff",lineHeight:1.5,maxWidth:320,margin:"0 auto"}}>{a.summary}</div>}
            <div style={{fontSize:12,color:"rgba(255,255,255,0.35)",marginTop:6}}>{date}</div>
          </div>

          {/* WHAT WENT WELL (green, 2 items) */}
          {wellItems.length > 0 && (
            <div style={{background:"rgba(46,204,113,0.06)",borderRadius:16,border:"1px solid rgba(46,204,113,0.15)",padding:"18px 20px",marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:800,color:"#2ECC71",letterSpacing:1,marginBottom:12}}>✅ WHAT WENT WELL</div>
              {wellItems.map((w, i) => (
                <div key={i} style={{marginBottom:i<wellItems.length-1?14:0}}>
                  <div style={{fontSize:15,fontWeight:800,color:"#2ECC71",marginBottom:3}}>{typeof w==="string"?w:w.label}</div>
                  {w.detail && <div style={{fontSize:13,lineHeight:1.6,color:"rgba(255,255,255,0.7)"}}>{w.detail}</div>}
                  {w.quote && <div style={{fontSize:12,color:"rgba(46,204,113,0.6)",fontStyle:"italic",marginTop:4,paddingLeft:12,borderLeft:"2px solid rgba(46,204,113,0.2)"}}>"{w.quote}"</div>}
                </div>
              ))}
            </div>
          )}

          {/* WHAT WENT POORLY (red, 2 items) */}
          {poorItems.length > 0 && (
            <div style={{background:"rgba(231,76,60,0.06)",borderRadius:16,border:"1px solid rgba(231,76,60,0.15)",padding:"18px 20px",marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:800,color:"#E74C3C",letterSpacing:1,marginBottom:12}}>⚠️ WHAT NEEDS WORK</div>
              {poorItems.map((p, i) => (
                <div key={i} style={{marginBottom:i<poorItems.length-1?14:0}}>
                  <div style={{fontSize:15,fontWeight:800,color:"#E74C3C",marginBottom:3}}>{typeof p==="string"?p:p.label}</div>
                  {p.detail && <div style={{fontSize:13,lineHeight:1.6,color:"rgba(255,255,255,0.7)"}}>{p.detail}</div>}
                  {p.quote && <div style={{fontSize:12,color:"rgba(231,76,60,0.6)",fontStyle:"italic",marginTop:4,paddingLeft:12,borderLeft:"2px solid rgba(231,76,60,0.2)"}}>"{p.quote}"</div>}
                </div>
              ))}
            </div>
          )}

          {/* ACTION ITEM (navy, 1 item) */}
          {action && (
            <div style={{background:"linear-gradient(145deg, #132F44 0%, #0B1F30 100%)",borderRadius:16,border:"1px solid rgba(93,165,186,0.15)",padding:"20px",marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:800,color:"#5DA5BA",letterSpacing:1,marginBottom:8}}>🎯 NEXT APPOINTMENT</div>
              <div style={{fontSize:16,color:"#fff",fontWeight:700,lineHeight:1.6}}>{action}</div>
            </div>
          )}

          {/* EXPAND ANALYSIS BUTTON */}
          {(scorecard.length > 0 || script) && !showExpanded && (
            <button onClick={()=>setShowExpanded(true)}
              style={{width:"100%",padding:"14px",borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.5)",fontSize:14,fontWeight:600,cursor:"pointer",marginBottom:16}}>
              Expand Full Analysis \u25bc
            </button>
          )}

          {/* EXPANDED VIEW */}
          {showExpanded && (
            <div style={{animation:"slideUp 0.3s ease"}}>
              <button onClick={()=>setShowExpanded(false)}
                style={{width:"100%",padding:"10px",borderRadius:12,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.4)",fontSize:13,fontWeight:600,cursor:"pointer",marginBottom:16}}>
                Collapse \u25b2
              </button>

              {/* SANDLER STEP BREAKDOWN */}
              {scorecard.length > 0 && (
                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.35)",letterSpacing:1,marginBottom:12}}>SANDLER STEP BREAKDOWN</div>
                  {scorecard.map((s, i) => (
                    <div key={i} style={{background:"rgba(255,255,255,0.03)",borderRadius:12,border:"1px solid rgba(255,255,255,0.06)",padding:"14px 16px",marginBottom:8}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                        <div style={{fontSize:14,fontWeight:700,color:"#fff"}}>{s.step}</div>
                        <div style={{fontSize:14,fontWeight:900,color:gc(s.grade),background:`${gc(s.grade)}15`,padding:"2px 10px",borderRadius:6}}>{s.grade}</div>
                      </div>
                      <div style={{fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,0.55)"}}>{s.detail || s.note || ""}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* MISSED OPPORTUNITIES */}
              {missed.length > 0 && (
                <div style={{background:"rgba(241,196,15,0.05)",borderRadius:16,border:"1px solid rgba(241,196,15,0.1)",padding:"16px 18px",marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:800,color:"#F1C40F",letterSpacing:1,marginBottom:10}}>MISSED OPPORTUNITIES</div>
                  {missed.map((m, i) => (
                    <div key={i} style={{fontSize:13,lineHeight:1.6,color:"rgba(255,255,255,0.6)",marginBottom:6,paddingLeft:14,position:"relative"}}>
                      <span style={{position:"absolute",left:0,color:"#F1C40F",fontWeight:800}}>•</span>{m}
                    </div>
                  ))}
                </div>
              )}

              {/* SCRIPT TO PRACTICE */}
              {script && (
                <div style={{background:"linear-gradient(145deg, #132F44 0%, #0B1F30 100%)",borderRadius:16,border:"1px solid rgba(93,165,186,0.15)",padding:"20px",marginBottom:16}}>
                  <div style={{fontSize:11,fontWeight:800,color:"#5DA5BA",letterSpacing:1,marginBottom:8}}>SCRIPT TO PRACTICE</div>
                  <div style={{fontSize:15,color:"rgba(255,255,255,0.85)",lineHeight:1.8,fontStyle:"italic"}}>{script}</div>
                </div>
              )}
            </div>
          )}

          {a.raw && <div style={{background:"rgba(255,255,255,0.03)",borderRadius:12,padding:"16px",border:"1px solid rgba(255,255,255,0.06)",fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,0.6)",whiteSpace:"pre-wrap",marginTop:12}}>{a.raw}</div>}
        </div>
      );
    };

    // Viewing a past analysis
    if (bsViewIdx !== null && bsHistory[bsViewIdx]) {
      const item = bsHistory[bsViewIdx];
      const parsed = parseStored(item);
      const dateStr = new Date(item.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
      return (
        <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif"}}>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
          <style>{CSS}</style>
          <NavBar
            left={<button onClick={()=>setBsViewIdx(null)} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:500}}>← Back</button>}
            center="Analysis Detail"
            right={<span style={{fontSize:13,fontWeight:700,color:gc(item.overall_grade)}}>{item.overall_grade || ''}</span>}
          />
          <div style={{maxWidth:700,margin:"0 auto",padding:"20px 16px 48px"}}>
            {parsed ? <AnalysisCard a={parsed} date={dateStr} /> : (
              <div style={{background:C.card,borderRadius:12,padding:"20px",border:`1px solid ${C.bdr}`}}>
                <div style={{fontSize:14,lineHeight:1.75,color:C.dk,whiteSpace:"pre-wrap"}}>{item.analysis}</div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif"}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{CSS}</style>
        <NavBar
          left={<button onClick={()=>setScreen("home")} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:500}}>← Back</button>}
          center="Blind Spot Revealer"
          right={<span/>}
        />

        <div style={{maxWidth:700,margin:"0 auto",padding:"20px 16px 48px"}}>
          {/* Header */}
          <div style={{background:C.navy,borderRadius:12,padding:"18px",marginBottom:16,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",inset:0,backgroundImage:`url(${BG})`,backgroundSize:"cover",backgroundPosition:"center",opacity:0.15}}/>
            <div style={{position:"relative"}}>
              <div style={{color:"#fff",fontSize:20,fontWeight:800,marginBottom:6}}>Blind Spot Revealer</div>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:14,lineHeight:1.6}}>Paste your Plaud transcript. AI analyzes your appointment against all 7 Sandler submarine steps.</div>
            </div>
          </div>

          {/* Transcript Input */}
          <div style={{background:C.card,borderRadius:12,padding:"16px",border:`1px solid ${C.bdr}`,marginBottom:14}}>
            <textarea
              value={bsTranscript}
              onChange={e=>setBsTranscript(e.target.value)}
              placeholder={"Paste your Plaud transcript here...\n\nRep: Hi, thanks for meeting with me today...\nHomeowner: Yeah, so we've got this chimney issue..."}
              style={{width:"100%",minHeight:180,padding:"14px",borderRadius:10,border:`1px solid ${C.bdr}`,fontSize:16,fontFamily:"inherit",lineHeight:1.7,resize:"vertical",outline:"none",color:C.dk,background:C.inp}}
              onFocus={e=>{e.target.style.borderColor=C.navy;}}
              onBlur={e=>{e.target.style.borderColor=C.bdr;}}
            />
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
              <span style={{fontSize:13,color:C.mut}}>{bsTranscript.length > 0 ? `${bsTranscript.length} chars` : 'Min 50 characters'}</span>
              <button onClick={analyzeTranscript} disabled={bsAnalyzing || bsTranscript.trim().length < 50} className="btn-primary"
                style={{padding:"12px 24px",borderRadius:10,background:bsAnalyzing?C.mut:(bsTranscript.trim().length>=50?C.navy:"#CBD5E1"),color:"#fff",border:"none",fontSize:15,fontWeight:700,cursor:bsAnalyzing||bsTranscript.trim().length<50?"not-allowed":"pointer"}}>
                {bsAnalyzing ? "Analyzing..." : "Analyze Appointment"}
              </button>
            </div>
          </div>

          {/* Loading */}
          {bsAnalyzing && (
            <div style={{background:C.card,borderRadius:12,padding:"24px",border:`1px solid ${C.bdr}`,textAlign:"center",marginBottom:14,animation:"fadeIn 0.3s ease"}}>
              <div style={{fontSize:24,marginBottom:6,animation:"pulse 1.5s infinite"}}>🧠</div>
              <div style={{fontSize:16,fontWeight:700,color:C.dk,marginBottom:4}}>Analyzing appointment...</div>
              <div style={{fontSize:14,color:C.mut}}>Running Sandler analysis on your appointment. 10-20 seconds.</div>
            </div>
          )}

          {/* Error */}
          {bsResult?.error && (
            <div style={{background:C.redBg,borderRadius:12,padding:"14px 16px",border:`1px solid ${C.red}40`,marginBottom:14}}>
              <div style={{fontWeight:700,fontSize:13,color:C.red,marginBottom:2}}>Analysis failed</div>
              <p style={{fontSize:12,color:C.dk,margin:0}}>{bsResult.error}</p>
            </div>
          )}

          {/* Analysis Result */}
          {bsResult?.data && <AnalysisCard a={bsResult.data} date={new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})} />}

          {/* History */}
          {bsHistory.length > 0 && (
            <div style={{marginTop:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{fontSize:16,fontWeight:800,color:C.dk}}>Past analyses ({bsHistory.length})</div>
                <div style={{fontSize:13,color:C.mut}}>Only visible to you</div>
              </div>
              {bsHistory.map((item, i) => (
                <div key={item.id} onClick={()=>setBsViewIdx(i)} className="quiz-card"
                  style={{background:C.card,borderRadius:12,padding:"14px 16px",marginBottom:8,border:`1px solid ${C.bdr}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
                    {item.overall_grade && <span style={{fontSize:14,fontWeight:800,color:gc(item.overall_grade),background:gcBg(item.overall_grade),padding:"4px 10px",borderRadius:6}}>{item.overall_grade}</span>}
                    <span style={{fontSize:13,color:C.mut,whiteSpace:"nowrap"}}>{new Date(item.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>
                    <span style={{fontSize:13,color:C.dk,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.transcript.substring(0,60)}</span>
                  </div>
                  <span style={{color:C.mut,fontSize:14,marginLeft:8}}>→</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }



  // ═══ HEAT MAP ═══
  if (screen === "heatmap") {
    const MARKET_CENTERS = {
      Chicago: [41.88, -87.72, 10],
      Milwaukee: [43.05, -87.93, 11],
      Dallas: [32.85, -96.85, 10],
      Indy: [41.07, -85.15, 11],
    };

    const renderMap = () => {
      if (!window.L || !mapRef.current || !heatmapData) return;
      const L = window.L;
      const [clat, clng, zoom] = MARKET_CENTERS[heatmapMarket];
      
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([clat, clng], zoom);
      } else {
        mapInstanceRef.current = L.map(mapRef.current, {
          center: [clat, clng], zoom,
          zoomControl: false,
          attributionControl: false,
        });
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mapInstanceRef.current);
        L.control.zoom({position:'bottomright'}).addTo(mapInstanceRef.current);
      }

      // Clear existing markers
      if (markersRef.current) markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      const jobs = heatmapData[heatmapMarket] || [];
      jobs.forEach(j => {
        const [lat, lng, scope] = j;
        const icon = L.divIcon({
          className: '',
          html: '<div style="width:9px;height:9px;border-radius:50%;background:#1B4F72;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.25);"></div>',
          iconSize: [9, 9],
          iconAnchor: [4.5, 4.5],
        });
        const marker = L.marker([lat, lng], { icon }).addTo(mapInstanceRef.current);
        marker.bindPopup(`
          <div style="font-family:Outfit,sans-serif;padding:2px 0;">
            <div style="font-size:14px;font-weight:700;color:#1B4F72;">${scope}</div>
          </div>
        `, {closeButton:false, maxWidth:220, minWidth:80});
        markersRef.current.push(marker);
      });
    };

    // Render map after DOM paint
    setTimeout(renderMap, 100);

    const marketJobs = heatmapData?.[heatmapMarket] || [];

    return (
      <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif",display:"flex",flexDirection:"column"}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{CSS}</style>
        <NavBar
          left={<button onClick={()=>{if(mapInstanceRef.current){mapInstanceRef.current.remove();mapInstanceRef.current=null;}setScreen("home");}} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:500}}>← Back</button>}
          center="Heat Map"
          right={<span/>}
        />

        {/* Market tabs */}
        <div style={{display:"flex",gap:0,padding:"8px 12px",background:C.card,borderBottom:`1px solid ${C.bdr}`}}>
          {["Chicago","Milwaukee","Dallas","Indy"].map(m => (
            <div key={m} onClick={()=>{setHeatmapMarket(m);setTimeout(renderMap,50);}}
              style={{flex:1,textAlign:"center",padding:"10px 4px",borderRadius:8,cursor:"pointer",
                background:m===heatmapMarket?B.navy:"transparent",
                color:m===heatmapMarket?"#fff":C.dk,
                fontSize:13,fontWeight:m===heatmapMarket?700:500,transition:"all 0.15s"}}>
              {m}
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div style={{display:"flex",gap:8,padding:"10px 16px",background:C.card,borderBottom:`1px solid ${C.bdr}`}}>
          <div style={{flex:1,textAlign:"center"}}>
            <div style={{fontSize:20,fontWeight:800,color:C.dk}}>{marketJobs.length}</div>
            <div style={{fontSize:11,color:C.mut}}>Approved Jobs</div>
          </div>
        </div>

        {/* Map */}
        <div style={{flex:1,minHeight:400}}>
          {!heatmapData ? (
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:400,color:C.mut}}>Loading map data...</div>
          ) : (
            <div ref={mapRef} style={{width:"100%",height:"100%",minHeight:400}}/>
          )}
        </div>
      </div>
    );
  }




  // ═══ ESTIMATOR ═══
  if (screen === "estimator") {
    // Rounding rules from the real NSM estimator
    const CLIENT_ENDINGS = [240, 480, 640, 860, 980];
    const roundClient = (raw) => {
      if (raw <= 0) return 0;
      // Check current and previous thousand
      const base = Math.floor(raw / 1000) * 1000;
      // First check if any ending in current thousand works (round up)
      for (const e of CLIENT_ENDINGS) { if (base + e >= raw) return base + e; }
      // If none work, use first ending of next thousand
      return (base + 1000) + CLIENT_ENDINGS[0];
    };
    const roundSub = (raw) => raw <= 0 ? 0 : Math.ceil(raw / 200) * 200;

    const SYS_PROMPT = `You are the pricing engine for North Shore Masonry (NSM), a masonry contractor in IL/WI/TX/IN. 845 approved estimates, 1,630 line items. Break the description into scope items, return a JSON array.

PRICING DATA:
Tuckpointing | n=312 | per sqft: $6-$14 price, $3.50-$8.50 cost | markup: 1.58x | margin: 37%. Percentage-based: 15%=lower, 30%+=mid-upper.
Lintel/Steel | n=187 | per lintel: 4ft=$1,200-$2,200, 6ft=$1,800-$3,200, 8ft+=$2,800-$5,500 | cost 0.65x price
Chimney Rebuild | n=89 | <=3x3ft=$3,200-$5,500, 4-5ft=$5,500-$9,000, 6ft+=$8,500-$14,000 | cost 0.65x
Chimney Repair | n=76 | cap=$800-$1,800, crown=$1,800-$3,500, multi=$2,800-$10,000 | cost 0.65x
Parapet/Coping | n=64 | $220-$420/LF price, $140-$270/LF cost
Concrete | n=52 | $10-$16/sqft price, $6-$10/sqft cost
Retaining Wall | n=45 | $38-$62/LF per ft height price, $24-$40/LF cost
Porch/Steps | n=41 | base $800 + $500/step, range 0.85x-1.5x | cost 0.65x
Brick Repair | n=38 | <=10 bricks=$500-$900, 11+=$800-$2,800 | cost 0.65x
Stone/Limestone | n=34 | $2,200-$3,800 per unit | cost 0.65x
Caulking | n=31 | $100-$200/opening, min $580 | cost 0.65x
Foundation | n=28 | $5,000-$12,000 | cost 0.65x
Waterproofing | n=22 | $4-$8/sqft price, $2.50-$5/sqft cost

ADD-ONS (auto-detect): Lift=$1,500-$4,000 (3+ stories), Scaffold=$2,500-$7,000, Permit=$750-$1,500 (structural)

BUILDING TYPE MULTIPLIERS: Single family=1.0x, 2-flat=1.15x, 3-flat=1.35x, 4+ story=1.6x, Commercial=1.45x

Return ONLY a JSON array: [{"scope":"...","description":"...","qty":1,"price_low":N,"price_high":N,"cost_low":N,"cost_high":N,"confidence":"high|medium|low","is_addon":false}]
No markdown. No backticks. No explanation. Raw JSON only.`;

    const BUILDING_MULT = {
      "residential": {label:"Single Family",mult:1.0},
      "2flat": {label:"2-Flat",mult:1.15},
      "3flat": {label:"3-Flat",mult:1.35},
      "midrise": {label:"4+ Story",mult:1.6},
      "commercial": {label:"Commercial",mult:1.45},
    };

    const runAIEstimate = async () => {
      if (estInput.trim().length < 10) return;
      setEstLoading(true);
      setEstScopes([]);
      try {
        const buildingCtx = `Building type: ${BUILDING_MULT[estBuilding].label} (${BUILDING_MULT[estBuilding].mult}x multiplier already factored into pricing data above — do NOT multiply again)`;
        const resp = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: SYS_PROMPT,
            messages: [{ role: "user", content: buildingCtx + "\n\nJob description: " + estInput }],
          })
        });
        const data = await resp.json();
        const text = (data.content || []).map(c => c.text || "").join("");
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Apply building multiplier and rounding
          const bm = BUILDING_MULT[estBuilding].mult;
          const rounded = parsed.map(item => ({
            ...item,
            price_low: roundClient(item.price_low * bm),
            price_high: roundClient(item.price_high * bm),
            cost_low: roundSub(item.cost_low * bm),
            cost_high: roundSub(item.cost_high * bm),
          }));
          setEstScopes(rounded);
        }
      } catch (e) {
        console.error("Estimate error:", e);
        // Fall back to local
        runLocalEstimate();
      }
      setEstLoading(false);
    };

    const runLocalEstimate = () => {
      let d = estInput.toLowerCase();
      // Convert word numbers to digits
      const wordNums = {"one":1,"two":2,"three":3,"four":4,"five":5,"six":6,"seven":7,"eight":8,"nine":9,"ten":10,"twelve":12,"fifteen":15,"twenty":20,"thirty":30,"forty":40,"fifty":50};
      for (const [w,n] of Object.entries(wordNums)) { d = d.replace(new RegExp("\\b"+w+"\\b","gi"), String(n)); }
      // Per-unit pricing (NOT full range — eliminates wide spreads)
      const KB = {
        "Tuckpointing":{n:312,unitLo:6,unitHi:14,cUnitLo:3.5,cUnitHi:8.5,unit:"sqft",defQty:300,minJob:2800},
        "Lintel/Steel":{n:187,unitLo:1200,unitHi:3200,cUnitLo:800,cUnitHi:2000,unit:"each",defQty:1,minJob:1200},
        "Chimney Rebuild":{n:89,unitLo:3200,unitHi:9000,cUnitLo:2100,cUnitHi:5800,unit:"each",defQty:1,minJob:3200},
        "Chimney Repair":{n:76,unitLo:800,unitHi:3500,cUnitLo:500,cUnitHi:2200,unit:"each",defQty:1,minJob:800},
        "Parapet/Coping":{n:64,unitLo:220,unitHi:420,cUnitLo:140,cUnitHi:270,unit:"lf",defQty:20,minJob:2200},
        "Concrete":{n:52,unitLo:10,unitHi:16,cUnitLo:6,cUnitHi:10,unit:"sqft",defQty:150,minJob:1500},
        "Retaining Wall":{n:45,unitLo:38,unitHi:62,cUnitLo:24,cUnitHi:40,unit:"lf",defQty:30,minJob:2500},
        "Porch/Steps":{n:41,unitLo:500,unitHi:800,cUnitLo:320,cUnitHi:520,unit:"step",defQty:5,minJob:2500},
        "Brick Repair":{n:38,unitLo:50,unitHi:90,cUnitLo:32,cUnitHi:58,unit:"brick",defQty:10,minJob:500},
        "Stone/Limestone":{n:34,unitLo:2200,unitHi:3800,cUnitLo:1400,cUnitHi:2500,unit:"each",defQty:1,minJob:2200},
        "Caulking":{n:31,unitLo:100,unitHi:200,cUnitLo:65,cUnitHi:130,unit:"opening",defQty:6,minJob:580,bundledCostLo:15,bundledCostHi:35},
        "Foundation":{n:28,unitLo:5000,unitHi:12000,cUnitLo:3200,cUnitHi:7800,unit:"each",defQty:1,minJob:5000},
        "Waterproofing":{n:22,unitLo:4,unitHi:8,cUnitLo:2.5,cUnitHi:5,unit:"sqft",defQty:200,minJob:1500},
      };
      const patterns = [
        {rx:/tuckpoint|took\s*point|tuck\s*point|repoint|mortar\s*joint|grind\s*and\s*point|mortar.*(?:fall|crumbl|deteriorat|fail|shot)|joints.*(?:open|fail|gone|shot)|\btp\b/i, scope:"Tuckpointing", qtyRx:/([\d,]+)\s*(?:sq|sf|sqft|square)/i},
        {rx:/lintel|lint[ea]l|lint\b|steel\s*beam|steel\s*(?:above|over)|i-beam|angle\s*iron/i, scope:"Lintel/Steel", qtyRx:/(\d+)\s*(?:lintel|beam|steel|window)/i},
        {rx:/chimney.*(rebuild|reconstruct|tear|rebuilt|replace entirely)|(?:rebuild|reconstruct|tear\s*down).*chimney/i, scope:"Chimney Rebuild"},
        {rx:/chimney.*(repair|cap|crown|flue|tuck|work|fix)|(?:crown|flue).*chimney|\bchim\b.*(?:cap|repair|fix|work)|chiminy|chimley/i, scope:"Chimney Repair"},
        {rx:/parapet|coping|cap\s*stone/i, scope:"Parapet/Coping", qtyRx:/(\d+)\s*(?:lf|linear|ft|feet)/i},
        {rx:/concrete|flatwork|sidewalk|driveway|slab/i, scope:"Concrete", qtyRx:/(\d+)\s*(?:sq|sf|sqft|square)/i},
        {rx:/retaining|block\s*wall|cmu/i, scope:"Retaining Wall", qtyRx:/(\d+)\s*(?:lf|linear|ft|feet)/i},
        {rx:/porch|front\s*steps|stair|stoop/i, scope:"Porch/Steps", qtyRx:/(\d+)\s*(?:step|stair)/i},
        {rx:/brick.*(repair|replace|fix|crack|spall)|spalling|loose\s*brick|(\d+)\s*(?:loose\s*)?brick/i, scope:"Brick Repair", qtyRx:/(\d+)\s*(?:loose\s*)?brick/i},
        {rx:/(?<!lime)stone(?!\s*cold)|limestone|bluestone|flagstone/i, scope:"Stone/Limestone", qtyRx:/(\d+)\s*(?:stone|limestone|sill|pillar|column)/i},
        {rx:/caulk|sealant|expansion\s*joint/i, scope:"Caulking", qtyRx:/(\d+)\s*(?:window|opening|door|joint)/i},
        {rx:/foundation|structural|load\s*bearing|bulg/i, scope:"Foundation"},
        {rx:/waterproof|seal.*(?:wall|exterior|basement|masonry|brick)|water.*(?:coming|leak|intrusion).*(?:wall|through)|damp\s*proof|efflor/i, scope:"Waterproofing", qtyRx:/(\d+)\s*(?:sq|sf|sqft)/i},
      ];
      // Auto-detect building type
      if (/3[\s-]*flat|3[\s-]*story|three\s*story|victorian/i.test(d)) setEstBuilding("3flat");
      else if (/2[\s-]*flat|two[\s-]*flat|duplex/i.test(d)) setEstBuilding("2flat");
      else if (/4[\s-]*story|mid[\s-]*rise|high[\s-]*rise|condo\s*build|apartment/i.test(d)) setEstBuilding("midrise");
      else if (/commercial|warehouse|office|retail|church|school/i.test(d)) setEstBuilding("commercial");

      const bm = BUILDING_MULT[estBuilding].mult;
      const homeSizeMatch = d.match(/([\d,]+)\s*(?:sq|sf|sqft|square)[\s-]*(?:ft|foot|feet)?[\s-]*(?:home|house|building|bungalow|ranch|colonial|property|residence|brownstone|greystone)/i);
      const homeSize = homeSizeMatch ? parseInt(homeSizeMatch[1].replace(/,/g,"")) : 0;
      const pctMatches = [...d.matchAll(/(\d+)\s*%/g)].map(m => parseInt(m[1]));
      const avgPct = pctMatches.length > 0 ? pctMatches.reduce((a,b)=>a+b,0) / pctMatches.length / 100 : 0;
      const estWallArea = homeSize > 0 ? Math.round(homeSize * 1.0) : 0;
      const found = [];
      const matched = new Set();
      for (const p of patterns) {
        if (p.rx.test(d) && !matched.has(p.scope)) {
          matched.add(p.scope);
          const kb = KB[p.scope];
          const qm = p.qtyRx ? d.match(p.qtyRx) : null;
          let rawQty = qm ? parseInt(qm[1].replace(/,/g,"")) : 0;
          let qty;
          if (rawQty > 0 && homeSize > 0 && Math.abs(rawQty - homeSize) < 50) {
            const allSqftMatches = [...d.matchAll(/([\d,]+)\s*(?:sq|sf|sqft|square)/gi)];
            const otherSqft = allSqftMatches.find(m => Math.abs(parseInt(m[1].replace(/,/g,"")) - homeSize) >= 50);
            if (otherSqft) {
              qty = parseInt(otherSqft[1].replace(/,/g,""));
            } else if (kb.unit === "sqft" && pctMatches.length > 0) {
              qty = Math.max(Math.round(estWallArea * avgPct), 50);
            } else if (kb.unit === "sqft") {
              qty = kb.defQty;
            } else {
              qty = rawQty || kb.defQty;
            }
          } else {
            qty = rawQty || kb.defQty;
          }
          const isBundled = matched.size > 1;
          // Per-unit pricing
          let pLo = Math.max(kb.unitLo * qty * bm, kb.minJob * bm);
          let pHi = kb.unitHi * qty * bm;
          if (pHi < pLo) pHi = pLo * 1.5;
          let cLo, cHi;
          if (isBundled && kb.bundledCostLo) {
            cLo = kb.bundledCostLo * qty * bm;
            cHi = kb.bundledCostHi * qty * bm;
          } else {
            cLo = kb.cUnitLo * qty * bm;
            cHi = kb.cUnitHi * qty * bm;
          }
          found.push({
            scope: p.scope, description: qty > 1 ? qty+" "+kb.unit : p.scope, qty,
            price_low: roundClient(pLo), price_high: roundClient(pHi),
            cost_low: roundSub(cLo), cost_high: roundSub(cHi),
            confidence: kb.n > 30 ? "high" : kb.n > 10 ? "medium" : "low",
            is_addon: false, n: kb.n
          });
        }
      }
      // Auto-add lift for 3+ stories
      if ((estBuilding === "3flat" || estBuilding === "midrise") && found.length > 0) {
        found.push({ scope:"Lift Rental", description:"Upper elevation access", qty:1, price_low:roundClient(1500*bm), price_high:roundClient(4000*bm), cost_low:roundSub(1300*bm), cost_high:roundSub(3500*bm), confidence:"high", is_addon:true });
      }
      // Auto-add permit for structural or 3+ scopes
      if (found.length >= 3 || found.some(s => s.scope === "Foundation")) {
        found.push({ scope:"Permit", description:"Building permit", qty:1, price_low:roundClient(750*bm), price_high:roundClient(1500*bm), cost_low:roundSub(650*bm), cost_high:roundSub(1350*bm), confidence:"high", is_addon:true });
      }
      if (found.length === 0 && d.trim().length > 10) {
        if (/masonry|brick\s*work|exterior|facade/i.test(d)) {
          found.push({ scope:"General Masonry", description:"Masonry work", qty:1, price_low:roundClient(2800*bm), price_high:roundClient(8400*bm), cost_low:roundSub(1800*bm), cost_high:roundSub(5200*bm), confidence:"medium", is_addon:false, n:312 });
        }
      }
      setEstScopes(found);
    };

    const fmt = (n) => "$" + n.toLocaleString();
    const totalPL = estScopes.reduce((s,sc) => s + (sc.price_low||0), 0);
    const totalPH = estScopes.reduce((s,sc) => s + (sc.price_high||0), 0);
    const totalCL = estScopes.reduce((s,sc) => s + (sc.cost_low||0), 0);
    const totalCH = estScopes.reduce((s,sc) => s + (sc.cost_high||0), 0);
    const sweetSpot = roundClient(Math.round((totalPL + totalPH) / 2));
    const marginLow = totalPH > 0 ? Math.round((1 - totalCH/totalPH)*100) : 0;
    const marginHigh = totalPL > 0 ? Math.round((1 - totalCL/totalPL)*100) : 0;
    const confColor = (c) => c==="high"?"#27AE60":c==="medium"?"#F39C12":"#E74C3C";

    return (
      <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif"}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{CSS}</style>
        <NavBar
          left={<button onClick={()=>{setEstScopes([]);setEstInput("");setScreen("home");}} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:500}}>{"\u2190 Back"}</button>}
          center="Estimator"
          right={<span/>}
        />
        <div style={{maxWidth:700,margin:"0 auto",padding:"16px 16px 48px"}}>

          {/* NLP Input */}
          <div style={{background:C.card,borderRadius:16,padding:"18px",border:`1px solid ${C.bdr}`,marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:14,fontWeight:800,color:C.dk}}>Describe the job</div>
              <div onClick={()=>{
                if (estRecording) {
                  if (estRecRef.current) { estRecRef.current.stop(); estRecRef.current = null; }
                  setEstRecording(false);
                } else {
                  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
                  if (!SR) { alert("Voice input not supported in this browser. Use Chrome or Safari."); return; }
                  const rec = new SR();
                  rec.continuous = true; rec.interimResults = true; rec.lang = "en-US";
                  let final = estInput;
                  rec.onresult = (e) => {
                    let interim = "";
                    for (let i = e.resultIndex; i < e.results.length; i++) {
                      if (e.results[i].isFinal) final += (final?" ":"") + e.results[i][0].transcript;
                      else interim += e.results[i][0].transcript;
                    }
                    setEstInput(final + (interim?" "+interim:""));
                  };
                  rec.onerror = () => setEstRecording(false);
                  rec.onend = () => setEstRecording(false);
                  rec.start();
                  estRecRef.current = rec;
                  setEstRecording(true);
                }
              }}
                style={{display:"flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:8,
                  background:estRecording?"#E74C3C":"rgba(93,165,186,0.15)",
                  border:"1px solid "+(estRecording?"#E74C3C":"rgba(93,165,186,0.2)"),
                  color:estRecording?"#fff":"#5DA5BA",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                <span style={{fontSize:16}}>{estRecording ? "\u23f9" : "\ud83c\udfa4"}</span>
                {estRecording ? "Stop" : "Voice"}
              </div>
            </div>
            <textarea value={estInput} onChange={e=>setEstInput(e.target.value)}
              placeholder={"e.g. 3-flat needs tuckpointing on rear and south elevations, 2 lintels at 6ft, chimney cap repair, and about 15 loose bricks on the front..."}
              style={{width:"100%",minHeight:120,padding:"14px",borderRadius:10,border:`1px solid ${C.bdr}`,fontSize:16,fontFamily:"inherit",lineHeight:1.6,resize:"vertical",outline:"none",color:C.dk,background:C.inp,boxSizing:"border-box"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
              <div style={{fontSize:11,color:C.mut}}>AI-powered pricing from 845 approved estimates</div>
              <div style={{display:"flex",gap:6}}>
                <div onClick={()=>{if(estInput.trim().length>10)runLocalEstimate();}}
                  style={{padding:"8px 16px",borderRadius:8,background:estInput.trim().length>10?C.card:"#CBD5E1",color:estInput.trim().length>10?C.dk:"#999",border:`1px solid ${C.bdr}`,fontSize:13,fontWeight:600,cursor:estInput.trim().length>10?"pointer":"not-allowed"}}>
                  Quick
                </div>
                <div onClick={()=>{if(estInput.trim().length>10&&!estLoading)runAIEstimate();}}
                  style={{padding:"8px 16px",borderRadius:8,background:estInput.trim().length>10&&!estLoading?C.navy:"#CBD5E1",color:"#fff",fontSize:13,fontWeight:700,cursor:estInput.trim().length>10&&!estLoading?"pointer":"not-allowed"}}>
                  {estLoading ? "Analyzing..." : "AI Estimate"}
                </div>
              </div>
            </div>
          </div>

          {/* Building Type */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:C.mut,letterSpacing:0.5,marginBottom:6,textTransform:"uppercase"}}>Building Type</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {Object.entries(BUILDING_MULT).map(([key, val]) => (
                <div key={key} onClick={()=>setEstBuilding(key)}
                  style={{padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:12,fontWeight:key===estBuilding?700:500,
                    background:key===estBuilding?C.navy:"transparent",color:key===estBuilding?"#fff":C.dk,
                    border:`1px solid ${key===estBuilding?C.navy:C.bdr}`}}>
                  {val.label}{val.mult!==1.0?` (${val.mult}x)`:""}
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          {estScopes.length > 0 && (
            <>
              {/* Sweet Spot */}
              <div style={{background:`linear-gradient(145deg, #27AE60 0%, #1B7A43 100%)`,borderRadius:16,padding:"20px",marginBottom:16,textAlign:"center"}}>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.6)",fontWeight:700,letterSpacing:1}}>SWEET SPOT PRICE</div>
                <div style={{fontSize:36,fontWeight:900,color:"#fff"}}>{fmt(sweetSpot)}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:4}}>Range: {fmt(totalPL)} — {fmt(totalPH)} · Margin: {marginLow}—{marginHigh}%</div>
              </div>

              {/* Line Items */}
              <div style={{fontSize:11,fontWeight:700,color:C.mut,letterSpacing:0.5,marginBottom:8,textTransform:"uppercase"}}>Scope Breakdown ({estScopes.length} items)</div>
              {estScopes.map((sc, i) => {
                const m = sc.price_high > 0 ? Math.round((1 - sc.cost_high/sc.price_high)*100) : 0;
                return (
                  <div key={i} style={{background:sc.is_addon?C.navy+"08":C.card,borderRadius:12,padding:"14px 16px",border:`1px solid ${sc.is_addon?C.navy+"25":C.bdr}`,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{fontSize:14,fontWeight:800,color:C.dk}}>{sc.scope}</div>
                        {sc.qty > 1 && <span style={{fontSize:11,color:C.navy,fontWeight:700,background:C.navy+"12",padding:"2px 6px",borderRadius:4}}>x{sc.qty}</span>}
                        {sc.is_addon && <span style={{fontSize:9,color:C.navy,fontWeight:700,background:C.navy+"12",padding:"2px 6px",borderRadius:4}}>ADD-ON</span>}
                      </div>
                      {sc.confidence && <span style={{fontSize:9,fontWeight:700,color:confColor(sc.confidence),background:confColor(sc.confidence)+"15",padding:"2px 6px",borderRadius:4}}>{sc.confidence}</span>}
                    </div>
                    {sc.description && sc.description !== sc.scope && <div style={{fontSize:12,color:C.mut,marginBottom:6}}>{sc.description}</div>}
                    <div style={{display:"flex",gap:12}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:9,color:C.mut,fontWeight:600}}>CLIENT</div>
                        <div style={{fontSize:14,fontWeight:800,color:C.dk}}>{fmt(sc.price_low)} — {fmt(sc.price_high)}</div>
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:9,color:C.mut,fontWeight:600}}>SUB COST</div>
                        <div style={{fontSize:14,fontWeight:700,color:C.mut}}>{fmt(sc.cost_low)} — {fmt(sc.cost_high)}</div>
                      </div>
                      <div>
                        <div style={{fontSize:9,color:C.mut,fontWeight:600}}>MARGIN</div>
                        <div style={{fontSize:14,fontWeight:800,color:m>=35?C.grn:m>=25?C.gold:C.red}}>{m}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Total Summary */}
              <div style={{background:C.navy,borderRadius:16,padding:"18px",marginTop:8}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",fontWeight:700}}>TOTAL RANGE</div>
                    <div style={{fontSize:20,fontWeight:900,color:"#fff"}}>{fmt(totalPL)} — {fmt(totalPH)}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:9,color:"rgba(255,255,255,0.5)",fontWeight:700}}>SUB COST</div>
                    <div style={{fontSize:16,fontWeight:700,color:"rgba(255,255,255,0.7)"}}>{fmt(totalCL)} — {fmt(totalCH)}</div>
                  </div>
                </div>
                <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginTop:8}}>
                  Client prices rounded to NSM endings (240/480/640/860/980) · Sub costs rounded to nearest $200
                </div>
              </div>
            </>
          )}

          {estScopes.length === 0 && !estLoading && (
            <div style={{textAlign:"center",padding:"30px 20px",color:C.mut}}>
              <div style={{fontSize:32,marginBottom:8}}>{"\ud83e\udd16"}</div>
              <div style={{fontSize:16,fontWeight:700,color:C.dk,marginBottom:4}}>Describe the job above</div>
              <div style={{fontSize:14,lineHeight:1.6}}>Include building type, elevations, quantities, and specific scopes. The more detail, the tighter the estimate.</div>
              <div style={{fontSize:12,color:C.mut,marginTop:12}}>{"\"Quick\" uses local pattern matching · \"AI Estimate\" uses Claude for smarter parsing"}</div>
            </div>
          )}
        </div>
      </div>
    );
  }




  // === TODAY (Tasks & To-Do's from JobTread) ===
  if (screen === "today") {
    const JT_USER_MAP = {
      "Zac": "22Nxa2M8vDzG",
      "Les": "22Nwt8wGjTEx",
      "Luke": "22P92SdAQUQE",
      "Jace": "22PTSGV5U7Rj",
      "Paul": "22PGVz57tzke",
      "Carlos": "22NxzADWDVVA",
      "Devin": "22NztygQhunB",
      "BJ": "22PHDEMpwFKR",
      "Cortney": "22NxBXSxWBRq",
    };
    const membershipId = JT_USER_MAP[user] || null;

    const fetchTasks = async () => {
      if (!membershipId) return;
      try {
        const resp = await fetch("/.netlify/functions/tasks", {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ membershipId })
        });
        const data = await resp.json();
        if (data.tasks) setTodayTasks(data.tasks);
      } catch(e) { console.error("Task fetch error:", e); }
    };


    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const todos = todayTasks.filter(t => t.isToDo);
    const scheduled = todayTasks.filter(t => !t.isToDo);
    const overdue = todayTasks.filter(t => t.endDate && t.endDate < todayStr);

    return (
      <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif"}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{CSS}</style>
        <NavBar
          left={<button onClick={()=>setScreen("home")} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:500}}>← Back</button>}
          center="Today"
          right={<button onClick={fetchTasks} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:500}}>Refresh</button>}
        />
        <div style={{maxWidth:700,margin:"0 auto",padding:"16px 16px 48px"}}>

          {/* Summary Cards */}
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            <div style={{flex:1,background:C.card,borderRadius:12,padding:"14px",textAlign:"center",border:`1px solid ${C.bdr}`}}>
              <div style={{fontSize:28,fontWeight:900,color:C.dk}}>{scheduled.length}</div>
              <div style={{fontSize:11,color:C.mut,fontWeight:600}}>FIELD WORK</div>
            </div>
            <div style={{flex:1,background:C.card,borderRadius:12,padding:"14px",textAlign:"center",border:`1px solid ${C.bdr}`}}>
              <div style={{fontSize:28,fontWeight:900,color:C.dk}}>{todos.length}</div>
              <div style={{fontSize:11,color:C.mut,fontWeight:600}}>DESK WORK</div>
            </div>
            {overdue.length > 0 && (
              <div style={{flex:1,background:"#E74C3C10",borderRadius:12,padding:"14px",textAlign:"center",border:"1px solid #E74C3C25"}}>
                <div style={{fontSize:28,fontWeight:900,color:"#E74C3C"}}>{overdue.length}</div>
                <div style={{fontSize:11,color:"#E74C3C",fontWeight:600}}>OVERDUE</div>
              </div>
            )}
          </div>

          {!membershipId && (
            <div style={{textAlign:"center",padding:40,color:C.mut}}>
              <div style={{fontSize:32,marginBottom:8}}>🔗</div>
              <div style={{fontSize:16,fontWeight:700,color:C.dk}}>Not linked to JobTread</div>
              <div style={{fontSize:14,marginTop:4}}>Ask Zac to connect your account.</div>
            </div>
          )}

          {membershipId && todayTasks.length === 0 && (
            <div style={{textAlign:"center",padding:40,color:C.mut}}>
              <div style={{fontSize:32,marginBottom:8}}>✅</div>
              <div style={{fontSize:16,fontWeight:700,color:C.dk}}>All caught up!</div>
              <div style={{fontSize:14,marginTop:4}}>No open tasks or to-do's right now.</div>
              <button onClick={fetchTasks} style={{marginTop:16,padding:"10px 24px",borderRadius:10,background:C.navy,color:"#fff",border:"none",fontSize:14,fontWeight:600,cursor:"pointer"}}>Check Again</button>
            </div>
          )}

          {/* Field Work (Scheduled Tasks) */}
          {scheduled.length > 0 && (
            <>
              <div style={{fontSize:11,fontWeight:700,color:C.navy,letterSpacing:0.5,textTransform:"uppercase",marginBottom:8}}>📥 Field Work — Estimates & Site Visits</div>
              {scheduled.map((t,i) => {
                const isOverdue = t.endDate && t.endDate < todayStr;
                const isToday = t.endDate === todayStr;
                return (
                  <div key={i} style={{background:C.card,borderRadius:12,padding:"14px 16px",border:`1px solid ${isOverdue?"#E74C3C25":isToday?"#F39C1225":C.bdr}`,marginBottom:8}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div style={{fontSize:15,fontWeight:700,color:C.dk}}>{t.name}</div>
                      {isOverdue && <span style={{fontSize:9,fontWeight:700,color:"#E74C3C",background:"#E74C3C15",padding:"2px 8px",borderRadius:4}}>OVERDUE</span>}
                      {isToday && <span style={{fontSize:9,fontWeight:700,color:"#F39C12",background:"#F39C1215",padding:"2px 8px",borderRadius:4}}>TODAY</span>}
                    </div>
                    {t.jobName && <div style={{fontSize:12,color:C.mut,marginTop:3}}>Job: {t.jobName}{t.jobNumber ? ` #${t.jobNumber}` : ""}</div>}
                    {t.endDate && <div style={{fontSize:11,color:C.mut,marginTop:2}}>Due: {t.endDate}</div>}
                  </div>
                );
              })}
            </>
          )}

          {/* Desk Work (To-Do's) */}
          {todos.length > 0 && (
            <>
              <div style={{fontSize:11,fontWeight:700,color:"#8E44AD",letterSpacing:0.5,textTransform:"uppercase",marginBottom:8,marginTop:scheduled.length>0?16:0}}>💻 Desk Work — To-Do's</div>
              {todos.map((t,i) => {
                const isOverdue = t.endDate && t.endDate < todayStr;
                return (
                  <div key={i} style={{background:C.card,borderRadius:12,padding:"14px 16px",border:`1px solid ${isOverdue?"#E74C3C25":C.bdr}`,marginBottom:8,display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:24,height:24,borderRadius:6,border:`2px solid ${C.bdr}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:C.mut,fontSize:14}}>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14,fontWeight:700,color:C.dk}}>{t.name}</div>
                      {t.jobName && <div style={{fontSize:12,color:C.mut,marginTop:2}}>Job: {t.jobName}</div>}
                    </div>
                    {isOverdue && <span style={{fontSize:9,fontWeight:700,color:"#E74C3C",background:"#E74C3C15",padding:"2px 6px",borderRadius:4}}>OVERDUE</span>}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    );
  }

  // === OBJECTION PLAYBOOK ===
  if (screen === "objections") {
    const OBJECTIONS = [
      {cat:"Price",obj:"That seems really expensive.",response:"I understand. Help me understand what you were expecting to invest? That way I can see if there's a way to scope this that fits your budget.",script:"Before I adjust anything, can you share what range you had in mind? I want to make sure we're solving the right problem at the right investment level."},
      {cat:"Price",obj:"I need to get other bids first.",response:"Totally fair. Out of curiosity, what specifically are you hoping the other bids will tell you that I haven't covered?",script:"I respect that. Most homeowners who get 3 bids end up confused by different scopes. What if I walk you through exactly what's included so you can compare apples to apples?"},
      {cat:"Price",obj:"Can you give me a discount?",response:"I appreciate you asking. Our pricing is based on the actual cost of materials and skilled labor. Can you help me understand what would make this feel like the right investment for you?",script:"I wish I could. We price jobs at fair market value so we can guarantee the quality and warranty. What if we phased the work so the first phase fits your budget now?"},
      {cat:"Price",obj:"My neighbor got it done for way less.",response:"That's possible — pricing varies a lot depending on scope, materials, and the contractor's approach. Can I ask what they had done specifically?",script:"I hear that sometimes. Every wall tells a different story. Would you be open to showing me their work so I can explain what might be different about your situation?"},
      {cat:"Decision",obj:"I need to talk to my spouse first.",response:"Absolutely. When you talk to them tonight, what do you think their biggest concern will be?",script:"Of course. If they were here right now, what questions do you think they'd ask? I want to make sure you have everything you need to explain it."},
      {cat:"Decision",obj:"I'm not ready to commit today.",response:"No pressure at all. Help me understand — is it the timing, the price, or something about the scope that's giving you pause?",script:"Totally understand. What would need to happen for this to feel like a yes? I want to know so I'm not guessing when I follow up."},
      {cat:"Decision",obj:"Let me think about it.",response:"Of course. When you're thinking about it later, what specifically are you going to be weighing?",script:"Take all the time you need. I'm curious though — what's the one thing you'd want to feel more confident about before moving forward?"},
      {cat:"Timing",obj:"We want to wait until spring.",response:"I get it. A lot of homeowners think that way. The risk is that water damage over winter can turn a $5K job into $15K by spring. What's driving the wait?",script:"Understandable. Just so you know, we book 8-12 weeks out in spring and prices typically go up 10-15%. If we lock in now, you get today's price and first-in-line scheduling."},
      {cat:"Timing",obj:"We're not in a rush.",response:"That makes sense. Can I ask — how long has this issue been there? And has it gotten worse over time?",script:"No rush at all. The only thing I want to flag is that masonry issues compound — what's cosmetic today can become structural in a season. Can I show you what I mean on your wall?"},
      {cat:"Timing",obj:"We just bought the house, we have a lot going on.",response:"Congrats on the new home! That's a lot to manage. Is this something the inspection flagged?",script:"Completely understand. If the inspection flagged this, your home warranty clock is ticking. Want me to prioritize what's urgent vs what can wait so you have a plan?"},
      {cat:"Trust",obj:"How do I know you'll do quality work?",response:"Great question. We've done 580+ jobs across Chicago, Milwaukee, and Dallas. Want me to show you some on the map that are near you?",script:"I'm glad you asked. We've been doing this for 47 years. I can show you photos of similar work, or if you'd like, I can connect you with a recent customer in your area."},
      {cat:"Trust",obj:"I've had bad experiences with contractors.",response:"I'm sorry to hear that. What happened? I want to understand so I can show you how we do things differently.",script:"That's frustrating and unfortunately common. Here's what makes us different: we put everything in writing, we carry full insurance, and if anything isn't right, we come back and fix it. Period."},
      {cat:"Trust",obj:"Are you licensed and insured?",response:"Absolutely. Fully licensed, bonded, and insured. I can send you our certificates today.",script:"Yes — fully licensed, bonded, and insured in every market we operate in. I'll email you our certificates right now so you have them on file."},
      {cat:"Scope",obj:"I only want to fix the one area.",response:"We can definitely do that. The only reason I mentioned the other areas is that mobilization is a big part of the cost. Fixing everything at once saves you money vs two separate trips.",script:"Absolutely, we can scope it just for that area. I will say — since we're already bringing the lift and crew out, adding the other spots would only be X more vs a full separate mobilization later."},
      {cat:"Scope",obj:"Is this really necessary?",response:"That's a fair question. Let me show you exactly what I'm seeing and why it matters.",script:"I totally get the skepticism. Let me show you the moisture readings and point out where water is getting in. Once you see it, you'll understand why I'm recommending this before winter."},
      {cat:"Scope",obj:"Can I just do a patch job?",response:"You can, and sometimes that's the right call. Let me show you the difference between a patch and a proper repair so you can decide what makes sense.",script:"We do patch jobs all the time. The tradeoff is longevity — a patch lasts 2-3 years, a full repair lasts 15-20. Want me to price both so you can compare?"},
    ];

    const filtered = objSearch.trim()
      ? OBJECTIONS.filter(o => (o.obj + o.cat + o.response + o.script).toLowerCase().includes(objSearch.toLowerCase()))
      : OBJECTIONS;

    const cats = [...new Set(OBJECTIONS.map(o => o.cat))];

    return (
      <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif"}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{CSS}</style>
        <NavBar
          left={<button onClick={()=>{setObjSearch("");setScreen("home");}} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:500}}>{"\u2190 Back"}</button>}
          center="Objection Playbook"
          right={<span/>}
        />
        <div style={{maxWidth:700,margin:"0 auto",padding:"16px 16px 48px"}}>
          <input value={objSearch} onChange={e=>setObjSearch(e.target.value)}
            placeholder="Search objections..."
            style={{width:"100%",padding:"14px 16px",borderRadius:12,border:`1px solid ${C.bdr}`,fontSize:16,fontFamily:"inherit",outline:"none",color:C.dk,background:C.inp,marginBottom:16,boxSizing:"border-box"}}
          />
          <div style={{fontSize:11,color:C.mut,marginBottom:12}}>{filtered.length} objections {objSearch ? 'matching "'+objSearch+'"' : ""}</div>
          {cats.map(cat => {
            const catObjs = filtered.filter(o => o.cat === cat);
            if (catObjs.length === 0) return null;
            const catColors = {Price:"#E74C3C",Decision:"#3498DB",Timing:"#E67E22",Trust:"#27AE60",Scope:"#8E44AD"};
            const cc = catColors[cat] || C.navy;
            return (
              <div key={cat} style={{marginBottom:20}}>
                <div style={{fontSize:12,fontWeight:800,color:cc,letterSpacing:0.5,textTransform:"uppercase",marginBottom:8}}>{cat}</div>
                {catObjs.map((o, i) => (
                  <details key={i} style={{background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,marginBottom:8,overflow:"hidden"}}>
                    <summary style={{padding:"14px 16px",cursor:"pointer",fontSize:14,fontWeight:700,color:C.dk,listStyle:"none",display:"flex",alignItems:"center",gap:8}}>
                      <span style={{color:cc,fontSize:12}}>{"\u25b6"}</span>
                      <span>{'"'+o.obj+'"'}</span>
                    </summary>
                    <div style={{padding:"0 16px 16px"}}>
                      <div style={{background:C.navy+"08",borderRadius:8,padding:"12px 14px",marginBottom:10}}>
                        <div style={{fontSize:10,fontWeight:700,color:C.mut,letterSpacing:0.5,marginBottom:4}}>REFRAME</div>
                        <div style={{fontSize:14,lineHeight:1.6,color:C.dk}}>{o.response}</div>
                      </div>
                      <div style={{background:C.navy,borderRadius:8,padding:"12px 14px"}}>
                        <div style={{fontSize:10,fontWeight:700,color:C.sky,letterSpacing:0.5,marginBottom:4}}>SCRIPT TO USE</div>
                        <div style={{fontSize:14,lineHeight:1.6,color:"rgba(255,255,255,0.9)",fontStyle:"italic"}}>{o.script}</div>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══ RESOURCES ═══
  if (screen === "resources") {
    return (
      <div style={{minHeight:"100vh",background:"#0B1929",fontFamily:"'DM Sans','Outfit',sans-serif"}}>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <style>{CSS}</style>
        <NavBar
          left={<button onClick={()=>setScreen("home")} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",color:"#fff",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:500}}>← Back</button>}
          center="Resources"
          right={<span/>}
        />
        <div style={{maxWidth:960,margin:"0 auto",padding:"16px 16px 48px"}}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:22,fontWeight:800,color:C.dk}}>Sales & Marketing</div>
            <div style={{fontSize:14,color:C.mut}}>Reference docs from JobTread — tap to view or download</div>
          </div>
          {RESOURCES.categories.map(cat => (
            <div key={cat.name} style={{marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:700,color:C.mut,letterSpacing:0.5,marginBottom:8,textTransform:"uppercase"}}>{cat.icon} {cat.name}</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {cat.docs.map((doc, i) => (
                  <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer"
                    style={{display:"flex",alignItems:"center",gap:12,background:C.card,border:`1px solid ${C.bdr}`,borderRadius:12,padding:"14px 16px",textDecoration:"none",transition:"all 0.15s"}}>
                    <div style={{width:36,height:36,borderRadius:8,background:doc.type==="pdf"?C.navy+"12":"rgba(255,255,255,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                      {doc.type === "pdf" ? "📄" : "🖼️"}
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:15,fontWeight:700,color:C.dk}}>{doc.name}</div>
                      <div style={{fontSize:10,color:C.mut,textTransform:"uppercase"}}>{doc.type === "pdf" ? "PDF Document" : "Image"}</div>
                    </div>
                    <div style={{fontSize:16,color:C.mut,flexShrink:0}}>↗</div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
