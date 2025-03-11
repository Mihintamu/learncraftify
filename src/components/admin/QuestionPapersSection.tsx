
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QuestionPaperUpload from './QuestionPaperUpload';
import QuestionPaperList from './QuestionPaperList';
import { QuestionPaper } from '@/hooks/useQuestionPapers';

interface QuestionPapersSectionProps {
  selectedSubject: string;
  questionPapers: QuestionPaper[];
  isLoading: boolean;
  onPaperUploaded: (newPaper: QuestionPaper) => void;
  onDeletePaper: (id: string) => void;
}

const QuestionPapersSection = ({
  selectedSubject,
  questionPapers,
  isLoading,
  onPaperUploaded,
  onDeletePaper
}: QuestionPapersSectionProps) => {
  return (
    <>
      <QuestionPaperUpload
        selectedSubject={selectedSubject}
        onPaperUploaded={onPaperUploaded}
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {selectedSubject === 'common' ? 'Common Question Papers' : `${selectedSubject} Question Papers`}
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            {questionPapers.length || 0} papers
          </div>
        </CardHeader>
        <CardContent>
          <QuestionPaperList
            papers={questionPapers}
            isLoading={isLoading}
            selectedSubject={selectedSubject}
            onDeletePaper={onDeletePaper}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default QuestionPapersSection;
