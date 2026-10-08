import { data } from "./data";

const findPart2 = (topic) =>
  data.part2.find((item) => item.topic === topic);

const findPart3 = (main) =>
  data.part3.find((item) => item.main === main);

const findPart4 = (main) =>
  data.part4.find((item) => item.main === main);

const expectedIntros = {
  "Topic: Films": "The first film was shown in 1895 in Paris, France.",
  "Topic: Weekend activities":
    "The weather was great last week, there was family sports in town.",
  "Topic: Homework next week":
    "Our homework next week will be about places in town.",
  "Topic: Travel": "In the early 1800s, traveling is quite difficult",
  "Topic: Music festivals":
    "Last Saturday, a live music show was held in town park.",
  "Topic: End of term project":
    "This semester we have studied several chapters about local history in the class",
  "Topic: African American woman in space":
    "Mae Jemison’s father is a skilled worker, her mother is a teacher",
  "Topic: A new café":
    "Yesterday I went to a new café named Corner Cafe on High Street.",
  "Topic: Famous singer":
    "Jaden Nobelton is only 18 years old and he is a famous singer",
};

test("adds source introductions to the nine Part 2 topics that have them", () => {
  Object.entries(expectedIntros).forEach(([topic, intro]) => {
    expect(findPart2(topic)?.intro).toBe(intro);
  });
});

test("keeps College Welcome Day without an introduction", () => {
  const item = findPart2("Topic: College Welcome Day");
  expect(item).toBeDefined();
  expect(item.intro).toBeUndefined();
});

test("normalizes End of term project to these chapters", () => {
  expect(findPart2("Topic: End of term project").questions[0]).toBe(
    "The end of term project will focus on at least two of these chapters.",
  );
});

test("restores the omitted Careers speaker B sentence", () => {
  expect(findPart3("careers").subQuestions[1].text).toContain(
    "Even though it can be challenging sometimes, I believe this experience is very valuable, and I am happy to continue on this career path without changing my job plans.",
  );
});

test("restores omitted Part 4 source sentences", () => {
  const mountain = findPart4("Mountain Summits");
  expect(mountain.subQuestions[5].text).toContain(
    "True success on Everest should mean leaving the mountain cleaner and safer for future generations.",
  );

  const workWeek = findPart4("The Arrival of the Four-Day Work Week");
  expect(workWeek.subQuestions[2].text).toContain(
    "To compensate, they may have to hire more people, leading to increased costs in salaries, training and management.",
  );
  expect(workWeek.subQuestions[2].text).toContain(
    "For smaller companies, this can easily become a major challenge in terms of budgets and ability to maintain operations.",
  );
  expect(workWeek.subQuestions[3].text).toContain(
    "Concerns that “compressing work into shorter hours” may be counterproductive to the original goal.",
  );
  expect(workWeek.subQuestions[4].text).toContain(
    "From schools, government agencies to shopping or entertainment centers – all are operating on this time frame.",
  );
  expect(workWeek.subQuestions[4].text).toContain(
    "Adjusting the entire system like this will not be easy and is likely to face opposition from many sides.",
  );
  expect(workWeek.subQuestions[4].text).toContain(
    "such as staying late or taking work home.",
  );
  expect(workWeek.subQuestions[5].text).toContain(
    "This is also true for teachers, as the number of students and teaching hours does not decrease.",
  );
  expect(workWeek.subQuestions[6].text).toContain(
    "Thereby, the goal of work-life balance can still be achieved without creating many barriers.",
  );

  const frozen = findPart4("Frozen Land");
  expect(frozen.subQuestions[0].text).toContain(
    "This unique model of international governance helps protect the fragile environment of the frozen land and ensures that its resources are not exploited for commercial gain.",
  );
  expect(frozen.subQuestions[1].text).toContain(
    "Still, the achievement marked a turning point in human exploration, showing that even the most remote and inhospitable places on Earth could be reached with courage and persistence.",
  );
  expect(frozen.subQuestions[2].text).toContain(
    "Today, while satellite images and scientific missions provide more data, the continent still retains an aura of the unknown, attracting adventurers and scientists who want to experience the planet’s final frontier.",
  );
  expect(frozen.subQuestions[3].text).toContain(
    "Studying this hidden geography helps researchers understand the Earth's geological past, as well as how changes in climate may affect the region’s ice coverage in the future.",
  );
  expect(frozen.subQuestions[4].text).toContain(
    "The race to the pole was one of the most extreme tests of human endurance and remains one of the most iconic chapters in the history of polar exploration.",
  );
  expect(frozen.subQuestions[5].text).toContain(
    "While the environment is still harsh, advances in transportation and survival gear make scientific missions more efficient and less life-threatening than those of early explorers.",
  );
  expect(frozen.subQuestions[6].text).toContain(
    "These unique features make it difficult for heat to accumulate, and as a result, the region remains frozen even in summer.",
  );
  expect(frozen.subQuestions[6].text).toContain(
    "Understanding these conditions helps scientists study global weather patterns and climate change.",
  );

  const women = findPart4("Women Mathematicians");
  expect(women.subQuestions[0].text).toContain(
    "Many of their contributions were later credited to male scholars.",
  );
  expect(women.subQuestions[1].text).toContain(
    "These achievements marked a significant moment in the history of mathematics and highlighted her lasting influence on future generations.",
  );
  expect(women.subQuestions[2].text).toContain(
    "Despite these challenges, her work was highly influential, and later generations recognised her contributions, proving that her talent had been overlooked for many years.",
  );
  expect(women.subQuestions[3].text).toContain(
    "tirelessly working to open academic and political doors for future generations.",
  );
  expect(women.subQuestions[3].text).toContain(
    "Her lifelong commitment to intellectual and social progress stands as a testament to her exceptional capabilities and enduring influence.",
  );
  expect(women.subQuestions[5].text).toContain(
    "in a domain where women have historically been underrepresented.",
  );
});
