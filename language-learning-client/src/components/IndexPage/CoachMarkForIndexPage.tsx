import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Move } from 'lucide-react';

// Coach Mark Component with Smart Positioning and Draggable functionality
const CoachMark = ({ step, totalSteps, onNext, onPrev, onSkip, onFinish }: {
  step: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onFinish: () => void;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const coachMarkRef = useRef<HTMLDivElement>(null);
  const steps = [
    {
      title: "Welcome to Your Language Learning Journey! 🎉",
      content: "Let's take a quick tour to help you master this powerful translation and vocabulary building tool. This tour will show you all the key features in just a few minutes!",
      position: "center",
      highlight: null
    },
    {
      title: "Language Selection Hub",
      content: "Start here! Click the left dropdown to choose your source language (Finnish, Korean, Chinese, Vietnamese, Greek). The arrow shows translation direction - always ending in English for now.",
      position: "bottom-center",
      highlight: "translation-bar"
    },
    {
      title: "Smart Text Input Area",
      content: "Enter any sentence or phrase here. Pro tip: Complete sentences give better context and more accurate translations. Use the Speak button to hear pronunciation!",
      position: "top-center",
      highlight: "input-bar"
    },
    {
      title: "Beautiful Translation Display",
      content: "Your translated text appears here in an elegant, easy-to-read format. Perfect for quick reference, studying, or sharing with others!",
      position: "top-center",
      highlight: "translation"
    },
    {
      title: "Interactive Word Analysis",
      content: "This is where the magic happens! Every word gets categorized (verbs, nouns, adjectives, etc.). Click any word to see pronunciation, detailed explanations, and save it to your vocabulary deck!",
      position: "top-center",
      highlight: "word-details"
    },
    {
      title: "Your Personal Profile Center",
      content: "Register or log in here to unlock the full power of the app. Save your vocabulary, track progress, create custom decks, and sync across devices. Your learning journey starts here!",
      position: "left",
      highlight: "user-section"
    },
    {
      title: "Vocabulary Deck Management",
      content: "Your flashcard decks live here! See progress percentages, card counts, creation dates, and quick access to detailed views. Perfect for tracking your learning journey across different languages.",
      position: "left",
      highlight: "deck-info"
    },
    {
      title: "You're Ready to Master Languages! 🚀",
      content: "That's the complete tour! Start by selecting a language and typing your first sentence. Every word you translate can become part of your personal vocabulary collection. Ready to become fluent?",
      position: "center",
      highlight: null
    }
  ];

  const currentStep = steps[step];

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.drag-handle') || target.classList.contains('drag-handle')) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Keep within viewport bounds with some padding
      const padding = 20;
      const rect = coachMarkRef.current?.getBoundingClientRect();
      if (rect) {
        const maxX = window.innerWidth - rect.width - padding;
        const maxY = window.innerHeight - rect.height - padding;
        
        setPosition({
          x: Math.max(padding, Math.min(newX, maxX)),
          y: Math.max(padding, Math.min(newY, maxY))
        });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for mouse events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, position]);

  // Only set initial position on first load, don't reset when step changes if user has moved it
  useEffect(() => {
    const getSmartPosition = () => {
      switch (currentStep.position) {
        case 'center':
          return { x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 150 };
        case 'bottom-center':
          return { x: window.innerWidth / 2 - 200, y: window.innerHeight / 3 };
        case 'top-center':
          return { x: window.innerWidth / 2 - 200, y: window.innerHeight * 0.75 - 300 };
        case 'left':
          return { x: 32, y: window.innerHeight / 2 - 150 };
        case 'right':
          return { x: window.innerWidth - 432, y: window.innerHeight / 2 - 150 };
        default:
          return { x: window.innerWidth - 432, y: 32 };
      }
    };
    
    // Only set position on the very first step, let user control it afterwards
    if (step === 0) {
      setPosition(getSmartPosition());
    }
  }, [step, currentStep.position]);

  const getPositionStyle = () => {
    return {
      position: 'fixed' as const,
      left: `${position.x}px`,
      top: `${position.y}px`,
      zIndex: 50,
      maxWidth: '400px',
      cursor: isDragging ? 'grabbing' : 'auto'
    };
  };

  return (
    <>
      {/* Smart Overlay */}
      <div className="fixed inset-0 z-40">
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>
      
      {/* Coach Mark with Smart Positioning and Draggable */}
      <div
        ref={coachMarkRef}
        style={getPositionStyle()}
        onMouseDown={handleMouseDown}
      >
        <div className={`bg-white rounded-xl shadow-2xl border-2 ${isDragging ? 'border-blue-600 shadow-3xl' : 'border-blue-500'} relative overflow-hidden select-none transition-shadow duration-200`}>
          {/* Gradient Header with Drag Handle */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className={`drag-handle ${isDragging ? 'cursor-grabbing' : 'cursor-grab hover:cursor-grabbing'} p-2 rounded hover:bg-white hover:bg-opacity-20 transition-colors select-none`}
                  title="Drag to move dialog"
                >
                  <Move className="w-4 h-4 text-white" />
                </div>
                <div className="text-white font-semibold">
                  Language Learning Tour
                </div>
              </div>
              <button
                onClick={onSkip}
                className="text-white hover:text-gray-200 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              />
            </div>
            
            <div className="mt-2 text-white text-sm opacity-90">
              Step {step + 1} of {totalSteps}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              {currentStep.title}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed text-base">
              {currentStep.content}
            </p>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <button
                onClick={onSkip}
                className="text-gray-500 hover:text-gray-700 font-medium transition-colors px-3 py-2"
              >
                Skip Tour
              </button>
              
              <div className="flex space-x-3">
                {step > 0 && (
                  <button
                    onClick={onPrev}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors border rounded-lg hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </button>
                )}
                
                {step < totalSteps - 1 ? (
                  <button
                    onClick={onNext}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                ) : (
                  <button
                    onClick={onFinish}
                    className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
                  >
                    Start Learning!
                    <Play className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Main Onboarding Component
export const CoachMarkForIndexPage = ({ 
  showOnboarding, 
  onFinish 
}: {
  showOnboarding: boolean;
  onFinish: () => void;
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  const totalSteps = 8;

  useEffect(() => {
    const stepHighlights = [
      null, 'translation-bar', 'input-bar', 'translation', 
      'word-details', 'user-section', 'deck-info', null
    ];
    setHighlightedElement(stepHighlights[currentStep]);
  }, [currentStep]);

  useEffect(() => {
    if (showOnboarding) {
      // Add highlight classes to elements
      const elementId = highlightedElement;
      if (elementId) {
        const element = document.getElementById(elementId);
        if (element) {
          element.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-75', 'bg-blue-50', 'rounded-lg', 'transition-all', 'duration-300', 'shadow-lg');
        }
      }

      // Cleanup function to remove highlights
      return () => {
        const allHighlightableElements = ['translation-bar', 'input-bar', 'translation', 'word-details', 'user-section', 'deck-info'];
        allHighlightableElements.forEach(id => {
          const element = document.getElementById(id);
          if (element) {
            element.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-75', 'bg-blue-50', 'rounded-lg', 'transition-all', 'duration-300', 'shadow-lg');
          }
        });
      };
    }
  }, [highlightedElement, showOnboarding]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setCurrentStep(0);
    setHighlightedElement(null);
    onFinish();
  };

  const handleFinishTour = () => {
    setCurrentStep(0);
    setHighlightedElement(null);
    onFinish();
  };

  if (!showOnboarding) {
    return null;
  }

  return (
    <CoachMark
      step={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrev={handlePrev}
      onSkip={handleSkip}
      onFinish={handleFinishTour}
    />
  );
};
