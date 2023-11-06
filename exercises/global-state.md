# Global State w/ Observables and Signals

In any size of applications it pays off to slice responsibilities and agree on standards.
Here we will introduce a global state to our application to manage the movie data.

## Goal

Maintain all logic withing a global state and cache the last results.

## Store Favorite Movies as Signal

Refactor the favorite methods in `MovieService`.

<details>
  <summary>MovieService</summary>

```ts
// src/app/movies/movie.service.ts
import { rxState } from '@rx-angular/state';

private state = rxState<{ favorites: (MovieModel & { comment: string })[] }>(({ set }) => {
    const storedFavorites = localStorage.getItem('my-movies');
    set({ favorites: storedFavorites ? JSON.parse(storedFavorites) : [] });
});

favorites = this.state.signal('favorites');

private updateLocalStorage = effect(() => {
    // update the local storage whenever favorites change
  if (typeof localStorage === "undefined") return;
  localStorage.setItem('my-movies', JSON.stringify(this.favorites()));
});

// OVERWRITE OLD LOGIC WITH THIS 👇
setFavorites(favorites: (MovieModel & { comment: string })[]) {
  this.state.set({ favorites });
}

// DELETE THIS 👇
getFavorites(): (MovieModel & { comment: string })[] {
  if (typeof localStorage === "undefined") return [];
  const movies = localStorage.getItem('my-movies');
  return movies ? JSON.parse(movies) : [];
}
```

</details>

Adjust usages in `MyMovieListComponent`

<details>
  <summary>MyMovieListComponent</summary>

```ts
// src/app/movies/my-movie-list/my-movie-list.component.ts

// replace this 👇
this.movieService.getFavorites()

// with this 👇
this.movieService.favorites()
```

Replace all usages of `getFavorites` with the new favorites signal. Test id it is still working.

</details>


## Create a computed for the favorites as Dictionary

<details>
  <summary>MovieService</summary>

```ts
// src/app/movies/movie.service.ts

import { toDictionary } from '@rx-angular/cdk/transformations';

favoritesMap = this.state.computed(({ favorites }) => toDictionary(favorites(), 'id'));

```

</details>

## Compute the favorite state in the movie-detail-page

<details>
  <summary>MovieDetailPageComponent</summary>

```ts
// src/app/movies/movie-detail-page/movie-detail-page.component.ts

movie = this.state.computed(({ movieState }) => {
  return {
    ...movieState().movie!,
    isFavorite: this.movieService.favoritesMap()[movieState().movie!.id]
  };
});
```

</details>

## Display the favorite state

<details>
  <summary>MovieDetailPageComponent</summary>

```html

<!-- src/app/movies/movie-detail-page/movie-detail-page.component.html -->
<ui-detail-grid *ngIf="movie() as movie; else: loader">
  <div detailGridMedia>
    <!-- ADD THIS 👇-->
    <span class="favourite-btn" *ngIf="!movie.isFavorite" >☆</span>
    <span class="favourite-btn" *ngIf="movie.isFavorite" >🌟</span>
    
    <img class="aspectRatio-2-3 fit-cover"
         [src]="movie.poster_path | movieImage: 780"
         [alt]="movie.title"
         width="780px"
         height="1170px">
  </div>
```

</details>
