import { AbstractControl, ValidatorFn } from '@angular/forms';

export function cardCountValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const cardCount = control.value ? control.value.length : 0;
        return cardCount >= min && cardCount <= max ? null : { cardCount: true };
    };
}

export function uniqueCardNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const cards = control.value as Array<any>;
        if (!cards || cards.length === 0) {
            return null;
        }

        const cardCounts = cards.reduce((counts, card) => {
            counts[card.name] = (counts[card.name] || 0) + 1;
            return counts;
        }, {});

        const invalidNames = Object.keys(cardCounts).filter(name => cardCounts[name] > 4);

        return invalidNames.length > 0 ? { uniqueCardName: true } : null;
    };
}