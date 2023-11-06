# Local State with Signals & Observables

In any size of applications it pays off to slice responsibilities and agree on standards.  

## Goal

Maintain all logic withing a local state.

## Introduce Local State to MovieDetailPageComponent

<details>
  <summary>MovieDetailPageComponent</summary>

```ts
// movie-detail-page.component.ts

type MovieDetailPage = {
  movieState: {
    movie: TMDBMovieDetailsModel | null;
    error: string | null;
  }
};


// ...
state = rxState<MovieDetailPage>(({connect, set}) => {
  set({movieState: {movie: null, error: null}});
  connect('movieState', this.activatedRoute.params.pipe(
    switchMap((params) => this.movieService.getMovieById(params['id']).pipe(
      map((movie) => ({movie, error: null})))
    ),
    catchError(_ => of({movie: null, error: 'Error!'})),
  ))
});

movie = this.state.computed(({ movieState }) => movieState().movie);

```

</details>

Test if it is working!


## Recommendation & Credit local state

Move the rest of the UI parts into the local state. Start by adopting the typing and go on with the logic

<details>
  <summary>MovieDetailPageComponent</summary>

```ts
// movie-detail-page.component.ts

type MovieDetailPage = {
    // ...
    recommendationsState: {
        recommendations: {
            results: MovieModel[]
        },
        error: string | null;
    },
    creditsState: {
        credits: TMDBMovieCreditsModel | null,
        error: string | null;
    }
}

state = rxState<MovieDetailPage>(({connect, set}) => {

    set({
        movieState: {movie: null, error: null},
        recommendationsState: {recommendations: null, error: null},
        creditsState: {credits: null, error: null},
    });

    // ...

    connect('recommendationsState', this.activatedRoute.params.pipe(
        switchMap((params) => this.movieService.getMovieById(params['id']).pipe(
            map(recommendations => ({recommendations})),
            catchError(e => of({error: e})),
        ))
    ));

    connect('creditsState', this.activatedRoute.params.pipe(
        switchMap((params) => this.movieService.getMovieById(params['id']).pipe(
            map(credits => ({credits})),
            catchError(e => of({error: e})),
        ))
    ))
});

// ...
recommendations = this.state.computed(({recommendationsState}) => recommendations());
credits = this.state.computed(({creditsState}) => creditsState());

```

</details>

## AppShell Local State

<details>

<summary>AppShellComponent</summary>

```ts
// app-shell.component.ts

state = rxState<State>(({set, connect}) => {
  set({sideDrawerOpen: false});
  
  connect(
    'sideDrawerOpen',
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => (e as NavigationEnd).urlAfterRedirects),
        distinctUntilChanged()
      ),
    () => false
  );
});

effects = rxEffects(({register}) => {
  register(this.state.select('searchValue'), (x) => this.router.navigate(['search', x]));
});

searchValue$ = this.state.select('searchValue');
sideDrawerOpen$ = this.state.select('sideDrawerOpen');

readonly genres$ = this.movieService.getGenres();

toggleSideDrawer() {
  this.state.set(s => ({ sideDrawerOpen: !s.sideDrawerOpen }));
}
```

</details>
