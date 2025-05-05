
import { supabase } from '@/integrations/supabase/client';
import { N8nQuizQuestion } from '@/types';

/**
 * Creates or updates a quiz and its questions for an article
 * @param articleId - The ID of the article
 * @param questions - Array of questions in the N8n format
 * @param title - Optional title for the quiz
 * @returns The ID of the created or updated quiz
 */
export async function createOrUpdateQuiz(
  articleId: string, 
  questions: N8nQuizQuestion[], 
  title?: string
): Promise<string | null> {
  try {
    // Check if a quiz already exists for this article
    const { data: existingQuiz, error: quizError } = await supabase
      .from('quizzes')
      .select('id')
      .eq('article_id', articleId)
      .maybeSingle();
      
    if (quizError) throw new Error(`Error checking existing quiz: ${quizError.message}`);
    
    let quizId: string;
    
    // Create or update the quiz
    if (existingQuiz) {
      // Update existing quiz
      quizId = existingQuiz.id;
      
      const { error: updateError } = await supabase
        .from('quizzes')
        .update({ title: title || `Quiz for article ${articleId}` })
        .eq('id', quizId);
        
      if (updateError) throw new Error(`Error updating quiz: ${updateError.message}`);
      
      // Delete existing questions for this quiz
      const { error: deleteError } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('quiz_id', quizId);
        
      if (deleteError) throw new Error(`Error deleting existing questions: ${deleteError.message}`);
    } else {
      // Insert new quiz
      const { data: newQuiz, error: insertError } = await supabase
        .from('quizzes')
        .insert({
          article_id: articleId,
          title: title || `Quiz for article ${articleId}`
        })
        .select('id')
        .single();
        
      if (insertError) throw new Error(`Error creating quiz: ${insertError.message}`);
      if (!newQuiz) throw new Error('Failed to create quiz');
      
      quizId = newQuiz.id;
    }
    
    // Insert all questions
    const questionsToInsert = questions.map(q => ({
      quiz_id: quizId,
      article_id: articleId,
      question_number: q.question_number,
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation
    }));
    
    const { error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(questionsToInsert);
      
    if (questionsError) throw new Error(`Error inserting questions: ${questionsError.message}`);
    
    return quizId;
  } catch (error) {
    console.error('Error creating or updating quiz:', error);
    return null;
  }
}
