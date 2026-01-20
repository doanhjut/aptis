/**
 * APTIS Reading Scoring Utilities
 * Converts raw scores (0-26) to British Council scale (0-50) and CEFR levels
 */

/**
 * Convert raw score to APTIS scale score (0-50)
 * @param {number} correctAnswers - Number of correct answers
 * @param {number} totalQuestions - Total number of questions (default: 29)
 * @returns {number} Scale score (0-50)
 */
export const convertToScaleScore = (correctAnswers, totalQuestions = 29) => {
  // Linear conversion: (correctAnswers / totalQuestions) * 50
  const scaleScore = Math.round((correctAnswers / totalQuestions) * 50);
  return Math.max(0, Math.min(50, scaleScore)); // Clamp between 0-50
};

/**
 * Get CEFR level based on scale score
 * @param {number} scaleScore - Scale score (0-50)
 * @returns {string} CEFR level
 */
export const getCEFRLevel = (scaleScore) => {
  if (scaleScore >= 43) return 'C';
  if (scaleScore >= 34) return 'B2';
  if (scaleScore >= 26) return 'B1';
  if (scaleScore >= 17) return 'A2';
  if (scaleScore >= 9) return 'A1';
  return 'A0';
};

/**
 * Get CEFR level description
 * @param {string} level - CEFR level
 * @returns {string} Description
 */
export const getCEFRDescription = (level) => {
  const descriptions = {
    'C': 'Proficient User (C1-C2)',
    'B2': 'Upper Intermediate',
    'B1': 'Intermediate',
    'A2': 'Elementary',
    'A1': 'Beginner',
    'A0': 'Pre-Beginner'
  };
  return descriptions[level] || 'Unknown';
};

/**
 * Get color for CEFR level
 * @param {string} level - CEFR level
 * @returns {string} Color code
 */
export const getCEFRColor = (level) => {
  const colors = {
    'C': '#28a745',   // Green
    'B2': '#17a2b8',  // Cyan
    'B1': '#007bff',  // Blue
    'A2': '#ffc107',  // Yellow
    'A1': '#fd7e14',  // Orange
    'A0': '#dc3545'   // Red
  };
  return colors[level] || '#6c757d';
};

/**
 * Calculate detailed score breakdown
 * @param {number} part1Score - Part 1 correct answers (max 5)
 * @param {number} part2Score - Part 2 correct answers (max 10)
 * @param {number} part3Score - Part 3 correct answers (max 7)
 * @param {number} part4Score - Part 4 correct answers (max 7)
 * @returns {object} Score breakdown
 */
export const getScoreBreakdown = (part1Score, part2Score, part3Score, part4Score) => {
  const totalCorrect = part1Score + part2Score + part3Score + part4Score;
  const scaleScore = convertToScaleScore(totalCorrect);
  const cefrLevel = getCEFRLevel(scaleScore);
  
  return {
    part1: { correct: part1Score, total: 5, percentage: Math.round((part1Score / 5) * 100) },
    part2: { correct: part2Score, total: 10, percentage: Math.round((part2Score / 10) * 100) },
    part3: { correct: part3Score, total: 7, percentage: Math.round((part3Score / 7) * 100) },
    part4: { correct: part4Score, total: 7, percentage: Math.round((part4Score / 7) * 100) },
    total: {
      correct: totalCorrect,
      total: 29,
      percentage: Math.round((totalCorrect / 29) * 100)
    },
    scaleScore,
    cefrLevel,
    cefrDescription: getCEFRDescription(cefrLevel),
    cefrColor: getCEFRColor(cefrLevel)
  };
};
