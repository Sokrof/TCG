import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Observable } from 'rxjs';
import { Deck } from '../_models/deck.model';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'decks'; // Key for local storage

@Injectable({
  providedIn: 'root'
})
export class DeckService {
  private deckSubject = new BehaviorSubject<Deck[]>(this.loadDecksFromStorage());

  constructor() { }

  addToDeck(deck: Deck): boolean {
    deck.id = uuidv4();
    const decks = this.getAllDecks();
    decks.push(deck);
    this.saveDecksToStorage(decks);
    this.deckSubject.next(decks);
    return true;
  }

  getDeck(): Observable<Deck[]> {
    return this.deckSubject.asObservable();
  }

  getDeckById(deckId: string): Observable<Deck | undefined> {
    return this.deckSubject.asObservable().pipe(
      map(decks => decks.find(deck => deck.id === deckId))
    );
  }

  updateDeck(deck: Deck): boolean {
    const decks = this.getAllDecks();
    const index = decks.findIndex(d => d.id === deck.id);
    if (index !== -1) {
      decks[index] = { ...deck };
      this.saveDecksToStorage(decks);
      this.deckSubject.next(decks);
      return true;
    } else {
      return false;
    }
  }

  deleteDeck(deckId: string): void {
    const decks = this.getAllDecks();
    const index = decks.findIndex(deck => deck.id === deckId);
    if (index !== -1) {
      decks.splice(index, 1);
      this.saveDecksToStorage(decks);
      this.deckSubject.next(decks);
    }
  }

  countDecks(): number {
    return this.getAllDecks().length;
  }

  private getAllDecks(): Deck[] {
    const decksString = localStorage.getItem(STORAGE_KEY);
    if (decksString) {
      return JSON.parse(decksString) as Deck[];
    }
    return [];
  }

  private saveDecksToStorage(decks: Deck[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
  }

  private loadDecksFromStorage(): Deck[] {
    const decksString = localStorage.getItem(STORAGE_KEY);
    if (decksString) {
      try {
        return JSON.parse(decksString) as Deck[];
      } catch (error) {
        console.error('Error loading decks from storage:', error);
        localStorage.removeItem(STORAGE_KEY); // Clear corrupted data
      }
    }
    return [];
  }
}
