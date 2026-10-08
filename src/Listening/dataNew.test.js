import { newListeningData } from "./dataNew";

const expectedCounts = {
  part1: 171,
  part2: 15,
  part3: 12,
  part4: 31,
};

test("contains every required source occurrence", () => {
  Object.entries(expectedCounts).forEach(([part, count]) => {
    expect(newListeningData[part]).toHaveLength(count);
  });
});

test("preserves test and question provenance", () => {
  newListeningData.part1.forEach((item) => {
    expect(item.testNumber).toBeGreaterThanOrEqual(1);
    expect(item.testNumber).toBeLessThanOrEqual(15);
    expect(item.questionNumber).toBeGreaterThanOrEqual(1);
    expect(item.questionNumber).toBeLessThanOrEqual(13);
  });

  newListeningData.part2.forEach((item) => {
    expect(item.testNumber).toBeGreaterThanOrEqual(1);
    expect(item.testNumber).toBeLessThanOrEqual(15);
    expect(item.questionNumber).toBe(14);
  });

  newListeningData.part3.forEach((item) => {
    expect(item.testNumber).toBeGreaterThanOrEqual(1);
    expect(item.testNumber).toBeLessThanOrEqual(16);
    expect(item.questionNumber).toBe(15);
  });

  newListeningData.part4.forEach((item) => {
    expect(item.testNumber).toBeGreaterThanOrEqual(1);
    expect(item.testNumber).toBeLessThanOrEqual(16);
    expect([16, 17]).toContain(item.questionNumber);
  });

  const part1Questions = newListeningData.part1.map((item) =>
    item.question.trim().replace(/\s+/g, " ").toLowerCase(),
  );
  expect(new Set(part1Questions).size).toBe(part1Questions.length);
  expect(
    newListeningData.part1.filter((item) =>
      item.question.toLowerCase().includes("what color top"),
    ),
  ).toHaveLength(1);
  expect(
    newListeningData.part1.filter((item) =>
      item.question.toLowerCase().includes("appointment"),
    ),
  ).toHaveLength(1);

  const part3Topics = newListeningData.part3.map((item) =>
    item.main.trim().toLowerCase(),
  );
  expect(new Set(part3Topics).size).toBe(part3Topics.length);

  for (let testNumber = 1; testNumber <= 15; testNumber += 1) {
    expect(
      newListeningData.part4
        .filter((item) => item.testNumber === testNumber)
        .map((item) => item.questionNumber),
    ).toEqual([16, 17]);
  }
});

test("uses valid Part 1 and Part 2 answers", () => {
  newListeningData.part1.forEach((item) => {
    expect(item.options).toHaveLength(3);
    expect(item.options).toContain(item.correctAnswer);
  });

  newListeningData.part2.forEach((item) => {
    expect(item.options.length).toBeGreaterThanOrEqual(4);
    expect(item.speakers).toHaveLength(4);
    expect(item.speakers.map(({ speaker }) => speaker)).toEqual([
      "A",
      "B",
      "C",
      "D",
    ]);
    item.speakers.forEach(({ transcript, correctAnswer }) => {
      expect(typeof transcript).toBe("string");
      expect(transcript.length).toBeGreaterThan(0);
      expect(item.options).toContain(correctAnswer);
    });
  });
});

test("is compatible with ListeningPart3", () => {
  newListeningData.part3.forEach((item) => {
    expect(item.options).toBe("1/2/B");
    expect(item.subQuestions).toHaveLength(4);
    expect(item.answers).toHaveLength(4);
    expect(typeof item.dialogue).toBe("string");
    expect(item.dialogue.length).toBeGreaterThan(0);
    item.subQuestions.forEach((subQuestion) => {
      expect(subQuestion.expectedAnswers).toBe(1);
    });
    item.answers.forEach((answer) => {
      expect(answer).toHaveLength(1);
      expect(["1", "2", "B"]).toContain(answer[0]);
    });
  });
});

test("gives every Part 4 occurrence two answers and enough distractors", () => {
  newListeningData.part4.forEach((item) => {
    const correct = item.subQuestions.filter(({ answer }) => answer);
    const distractors = item.subQuestions.filter(({ answer }) => !answer);
    expect(correct).toHaveLength(2);
    expect(distractors.length).toBeGreaterThanOrEqual(4);
    expect(new Set(item.subQuestions.map(({ text }) => text)).size).toBe(
      item.subQuestions.length,
    );
  });
});

test("preserves exact Test 1 source details", () => {
  expect(newListeningData.part1[0]).toEqual({
    testNumber: 1,
    questionNumber: 1,
    question:
      "A person calls a friend about his new car. How much does the small car cost him?",
    options: ["3250 pounds", "3550 pounds", "4250 pounds"],
    correctAnswer: "3250 pounds",
  });

  expect(newListeningData.part2[0].options).toEqual([
    "Horse riding",
    "Mountain biking",
    "Walking",
    "Going for a run",
  ]);
  expect(newListeningData.part2[0].speakers.map(({ correctAnswer }) => correctAnswer)).toEqual([
    "Mountain biking",
    "Going for a run",
    "Walking",
    "Horse riding",
  ]);
  expect(newListeningData.part3[0].answers).toEqual([
    ["1"],
    ["B"],
    ["2"],
    ["B"],
  ]);
  expect(
    newListeningData.part4
      .find(({ testNumber, questionNumber }) => testNumber === 1 && questionNumber === 16)
      .subQuestions.filter(({ answer }) => answer)
      .map(({ text }) => text),
  ).toEqual([
    "It is different from his earlier works",
    "He should listen to critics before writing his next work",
  ]);
});

test("preserves exact Test 15 source details", () => {
  expect(newListeningData.part1[newListeningData.part1.length - 1]).toEqual({
    testNumber: 15,
    questionNumber: 13,
    question: "A teacher is talking to her students. Where are the students now?",
    options: ["At school", "In a townhouse", "In a museum"],
    correctAnswer: "In a townhouse",
  });
  expect(
    newListeningData.part2[
      newListeningData.part2.length - 1
    ].speakers.map(({ correctAnswer }) => correctAnswer),
  ).toEqual(["To relax", "While studying", "While singing", "After waking up"]);
  expect(newListeningData.part3.find(({ testNumber }) => testNumber === 14)).toMatchObject({
    testNumber: 14,
    main: "Beauty",
    answers: [["2"], ["1"], ["B"], ["1"]],
  });
  expect(newListeningData.part3.find(({ main }) => main === "Homeschooling").answers).toEqual([
    ["2"],
    ["1"],
    ["1"],
    ["B"],
  ]);
  expect(
    newListeningData.part4
      .find(({ name }) => name === "Panos's painting")
      .subQuestions.filter(({ answer }) => answer)
      .map(({ text }) => text),
  ).toEqual([
    "Pano's paintings would be similar to those of another artist",
    "It is a window to the past",
  ]);
  expect(
    newListeningData.part4
      .find(({ testNumber, questionNumber }) => testNumber === 15 && questionNumber === 17)
      .subQuestions.filter(({ answer }) => answer)
      .map(({ text }) => text),
  ).toEqual([
    "It is exciting to read",
    "It has been written for a general audience",
  ]);
});

test("retains Test 13's extra unused Part 2 choice", () => {
  const test13 = newListeningData.part2.find(({ testNumber }) => testNumber === 13);
  expect(test13.options).toEqual([
    "After waking up",
    "While singing",
    "To relax",
    "While reading",
    "While studying",
  ]);
  expect(test13.speakers).toHaveLength(4);
});
