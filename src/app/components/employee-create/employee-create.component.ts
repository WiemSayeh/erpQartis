import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';
import { DepartmentService } from 'src/app/services/department.service';
import Swal from 'sweetalert2';

// ✅ Validateur custom pour vérifier qu'au moins un département est sélectionné
// Validators.minLength(1) ne fonctionne que sur les strings, pas sur les arrays
function atLeastOneDepartment(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value || !Array.isArray(value) || value.length === 0) {
    return { noDepartment: true };
  }
  return null;
}

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})
export class EmployeeCreateComponent implements OnInit, OnDestroy {
  employeeForm!: FormGroup;
  departments: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.employeeForm = this.fb.group({
      fullName:     ['', [Validators.required, Validators.minLength(3)]],
      cin:          ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      email:        ['', [Validators.required, Validators.email]],
      phone:        ['', [Validators.required, Validators.pattern('^[0-9]{8,12}$')]],
      address:      ['', [Validators.required]],
      salary:       [null, [Validators.required, Validators.min(0)]],
      contractType: ['CDI', [Validators.required]],

      // ✅ Validateur custom remplace Validators.minLength(1) qui ne marche pas sur array
      departmentIds: [[], [atLeastOneDepartment]]
    });
  }

  private loadDepartments(): void {
    this.departmentService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => this.departments = res,
        error: () => console.error("Erreur de chargement des départements")
      });
  }

  onDepartmentChange(event: any, id: number): void {
    // Copie de la liste actuelle pour ne pas muter directement le FormControl
    const selectedIds: number[] = [...this.employeeForm.get('departmentIds')?.value];

    if (event.target.checked) {
      // Ajouter l'ID seulement s'il n'existe pas déjà (évite les doublons)
      if (!selectedIds.includes(id)) {
        selectedIds.push(id);
      }
    } else {
      // Retirer l'ID décoché
      const index = selectedIds.indexOf(id);
      if (index > -1) {
        selectedIds.splice(index, 1);
      }
    }

    // Mettre à jour le FormControl + déclencher la validation
    this.employeeForm.patchValue({ departmentIds: selectedIds });
    this.employeeForm.get('departmentIds')?.markAsTouched();
  }

  saveEmployee(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    Swal.fire({
      title: 'Enregistrement...',
      text: 'Création du profil en cours',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    this.employeeService.createEmployee(this.employeeForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => this.showSuccessAlert(res.id),
        error: (err) => {
          let msg = "Une erreur est survenue lors de la création.";
          if (err.status === 409) msg = "Ce CIN ou cet Email est déjà utilisé par un autre employé.";
          Swal.fire('Erreur de saisie', msg, 'error');
        }
      });
  }

  private showSuccessAlert(id: number): void {
    Swal.fire({
      title: 'Employé créé avec succès !',
      text: "Voulez-vous configurer son emploi du temps maintenant ?",
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Oui, configurer le shift',
      cancelButtonText: 'Plus tard',
      confirmButtonColor: '#3182ce',
      cancelButtonColor: '#718096',
    }).then((result) => {
      this.router.navigate(result.isConfirmed ? ['/shifts/assign', id] : ['/employees']);
    });
  }
}
