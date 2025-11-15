import React, { useState, useEffect } from 'react';

interface Exercise {
    id: number;
    name: string;
    duration: number; // in minutes
    difficulty: 'easy' | 'moderate' | 'hard';
    description: string;
    instructions: string[];
    benefits: string[];
    breathingFocus: boolean;
    caloriesBurned: number;
    icon: string;
}

interface MeditationSession {
    id: number;
    name: string;
    duration: number; // in minutes
    type: 'breathing' | 'mindfulness' | 'guided' | 'body-scan';
    description: string;
    instructions: string[];
    benefits: string[];
    icon: string;
}

interface CompletedSession {
    id: string;
    type: 'exercise' | 'meditation';
    name: string;
    duration: number;
    date: string;
    timestamp: string;
}

const exercises: Exercise[] = [
    {
        id: 1,
        name: 'Walking',
        duration: 30,
        difficulty: 'easy',
        description: 'Gentle walk at a comfortable pace to improve cardiovascular health',
        instructions: [
            'Start with a 5-minute warm-up at a slow pace',
            'Maintain a steady pace for 20-25 minutes',
            'Focus on deep, even breathing throughout',
            'End with a 5-minute cool-down walk',
        ],
        benefits: ['Improves lung capacity', 'Reduces stress', 'Low impact on joints'],
        breathingFocus: true,
        caloriesBurned: 150,
        icon: '🚶',
    },
    {
        id: 2,
        name: 'Gentle Yoga',
        duration: 25,
        difficulty: 'easy',
        description: 'Slow-paced yoga focusing on breathing and flexibility',
        instructions: [
            'Begin with child\'s pose for 1 minute',
            'Flow through cat-cow stretches (3 minutes)',
            'Practice forward bends and side stretches (10 minutes)',
            'End with relaxation pose (5 minutes)',
        ],
        benefits: ['Increases flexibility', 'Calms nervous system', 'Improves breathing'],
        breathingFocus: true,
        caloriesBurned: 120,
        icon: '🧘',
    },
    {
        id: 3,
        name: 'Swimming',
        duration: 30,
        difficulty: 'moderate',
        description: 'Excellent full-body exercise with water resistance',
        instructions: [
            'Warm up with easy laps for 5 minutes',
            'Swim at moderate intensity for 20 minutes',
            'Practice breathing technique with each stroke',
            'Cool down with gentle floating for 5 minutes',
        ],
        benefits: ['Builds endurance', 'Full-body workout', 'Easy on joints'],
        breathingFocus: true,
        caloriesBurned: 250,
        icon: '🏊',
    },
    {
        id: 4,
        name: 'Stretching',
        duration: 15,
        difficulty: 'easy',
        description: 'Basic stretching routine to improve flexibility and reduce tension',
        instructions: [
            'Neck rolls (1 minute)',
            'Shoulder stretches (2 minutes)',
            'Torso and side stretches (5 minutes)',
            'Leg stretches and hip flexor work (5 minutes)',
            'Cool down with deep breathing (2 minutes)',
        ],
        benefits: ['Reduces muscle tension', 'Improves flexibility', 'Promotes relaxation'],
        breathingFocus: true,
        caloriesBurned: 30,
        icon: '🤸',
    },
    {
        id: 5,
        name: 'Cycling',
        duration: 30,
        difficulty: 'moderate',
        description: 'Steady-paced cycling for cardiovascular health',
        instructions: [
            'Start with 5-minute warm-up at easy pace',
            'Maintain moderate intensity for 20 minutes',
            'Keep breathing steady and controlled',
            'Cool down with 5 minutes of easy cycling',
        ],
        benefits: ['Improves heart health', 'Low impact', 'Builds leg strength'],
        breathingFocus: true,
        caloriesBurned: 200,
        icon: '🚴',
    },
];

const meditations: MeditationSession[] = [
    {
        id: 1,
        name: '4-7-8 Breathing',
        duration: 10,
        type: 'breathing',
        description: 'Calming breathing technique to reduce anxiety and stress',
        instructions: [
            'Find a comfortable seated position',
            'Inhale through nose for count of 4',
            'Hold breath for count of 7',
            'Exhale through mouth for count of 8',
            'Repeat 5-10 times',
            'Rest and notice how you feel',
        ],
        benefits: ['Reduces anxiety', 'Lowers blood pressure', 'Improves sleep'],
        icon: '🫁',
    },
    {
        id: 2,
        name: 'Mindfulness Meditation',
        duration: 15,
        type: 'mindfulness',
        description: 'Focus on the present moment without judgment',
        instructions: [
            'Sit comfortably with spine straight',
            'Close eyes and focus on natural breathing',
            'Notice thoughts but let them pass without judgment',
            'Bring attention back to breath when mind wanders',
            'Continue for 15 minutes',
            'Slowly open eyes and sit quietly for a moment',
        ],
        benefits: ['Reduces stress', 'Improves focus', 'Enhances emotional balance'],
        icon: '🧠',
    },
    {
        id: 3,
        name: 'Body Scan',
        duration: 20,
        type: 'body-scan',
        description: 'Progressive relaxation through body awareness',
        instructions: [
            'Lie down in comfortable position',
            'Start at the top of your head',
            'Slowly move attention down through each body part',
            'Notice sensations without trying to change them',
            'Spend 1-2 minutes on each major area',
            'End with full body relaxation',
        ],
        benefits: ['Releases tension', 'Promotes relaxation', 'Improves body awareness'],
        icon: '😌',
    },
    {
        id: 4,
        name: 'Guided Breathing',
        duration: 12,
        type: 'breathing',
        description: 'Structured breathing exercise for asthma management',
        instructions: [
            'Sit upright in a comfortable position',
            'Breathe in slowly through nose for 5 seconds',
            'Hold for 3 seconds',
            'Exhale slowly through mouth for 7 seconds',
            'Pause for 2 seconds',
            'Repeat for 10-12 cycles',
        ],
        benefits: ['Strengthens respiratory muscles', 'Reduces asthma symptoms', 'Calms nervous system'],
        icon: '💨',
    },
    {
        id: 5,
        name: 'Loving-Kindness Meditation',
        duration: 15,
        type: 'guided',
        description: 'Cultivate compassion and positive emotions',
        instructions: [
            'Sit comfortably and close your eyes',
            'Repeat phrases like "May I be healthy"',
            'Extend wishes to loved ones',
            'Extend wishes to neutral people',
            'Extend wishes to difficult people',
            'Extend wishes to all beings',
        ],
        benefits: ['Increases self-compassion', 'Reduces stress', 'Improves relationships'],
        icon: '💚',
    },
];

interface ExerciseMeditationPageProps {
    onBack: () => void;
}

export const ExerciseMeditationPage: React.FC<ExerciseMeditationPageProps> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'exercises' | 'meditations' | 'history'>('exercises');
    const [selectedItem, setSelectedItem] = useState<Exercise | MeditationSession | null>(null);
    const [completedSessions, setCompletedSessions] = useState<CompletedSession[]>([]);
    const [startedSession, setStartedSession] = useState<{
        type: 'exercise' | 'meditation';
        item: Exercise | MeditationSession;
        startTime: number;
    } | null>(null);

    // Load completed sessions from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem('completedExerciseSessions');
            if (stored) {
                setCompletedSessions(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load completed sessions:', e);
        }
    }, []);

    const startSession = (type: 'exercise' | 'meditation', item: Exercise | MeditationSession) => {
        setStartedSession({
            type,
            item,
            startTime: Date.now(),
        });
    };

    const completeSession = () => {
        if (!startedSession) return;

        const newSession: CompletedSession = {
            id: Date.now().toString(),
            type: startedSession.type,
            name: startedSession.item.name,
            duration: startedSession.item.duration,
            date: new Date().toLocaleDateString(),
            timestamp: new Date().toISOString(),
        };

        const updated = [...completedSessions, newSession];
        setCompletedSessions(updated);
        localStorage.setItem('completedExerciseSessions', JSON.stringify(updated));

        setStartedSession(null);
        setSelectedItem(null);
    };

    const skipSession = () => {
        setStartedSession(null);
    };

    if (startedSession) {
        const duration = startedSession.item.duration;
        const instructions = startedSession.item.type === 'breathing' || startedSession.item.type === 'mindfulness' || startedSession.item.type === 'guided' || startedSession.item.type === 'body-scan'
            ? (startedSession.item as MeditationSession).instructions
            : (startedSession.item as Exercise).instructions;

        return (
            <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-slate-50 to-teal-50 p-6">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">{startedSession.item.icon}</div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">
                                {startedSession.item.name}
                            </h1>
                            <p className="text-slate-600 mb-4">{duration} minutes</p>

                            <div className="inline-block bg-teal-100 text-teal-700 px-4 py-2 rounded-full text-sm font-medium">
                                ▶️ Session in Progress
                            </div>
                        </div>

                        <div className="bg-slate-50 rounded-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Instructions:</h2>
                            <ol className="space-y-3">
                                {instructions.map((instruction, idx) => (
                                    <li key={idx} className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500 text-white flex items-center justify-center text-sm font-medium">
                                            {idx + 1}
                                        </span>
                                        <span className="text-slate-700">{instruction}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {'benefits' in startedSession.item && (
                                <div className="bg-green-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-green-900 mb-2">✓ Benefits</h3>
                                    <ul className="text-sm text-green-800 space-y-1">
                                        {startedSession.item.benefits.map((benefit, idx) => (
                                            <li key={idx}>• {benefit}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {'breathingFocus' in startedSession.item && startedSession.item.breathingFocus && (
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-blue-900 mb-2">🫁 Breathing Focus</h3>
                                    <p className="text-sm text-blue-800">This exercise emphasizes proper breathing technique</p>
                                </div>
                            )}
                            {'caloriesBurned' in startedSession.item && (
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-orange-900 mb-2">🔥 Calories</h3>
                                    <p className="text-sm text-orange-800">{startedSession.item.caloriesBurned} calories burned</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={completeSession}
                                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                            >
                                ✓ Complete Session
                            </button>
                            <button
                                onClick={skipSession}
                                className="flex-1 px-6 py-3 bg-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-400 transition"
                            >
                                ⊗ Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-slate-50 to-teal-50 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={onBack}
                        className="mb-4 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition"
                    >
                        ← Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">🏋️ Exercise & Meditation</h1>
                    <p className="text-slate-600">Improve your asthma control through exercise and mindfulness practices</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-4 mb-8 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('exercises')}
                        className={`px-6 py-3 font-semibold transition border-b-2 ${
                            activeTab === 'exercises'
                                ? 'text-teal-600 border-teal-600'
                                : 'text-slate-600 border-transparent hover:text-slate-900'
                        }`}
                    >
                        💪 Exercises
                    </button>
                    <button
                        onClick={() => setActiveTab('meditations')}
                        className={`px-6 py-3 font-semibold transition border-b-2 ${
                            activeTab === 'meditations'
                                ? 'text-teal-600 border-teal-600'
                                : 'text-slate-600 border-transparent hover:text-slate-900'
                        }`}
                    >
                        🧘 Meditations
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-3 font-semibold transition border-b-2 ${
                            activeTab === 'history'
                                ? 'text-teal-600 border-teal-600'
                                : 'text-slate-600 border-transparent hover:text-slate-900'
                        }`}
                    >
                        📊 History
                    </button>
                </div>

                {/* Exercises Tab */}
                {activeTab === 'exercises' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exercises.map((exercise) => (
                            <div
                                key={exercise.id}
                                onClick={() => setSelectedItem(exercise)}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-teal-400 to-cyan-400 p-6 text-center">
                                    <div className="text-5xl mb-2">{exercise.icon}</div>
                                    <h2 className="text-xl font-bold text-white">{exercise.name}</h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-slate-600 text-sm mb-4">{exercise.description}</p>

                                    <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                                        <div className="bg-blue-50 rounded p-2 text-center">
                                            <div className="font-semibold text-blue-900">{exercise.duration}</div>
                                            <div className="text-xs text-blue-700">minutes</div>
                                        </div>
                                        <div className="bg-amber-50 rounded p-2 text-center">
                                            <div className="font-semibold text-amber-900 capitalize">{exercise.difficulty}</div>
                                            <div className="text-xs text-amber-700">difficulty</div>
                                        </div>
                                        <div className="bg-orange-50 rounded p-2 text-center">
                                            <div className="font-semibold text-orange-900">{exercise.caloriesBurned}</div>
                                            <div className="text-xs text-orange-700">calories</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startSession('exercise', exercise);
                                        }}
                                        className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
                                    >
                                        Start Exercise
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Meditations Tab */}
                {activeTab === 'meditations' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {meditations.map((meditation) => (
                            <div
                                key={meditation.id}
                                onClick={() => setSelectedItem(meditation)}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-purple-400 to-pink-400 p-6 text-center">
                                    <div className="text-5xl mb-2">{meditation.icon}</div>
                                    <h2 className="text-xl font-bold text-white">{meditation.name}</h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-slate-600 text-sm mb-4">{meditation.description}</p>

                                    <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                                        <div className="bg-purple-50 rounded p-2 text-center">
                                            <div className="font-semibold text-purple-900">{meditation.duration}</div>
                                            <div className="text-xs text-purple-700">minutes</div>
                                        </div>
                                        <div className="bg-pink-50 rounded p-2 text-center">
                                            <div className="font-semibold text-pink-900 capitalize">{meditation.type}</div>
                                            <div className="text-xs text-pink-700">type</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startSession('meditation', meditation);
                                        }}
                                        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
                                    >
                                        Start Meditation
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Completed Sessions</h2>

                        {completedSessions.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">📭</div>
                                <p className="text-slate-600 text-lg">No sessions completed yet. Start your first session!</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Summary Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                    <div className="bg-teal-50 rounded-lg p-4">
                                        <div className="text-3xl font-bold text-teal-600">{completedSessions.length}</div>
                                        <div className="text-sm text-teal-700">Total Sessions</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="text-3xl font-bold text-blue-600">
                                            {completedSessions.reduce((sum, s) => sum + s.duration, 0)}
                                        </div>
                                        <div className="text-sm text-blue-700">Total Minutes</div>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <div className="text-3xl font-bold text-green-600">
                                            {new Set(completedSessions.map(s => s.date)).size}
                                        </div>
                                        <div className="text-sm text-green-700">Days Active</div>
                                    </div>
                                </div>

                                {/* Sessions List */}
                                <div className="border-t border-slate-200 pt-6">
                                    {completedSessions.slice().reverse().map((session) => (
                                        <div key={session.id} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                                            <div className="flex items-center gap-4">
                                                <div className="text-3xl">
                                                    {session.type === 'exercise' ? '💪' : '🧘'}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-slate-900">{session.name}</h3>
                                                    <p className="text-sm text-slate-500">{session.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-slate-900">{session.duration} min</div>
                                                <div className="text-sm text-slate-500">{session.type}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
