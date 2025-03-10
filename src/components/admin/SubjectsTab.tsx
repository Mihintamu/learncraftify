
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Book } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const SubjectsTab = () => {
  const { toast } = useToast();
  
  // Subject management state
  const [subjects, setSubjects] = useState([
    "Mathematics", "Computer Science", "Engineering", 
    "Physics", "Chemistry", "Biology"
  ]);
  const [newSubject, setNewSubject] = useState('');
  
  // Subject management functions
  const handleAddSubject = () => {
    if (!newSubject.trim()) {
      toast({
        title: "Error",
        description: "Subject name cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    if (subjects.includes(newSubject.trim())) {
      toast({
        title: "Error",
        description: "Subject already exists",
        variant: "destructive",
      });
      return;
    }
    
    setSubjects([...subjects, newSubject.trim()]);
    setNewSubject('');
    
    toast({
      title: "Subject added",
      description: `"${newSubject.trim()}" has been added successfully`,
    });
  };
  
  const handleEditSubject = (index: number, originalName: string) => {
    toast({
      title: "Edit Subject",
      description: `Editing functionality for "${originalName}" will be available soon`,
    });
  };
  
  const handleDeleteSubject = (index: number, subjectName: string) => {
    const updatedSubjects = [...subjects];
    updatedSubjects.splice(index, 1);
    setSubjects(updatedSubjects);
    
    toast({
      title: "Subject deleted",
      description: `"${subjectName}" has been removed successfully`,
    });
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
          />
          <Button onClick={handleAddSubject}>
            <Book className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {subjects.map((subject, index) => (
          <Card key={`${subject}-${index}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{subject}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEditSubject(index, subject)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteSubject(index, subject)}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubjectsTab;
