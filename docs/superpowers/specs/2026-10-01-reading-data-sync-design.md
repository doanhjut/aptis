# Reading Data Sync Design

## Goal

Synchronize the four Reading exercises with the five source tests in `5 đề reading.docx` without changing answer keys or exercise scoring.

The application mapping remains:

- App Part 1 → DOCX Part 1
- App Part 2 → DOCX Parts 2 and 3
- App Part 3 → DOCX Part 4
- App Part 4 → DOCX Part 5

## Scope

### Part 1

No change. All 25 answers already match the source. Test 2 question 5 remains an intentional fill-in-the-blank adaptation.

### Part 2

Add an optional `intro` property to full Part 2 data items. Populate it for the nine topics that have a numbered opening sentence in the source document. `College Welcome Day` has no opening sentence in the source and will omit the property.

Render `intro` as fixed context above the five sortable sentences. It is not draggable, does not add an answer slot, and does not affect scoring.

Normalize the first `End of term project` sortable sentence to:

> The end of term project will focus on at least two of these chapters.

The short data set remains unchanged. Data passed through the `questions` prop remains compatible because `intro` is optional.

### Part 3

Restore the final source sentence in the `Careers` speaker B passage. Answer options and mappings remain unchanged.

### Part 4

Restore all source sentences and sentence endings omitted from:

- Mountain Summits
- The Arrival of the Four-Day Work Week
- Frozen Land
- Women Mathematicians

`Early Australia` is already complete and remains unchanged. Headings and answer mappings remain unchanged for every topic.

## UI Behavior

`ReadingPart2` stores the current optional introduction alongside the current topic and correct answer. When present, the introduction appears as a non-interactive context block between the topic and the sentence-ordering controls. When absent, no empty placeholder is rendered.

Changing data sets, advancing questions, resetting, and review mode must refresh the introduction from the same current item as the displayed answer.

## Compatibility

- Existing `{ topic, questions }` Part 2 objects continue to work.
- Existing array-based `part2shorten` entries continue to work.
- Custom question props without `intro` continue to render normally.
- The number of answer slots and all score totals remain unchanged.

## Testing

Use test-first development:

1. Add data fidelity tests that initially fail because intros and restored source sentences are absent.
2. Add a Part 2 component test that initially fails because the intro is not rendered.
3. Update production data and UI with the minimum changes needed to pass.
4. Run the focused tests, then the full non-interactive test suite and production build.

## Acceptance Criteria

- Nine Part 2 full-data topics contain the correct source introduction.
- `College Welcome Day` renders without an intro or placeholder.
- Part 2 always keeps exactly five sortable answer positions.
- `End of term project` contains “these chapters”.
- The omitted Part 3 and Part 4 source text is restored.
- All existing answer keys, headings, mappings, and scores are unchanged.
- Tests and production build pass.
