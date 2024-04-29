import { Routes } from '@angular/router';
import { DeckListComponent } from './deck-list/deck-list.component';
import { DeckCreateUpadateComponent } from './deck-create-update/deck-create-update.component';

export default [
    { path: '', component: DeckListComponent },
    { path: 'create/:id', component: DeckCreateUpadateComponent }
] as Routes;
