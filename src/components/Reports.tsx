
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { FileText, Download, Printer, BarChart, PieChart } from "lucide-react";
import {
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartPieChart,
  Pie,
  Cell
} from "recharts";

interface Student {
  id: string;
  name: string;
  gender: string;
  class: string;
  enrollmentDate: string;
}

interface ClassInfo {
  id: string;
  name: string;
  teacher: string;
  totalStudents: number;
}

interface Result {
  id: string;
  studentId: string;
  class: string;
  subject: string;
  marks: number;
  grade: string;
  term: string;
}

interface StudentResultsData {
  student: Student;
  termResults: Record<string, Result[]>;
}

const Reports = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedTerm, setSelectedTerm] = useState("All Terms");
  const [reportType, setReportType] = useState("student");
  
  const { toast } = useToast();
  
  // List of subjects
  const subjects = ["All Subjects", "Mathematics", "English", "Science", "Social Studies", "Physics", "Chemistry", "Biology", "History", "Geography", "Computer Science"];
  
  // List of terms
  const terms = ["All Terms", "Mid Term", "Final Term", "First Quarter", "Second Quarter", "Third Quarter", "Fourth Quarter"];
  
  useEffect(() => {
    const storedStudents = localStorage.getItem("students");
    const storedClasses = localStorage.getItem("classes");
    const storedResults = localStorage.getItem("results");
    
    if (storedStudents) setStudents(JSON.parse(storedStudents));
    if (storedClasses) setClasses(JSON.parse(storedClasses));
    if (storedResults) setResults(JSON.parse(storedResults));
  }, []);
  
  // Function to get student name from ID
  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : studentId;
  };
  
  // Filter results based on selections
  const filteredResults = results.filter(result => {
    const matchesClass = selectedClass === "all" || result.class === selectedClass;
    const matchesStudent = selectedStudent === "all" || result.studentId === selectedStudent;
    const matchesSubject = selectedSubject === "All Subjects" || result.subject === selectedSubject;
    const matchesTerm = selectedTerm === "All Terms" || result.term === selectedTerm;
    
    return matchesClass && matchesStudent && matchesSubject && matchesTerm;
  });
  
  // For class performance chart
  const classPerformanceData = React.useMemo(() => {
    if (selectedClass === "all") return [];
    
    // Get all results for selected class
    const classResults = results.filter(result => result.class === selectedClass);
    
    // Group by subject
    const subjectPerformance: Record<string, {
      subject: string;
      average: number;
      total: number;
      count: number;
    }> = {};
    
    classResults.forEach(result => {
      if (!subjectPerformance[result.subject]) {
        subjectPerformance[result.subject] = {
          subject: result.subject,
          average: 0,
          total: 0,
          count: 0
        };
      }
      subjectPerformance[result.subject].total += result.marks;
      subjectPerformance[result.subject].count += 1;
    });
    
    // Calculate averages
    return Object.values(subjectPerformance).map(data => ({
      ...data,
      average: data.total / data.count
    }));
  }, [selectedClass, results]);
  
  // For grade distribution chart
  const gradeDistributionData = React.useMemo(() => {
    if (filteredResults.length === 0) return [];
    
    const gradeCounts: Record<string, { name: string; value: number }> = {
      "A+": { name: "A+", value: 0 },
      "A": { name: "A", value: 0 },
      "B": { name: "B", value: 0 },
      "C": { name: "C", value: 0 },
      "D": { name: "D", value: 0 },
      "F": { name: "F", value: 0 }
    };
    
    filteredResults.forEach(result => {
      if (gradeCounts[result.grade]) {
        gradeCounts[result.grade].value += 1;
      }
    });
    
    return Object.values(gradeCounts).filter(grade => grade.value > 0);
  }, [filteredResults]);
  
  // Pie chart colors
  const GRADE_COLORS = ["#22c55e", "#84cc16", "#3b82f6", "#eab308", "#f97316", "#ef4444"];
  
  // Generate student report card
  const studentResultsData = React.useMemo((): StudentResultsData | null => {
    if (selectedStudent === "all") return null;
    
    // Get student information
    const student = students.find(s => s.id === selectedStudent);
    if (!student) return null;
    
    // Get all results for this student
    const studentResults = results.filter(result => result.studentId === selectedStudent);
    
    // Group by subject
    const termResults = studentResults.reduce((acc: Record<string, Result[]>, result) => {
      if (!acc[result.term]) {
        acc[result.term] = [];
      }
      acc[result.term].push(result);
      return acc;
    }, {});
    
    return {
      student,
      termResults
    };
  }, [selectedStudent, students, results]);
  
  const handlePrintReport = () => {
    toast({
      title: "Print Initiated",
      description: "The report is being prepared for printing."
    });
    
    setTimeout(() => {
      window.print();
    }, 500);
  };
  
  const handleDownloadReport = () => {
    toast({
      title: "Download Started",
      description: "Your report is being downloaded as a PDF."
    });
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Academic Reports</CardTitle>
          <CardDescription>Generate and view different types of academic reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div>
              <label className="text-sm mb-2 block text-gray-500">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student Report Card</SelectItem>
                  <SelectItem value="class">Class Performance</SelectItem>
                  <SelectItem value="grades">Grade Distribution</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm mb-2 block text-gray-500">Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
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
            
            <div>
              <label className="text-sm mb-2 block text-gray-500">Student</label>
              <Select 
                value={selectedStudent} 
                onValueChange={setSelectedStudent} 
                disabled={reportType !== "student"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {students.filter(student => 
                    selectedClass === "all" || student.class === selectedClass
                  ).map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm mb-2 block text-gray-500">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
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
            
            <div>
              <label className="text-sm mb-2 block text-gray-500">Term</label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger>
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
          
          {/* Student Report Card */}
          {reportType === "student" && studentResultsData && (
            <div className="mt-6 p-4 border rounded-md bg-white print:shadow-none" id="printable-report">
              <div className="text-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold">Student Report Card</h2>
                <p className="text-gray-500">Academic Progress Report</p>
              </div>
              
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <p><strong>Student Name:</strong> {studentResultsData.student.name}</p>
                  <p><strong>Student ID:</strong> {studentResultsData.student.id}</p>
                </div>
                <div>
                  <p><strong>Class:</strong> {studentResultsData.student.class}</p>
                  <p><strong>Academic Year:</strong> 2023-2024</p>
                </div>
              </div>
              
              {/* Results by Term */}
              {Object.entries(studentResultsData.termResults || {}).map(([term, termResults]: [string, Result[]]) => (
                <div key={term} className="mb-8">
                  <h3 className="text-xl font-bold mb-4 border-b pb-2">{term} Results</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 text-left border">Subject</th>
                          <th className="p-2 text-left border">Marks</th>
                          <th className="p-2 text-left border">Grade</th>
                          <th className="p-2 text-left border">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {termResults.map((result: Result, idx: number) => (
                          <tr key={idx} className="border-b">
                            <td className="p-2 border">{result.subject}</td>
                            <td className="p-2 border">{result.marks}</td>
                            <td className="p-2 border">
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
                            <td className="p-2 border">
                              {result.grade === 'A+' ? 'Excellent' :
                               result.grade === 'A' ? 'Very Good' :
                               result.grade === 'B' ? 'Good' :
                               result.grade === 'C' ? 'Satisfactory' :
                               result.grade === 'D' ? 'Needs Improvement' :
                               'Failed'}
                            </td>
                          </tr>
                        ))}
                        
                        {/* Calculate average */}
                        <tr className="bg-gray-50 font-medium">
                          <td className="p-2 border">Average</td>
                          <td className="p-2 border">
                            {(termResults.reduce((sum: number, result: Result) => sum + result.marks, 0) / termResults.length).toFixed(2)}
                          </td>
                          <td className="p-2 border" colSpan={2}>
                            {/* No grade here */}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
              
              {/* Teacher's Comments */}
              <div className="mt-8 border-t pt-4">
                <h4 className="font-bold mb-2">Teacher's Comments:</h4>
                <p className="p-2 border min-h-[60px] italic">
                  {/* This would be filled by the teacher */}
                  The student has shown consistent performance throughout the term.
                </p>
                
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Teacher's Signature:</strong> _________________</p>
                  </div>
                  <div>
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Class Performance */}
          {reportType === "class" && selectedClass !== "all" && (
            <div className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>{selectedClass} - Subject Performance Analysis</CardTitle>
                  <CardDescription>Average marks in each subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartBarChart data={classPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="average" name="Average Marks" fill="#3b82f6" />
                      </RechartBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Grade Distribution */}
          {reportType === "grades" && (
            <div className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Grade Distribution Analysis</CardTitle>
                  <CardDescription>
                    {selectedClass !== "all" ? `For ${selectedClass}` : "For All Classes"} 
                    {selectedSubject !== "All Subjects" ? ` - ${selectedSubject}` : ""}
                    {selectedTerm !== "All Terms" ? ` - ${selectedTerm}` : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartPieChart>
                        <Pie
                          data={gradeDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                        >
                          {gradeDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={GRADE_COLORS[index % GRADE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </RechartPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex gap-2 justify-end mt-6 print:hidden">
            <Button variant="outline" onClick={handlePrintReport} className="flex items-center gap-1">
              <Printer className="h-4 w-4" />
              Print Report
            </Button>
            <Button onClick={handleDownloadReport} className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
