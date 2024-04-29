export class Card {
    id!: number;
    name: string = '';
    number: string = '';
    supertype: string = '';
    subtypes: string[] = [];
    hp: string = '';
    rules: string[] = [];
    types: string[] = [];
    images: {
        small: string;
        large: string;
    } = {
            small: '',
            large: ''
        };
    attacks: Attack[] = [];
    weaknesses: Weakness[] = [];
}

export interface Attack {
    name: string;
    text: string;
}

export interface Weakness {
    type: string;
    value: string;
}