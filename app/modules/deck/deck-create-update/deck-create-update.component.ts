import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { cardCountValidator, uniqueCardNameValidator } from 'src/app/_helpers/validator';
import { Card } from 'src/app/_models/card.model';
import { Deck } from 'src/app/_models/deck.model';
import { CardsService } from 'src/app/_services/cards.service';
import { DeckService } from 'src/app/_services/desk.services';
import { TypeService } from 'src/app/_services/type.services';
import { LoadingComponent } from 'src/app/shared/components/loading/loading.component';
import { TitlePageComponent } from 'src/app/shared/components/title-page/title-page.component';

@Component({
  selector: 'app-deck-create-update',
  templateUrl: './deck-create-update.component.html',
  styleUrls: ['./deck-create-update.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TitlePageComponent,
    LoadingComponent
  ]
})
export class DeckCreateUpadateComponent implements OnInit {

  form!: FormGroup;

  cards: Card[] = [];
  searchTerm: string = '';
  decks: Deck[] = [];
  types: [] = [];

  showModal: boolean = false;
  cardDetails!: Card;

  isDrawerOpen: boolean = false;
  itensDeck: Card[] = [];
  deck: Deck = new Deck();

  isLoading: boolean = false;
  formSubmitted = false;
  isDeck: boolean = false

  deckId: string = '';

  constructor(
    private cardsService: CardsService,
    private deckService: DeckService,
    private typeService: TypeService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.deckId = this._route.snapshot.paramMap.get('id') ?? '';
    if (this.deckId) {
      this.deckService.getDeckById(this.deckId).subscribe(deck => {
        if (deck) {
          this.deck = deck;
          this.itensDeck = deck.cards
        }
      });
    } else {
      this.deck = new Deck();
      this.itensDeck = [];
    }

    this.loadCard();
    this.loadTyps();
    this.buildForm();
  }

  buildForm(): void {
    this.form = this._formBuilder.group({
      name: ['', Validators.required],
      cards: [[], [cardCountValidator(1, 60), uniqueCardNameValidator()]]
    });
  }

  get f(): any {
    return this.form.controls;
  }

  toggleDrawer(): void {
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  loadCard(): void {
    this.isLoading = true;
    this.cardsService.read().subscribe(
      (response) => {
        this.cards = response;
      },
      (error) => {
        console.error('Error al cargar las cartas:', error);
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  search(query: string, type?: string): void {
    this.isLoading = true;

    let queryParams = `name:${query}`;
    if (type) {
      queryParams = `types:${type}`;
    }
  
    this.cardsService.searchCards(queryParams).subscribe(
      (response) => {
        this.cards = response;
      },
      (error) => {
        console.error('Error en la búsqueda de cartas:', error);
        this.cards = [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  filterType(type: string): void {
    this.searchTerm = '';
    this.search('', type);
  }

  onInputChange(): void {
    const searchTerm = this.searchTerm.trim();

    if (!searchTerm) {
      this.loadCard();
    } else if (searchTerm.length >= 3) {
      this.search(this.searchTerm);
    }
  }

  loadTyps(): void {
    this.typeService.read().subscribe(
      (response) => {
        this.types = response;
      },
      (error) => {
        console.error('Error al cargar los tipos:', error);
      }
    );
  }

  addToDeck(card: Card): void {
    this.itensDeck.push(card);
    this.toggleModal();
  }

  onSubmit(): void {
    this.form.controls['cards'].setValue(this.itensDeck);
    this.formSubmitted = true;
    if (this.form.valid) {
      this.deck.cards = this.itensDeck;

      if (this.deckId !== 'null') {
        const updated = this.deckService.updateDeck(this.deck);
        if (updated) {
          this.toggleModal();
          this._router.navigateByUrl('/');
        } 
      } else {
        const saved = this.deckService.addToDeck(this.deck);
        if (saved) {
          this.toggleModal();
          this._router.navigateByUrl('/');
        } 
      }

    }
  }

  getList(): void {
    this.deckService.getDeck().subscribe(deck => {
      this.decks = deck;
    });
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
  }

  getDetails(item: Card, deck: boolean): void {
    this.cardDetails = item;
    this.isDeck = deck;
    this.toggleModal();
  }

  deleteCartDeck(card: Card): void {
    const index = this.itensDeck.indexOf(card);
    if (index !== -1) {
      this.itensDeck.splice(index, 1);
      this.toggleModal();
    }
  }

}
