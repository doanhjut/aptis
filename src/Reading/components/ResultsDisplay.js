import React from 'react';
import './ResultsDisplay.css';
import { getScoreBreakdown } from '../utils/scoringUtils';

function ResultsDisplay({ part1Score, part2Score, part3Score, part4Score, onRestart }) {
  const breakdown = getScoreBreakdown(part1Score, part2Score, part3Score, part4Score);

  return (
    <div className="results-container">
      <div className="results-card">
        <h1 className="results-title">🎉 Test Completed!</h1>
        
        {/* Overall Score */}
        <div className="overall-score">
          <div className="score-circle" style={{ borderColor: breakdown.cefrColor }}>
            <div className="score-value">{breakdown.total.correct}/29</div>
            <div className="score-label">Correct Answers</div>
          </div>
          
          <div className="scale-score">
            <div className="scale-label">APTIS Scale Score</div>
            <div className="scale-value" style={{ color: breakdown.cefrColor }}>
              {breakdown.scaleScore}/50
            </div>
          </div>
        </div>

        {/* CEFR Level Badge */}
        <div className="cefr-badge" style={{ backgroundColor: breakdown.cefrColor }}>
          <div className="cefr-level">{breakdown.cefrLevel}</div>
          <div className="cefr-description">{breakdown.cefrDescription}</div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-label">
            Overall Progress: {breakdown.total.percentage}%
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${breakdown.total.percentage}%`,
                backgroundColor: breakdown.cefrColor 
              }}
            />
          </div>
        </div>

        {/* Breakdown by Part */}
        <div className="breakdown-section">
          <h2>Score Breakdown</h2>
          
          <div className="part-score">
            <div className="part-header">
              <span className="part-name">Part 1 - Matching</span>
              <span className="part-result">{breakdown.part1.correct}/{breakdown.part1.total}</span>
            </div>
            <div className="part-progress-bar">
              <div 
                className="part-progress-fill" 
                style={{ width: `${breakdown.part1.percentage}%` }}
              />
            </div>
          </div>

          <div className="part-score">
            <div className="part-header">
              <span className="part-name">Part 2 - Fill in the Blanks</span>
              <span className="part-result">{breakdown.part2.correct}/{breakdown.part2.total}</span>
            </div>
            <div className="part-progress-bar">
              <div 
                className="part-progress-fill" 
                style={{ width: `${breakdown.part2.percentage}%` }}
              />
            </div>
          </div>

          <div className="part-score">
            <div className="part-header">
              <span className="part-name">Part 3 - Sentence Matching</span>
              <span className="part-result">{breakdown.part3.correct}/{breakdown.part3.total}</span>
            </div>
            <div className="part-progress-bar">
              <div 
                className="part-progress-fill" 
                style={{ width: `${breakdown.part3.percentage}%` }}
              />
            </div>
          </div>

          <div className="part-score">
            <div className="part-header">
              <span className="part-name">Part 4 - Reading Comprehension</span>
              <span className="part-result">{breakdown.part4.correct}/{breakdown.part4.total}</span>
            </div>
            <div className="part-progress-bar">
              <div 
                className="part-progress-fill" 
                style={{ width: `${breakdown.part4.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button className="restart-button" onClick={onRestart}>
          Take Test Again
        </button>
      </div>
    </div>
  );
}

export default ResultsDisplay;
