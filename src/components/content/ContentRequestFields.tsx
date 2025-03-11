
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FormData {
  subject: string;
  topic: string;
  instructions: string;
}

interface ContentRequestFieldsProps {
  formData: FormData;
  onChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const ContentRequestFields = ({ 
  formData, 
  onChange, 
  onSubmit, 
  isSubmitting 
}: ContentRequestFieldsProps) => {
  const [subjects, setSubjects] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to load subjects');
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="subject" className="text-sm font-medium">
          Subject
        </label>
        <Select
          value={formData.subject}
          onValueChange={(value) => onChange('subject', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.name}>
                  {subject.name}
                </SelectItem>
              ))
            ) : (
              <>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Literature">Literature</SelectItem>
                <SelectItem value="Financial Accounting">Financial Accounting</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="topic" className="text-sm font-medium">
          Topic
        </label>
        <Input
          id="topic"
          name="topic"
          placeholder="Enter the specific topic"
          value={formData.topic}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="instructions" className="text-sm font-medium">
          Additional Instructions
        </label>
        <Textarea
          id="instructions"
          name="instructions"
          placeholder="Provide any specific requirements or formatting instructions"
          rows={5}
          value={formData.instructions}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ContentRequestFields;
