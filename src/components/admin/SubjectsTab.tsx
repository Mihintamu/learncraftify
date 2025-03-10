
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Book, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const SubjectsTab = () => {
  const { toast } = useToast();
  
  // Subject management state
  const [subjects, setSubjects] = useState<{id: string, name: string}[]>([]);
  const [newSubject, setNewSubject] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch subjects on component mount
  useEffect(() => {
    fetchSubjects();
  }, []);
  
  // Fetch subjects from Supabase
  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        title: "Error",
        description: "Failed to load subjects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Subject management functions
  const handleAddSubject = async () => {
    if (!newSubject.trim()) {
      toast({
        title: "Error",
        description: "Subject name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    if (subjects.some(subject => subject.name.toLowerCase() === newSubject.trim().toLowerCase())) {
      toast({
        title: "Error",
        description: "Subject already exists",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert([{ name: newSubject.trim() }])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        setSubjects([...subjects, data[0]]);
        setNewSubject('');
        
        toast({
          title: "Subject added",
          description: `"${newSubject.trim()}" has been added successfully`,
        });
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      toast({
        title: "Error",
        description: "Failed to add subject. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditSubject = (id: string, originalName: string) => {
    toast({
      title: "Edit Subject",
      description: `Editing functionality for "${originalName}" will be available soon`,
    });
  };
  
  const handleDeleteSubject = async (id: string, subjectName: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setSubjects(subjects.filter(subject => subject.id !== id));
      
      toast({
        title: "Subject deleted",
        description: `"${subjectName}" has been removed successfully`,
      });
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        title: "Error",
        description: "Failed to delete subject. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Manage Subjects</h2>
        <div className="flex gap-2">
          <Input 
            placeholder="New subject name" 
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="w-48 md:w-64"
            disabled={isSubmitting}
          />
          <Button onClick={handleAddSubject} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Book className="mr-2 h-4 w-4" />
                Add Subject
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Card key={subject.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{subject.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditSubject(subject.id, subject.name)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDeleteSubject(subject.id, subject.name)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubjectsTab;
