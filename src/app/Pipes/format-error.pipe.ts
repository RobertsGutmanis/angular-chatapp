import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'formatError'
})
export class FormatErrorPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    const valueArr = [...value]
    valueArr.forEach((char: string, i: number): void => {
      if (char === "_") {
        valueArr[i] = " "
      }
    })
    return valueArr.join("")
  }

}
