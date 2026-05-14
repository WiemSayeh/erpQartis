export interface WorkShift {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status?: string;
  employeeId?: number;
  departmentId?: number;
  employeeName?: string;
  departmentName?: string;
  employee?: {
    id: number;
    email: string;
    fullName?: string;
  };
  department?: {
    id: number;
    name: string;
    description?: string;
  };
}
