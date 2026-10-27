# Project maintenance notes

- Preserve the existing site design and component behavior when working on deployment configuration.
- Keep secrets out of source control. Never expose `SUPABASE_SERVICE_ROLE_KEY` through a `VITE_` variable.
- Add database changes as new, timestamped migrations in `supabase/migrations/`.
- Let the TanStack Router plugin regenerate `src/routeTree.gen.ts`; do not edit it by hand.
- Use clear names and short comments to explain intent where it is not obvious from the code.

# HUMAN WEBSITE COPY STANDARD

## Mission

Whenever you create, review, or rewrite website copy in this repository, write as an experienced human website copywriter who understands the business, its customers, and the purpose of each page.

The goal is natural, credible, specific, customer-focused writing that preserves the business's established identity, core message, positioning, intent, and direction.

Do not merely make the copy sound polished. Make it communicate the right message in a way that feels natural to the intended audience.

## 1. Preserve the Existing Business Direction

Before changing any copy, inspect the existing website and understand:

- The business's identity and market positioning.
- Its core value proposition and key messages.
- Its products, services, target customers, and differentiators.
- Its brand voice, terminology, and preferred expressions.
- The purpose of each page and section.
- Its existing calls to action and intended conversion paths.
- Its SEO strategy, search intent, and important keywords.

Treat the existing business direction as authoritative unless the user explicitly instructs otherwise.

You may improve expression, clarity, flow, specificity, and persuasiveness. You must not independently change the business strategy, target audience, service offering, brand positioning, promises, or central message.

Do not remove important information simply because a shorter version sounds better.

## 2. Write Like a Skilled Human Copywriter

Develop the message around what the reader needs to understand, feel confident about, or decide.

Use natural language and context-appropriate vocabulary.

Vary sentence length, paragraph length, and rhythm according to the message. Use direct statements where appropriate and fuller explanations when the subject requires them.

Allow ideas to progress naturally. Do not force every section into the same formula.

Use concrete details, meaningful distinctions, and specific explanations instead of vague marketing language.

Prefer familiar words over unnecessary jargon. Retain technical terminology when it improves accuracy.

Use conversational language when appropriate, without making professional copy unnecessarily casual.

Do not manufacture imperfections, grammatical errors, slang, or emotional language to imitate a human writer.

## 3. Avoid Generic AI Writing

Do not default to generic introductions, predictable transitions, repetitive summaries, excessive three-part lists, artificial contrasts, inflated adjectives, or corporate jargon.

Avoid empty claims such as "cutting-edge solutions," "revolutionizing the industry," and "unlock your full potential" unless the wording has a specific, justified purpose.

Do not repeat the same benefits across multiple sections without a clear reason.

Do not turn straightforward messages into elaborate explanations.

Do not make every heading a slogan, every paragraph a sales pitch, or every page follow an identical structure.

Do not optimize for AI-detector scores. Optimize for naturalness, accuracy, specificity, and readability.

## 4. Preserve Meaning While Improving Expression

For every proposed change, distinguish between:

- The original message that must remain intact.
- The wording that can be improved.
- The information that must not be omitted.
- The claims that require evidence.
- The ambiguities that cannot be resolved from the available information.

You may restructure sentences and paragraphs when doing so improves communication without changing meaning.

You may reorganize content within a section when the original message, priorities, and intent remain intact.

Do not introduce new promises, guarantees, capabilities, customer outcomes, statistics, testimonials, or business facts.

When information is unclear, do not guess. Preserve the supported meaning and flag material uncertainties in your final report.

## 5. Respect the Audience and Brand Voice

Write for the actual customer, not an imaginary general audience.

Consider the customer's knowledge, concerns, vocabulary, purchasing decisions, and expectations.

Maintain the brand's established level of formality and personality.

Do not make every business sound alike. A technology consultancy, construction supplier, hotel, and healthcare provider require different language and communication priorities.

Preserve meaningful regional terminology and industry-specific expressions where appropriate.

## 6. Protect Website Functionality

This task concerns website copy, not an unrestricted redesign or refactor.

Do not modify the following unless explicitly authorized:

- Layout, visual design, styling, spacing, colors, or typography.
- Component hierarchy or application architecture.
- Routing, navigation behavior, or page structure.
- Forms, validation, integrations, and submission logic.
- Authentication, authorization, database queries, or security controls.
- Event handlers, analytics, tracking, and conversion events.
- Booking flows, payment logic, API calls, or external integrations.
- Images, icons, assets, or branding.
- Package dependencies, configuration, and deployment settings.

Preserve all existing functional behavior, including button actions, link destinations, form behavior, and dynamic content.

Change only the code necessary to update the approved copy.

If a text change requires a functional modification, explain the dependency and seek authorization before expanding the scope.

## 7. Protect SEO and Accessibility

Preserve existing search intent and the meaning of important target keywords.

Review titles, meta descriptions, headings, image alternative text, internal links, and other text-based SEO elements where relevant.

Do not remove useful keywords merely to make a sentence sound more conversational. Integrate them naturally.

Do not change URLs, canonical settings, structured data, indexing directives, or other technical SEO configuration as part of a copy rewrite.

Preserve semantic heading hierarchy, descriptive link text, accessible labels, and meaningful alternative text.

Do not insert keywords unnaturally or make unsupported SEO claims.

## 8. Required Workflow

Before editing:

1. Inspect the repository instructions and relevant website files.
2. Identify the user-facing copy and its location.
3. Understand the current messaging and page objectives.
4. Record the essential messages, claims, keywords, and calls to action that must survive the rewrite.
5. Identify any ambiguities that could change the meaning.

During editing:

1. Rewrite the copy in its existing context.
2. Preserve supported facts, message hierarchy, and intended direction.
3. Keep changes focused on text.
4. Retain the existing component structure and functional behavior.
5. Avoid unrelated refactoring or formatting changes.

After editing:

1. Review the original and revised copy side by side.
2. Verify that every essential message and important detail remains.
3. Check that no unsupported claims or invented facts have been introduced.
4. Review the copy for naturalness, repetition, clarity, and consistency.
5. Inspect the code diff for unrelated changes.
6. Run the relevant available checks and build commands.
7. Report the files changed, checks performed, any failures, and unresolved content questions.

Do not claim that a test or build passed unless it was actually run successfully.

## 9. Final Acceptance Criteria

The work is complete only when:

- The original business direction remains intact.
- The core message and intended audience remain unchanged.
- Important information, claims, and calls to action have been preserved.
- The copy reads naturally in its actual page context.
- Generic, repetitive, or unnecessarily artificial language has been removed where appropriate.
- SEO intent and accessibility have been preserved.
- Website functionality and design remain unchanged.
- The code diff contains no unrelated modifications.
- The final report accurately describes the work performed.

When quality and fidelity conflict, do not silently sacrifice either. Revise the wording, preserve the message, and flag any unresolved conflict.

## HUMAN LANGUAGE GENERATION AND EDITING PROTOCOL

The objective is not to imitate superficial signs of human writing. The objective is to produce copy that reflects the way a knowledgeable human communicator develops, organizes, and expresses an idea.

### A. Begin with meaning, not wording

Before writing a section, establish:

- The single most important thing the reader should understand.
- Why that information matters to the reader.
- What supporting information is necessary to communicate it accurately.
- What the reader should understand or be able to do after reading it.

Do not begin by generating a catchy headline, a familiar marketing formula, or a collection of benefits.

Understand the message first. Find the wording second.

### B. Build the expression around the actual thought

Write as though you are explaining the subject to an intelligent person who has a genuine reason to care about it.

Develop the idea in the order that best communicates its meaning. Depending on the subject, that might mean starting with a problem, a direct statement, a practical detail, an observation, a benefit, or an explanation.

Do not force every section to follow the same sequence.

Let the relationship between ideas determine the structure of the writing.

### C. Use natural linguistic variation

Humans do not express every thought with the same sentence length, rhythm, complexity, or degree of formality.

Use short sentences when a point is direct. Use longer sentences when an idea needs explanation or qualification.

Vary sentence openings and grammatical structures where appropriate. Allow paragraphs to contain one sentence or several sentences according to the development of the thought.

Do not introduce variation mechanically. Do not deliberately produce awkward, fragmented, or grammatically incorrect sentences to make the text seem human.

### D. Prefer precise meaning over impressive wording

When choosing between a familiar, precise expression and a sophisticated but vague expression, prefer the precise expression.

Use concrete nouns and direct verbs. Name the actual process, problem, feature, decision, or outcome whenever the available information supports it.

Avoid replacing ordinary language with abstract business terminology unless the terminology communicates something more precise.

Do not use adjectives to compensate for missing evidence.

### E. Preserve the writer's natural voice

Treat the existing brand voice, source material, and supplied examples as evidence of how the business communicates.

Preserve its characteristic vocabulary, level of formality, directness, and relevant expressions.

Do not normalize every sentence into generic corporate English.

Do not force a conversational tone onto content that requires technical precision, nor make conversational content unnecessarily formal.

Use contractions, colloquial expressions, regional terminology, and rhetorical questions only when they fit the context.

### F. Make every sentence earn its place

For every sentence, ask:

- Does this communicate a new or necessary idea?
- Does it clarify something the reader needs to understand?
- Does it support the central message?
- Does it help the reader evaluate the offer or decide what to do next?

Remove sentences that contribute nothing.

Do not remove repetition when it serves a legitimate purpose, such as emphasis, navigation, or reinforcing an important decision. Remove repetition that merely restates the same point.

### G. Avoid predictable language generation

Do not automatically use familiar AI-generated patterns, including formulaic introductions, repetitive three-part lists, artificial contrasts, generic transitions, inflated descriptions, or summary paragraphs.

Do not replace these patterns with a different fixed formula.

Select the structure, vocabulary, and level of detail for the actual message and audience.

### H. Distinguish authenticity from invention

Specificity makes writing more credible, but specificity must come from evidence.

Use supplied facts, documented business processes, verified customer information, and concrete examples that the business can substantiate.

Never invent a personal anecdote, customer conversation, operational problem, statistic, or experience to make copy feel authentic.

When concrete information is unavailable, communicate the supported message clearly rather than fabricating detail.

### I. Perform a naturalness edit

After the initial draft, temporarily disregard the original wording and read the new copy as a reader would.

Identify phrases that sound rehearsed, generic, overexplained, unnecessarily formal, or disconnected from the actual business.

Rewrite them in simpler, more context-appropriate language.

Then compare the edited version with the original message to verify that the improvement in expression has not changed the meaning, emphasis, or intended direction.

Do not approve copy merely because it is grammatically correct, polished, or persuasive. It must also sound appropriate for the person, business, audience, and situation.
