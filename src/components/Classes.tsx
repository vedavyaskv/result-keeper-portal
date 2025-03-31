
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Search, Plus, Edit, Trash2, Users } from "lucide-react";

const Classes = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [newClass, setNewClass] = useState({
    id: "",
    name: "",
    teacher: "",
    totalStudents: 0
  });
  
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isViewStudentsOpen, setIsViewStudentsOpen] = useState(false);
  
  const { toast } = useToast();
  
  useEffect(() => {
    const storedClasses = localStorage.getItem("classes");
    const storedStudents = localStorage.getItem("students");
    
    if (storedClasses) setClasses(JSON.parse(storedClasses));
    if (storedStudents) setStudents(JSON.parse(storedStudents));
  }, []);
  
  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStudentCountByClass = (className: string) => {
    return students.filter(student => student.class === className).length;
  };
  
  const handleAddClass = () => {
    // Generate a new ID
    const newId = `C${String(classes.length + 1).padStart(3, '0')}`;
    const classToAdd = { 
      ...newClass, 
      id: newId,
      totalStudents: parseInt(newClass.totalStudents.toString()) || 0 
    };
    
    const updatedClasses = [...classes, classToAdd];
    setClasses(updatedClasses);
    localStorage.setItem("classes", JSON.stringify(updatedClasses));
    
    setNewClass({
      id: "",
      name: "",
      teacher: "",
      totalStudents: 0
    });
    
    setIsAddDialogOpen(false);
    
    toast({
      title: "Class Added",
      description: `${classToAdd.name} has been added successfully.`
    });
  };
  
  const handleEditClass = () => {
    if (!editingClass) return;
    
    const updatedClasses = classes.map(cls => 
      cls.id === editingClass.id ? {
        ...editingClass,
        totalStudents: parseInt(editingClass.totalStudents.toString()) || 0
      } : cls
    );
    
    setClasses(updatedClasses);
    localStorage.setItem("classes", JSON.stringify(updatedClasses));
    
    setIsEditDialogOpen(false);
    setEditingClass(null);
    
    toast({
      title: "Class Updated",
      description: `${editingClass.name}'s information has been updated.`
    });
  };
  
  const handleDeleteClass = (id: string) => {
    const classToDelete = classes.find(cls => cls.id === id);
    if (!classToDelete) return;
    
    // Check if there are students in this class
    const studentsInClass = students.filter(student => student.class === classToDelete.name);
    
    if (studentsInClass.length > 0) {
      toast({
        title: "Cannot Delete Class",
        description: `There are ${studentsInClass.length} students enrolled in ${classToDelete.name}. Please reassign or remove these students first.`,
        variant: "destructive"
      });
      return;
    }
    
    const confirmed = window.confirm(`Are you sure you want to delete ${classToDelete.name}?`);
    if (!confirmed) return;
    
    const updatedClasses = classes.filter(cls => cls.id !== id);
    setClasses(updatedClasses);
    localStorage.setItem("classes", JSON.stringify(updatedClasses));
    
    toast({
      title: "Class Deleted",
      description: `${classToDelete.name} has been removed from the system.`,
      variant: "destructive"
    });
  };
  
  const startEdit = (cls: any) => {
    setEditingClass({...cls});
    setIsEditDialogOpen(true);
  };
  
  const handleViewStudents = (cls: any) => {
    setSelectedClass(cls);
    setIsViewStudentsOpen(true);
  };
  
  const studentsInSelectedClass = selectedClass 
    ? students.filter(student => student.class === selectedClass.name)
    : [];
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Class Management</CardTitle>
              <CardDescription>View and manage all classes in the system</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new class.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Class Name</Label>
                    <Input 
                      id="name" 
                      value={newClass.name}
                      onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                      className="col-span-3" 
                      placeholder="e.g. Class 10A"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacher" className="text-right">Class Teacher</Label>
                    <Input 
                      id="teacher" 
                      value={newClass.teacher}
                      onChange={(e) => setNewClass({...newClass, teacher: e.target.value})}
                      className="col-span-3" 
                      placeholder="e.g. Mr. Anderson"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="capacity" className="text-right">Total Capacity</Label>
                    <Input 
                      id="capacity" 
                      type="number"
                      value={newClass.totalStudents}
                      onChange={(e) => setNewClass({...newClass, totalStudents: parseInt(e.target.value) || 0})}
                      className="col-span-3" 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddClass}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search by class name or teacher..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 font-medium">ID</th>
                  <th className="p-2 font-medium">Class Name</th>
                  <th className="p-2 font-medium">Class Teacher</th>
                  <th className="p-2 font-medium">Students</th>
                  <th className="p-2 font-medium">Capacity</th>
                  <th className="p-2 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClasses.length > 0 ? (
                  filteredClasses.map((cls) => {
                    const currentStudentCount = getStudentCountByClass(cls.name);
                    
                    return (
                      <tr key={cls.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{cls.id}</td>
                        <td className="p-2 font-medium">{cls.name}</td>
                        <td className="p-2">{cls.teacher}</td>
                        <td className="p-2">
                          <div className="flex items-center">
                            <span>{currentStudentCount}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewStudents(cls)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="p-2">{cls.totalStudents}</td>
                        <td className="p-2 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => startEdit(cls)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteClass(cls.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No classes found matching the search criteria
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
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              Update the class information.
            </DialogDescription>
          </DialogHeader>
          {editingClass && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-id" className="text-right">Class ID</Label>
                <Input 
                  id="edit-id" 
                  value={editingClass.id}
                  disabled
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Class Name</Label>
                <Input 
                  id="edit-name" 
                  value={editingClass.name}
                  onChange={(e) => setEditingClass({...editingClass, name: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-teacher" className="text-right">Class Teacher</Label>
                <Input 
                  id="edit-teacher" 
                  value={editingClass.teacher}
                  onChange={(e) => setEditingClass({...editingClass, teacher: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-capacity" className="text-right">Total Capacity</Label>
                <Input 
                  id="edit-capacity" 
                  type="number"
                  value={editingClass.totalStudents}
                  onChange={(e) => setEditingClass({...editingClass, totalStudents: parseInt(e.target.value) || 0})}
                  className="col-span-3" 
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditClass}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isViewStudentsOpen} onOpenChange={setIsViewStudentsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedClass?.name} - Student List</DialogTitle>
            <DialogDescription>
              {selectedClass?.teacher} | {studentsInSelectedClass.length} students enrolled
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Gender</th>
                  <th className="p-2 text-left">Enrollment Date</th>
                </tr>
              </thead>
              <tbody>
                {studentsInSelectedClass.length > 0 ? (
                  studentsInSelectedClass.map(student => (
                    <tr key={student.id} className="border-b">
                      <td className="p-2">{student.id}</td>
                      <td className="p-2 font-medium">{student.name}</td>
                      <td className="p-2">{student.gender}</td>
                      <td className="p-2">{student.enrollmentDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      No students enrolled in this class
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewStudentsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Classes;
