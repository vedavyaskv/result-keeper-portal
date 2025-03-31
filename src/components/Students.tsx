
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

const Students = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  
  // Form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [newStudent, setNewStudent] = useState({
    id: "",
    name: "",
    gender: "",
    class: "",
    enrollmentDate: ""
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    const storedStudents = localStorage.getItem("students");
    const storedClasses = localStorage.getItem("classes");
    
    if (storedStudents) setStudents(JSON.parse(storedStudents));
    if (storedClasses) setClasses(JSON.parse(storedClasses));
  }, []);
  
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         student.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "all" || student.class === selectedClass;
    
    return matchesSearch && matchesClass;
  });
  
  const handleAddStudent = () => {
    // Generate a new ID
    const newId = `S${String(students.length + 1).padStart(3, '0')}`;
    const studentToAdd = { ...newStudent, id: newId };
    
    const updatedStudents = [...students, studentToAdd];
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    
    setNewStudent({
      id: "",
      name: "",
      gender: "",
      class: "",
      enrollmentDate: ""
    });
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Student Added",
      description: `${studentToAdd.name} has been added successfully.`
    });
  };
  
  const handleEditStudent = () => {
    if (!editingStudent) return;
    
    const updatedStudents = students.map(student => 
      student.id === editingStudent.id ? editingStudent : student
    );
    
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    
    setIsEditDialogOpen(false);
    setEditingStudent(null);
    
    toast({
      title: "Student Updated",
      description: `${editingStudent.name}'s information has been updated.`
    });
  };
  
  const handleDeleteStudent = (id: string) => {
    const studentToDelete = students.find(student => student.id === id);
    if (!studentToDelete) return;
    
    const confirmed = window.confirm(`Are you sure you want to delete ${studentToDelete.name}?`);
    if (!confirmed) return;
    
    const updatedStudents = students.filter(student => student.id !== id);
    setStudents(updatedStudents);
    localStorage.setItem("students", JSON.stringify(updatedStudents));
    
    toast({
      title: "Student Deleted",
      description: `${studentToDelete.name} has been removed from the system.`,
      variant: "destructive"
    });
  };
  
  const startEdit = (student: any) => {
    setEditingStudent({...student});
    setIsEditDialogOpen(true);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>View and manage all students in the system</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new student record.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Full Name</Label>
                    <Input 
                      id="name" 
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      className="col-span-3" 
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="gender" className="text-right">Gender</Label>
                    <Select 
                      onValueChange={(value) => setNewStudent({...newStudent, gender: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="class" className="text-right">Class</Label>
                    <Select
                      onValueChange={(value) => setNewStudent({...newStudent, class: value})}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.name}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="enrollmentDate" className="text-right">Enrollment Date</Label>
                    <Input 
                      id="enrollmentDate" 
                      type="date"
                      value={newStudent.enrollmentDate}
                      onChange={(e) => setNewStudent({...newStudent, enrollmentDate: e.target.value})}
                      className="col-span-3" 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddStudent}>Save</Button>
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
                placeholder="Search by name or ID..." 
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
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 font-medium">ID</th>
                  <th className="p-2 font-medium">Name</th>
                  <th className="p-2 font-medium">Gender</th>
                  <th className="p-2 font-medium">Class</th>
                  <th className="p-2 font-medium">Enrollment Date</th>
                  <th className="p-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{student.id}</td>
                      <td className="p-2 font-medium">{student.name}</td>
                      <td className="p-2">{student.gender}</td>
                      <td className="p-2">{student.class}</td>
                      <td className="p-2">{student.enrollmentDate}</td>
                      <td className="p-2 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => startEdit(student)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No students found matching the search criteria
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
            <DialogTitle>Edit Student</DialogTitle>
            <DialogDescription>
              Update the student's information.
            </DialogDescription>
          </DialogHeader>
          {editingStudent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-id" className="text-right">Student ID</Label>
                <Input 
                  id="edit-id" 
                  value={editingStudent.id}
                  disabled
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Full Name</Label>
                <Input 
                  id="edit-name" 
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-gender" className="text-right">Gender</Label>
                <Select 
                  value={editingStudent.gender}
                  onValueChange={(value) => setEditingStudent({...editingStudent, gender: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-class" className="text-right">Class</Label>
                <Select
                  value={editingStudent.class}
                  onValueChange={(value) => setEditingStudent({...editingStudent, class: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.name}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">Enrollment Date</Label>
                <Input 
                  id="edit-date" 
                  type="date"
                  value={editingStudent.enrollmentDate}
                  onChange={(e) => setEditingStudent({...editingStudent, enrollmentDate: e.target.value})}
                  className="col-span-3" 
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditStudent}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
