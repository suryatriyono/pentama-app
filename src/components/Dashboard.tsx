import { Lecturer, Student, whoYouAre } from "@/types/user";
import { useUnified } from "./contexts/UnifiedContext";
import { Card, CardHeader, CardTitle } from "./ui/card";

const StudentDashboard = ({userData}:{userData: Student}) => {
  return(
    <div className="space-y-6">
    
    </div>
  );
}

// Lecturer dashboard component
const LecturerDashboard = ({userData}: {userData: Lecturer}) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl text-white font-semibold">Students Supervised</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}



const DashboardComponent = () => {
  const { user } = useUnified();
  const whoAreYou = whoYouAre(user.data);

  if (whoAreYou === "student" && user.type === "student") {
    return <StudentDashboard userData={user} />
  }

  if (whoAreYou === "lecturer" && user.type === "lecturer") {
    return <LecturerDashboard userData={user}/>
  }

  return <>Unidentified</>
}

export default DashboardComponent