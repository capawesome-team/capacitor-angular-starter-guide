import { Pipe, PipeTransform } from '@angular/core';
import { formatAmount } from '../../core/constants/currencies';

@Pipe({ name: 'currencyFormat', standalone: true })
export class CurrencyFormatPipe implements PipeTransform {
  transform(amount: number | null | undefined, currencyCode: string): string {
    if (amount == null) return '';
    return formatAmount(amount, currencyCode);
  }
}
