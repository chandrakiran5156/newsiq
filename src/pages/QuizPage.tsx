
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft,
  Award,
  Check,
  CircleX,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/lib/supabase-auth';
import { fetchArticleById, fetchQuizByArticleId, submitQuizAttempt } from '@/lib/api';
import { QuizQuestion } from '@/types';

export default function QuizPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answers, setAnswers] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Fetch article
  const { data: article, isLoading: isArticleLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => articleId ? fetchArticleById(articleId) : Promise.reject('No article ID'),
    enabled: !!articleId,
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch article:', error);
        toast({
          title: 'Error',
          description: 'Failed to load article details.',
          variant: 'destructive',
        });
      }
    }
  });

  // Fetch quiz with improved error handling
  const { data: quiz, isLoading: isQuizLoading } = useQuery({
    queryKey: ['quiz', articleId],
    queryFn: () => articleId ? fetchQuizByArticleId(articleId) : Promise.reject('No article ID'),
    enabled: !!articleId,
    staleTime: 300000, // Cache quiz data for 5 minutes
    meta: {
      onError: (error: Error) => {
        console.error('Failed to fetch quiz:', error);
        toast({
          title: 'Error',
          description: 'Failed to load quiz questions.',
          variant: 'destructive',
        });
      }
    }
  });

  // Submit quiz mutation
  const { mutate: submitQuiz, isPending: isSubmitting } = useMutation({
    mutationFn: ({ userId, quizId, score, answers }: { userId: string; quizId: string; score: number; answers: any[] }) => {
      return submitQuizAttempt(userId, quizId, score, answers);
    },
    onSuccess: () => {
      toast({
        title: 'Quiz completed!',
        description: `You scored ${score}% on this quiz.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error submitting quiz',
        description: String(error),
        variant: 'destructive',
      });
    },
  });

  // Get the parsed and transformed questions
  const getQuizQuestions = () => {
    if (!quiz) return [];
    
    // The mapping is now handled in mapDbQuizToQuiz
    console.log('Quiz questions from quiz object:', quiz.questions);
    return quiz.questions || [];
  };

  const questions = getQuizQuestions();
  const currentQuestion: QuizQuestion | undefined = questions[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (hasAnswered) return;
    setSelectedOption(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion?.correctOptionIndex;
    
    // Record answer
    const answerData = {
      questionId: currentQuestion?.id || currentQuestionIndex.toString(),
      selectedOptionIndex: selectedOption,
      isCorrect,
    };
    
    const newAnswers = [...answers, answerData];
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    setHasAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      // Calculate final score
      const finalScore = (score / Math.max(questions.length, 1)) * 100;
      setQuizFinished(true);
      
      // Submit quiz if user is authenticated
      if (user && quiz) {
        submitQuiz({
          userId: user.id,
          quizId: quiz.id,
          score: Math.round(finalScore),
          answers,
        });
      }
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setAnswers([]);
    setScore(0);
    setQuizFinished(false);
  };

  // Debug logs to help troubleshoot
  useEffect(() => {
    if (quiz) {
      console.log('Quiz data loaded:', quiz);
      console.log('Transformed questions:', questions);
    }
    
    console.log('Current article ID:', articleId);
  }, [quiz, questions, articleId]);

  if (isArticleLoading || isQuizLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4">Loading quiz...</p>
      </div>
    );
  }

  if (!article || !quiz || !questions || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Quiz not found</h2>
        <p className="text-muted-foreground mb-6">
          The quiz you're looking for doesn't exist or has no questions.
          {quiz && <span> Debug info: quiz found but no valid questions parsed.</span>}
          {!articleId && <span> No article ID provided.</span>}
          <br />
          <span className="text-sm">Article ID: {articleId}</span>
        </p>
        <Button asChild>
          <Link to={articleId ? `/article/${articleId}` : '/discover'}>Back to Article</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to={`/article/${articleId}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to article
        </Link>
      </div>
      
      {quizFinished ? (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
            <CardDescription>
              You've completed the quiz for "{article.title}"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                {Math.round((score / questions.length) * 100)}%
              </h3>
              <p className="text-muted-foreground">
                You got {score} out of {questions.length} questions correct
              </p>
            </div>
            
            {/* Answer summary */}
            <div className="border rounded-lg divide-y">
              {answers.map((answer, index) => {
                const question = questions[index];
                return (
                  <div key={index} className="p-3 flex items-center">
                    {answer.isCorrect ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <CircleX className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">{question.question}</p>
                      <p className="text-sm text-muted-foreground">
                        {answer.isCorrect
                          ? `Correct: ${question.options[question.correctOptionIndex]}`
                          : `Your answer: ${question.options[answer.selectedOptionIndex]} (Correct: ${
                              question.options[question.correctOptionIndex]
                            })`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button variant="outline" onClick={restartQuiz}>
              Retry Quiz
            </Button>
            <Button asChild>
              <Link to="/discover">Explore More Articles</Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {article.category}
              </span>
            </div>
            <CardTitle>{currentQuestion?.question}</CardTitle>
            <CardDescription>{article.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectOption(index)}
                  className={`w-full text-left p-3 border rounded-lg transition-colors ${
                    selectedOption === index
                      ? hasAnswered
                        ? index === currentQuestion.correctOptionIndex
                          ? 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-800'
                          : 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-800'
                        : 'bg-primary/10 border-primary/30'
                      : 'hover:bg-muted'
                  }`}
                  disabled={hasAnswered}
                >
                  <div className="flex items-center">
                    <div className="mr-3 flex-shrink-0 h-6 w-6 rounded-full border flex items-center justify-center">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                    {hasAnswered && selectedOption === index && (
                      <span className="ml-auto">
                        {index === currentQuestion.correctOptionIndex ? (
                          <Check className="h-5 w-5 text-green-500" />
                        ) : (
                          <CircleX className="h-5 w-5 text-red-500" />
                        )}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {hasAnswered && currentQuestion?.explanation && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="font-medium mb-1">Explanation:</p>
                <p className="text-sm">{currentQuestion.explanation}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            {!hasAnswered ? (
              <Button onClick={handleSubmitAnswer} disabled={selectedOption === null}>
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {currentQuestionIndex < (questions.length - 1)
                  ? 'Next Question'
                  : 'Finish Quiz'}
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
