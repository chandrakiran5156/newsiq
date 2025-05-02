
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Quiz, Article, QuizQuestion } from '@/types';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { fetchArticleById, fetchQuizByArticleId, submitQuizAttempt } from '@/lib/api';
import { mockQuizzes, mockArticles } from '@/data/mockData'; // Fallback
import { useAuth } from '@/lib/supabase-auth';

export default function QuizPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch article data
  const { data: article, isLoading: isArticleLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => articleId ? fetchArticleById(articleId) : Promise.reject('No article ID'),
    onError: () => {
      console.error('Failed to fetch article, using mock data');
    }
  });

  // Fetch quiz data
  const { data: quiz, isLoading: isQuizLoading } = useQuery({
    queryKey: ['quiz', articleId],
    queryFn: () => articleId ? fetchQuizByArticleId(articleId) : Promise.reject('No article ID'),
    onError: () => {
      console.error('Failed to fetch quiz, using mock data');
    }
  });

  // Submit quiz attempt mutation
  const { mutate: submitQuiz, isPending: isSubmitting } = useMutation({
    mutationFn: () => {
      if (!user || !quiz) return Promise.reject('Not authenticated or no quiz data');
      return submitQuizAttempt(
        user.id,
        quiz.id,
        Math.round((score / quiz.questions.length) * 100),
        answers
      );
    },
    onSuccess: () => {
      toast({
        title: "Quiz completed!",
        description: "Your results have been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving quiz results",
        description: String(error),
        variant: "destructive"
      });
    }
  });

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    const currentQuestion = currentQuestions[currentQuestionIndex];
    let isCorrect = false;
    
    if (currentQuestion && optionIndex === currentQuestion.correctOptionIndex) {
      setScore(prev => prev + 1);
      isCorrect = true;
      toast({
        title: "Correct!",
        description: currentQuestion.explanation,
      });
    } else {
      toast({
        title: "Incorrect",
        description: currentQuestion?.explanation,
        variant: "destructive",
      });
    }

    // Save answer for submission
    setAnswers(prev => [
      ...prev, 
      {
        questionId: currentQuestion.id,
        selectedOptionIndex: optionIndex,
        isCorrect
      }
    ]);
  };

  const handleNextQuestion = () => {
    if (!currentQuestions) return;
    
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      
      // If authenticated, submit the quiz results
      if (user) {
        submitQuiz();
      }
    }
  };

  // Fallback to mock data if API fails
  const fallbackArticle = articleId ? mockArticles.find(a => a.id === articleId) : null;
  const fallbackQuiz = articleId ? mockQuizzes.find(q => q.articleId === articleId) : null;
  
  const currentArticle = article || fallbackArticle;
  const currentQuiz = quiz || fallbackQuiz;
  const currentQuestions = currentQuiz?.questions || [];
  
  const isLoading = isArticleLoading || isQuizLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 h-[60vh]">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground">Loading quiz...</p>
      </div>
    );
  }

  if (!currentArticle || !currentQuiz) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 h-[60vh]">
        <p className="text-2xl font-semibold">Quiz not found</p>
        <Button onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    );
  }

  const currentQuestion = currentQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;

  if (quizCompleted) {
    const finalScore = Math.round((score / currentQuestions.length) * 100);
    
    return (
      <div className="py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Quiz Results</h1>
        
        <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-2 text-center">{currentArticle.title}</h2>
          
          <div className="flex flex-col items-center justify-center my-8">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{finalScore}%</span>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  className="text-muted" 
                  strokeWidth="10" 
                />
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke="currentColor"
                  className="text-primary"
                  strokeWidth="10"
                  strokeDasharray={`${finalScore * 2.83} 283`}
                  strokeDashoffset="0"
                  transform="rotate(-90, 50, 50)"
                />
              </svg>
            </div>
            <p className="text-lg mt-4">
              You got <span className="font-bold">{score}</span> out of <span className="font-bold">{currentQuestions.length}</span> questions correct!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/article/${currentArticle.id}`}>Review Article</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4">
      <div className="mb-4">
        <Link 
          to={`/article/${currentArticle.id}`} 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to article
        </Link>
      </div>
      
      <h1 className="text-xl font-bold mb-1">Test Your Knowledge</h1>
      <h2 className="text-sm text-muted-foreground mb-4">
        {currentArticle.title}
      </h2>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Question {currentQuestionIndex + 1} of {currentQuestions.length}</span>
          <span>Score: {score}/{currentQuestions.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="bg-card rounded-lg p-6 shadow-sm mb-6 animate-fade-in">
        <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
        
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={isAnswered}
              className={`w-full p-4 text-left rounded-lg border transition-all ${
                isAnswered
                  ? index === currentQuestion.correctOptionIndex
                    ? 'bg-green-100 border-green-500 dark:bg-green-900/20 dark:border-green-500'
                    : selectedOption === index
                    ? 'bg-red-100 border-red-500 dark:bg-red-900/20 dark:border-red-500'
                    : 'bg-card border-border'
                  : 'bg-card border-border hover:border-primary hover:bg-accent'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-1">{option}</div>
                {isAnswered && index === currentQuestion.correctOptionIndex && (
                  <span className="text-green-500 ml-2">
                    <Check size={20} />
                  </span>
                )}
                {isAnswered && selectedOption === index && index !== currentQuestion.correctOptionIndex && (
                  <span className="text-red-500 ml-2">
                    <X size={20} />
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleNextQuestion} 
          disabled={!isAnswered}
        >
          {currentQuestionIndex < currentQuestions.length - 1 ? 'Next Question' : 'See Results'}
        </Button>
      </div>
    </div>
  );
}
