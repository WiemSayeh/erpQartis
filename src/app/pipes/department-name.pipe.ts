import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'departmentName' })
export class DepartmentNamePipe implements PipeTransform {
  transform(departments: any[], id: number | null): string {
    if (!id || !departments) return '';
    return departments.find(d => d.id === id)?.name || '';
  }
}
