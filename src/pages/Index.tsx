
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Dashboard from "@/components/Dashboard";
import Students from "@/components/Students";
import Results from "@/components/Results";
import Classes from "@/components/Classes";
import Reports from "@/components/Reports";
import Header from "@/components/Header";

const Index = () => {
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);

  // Initialize demo data on first load
  useEffect(() => {
    if (!initialized) {
      // Check if data already exists in localStorage
      const studentsExist = localStorage.getItem("students");
      
      if (!studentsExist) {
        // Initialize with sample data
        const sampleStudents = [
          { id: "S001", name: "John Smith", gender: "Male", class: "Class 10A", enrollmentDate: "2023-08-15" },
          { id: "S002", name: "Mary Johnson", gender: "Female", class: "Class 10A", enrollmentDate: "2023-08-15" },
          { id: "S003", name: "Robert Williams", gender: "Male", class: "Class 10B", enrollmentDate: "2023-08-16" },
          { id: "S004", name: "Emily Davis", gender: "Female", class: "Class 10B", enrollmentDate: "2023-08-16" },
          { id: "S005", name: "Michael Brown", gender: "Male", class: "Class 11A", enrollmentDate: "2023-08-15" },
        ];
        
        const sampleClasses = [
          { id: "C001", name: "Class 10A", teacher: "Mr. Anderson", totalStudents: 25 },
          { id: "C002", name: "Class 10B", teacher: "Ms. Thompson", totalStudents: 22 },
          { id: "C003", name: "Class 11A", teacher: "Mr. Wilson", totalStudents: 24 },
        ];
        
        const sampleResults = [
          { id: "R001", studentId: "S001", class: "Class 10A", subject: "Mathematics", marks: 85, grade: "A", term: "Mid Term" },
          { id: "R002", studentId: "S001", class: "Class 10A", subject: "English", marks: 78, grade: "B", term: "Mid Term" },
          { id: "R003", studentId: "S001", class: "Class 10A", subject: "Science", marks: 92, grade: "A+", term: "Mid Term" },
          { id: "R004", studentId: "S002", class: "Class 10A", subject: "Mathematics", marks: 72, grade: "B", term: "Mid Term" },
          { id: "R005", studentId: "S002", class: "Class 10A", subject: "English", marks: 88, grade: "A", term: "Mid Term" },
          { id: "R006", studentId: "S002", class: "Class 10A", subject: "Science", marks: 75, grade: "B", term: "Mid Term" },
        ];

        localStorage.setItem("students", JSON.stringify(sampleStudents));
        localStorage.setItem("classes", JSON.stringify(sampleClasses));
        localStorage.setItem("results", JSON.stringify(sampleResults));
        
        toast({
          title: "Demo data initialized",
          description: "Sample students, classes and results have been loaded.",
        });
      }
      
      setInitialized(true);
    }
  }, [initialized, toast]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto p-4 pt-24">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="mb-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-1">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="classes">Classes</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
              </CardContent>
            </Card>
          </div>
          
          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>
          
          <TabsContent value="students">
            <Students />
          </TabsContent>
          
          <TabsContent value="classes">
            <Classes />
          </TabsContent>
          
          <TabsContent value="results">
            <Results />
          </TabsContent>
          
          <TabsContent value="reports">
            <Reports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
