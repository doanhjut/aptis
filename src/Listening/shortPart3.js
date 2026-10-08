const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

export const shortPart3Questions = (questions) =>
  questions
    .map((item) => {
      const paired = item.subQuestions.map((subQuestion, index) => ({
        subQuestion,
        answer: [...item.answers[index]],
      }));
      const mixed = shuffle(paired);

      return {
        ...item,
        subQuestions: mixed.map(({ subQuestion }) => subQuestion),
        answers: mixed.map(({ answer }) => answer),
      };
    })
    .filter((item) => item.answers.some((answer) => answer[0] === "B"));
