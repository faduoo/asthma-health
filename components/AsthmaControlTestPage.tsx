import React, { useState } from 'react';
import CompanyLogo from './CompanyLogo';
import lungsLogo from '../lungs.png';

interface ACTAnswer {
    question: number;
    answer: number;
}

export const AsthmaControlTestPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<ACTAnswer[]>([]);
    const [showResults, setShowResults] = useState(false);

    const questions = [
        {
            id: 1,
            question: 'During the past 4 weeks, how much of the time did your asthma keep you from getting as much done at work, school, or at home?',
            options: [
                { label: 'All of the time', value: 1 },
                { label: 'Most of the time', value: 2 },
                { label: 'Some of the time', value: 3 },
                { label: 'A little of the time', value: 4 },
                { label: 'None of the time', value: 5 }
            ]
        },
        {
            id: 2,
            question: 'During the past 4 weeks, how often have you had shortness of breath?',
            options: [
                { label: 'More than once per day', value: 1 },
                { label: 'Once per day', value: 2 },
                { label: '3 to 6 times per week', value: 3 },
                { label: 'Once or twice per week', value: 4 },
                { label: 'Not at all', value: 5 }
            ]
        },
        {
            id: 3,
            question: 'During the past 4 weeks, how often did your asthma symptoms (wheezing, coughing, shortness of breath, chest tightness or pain) wake you up at night or earlier than usual in the morning?',
            options: [
                { label: '4 or more nights per week', value: 1 },
                { label: '2 to 3 nights per week', value: 2 },
                { label: 'Once per week', value: 3 },
                { label: 'Once or twice per month', value: 4 },
                { label: 'Not at all', value: 5 }
            ]
        },
        {
            id: 4,
            question: 'During the past 4 weeks, how often have you used your rescue inhaler or nebulizer medication (such as albuterol)?',
            options: [
                { label: '4 or more times per day', value: 1 },
                { label: '2 to 3 times per day', value: 2 },
                { label: 'Once per day', value: 3 },
                { label: '2 to 3 times per week or less', value: 4 },
                { label: 'Not at all', value: 5 }
            ]
        },
        {
            id: 5,
            question: 'If you used your rescue inhaler, how would you rate your asthma control?',
            options: [
                { label: 'Not controlled at all', value: 1 },
                { label: 'Poorly controlled', value: 2 },
                { label: 'Somewhat controlled', value: 3 },
                { label: 'Well controlled', value: 4 },
                { label: 'Completely controlled', value: 5 }
            ]
        }
    ];

    const handleAnswerSelect = (value: number) => {
        const newAnswers = answers.filter(a => a.question !== currentQuestion + 1);
        setAnswers([...newAnswers, { question: currentQuestion + 1, answer: value }]);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResults(true);
        }
    };

    const calculateScore = () => {
        return answers.reduce((sum, a) => sum + a.answer, 0);
    };

    const getControlLevel = (score: number) => {
        if (score >= 20) return { level: 'Well Controlled', color: 'green', icon: '✓', description: 'Your asthma is well controlled. Continue with your current treatment plan and maintain regular check-ups.' };
        if (score >= 16) return { level: 'Not Well Controlled', color: 'amber', icon: '⚠', description: 'Your asthma control could be improved. Schedule a consultation with your doctor to adjust your treatment plan.' };
        return { level: 'Very Poorly Controlled', color: 'red', icon: '✕', description: 'Your asthma requires immediate attention. Contact your healthcare provider urgently to discuss your treatment options.' };
    };

    const score = calculateScore();
    const controlStatus = getControlLevel(score);

    if (showResults) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-slate-50 to-teal-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
                    <div className="max-w-4xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <button 
                                onClick={onBack}
                                className="px-4 py-2 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                ← Back to Dashboard
                            </button>
                            <div className="flex items-center space-x-3">
                                <CompanyLogo src={lungsLogo} className="h-8 w-8" alt="Asthma Health" />
                                <h1 className="text-2xl font-bold text-slate-900">ACT Results</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
                    {/* Results Card */}
                    <div className={`bg-white rounded-xl shadow-lg border-2 overflow-hidden ${
                        controlStatus.color === 'green' ? 'border-green-400' :
                        controlStatus.color === 'amber' ? 'border-amber-400' :
                        'border-red-400'
                    }`}>
                        {/* Score Header */}
                        <div className={`bg-gradient-to-r ${
                            controlStatus.color === 'green' ? 'from-green-500 to-emerald-600' :
                            controlStatus.color === 'amber' ? 'from-amber-500 to-orange-600' :
                            'from-red-500 to-rose-600'
                        } px-8 py-12 text-center text-white`}>
                            <p className="text-lg font-bold opacity-90 mb-4">Your ACT Score</p>
                            <p className="text-6xl font-black mb-4">{score}/25</p>
                            <p className="text-2xl font-bold">{controlStatus.level}</p>
                        </div>

                        {/* Interpretation */}
                        <div className="px-8 py-8 space-y-6">
                            {/* Status Indicator */}
                            <div className={`rounded-lg p-6 ${
                                controlStatus.color === 'green' ? 'bg-green-50 border border-green-300' :
                                controlStatus.color === 'amber' ? 'bg-amber-50 border border-amber-300' :
                                'bg-red-50 border border-red-300'
                            }`}>
                                <div className="flex items-start space-x-4">
                                    <span className={`text-5xl flex-shrink-0 ${
                                        controlStatus.color === 'green' ? 'text-green-600' :
                                        controlStatus.color === 'amber' ? 'text-amber-600' :
                                        'text-red-600'
                                    }`}>
                                        {controlStatus.icon}
                                    </span>
                                    <div>
                                        <h3 className={`text-xl font-bold mb-2 ${
                                            controlStatus.color === 'green' ? 'text-green-900' :
                                            controlStatus.color === 'amber' ? 'text-amber-900' :
                                            'text-red-900'
                                        }`}>
                                            What This Means
                                        </h3>
                                        <p className={`text-sm leading-relaxed ${
                                            controlStatus.color === 'green' ? 'text-green-800' :
                                            controlStatus.color === 'amber' ? 'text-amber-800' :
                                            'text-red-800'
                                        }`}>
                                            {controlStatus.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Score Breakdown */}
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Your Answers</h3>
                                <div className="space-y-4">
                                    {questions.map((q, idx) => {
                                        const answer = answers.find(a => a.question === q.id);
                                        const selectedOption = q.options.find(o => o.value === answer?.answer);
                                        return (
                                            <div key={q.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                                                <div className="flex items-start justify-between mb-2">
                                                    <p className="font-semibold text-slate-900 flex-1">{q.question}</p>
                                                    <span className={`ml-4 px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap ${
                                                        answer && answer.answer >= 4 ? 'bg-green-100 text-green-800' :
                                                        answer && answer.answer >= 3 ? 'bg-amber-100 text-amber-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {answer?.answer || 0} pts
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-700 font-semibold">{selectedOption?.label}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
                                <h3 className="text-lg font-bold text-blue-900 mb-4">Recommendations</h3>
                                <ul className="space-y-3 text-sm text-blue-800">
                                    {score >= 20 ? (
                                        <>
                                            <li className="flex items-start space-x-3">
                                                <span className="text-xl">✓</span>
                                                <span>Continue taking your asthma medications as prescribed</span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <span className="text-xl">✓</span>
                                                <span>Schedule routine check-ups with your healthcare provider</span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <span className="text-xl">✓</span>
                                                <span>Monitor your symptoms regularly using this app</span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <span className="text-xl">✓</span>
                                                <span>Maintain your asthma action plan</span>
                                            </li>
                                        </>
                                    ) : score >= 16 ? (
                                        <>
                                            <li className="flex items-start space-x-3">
                                                <span className="text-xl">⚠</span>
                                                <span>Schedule an appointment with your doctor to review your asthma control</span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <span className="text-xl">⚠</span>
                                                <span>Your current treatment plan may need adjustment</span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <span className="text-xl">⚠</span>
                                                <span>Keep a symptom diary to share with your healthcare provider</span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <span className="text-xl">⚠</span>
                                                <span>Review your asthma triggers and try to avoid them</span>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li className="flex items-start space-x-3">
                                                <span className="text-xl">✕</span>
                                                <span><strong>Contact your healthcare provider immediately</strong></span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <span className="text-xl">✕</span>
                                                <span>Your asthma may require a significant change in treatment</span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <span className="text-xl">✕</span>
                                                <span>If experiencing severe symptoms, call 911 or go to the ER</span>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={() => {
                                        setCurrentQuestion(0);
                                        setAnswers([]);
                                        setShowResults(false);
                                    }}
                                    className="flex-1 px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition-colors"
                                >
                                    Retake Test
                                </button>
                                <button
                                    onClick={onBack}
                                    className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">About the ACT</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                            The Asthma Control Test (ACT) is a 5-question assessment that helps you and your healthcare provider determine how well your asthma is controlled. A score of 20 or higher indicates that your asthma is well controlled. Scores of 16–19 suggest your asthma is not well controlled, and scores below 16 indicate very poor control.
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            <strong>Note:</strong> This test is designed to complement, not replace, professional medical advice. Always consult with your healthcare provider about your asthma management plan.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-slate-50 to-teal-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button 
                            onClick={onBack}
                            className="px-4 py-2 text-slate-700 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            ← Back
                        </button>
                        <div className="flex items-center space-x-3">
                            <CompanyLogo src={lungsLogo} className="h-8 w-8" alt="Asthma Health" />
                            <h1 className="text-2xl font-bold text-slate-900">Asthma Control Test</h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-bold text-slate-900">
                            Question {currentQuestion + 1} of {questions.length}
                        </h2>
                        <span className="text-sm font-semibold text-slate-600">
                            {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                        </span>
                    </div>
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-300"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-6 text-white">
                        <h3 className="text-2xl font-bold leading-relaxed">
                            {questions[currentQuestion].question}
                        </h3>
                    </div>

                    <div className="p-8 space-y-4">
                        {questions[currentQuestion].options.map((option) => {
                            const isSelected = answers.find(a => a.question === currentQuestion + 1)?.answer === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleAnswerSelect(option.value)}
                                    className={`w-full p-4 rounded-lg border-2 font-semibold text-left transition-all ${
                                        isSelected
                                            ? 'bg-teal-100 border-teal-500 text-teal-900'
                                            : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                            isSelected ? 'bg-teal-500 border-teal-500' : 'border-slate-400'
                                        }`}>
                                            {isSelected && <span className="text-white text-sm font-bold">✓</span>}
                                        </div>
                                        <span>{option.label}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Navigation */}
                    <div className="bg-slate-50 px-8 py-6 flex gap-4">
                        <button
                            disabled={currentQuestion === 0}
                            onClick={() => setCurrentQuestion(currentQuestion - 1)}
                            className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            ← Previous
                        </button>
                        <button
                            disabled={!answers.find(a => a.question === currentQuestion + 1)}
                            onClick={() => {
                                if (currentQuestion < questions.length - 1) {
                                    setCurrentQuestion(currentQuestion + 1);
                                } else {
                                    setShowResults(true);
                                }
                            }}
                            className="flex-1 px-4 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {currentQuestion === questions.length - 1 ? 'See Results' : 'Next →'}
                        </button>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="mt-8 bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
                    <p className="text-sm text-blue-900">
                        <strong>ℹ️ About this test:</strong> The Asthma Control Test (ACT) is a simple 5-question assessment designed to help you and your doctor monitor how well your asthma is controlled. It takes about 2 minutes to complete.
                    </p>
                </div>
            </div>
        </div>
    );
};
