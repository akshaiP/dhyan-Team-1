import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], searchText: string, fields: string[]): any[] {
    if (!items || !searchText || !fields || fields.length === 0) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter(item =>
      fields.some(field => {
        const fieldValue = this.getValue(item, field)?.toLowerCase() || '';
        return fieldValue.includes(searchText);
      })
    );
  }

  private getValue(item: any, field: string): any {
    return field.split('.').reduce((acc, part) => acc && acc[part], item);
  }
}
