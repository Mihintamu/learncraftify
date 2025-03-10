
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SubjectSelectorProps {
  selectedSubject: string;
  onSubjectChange: (value: string) => void;
  subjects: { id: string; name: string; }[];
  isLoading: boolean;
}

const SubjectSelector = ({ 
  selectedSubject, 
  onSubjectChange, 
  subjects, 
  isLoading 
}: SubjectSelectorProps) => {
  return (
    <Select
      value={selectedSubject}
      onValueChange={onSubjectChange}
      disabled={isLoading}
    >
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="Select Knowledge Base" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="common">Common Knowledge Base</SelectItem>
        {subjects.map(subject => (
          <SelectItem key={subject.id} value={subject.name}>{subject.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubjectSelector;
