import { useState, useEffect } from 'react';
import './part3.css';

const questions = [
  {
    main: "Opinions on flying",
    subQuestions: [
      { text: "I have a", expectedAnswers: 2 },
      { text: "My family", expectedAnswers: 2 },
      { text: "I was a businessman", expectedAnswers: 1 },
      { text: "If I have", expectedAnswers: 2 }
    ],
    options: "suggest making flights more expensive/want to work in other countries/visit relatives regularly/try to protect the environment/like relaxing while they travel/find flying tiring/need to fly for their work",
    answers: [
      ["suggest making flights more expensive", "want to work in other countries"],
      ["visit relatives regularly", "try to protect the environment"],
      ["like relaxing while they travel"],
      ["find flying tiring", "need to fly for their work"]
    ]
  },
  {
    main: "a new restaurant",
    subQuestions: [
      { text: "This is my first", expectedAnswers: 2 },
      { text: "This is a very famous", expectedAnswers: 2 },
      { text: "I'm not sure", expectedAnswers: 2 },
      { text: "I don't understand", expectedAnswers: 1 }
    ],
    options: "was impressed by the range of appetizers/thought the music was too quiet/didn't eat anything at the restaurant/enjoyed the atmosphere/thought his bad experience was probably unusual/the food was of average quality/will definitely not return to the restaurant",
    answers: [
      ["was impressed by the range of appetizers", "thought the music was too quiet"],
      ["didn't eat anything at the restaurant", "enjoyed the atmosphere"],
      ["thought his bad experience was probably unusual", "the food was of average quality"],
      ["will definitely not return to the restaurant"]
    ]
  },
  {
    main: "reading books",
    subQuestions: [
      { text: "My wife", expectedAnswers: 2 },
      { text: "I used", expectedAnswers: 2 },
      { text: "I often keep", expectedAnswers: 1 },
      { text: "My job", expectedAnswers: 2 }
    ],
    options: "plans their reading schedule/reads more than another family member/reads many books at once/wants to read a lot of books/is having difficulty in finishing a book/thinks that factual books are boring/has limited time to read books",
    answers: [
      ["plans their reading schedule", "reads more than another family member"],
      ["reads many books at once", "wants to read a lot of books"],
      ["is having difficulty in finishing a book"],
      ["thinks that factual books are boring", "has limited time to read books"]
    ]
  },
  {
    main: "visit a city",
    subQuestions: [
      { text: "When I first", expectedAnswers: 2 },
      { text: "I don't like big", expectedAnswers: 2 },
      { text: "I went to this", expectedAnswers: 2 },
      { text: "When I go out", expectedAnswers: 1 }
    ],
    options: "thought public transport system was good/walking too much causes a problem/like the natural resort here/visit one part of the city/like the public theatre that the city puts on/usually spend a lot of money on shopping/pay a lot for their meal",
    answers: [
      ["thought public transport system was good", "walking too much causes a problem"],
      ["like the natural resort here", "visit one part of the city"],
      ["like the public theatre that the city puts on", "usually spend a lot of money on shopping"],
      ["pay a lot for their meal"]
    ]
  },
  {
    main: "plans for a new station",
    subQuestions: [
      { text: "I see too many", expectedAnswers: 1 },
      { text: "Buses are often full", expectedAnswers: 2 },
      { text: "In my opinion", expectedAnswers: 2 },
      { text: "Building a new public", expectedAnswers: 2 }
    ],
    options: "people should plan their journeys better/the bus is too busy/the new station will improve train travel/the bus service is good/transport system doesn't need improving/better medical facilities are needed/the new station will cost too much to build",
    answers: [
      ["people should plan their journeys better"],
      ["the bus is too busy", "the new station will improve train travel"],
      ["the bus service is good", "transport system doesn't need improving"],
      ["better medical facilities are needed", "the new station will cost too much to build"]
    ]
  },
  {
    main: "art",
    subQuestions: [
      { text: "I know", expectedAnswers: 2 },
      { text: "I find going to", expectedAnswers: 2 },
      { text: "I find polite art", expectedAnswers: 1 },
      { text: "My parents", expectedAnswers: 2 }
    ],
    options: "has some artistic skills/seeing exhibitions is a boring activity/prefers seeing exhibitions by themselves/visitors should focus on the art/has a good knowledge of art/prefers going to art exhibitions with other people/has been going to art exhibitions all their life",
    answers: [
      ["has some artistic skills", "seeing exhibitions is a boring activity"],
      ["prefers seeing exhibitions by themselves", "visitors should focus on the art"],
      ["has a good knowledge of art"],
      ["prefers going to art exhibitions with other people", "has been going to art exhibitions all their life"]
    ]
  },
  {
    main: "volunteering to clean a local park",
    subQuestions: [
      { text: "I feel very lucky", expectedAnswers: 2 },
      { text: "I'm a very busy", expectedAnswers: 2 },
      { text: "I think this volunteering", expectedAnswers: 2 },
      { text: "My family and I often", expectedAnswers: 1 }
    ],
    options: "the park is a beautiful place to relax/ask for others to help/can't clean the park because of their busy work/volunteering will help with future employment/local areas need cleaning/the cleaning needs to be done regularly/volunteering is important for students",
    answers: [
      ["the park is a beautiful place to relax", "ask for others to help"],
      ["can't clean the park because of their busy work", "volunteering will help with future employment"],
      ["local areas need cleaning", "the cleaning needs to be done regularly"],
      ["volunteering is important for students"]
    ]
  },
  {
    main: "Going on holiday",
    subQuestions: [
      { text: "Last year", expectedAnswers: 2 },
      { text: "When I travel somewhere", expectedAnswers: 2 },
      { text: "My family and I often", expectedAnswers: 2 },
      { text: "Next month's trip will", expectedAnswers: 1 }
    ],
    options: "prefer to stay at home/like going walking/like seeing tourist attractions/going to the beach is boring/holiday requires good weather/want to go mountaineering trip/have never been abroad",
    answers: [
      ["prefer to stay at home", "like going walking"],
      ["like seeing tourist attractions", "going to the beach is boring"],
      ["holiday requires good weather", "want to go mountaineering trip"],
      ["have never been abroad"]
    ]
  },
  {
    main: "sports",
    subQuestions: [
      { text: "Exercising with", expectedAnswers: 2 },
      { text: "Establishing a consistent", expectedAnswers: 1 },
      { text: "Age is just a number", expectedAnswers: 2 },
      { text: "Experiencing pain", expectedAnswers: 2 }
    ],
    options: "work out with friends is a good idea/a proper meal is important/a routine can help us do more sport/exercise is for both the young and the elderly/competitions are not useful for everybody/experience pain is not necessary/at times we seek expert advice",
    answers: [
      ["work out with friends is a good idea", "a proper meal is important"],
      ["a routine can help us do more sport"],
      ["exercise is for both the young and the elderly", "competitions are not useful for everybody"],
      ["experience pain is not necessary", "at times we seek expert advice"]
    ]
  },
  {
    main: "visit an island",
    subQuestions: [
      { text: "I like traveling", expectedAnswers: 2 },
      { text: "As an architect", expectedAnswers: 1 },
      { text: "The sharp bends", expectedAnswers: 2 },
      { text: "There's a lot", expectedAnswers: 2 }
    ],
    options: "forgot to bring something/liked to be alone/spent a lot of money on transport/thought public transport could be improved/liked to walk/loved eating food here/liked buying things on the island",
    answers: [
      ["forgot to bring something", "liked to be alone"],
      ["spent a lot of money on transport"],
      ["thought public transport could be improved", "liked to walk"],
      ["loved eating food here", "liked buying things on the island"]
    ]
  },
  {
    main: "watching television",
    subQuestions: [
      { text: "I know I have", expectedAnswers: 2 },
      { text: "I often spend", expectedAnswers: 2 },
      { text: "I wasn't good", expectedAnswers: 1 },
      { text: "My husband", expectedAnswers: 2 }
    ],
    options: "watch TV instead of studying/like TV programs which continue over several weeks/avoid watching reality TV programs/lost interest in watching football on TV/get a lot of knowledge by watching TV/isn't a very selective viewer/keep up to date on cinema and music",
    answers: [
      ["watch TV instead of studying", "like TV programs which continue over several weeks"],
      ["avoid watching reality TV programs", "lost interest in watching football on TV"],
      ["get a lot of knowledge by watching TV"],
      ["isn't a very selective viewer", "keep up to date on cinema and music"]
    ]
  },
  {
    main: "eating and cooking",
    subQuestions: [
      { text: "When I was a kid", expectedAnswers: 1 },
      { text: "I used to often", expectedAnswers: 2 },
      { text: "Going to a restaurant", expectedAnswers: 2 },
      { text: "I don't understand", expectedAnswers: 2 }
    ],
    options: "like to eat with friends/prefer to eat alone/need to save money/like to eat a wide range of dishes/take a cookery course/only want to eat a few range of food/like home cooked food",
    answers: [
      ["like to eat with friends"],
      ["prefer to eat alone", "need to save money"],
      ["like to eat a wide range of dishes", "take a cookery course"],
      ["only want to eat a few range of food", "like home cooked food"]
    ]
  }
];



function Part3() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([[], [], [], []]);
  const [currentSubQuestion, setCurrentSubQuestion] = useState(0);
  const [usedOptions, setUsedOptions] = useState(new Set());
  const [result, setResult] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);

  useEffect(() => {
    resetQuestion();
  }, [currentQuestionIndex]);

  const resetQuestion = () => {
    setUserAnswers([[], [], [], []]);
    setCurrentSubQuestion(0);
    setUsedOptions(new Set());
    setResult(null);
    setShowCorrect(false);
  };

  const handleOptionClick = (option) => {
    if (usedOptions.has(option)) return;

    const currentQuestion = questions[currentQuestionIndex];
    const maxAnswers = currentQuestion.subQuestions[currentSubQuestion].expectedAnswers;
    
    if (userAnswers[currentSubQuestion].length < maxAnswers) {
      const newUserAnswers = [...userAnswers];
      newUserAnswers[currentSubQuestion] = [...newUserAnswers[currentSubQuestion], option];
      setUserAnswers(newUserAnswers);
      setUsedOptions(new Set([...usedOptions, option]));

      // Nếu đã đủ số câu trả lời cho câu hỏi hiện tại, chuyển sang câu hỏi tiếp theo
      if (newUserAnswers[currentSubQuestion].length === maxAnswers) {
        if (currentSubQuestion < 3) {
          setCurrentSubQuestion(currentSubQuestion + 1);
        }
      }
    }
  };

  const handleAnswerClick = (subIndex, answerIndex) => {
    const newUserAnswers = [...userAnswers];
    const removedAnswer = newUserAnswers[subIndex][answerIndex];
    newUserAnswers[subIndex].splice(answerIndex, 1);
    setUserAnswers(newUserAnswers);
    
    const newUsedOptions = new Set(usedOptions);
    newUsedOptions.delete(removedAnswer);
    setUsedOptions(newUsedOptions);

    // Nếu xóa câu trả lời từ câu hỏi hiện tại hoặc trước đó, quay lại câu hỏi đó
    if (subIndex <= currentSubQuestion) {
      setCurrentSubQuestion(subIndex);
    }
  };

  const checkAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    let isCorrect = true;

    for (let i = 0; i < 4; i++) {
      const userAnswer = userAnswers[i].sort();
      const correctAnswer = currentQuestion.answers[i].sort();
      
      if (userAnswer.length !== correctAnswer.length || 
          !userAnswer.every((answer, index) => answer === correctAnswer[index])) {
        isCorrect = false;
        break;
      }
    }

    if (isCorrect) {
      setResult('Đúng rồi!');
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setResult('Chúc mừng! Bạn đã hoàn thành tất cả các câu hỏi!');
        }
      }, 1500);
    } else {
      setResult('Sai rồi, hãy thử lại hoặc xem đáp án đúng.');
      setShowCorrect(true);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const availableOptions = currentQuestion.options.split('/');

  return (
    <div className="app-container">
      <h1 className="game-title">Trò chơi sắp xếp từ - Phần 3</h1>
      <p className="sentence-info">Câu hỏi {currentQuestionIndex + 1} / {questions.length}</p>
      
      <div className="word-section">
        <h2 className="question-title">{currentQuestion.main}</h2>
        
        <div className="sub-questions">
          {currentQuestion.subQuestions.map((sub, index) => (
            <div 
              key={index} 
              className={`sub-question ${index === currentSubQuestion ? 'active' : ''} ${userAnswers[index].length > 0 ? 'completed' : ''}`}
            >
              <div className="sub-question-text">{sub.text}</div>
              <div className="answer-boxes">
                {Array.from({length: sub.expectedAnswers}, (_, boxIndex) => (
                  <div 
                    key={boxIndex}
                    className={`answer-box ${userAnswers[index][boxIndex] ? 'filled' : 'empty'}`}
                    onClick={() => userAnswers[index][boxIndex] && handleAnswerClick(index, boxIndex)}
                  >
                    {userAnswers[index][boxIndex] || ''}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="current-question-indicator">
          {currentSubQuestion < 4 && (
            <p>Chọn một lựa chọn cho: <strong>{currentQuestion.subQuestions[currentSubQuestion].text}</strong></p>
          )}
        </div>

        <div className="option-list">
          {availableOptions.map((option, index) => (
            <span
              key={index}
              className={`word-item ${usedOptions.has(option) ? 'disabled' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </span>
          ))}
        </div>
      </div>

      {result && (
        <div className={`result ${result.includes('Đúng') ? 'correct' : 'incorrect'}`}>
          {result}
        </div>
      )}

      {showCorrect && (
        <div className="correct-answer">
          <h3>Đáp án đúng:</h3>
          {currentQuestion.subQuestions.map((sub, index) => (
            <div key={index}>
              <strong>{sub.text}:</strong> {currentQuestion.answers[index].join(', ')}
            </div>
          ))}
        </div>
      )}

      <div className="button-container">
        <button onClick={checkAnswer} className="check-button">
          Kiểm tra đáp án
        </button>
        <button onClick={resetQuestion} className="try-again-button">
          Thử lại
        </button>
      </div>
    </div>
  );
}

export default Part3;
