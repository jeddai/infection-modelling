import { AbstractControl } from '@angular/forms';

export interface ContentItem {
  header: string,
  value: any,
  description?: string,
  references?: {
    name: string,
    link: string
  }[],
  formItem?: {
    label: string,
    control: string,
    type: 'number' | 'select',
    step?: number,
    options?: any[]
  }
}
