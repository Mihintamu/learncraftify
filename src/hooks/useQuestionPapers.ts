
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface QuestionPaper {
  id: string;
  name: string;
  year: string;
  size: string;
  date: string;
}

export function useQuestionPapers(selectedSubject: string) {
  const { toast } = useToast();
  const [questionPapers, setQuestionPapers] = useState<QuestionPaper[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedSubject) {
      fetchQuestionPapers();
    }
  }, [selectedSubject]);

  const fetchQuestionPapers = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('question_papers')
        .select('*')
        .eq('subject', selectedSubject)
        .order('year', { ascending: false });
        
      if (error) throw error;
      
      // Safely handle the data with proper type checking
      const formattedPapers: QuestionPaper[] = [];
      
      if (data) {
        for (const paper of data) {
          // Check if the paper object has the expected properties
          if (
            'id' in paper && 
            'file_name' in paper && 
            'year' in paper && 
            'file_size' in paper && 
            'upload_date' in paper
          ) {
            formattedPapers.push({
              id: paper.id as string,
              name: paper.file_name as string,
              year: paper.year as string,
              size: paper.file_size as string,
              date: new Date(paper.upload_date as string).toLocaleDateString(),
            });
          }
        }
      }
      
      setQuestionPapers(formattedPapers);
    } catch (error) {
      console.error('Error fetching question papers:', error);
      toast({
        title: "Error",
        description: "Failed to load question papers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaperUploaded = (newPaper: QuestionPaper) => {
    setQuestionPapers([newPaper, ...questionPapers]);
  };

  const handleDeletePaper = (id: string) => {
    setQuestionPapers(questionPapers.filter(paper => paper.id !== id));
  };

  return {
    questionPapers,
    isLoading,
    handlePaperUploaded,
    handleDeletePaper
  };
}
