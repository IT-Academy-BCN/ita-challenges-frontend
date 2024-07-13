import { Pipe, type PipeTransform } from '@angular/core'

@Pipe({ name: 'escapeJavaForJson' })
export class EscapeJavaForJsonPipe implements PipeTransform {
  transform (value: string): string {
    return value
      .replace(/\\/g, '\\\\') // Replace backslashes
      .replace(/"/g, '\\"') // Replace double quotes
      .replace(/\f/g, '\\f') // Replace form feed
      .replace(/\n/g, '\\n') // Replace new line
      .replace(/\r/g, '\\r') // Replace carriage return
      .replace(/\t/g, '\\t') // Replace tab
  }
}
