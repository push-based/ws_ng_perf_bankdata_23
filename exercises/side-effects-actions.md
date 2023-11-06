# Side Effects with actions

Actions are a way to encapsulate side effects in a reactive way. 

## Goal

Maintain all logic within global state and cache the last results.

## Make the favorite state editable

1. Create `rxActions`
2. Add toggleFavorite action to `MovieService`
3. Create favorite button in MovieDetailPageComponent
4. Map button to `rxActions` to edit favorite state

Introduce `rxActions` in `MovieService` and connect `setFavorites$` to `favorites` state.

Remove the `setFavorites` method and replace it with the `setFavorites` action where needed.

<details>
  <summary>MovieService Actions</summary>

```ts
// movie.service.ts
actions = rxActions<{ setFavorites: (MovieModel & { comment: string })[] }>();

private state = rxState<{ favorites: (MovieModel & { comment: string })[] }>(({set, connect}) => {
  // removed for brevity

  connect('favorites', this.actions.setFavorites$);
});
```

</details>

<details>
  <summary>MyMovieListComponent Actions</summary>

```ts
// BEFORE
ngOnInit(): void {
  this.favorites.valueChanges
    .pipe(filter(() => this.favorites.valid))
    .subscribe(() => {
      this.movieService.setFavorites(this.favorites.value); // <-- removed
    });
}

// AFTER 
ngOnInit(): void {
  this.favorites.valueChanges
    .pipe(filter(() => this.favorites.valid))
    .subscribe(() => {
      this.movieService.actions.setFavorites(this.favorites.value); // <-- added
    });
}
```

</details>

Add a `toggleFavorite` action to the `MovieService` and use it to toggle the favorite state of a movie.

<details>
  <summary>MovieService Actions</summary>

```ts
// movie.service.ts
actions = rxActions<{ setFavorites: (MovieModel & { comment: string })[]; toggleFavorite: MovieModel }>();

private state = rxState<{ favorites: (MovieModel & { comment: string })[] }>(({set, connect}) => {
  // removed for brevity

  connect('favorites', this.actions.setFavorites$);

  connect('favorites', this.actions.toggleFavorite$, (state, movie) => {
    const isFavorite = state.favorites.find((m) => m.id === movie.id);
    if (isFavorite) {
      return state.favorites.filter((m) => m.id !== movie.id);
    } else {
      return [...state.favorites, movie];
    }
  })
});
```
</details>

Refactor the button to the `MovieDetailPageComponent` to toggle the favorite state of a movie.

<details>
  <summary>MovieDetailPageComponent</summary>

```ts
<!--movie-detail-page.component.ts-->
toggleFavorite = (movie: any) => this.movieService.actions.toggleFavorite(movie);
```

</details>

<details>
  <summary>MovieDetailPageComponent Template</summary>

```html
<!--movie-detail-page.component.html-->
<span class="favourite-btn" (click)="toggleFavorite(movie)">
  {{ movie.isFavorite ? '🌟' : '☆' }}
</span>
```

</details>
