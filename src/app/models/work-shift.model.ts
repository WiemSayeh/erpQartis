
export interface WorkShiftResponse {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  employee: {
    id: number;
    fullName: string;
    email: string;
  };
  department: {
    id: number;
    name: string;
  };
}
