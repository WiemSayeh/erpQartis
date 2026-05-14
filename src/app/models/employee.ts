export interface Department {
  id: number;
  name: string;
}

export interface Employee {
  id: number; // ❗ obligatoire (ton erreur principale)
  fullName: string;
  email: string;
  address: string;
  phone: string;
  salary: number;
contractType?: string;
  employmentStatus?: string;

  specialty?: string;
  available?: boolean;
  maxTasksPerDay?: number;

  departments?: Department[]; // 🔥 IMPORTANT (pas department)

  workShifts?: any[];
  contracts?: any[];
  leaves?: any[];
  advances?: any[];
}
