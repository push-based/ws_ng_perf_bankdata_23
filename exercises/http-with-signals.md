# Http with Signals exercise

In this exercise we will learn more details on how observables and signals match together.

## Goal

Derive state from an asynchronous source including error handling.

## Movie fetching with signals

Create a `movie: TMDBMovieDetailsModel` signal in `MovieDetailPageComponent` by using the `toSignal` method
and refactor the current fetching logic.

<details>
  <summary>MovieDetailPageComponent</summary>

```ts
// src/app/movie/movie-detail-page/movie-detail-page.component.ts

import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

// DELETE THIS  
// movie$!: Observable<TMDBMovieDetailsModel>;
movie = toSignal(
  this.activatedRoute.params.pipe(
    switchMap((params) => this.movieService.getMovieById(params['id']))
  ),
  {
      initialValue: null
  }
)

ngOnInit(): void {
  this.activatedRoute.params.subscribe((params) => {
    // DELETE THIS  
    //  this.movie$ = this.movieService.getMovieById(params['id']);   
    this.credits$ = this.movieService.getMovieCredits(params['id']);
    this.recommendations$ = this.movieService.getMovieRecommendations(
      params['id']
    );
  })
}

```

</details>

Use the newly created `movie` signal in the template.

<details>
  <summary>MovieDetailPageComponent Template</summary>

  ```html
  <!-- src/app/movie-detail-page/movie-detail-page.component.html -->
  
  <ui-detail-grid *ngIf="movie() as movie; else: loader">
    
  </ui-detail-grid>
  ```

As we have now a push/pull system connected with an HTTP request we have to consider the loaging  

</details>

## Error Handling

Produce an error, and you'll notice the page stops functioning as there is no proper error handling being made.

Open `movie.service.ts` and add the following snippet:

```typescript
// src/app/movie/movie.service.ts

getMovieById(id: string): Observable<TMDBMovieDetailsModel> {
  return this.httpClient.get<TMDBMovieDetailsModel>(
    `${environment.tmdbBaseUrl}/3/movie/${id}`
  ).pipe(
    map((v) => {
        // movie ID of your choice :) 
      if (id === '363063') {
        throw new Error('BOOOOMMMMMM!!!!!');
      }
      return v;
    })
  );
}
```


Let's fix that by handling our errors as well.

As error handling with signals is a bit of a hassle we have to create an intermediate computed to implement the try catch block.

<details>
  <summary>MovieDetailPageComponent</summary>

```ts
// src/app/movie-detail-page/movie-detail-page.component.ts

// RENAMED
_currentMovie = toSignal(...); 

// NEW INTERMEDIATE COMPUTED
currentMovie = computed(() => {
  try {
    return this._currentMovie();
  } catch (e) {
    console.log('ERROR in signals!!');
    return null;
  }
})
```

</details>

## Bonus: Refactor the error handling to RxJS

To understand why a separate error channel is important we use RxJS and it's error channel implementation.
