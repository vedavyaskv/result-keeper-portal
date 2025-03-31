
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Award, BookOpen } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";

const Dashboard = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const storedStudents = localStorage.getItem("students");
    const storedClasses = localStorage.getItem("classes");
    const storedResults = localStorage.getItem("results");
    
    if (storedStudents) setStudents(JSON.parse(storedStudents));
    if (storedClasses) setClasses(JSON.parse(storedClasses));
    if (storedResults) setResults(JSON.parse(storedResults));
    
    // Generate performance data
    if (storedResults) {
      const resultsData = JSON.parse(storedResults);
      const performanceBySubject: any = {};
      
      resultsData.forEach((result: any) => {
        if (!performanceBySubject[result.subject]) {
          performanceBySubject[result.subject] = {
            subject: result.subject,
            averageMarks: 0,
            count: 0,
          };
        }
        
        performanceBySubject[result.subject].averageMarks += result.marks;
        performanceBySubject[result.subject].count += 1;
      });
      
      const chartData = Object.values(performanceBySubject).map((item: any) => ({
        ...item,
        averageMarks: item.averageMarks / item.count,
      }));
      
      setPerformanceData(chartData);
    }
  }, []);

  const recentResults = results.slice(0, 5);

  const totalStudents = students.length;
  const totalClasses = classes.length;
  const averageMarks = results.length > 0 
    ? results.reduce((sum, result) => sum + result.marks, 0) / results.length 
    : 0;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled in various classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              Active class sections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMarks.toFixed(2)}</div>
            <Progress className="mt-2" value={averageMarks} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Results Recorded</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all subjects
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Subject Performance Overview</CardTitle>
            <CardDescription>Average marks by subject</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="averageMarks" name="Average Marks" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Results</CardTitle>
            <CardDescription>Latest recorded student results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Student</th>
                    <th className="text-left py-2 font-medium">Subject</th>
                    <th className="text-left py-2 font-medium">Marks</th>
                    <th className="text-left py-2 font-medium">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {recentResults.map((result, index) => {
                    const student = students.find(s => s.id === result.studentId);
                    
                    return (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="py-2">{student ? student.name : result.studentId}</td>
                        <td className="py-2">{result.subject}</td>
                        <td className="py-2">{result.marks}</td>
                        <td className="py-2">{result.grade}</td>
                      </tr>
                    );
                  })}
                  {recentResults.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-gray-500">
                        No results recorded yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
