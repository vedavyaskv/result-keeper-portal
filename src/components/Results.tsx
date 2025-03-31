
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Edit, Trash2, FileText } from "lucide-react";

const Results = () => {
  const [results, setResults] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState("all");
  
  // Form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<any>(null);
  const [newResult, setNewResult] = useState({
    id: "",
    studentId: "",
    class: "",
    subject: "",
    marks: 0,
    grade: "",
    term: ""
  });
  
  // List of subjects
  const subjects = ["Mathematics", "English", "Science", "Social Studies", "Physics", "Chemistry", "Biology", "History", "Geography", "Computer Science"];
  
  // List of terms
  const terms = ["Mid Term", "Final Term", "First Quarter", "Second Quarter", "Third Quarter", "Fourth Quarter"];
  
  const { toast } = useToast();
  
  useEffect(() => {
    const storedResults = localStorage.getItem("results");
    const storedStudents = localStorage.getItem("students");
    const storedClasses = localStorage.getItem("classes");
    
    if (storedResults) setResults(JSON.parse(storedResults));
    if (storedStudents) setStudents(JSON.parse(storedStudents));
    if (storedClasses) setClasses(JSON.parse(storedClasses));
  }, []);
  
  const filteredResults = results.filter(result => {
    const student = students.find(s => s.id === result.studentId);
    const studentName = student ? student.name : result.studentId;
    
    const matchesSearch = (studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          result.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesClass = selectedClass === "all" || result.class === selectedClass;
    const matchesStudent = selectedStudent === "all" || result.studentId === selectedStudent;
    
    return matchesSearch && matchesClass && matchesStudent;
  });
  
  const calculateGrade = (marks: number) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";
    return "F";
  };
  
  const handleAddResult = () => {
    // Generate a new ID
    const newId = `R${String(results.length + 1).padStart(3, '0')}`;
    
    // Calculate grade based on marks
    const grade = calculateGrade(Number(newResult.marks));
    
    const resultToAdd = { 
      ...newResult, 
      id: newId,
      marks: Number(newResult.marks),
      grade: grade
    };
    
    const updatedResults = [...results, resultToAdd];
    setResults(updatedResults);
    localStorage.setItem("results", JSON.stringify(updatedResults));
    
    setNewResult({
      id: "",
      studentId: "",
      class: "",
      subject: "",
      marks: 0,
      grade: "",
      term: ""
    });
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Result Added",
      description: `New result has been recorded successfully.`
    });
  };
  
  const handleEditResult = () => {
    if (!editingResult) return;
    
    // Recalculate grade based on marks
    const grade = calculateGrade(Number(editingResult.marks));
    
    const updatedResults = results.map(result => 
      result.id === editingResult.id ? {
        ...editingResult,
        marks: Number(editingResult.marks),
        grade: grade
      } : result
    );
    
    setResults(updatedResults);
    localStorage.setItem("results", JSON.stringify(updatedResults));
    
    setIsEditDialogOpen(false);
    setEditingResult(null);
    
    toast({
      title: "Result Updated",
      description: "The student result has been updated successfully."
    });
  };
  
  const handleDeleteResult = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this result?");
    if (!confirmed) return;
    
    const updatedResults = results.filter(result => result.id !== id);
    setResults(updatedResults);
    localStorage.setItem("results", JSON.stringify(updatedResults));
    
    toast({
      title: "Result Deleted",
      description: "The student result has been removed from the system.",
      variant: "destructive"
    });
  };
  
  const startEdit = (result: any) => {
    setEditingResult({...result});
    setIsEditDialogOpen(true);
  };
  
  // Function to get student name from ID
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : studentId;
  };
  
  // Handle student selection in add form
  const handleStudentSelect = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    setNewResult({
      ...newResult,
      studentId: studentId,
      class: student ? student.class : ""
    });
  };
  
  // Handle student selection in edit form
  const handleEditStudentSelect = (studentId: string) => {
    if (!editingResult) return;
    
    const student = students.find(s => s.id === studentId);
    setEditingResult({
      ...editingResult,
      studentId: studentId,
      class: student ? student.class : ""
    });
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Result Management</CardTitle>
              <CardDescription>View and manage student academic results</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add Result
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Result</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new student result.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="student" className="text-right">Student</Label>
                    <Select 
                      onValueChange={handleStudentSelect}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select Student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} ({student.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="class" className="text-right">Class</Label>
                    <Input 
                      id="class" 
                      value={newResult.class}
                      disabled
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subject" className="text-right">Subject</Label>
                    <Select
                      onValueChange={(value) => setNewResult({...newResult, subject: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select Subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="marks" className="text-right">Marks</Label>
                    <Input 
                      id="marks" 
                      type="number"
                      min="0"
                      max="100"
                      value={newResult.marks}
                      onChange={(e) => setNewResult({...newResult, marks: parseInt(e.target.value) || 0})}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="term" className="text-right">Term</Label>
                    <Select
                      onValueChange={(value) => setNewResult({...newResult, term: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select Term" />
                      </SelectTrigger>
                      <SelectContent>
                        {terms.map((term) => (
                          <SelectItem key={term} value={term}>
                            {term}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddResult}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search by student or subject..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.name}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 font-medium">ID</th>
                  <th className="p-2 font-medium">Student</th>
                  <th className="p-2 font-medium">Class</th>
                  <th className="p-2 font-medium">Subject</th>
                  <th className="p-2 font-medium">Marks</th>
                  <th className="p-2 font-medium">Grade</th>
                  <th className="p-2 font-medium">Term</th>
                  <th className="p-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.length > 0 ? (
                  filteredResults.map((result) => (
                    <tr key={result.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{result.id}</td>
                      <td className="p-2 font-medium">{getStudentName(result.studentId)}</td>
                      <td className="p-2">{result.class}</td>
                      <td className="p-2">{result.subject}</td>
                      <td className="p-2">{result.marks}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          result.grade === 'A+' || result.grade === 'A' ? 'bg-green-100 text-green-800' :
                          result.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                          result.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                          result.grade === 'D' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {result.grade}
                        </span>
                      </td>
                      <td className="p-2">{result.term}</td>
                      <td className="p-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => startEdit(result)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteResult(result.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-gray-500">
                      No results found matching the search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Result</DialogTitle>
            <DialogDescription>
              Update the student result information.
            </DialogDescription>
          </DialogHeader>
          {editingResult && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-id" className="text-right">Result ID</Label>
                <Input 
                  id="edit-id" 
                  value={editingResult.id}
                  disabled
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-student" className="text-right">Student</Label>
                <Select 
                  value={editingResult.studentId}
                  onValueChange={handleEditStudentSelect}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} ({student.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-class" className="text-right">Class</Label>
                <Input 
                  id="edit-class" 
                  value={editingResult.class}
                  disabled
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-subject" className="text-right">Subject</Label>
                <Select
                  value={editingResult.subject}
                  onValueChange={(value) => setEditingResult({...editingResult, subject: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-marks" className="text-right">Marks</Label>
                <Input 
                  id="edit-marks" 
                  type="number"
                  min="0"
                  max="100"
                  value={editingResult.marks}
                  onChange={(e) => setEditingResult({...editingResult, marks: parseInt(e.target.value) || 0})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-term" className="text-right">Term</Label>
                <Select
                  value={editingResult.term}
                  onValueChange={(value) => setEditingResult({...editingResult, term: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {terms.map((term) => (
                      <SelectItem key={term} value={term}>
                        {term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditResult}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Results;
