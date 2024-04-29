import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Card } from 'src/app/_models/card.model';
import { Deck } from 'src/app/_models/deck.model';
import { DeckService } from 'src/app/_services/desk.services';
import { TitlePageComponent } from 'src/app/shared/components/title-page/title-page.component';

@Component({
  selector: 'app-deck-list',
  templateUrl: './deck-list.component.html',
  styleUrls: ['./deck-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TitlePageComponent,
    RouterLink
  ]
})
export class DeckListComponent implements OnInit, OnDestroy {

  deckSubscription!: Subscription;

  deckId: string = '';
  decks: Deck[] = [];
  deck: Deck = new Deck();

  cardDetails!: Card;

  isDrawerOpen: boolean = false;
  showModal: boolean = false;
  showModalCard: boolean = false;

  constructor(private deckService: DeckService) { }

  ngOnInit(): void {
    this.getList();
  }

  ngOnDestroy(): void {
    if (this.deckSubscription) {
      this.deckSubscription.unsubscribe();
    }
  }

  getList(): void {
    this.deckSubscription = this.deckService.getDeck().subscribe(deck => {
      if (deck && deck.length > 0) {
        this.decks = deck;
      } else {
        this.decks = [];
      }
    });
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
  }

  deleteDeck(deckId: string): void {
    this.deckService.deleteDeck(deckId);
    this.toggleModal();
  }

  deleteConfirm(deckId: string): void {
    this.deckId = deckId;
    this.toggleModal();
  }

  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  detailDeck(deck: Deck): void {
    this.deck = deck;
    this.toggleDrawer();
  }

  toggleModalDetails(): void {
    this.showModalCard = !this.showModalCard;
  }

  getDetails(item: Card): void {
    this.cardDetails = item;
    this.toggleModalDetails();
  }

  getNumberOfUniqueTypes(): number {
    if (!this.deck || !this.deck.cards || this.deck.cards.length === 0) {
      return 0;
    }

    let uniqueTypes = new Set<string>();

    this.deck.cards.forEach(card => {
      if (card.types) {
        card.types.forEach(type => {
          uniqueTypes.add(type);
        });
      }
    });

    return uniqueTypes.size;
  }

  getTypesWithCount(): { [key: string]: number } {
    if (!this.deck || !this.deck.cards || this.deck.cards.length === 0) {
      return {};
    }

    let typesCount: { [key: string]: number } = {};

    this.deck.cards.forEach(card => {
      if (card.types) {
        card.types.forEach(type => {
          typesCount[type] = (typesCount[type] || 0) + 1;
        });
      }
    });

    return typesCount;
  }

  getSupertypesWithCount(): { [key: string]: number } {
    if (!this.deck || !this.deck.cards || this.deck.cards.length === 0) {
      return {};
    }

    let supertypesCount: { [key: string]: number } = {};

    this.deck.cards.forEach(card => {
      if (card.supertype) {
        supertypesCount[card.supertype] = (supertypesCount[card.supertype] || 0) + 1;
      }
    });

    return supertypesCount;
  }
}
