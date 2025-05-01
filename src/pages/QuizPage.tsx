
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockQuizzes, mockArticles } from '@/data/mockData';
import { Quiz, Article, QuizQuestion } from '@/types';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export default function QuizPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Find the quiz and article
    const foundQuiz = mockQuizzes.find(q => q.articleId === articleId);
    const foundArticle = mockArticles.find(a => a.id === articleId);
    
    setQuiz(foundQuiz || null);
    setArticle(foundArticle || null);
  }, [articleId]);

  const handleOptionSelect = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    const currentQuestion = quiz?.questions[currentQuestionIndex];
    
    if (currentQuestion && optionIndex === currentQuestion.correctOptionIndex) {
      setScore(prev => prev + 1);
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
  };

  const handleNextQuestion = () => {
    if (!quiz) return;
    
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
      // Calculate final score as percentage
      const finalScore = Math.round((score / quiz.questions.length) * 100);
      
      toast({
        title: `Quiz completed!`,
        description: `Your score: ${finalScore}%`,
      });
    }
  };

  if (!quiz || !article) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 h-[60vh]">
        <p className="text-2xl font-semibold">Quiz not found</p>
        <Link to="/" className="text-primary hover:underline">
          Return to home
        </Link>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  if (quizCompleted) {
    const finalScore = Math.round((score / quiz.questions.length) * 100);
    
    return (
      <div className="py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Quiz Results</h1>
        
        <div className="bg-card rounded-lg p-6 shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-2 text-center">{article.title}</h2>
          
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
              You got <span className="font-bold">{score}</span> out of <span className="font-bold">{quiz.questions.length}</span> questions correct!
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={`/article/${article.id}`}>Review Article</Link>
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
          to={`/article/${article.id}`} 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to article
        </Link>
      </div>
      
      <h1 className="text-xl font-bold mb-1">Test Your Knowledge</h1>
      <h2 className="text-sm text-muted-foreground mb-4">
        {article.title}
      </h2>
      
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
          <span>Score: {score}/{quiz.questions.length}</span>
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
          {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'See Results'}
        </Button>
      </div>
    </div>
  );
}
