# Contextual Template States Exercises

In this exercise we will get to know different techniques to maintain contextual states provided by asynchronous data
structures in the template.

## Goal

The goal of this exercise is to learn how to make use of contextual template states in order to provide the users of your
application a better experience consuming it. On top of that you will learn how to implement contextual template states
in a very developer friendly way.

## MovieSearchPage

In this exercise we want to make use of the `rxLet` directive in order to provide our users contextual state information
derived from network request we perform to receive values for the users search input.

### Initial Suspense State

As a first step, let's handle the suspense state of the template (the loader). 
The initial suspense state is already in place with the `*ngIf async hack`.  

Start by introducing the `rxLet` Directive to your template in favor of `*ngIf`.   
You can import the `LetModule` from `'@rx-angular/template/let'`.

For the sake of consistency rename the currently in place `ng-template #loader` to `suspense`.

Be aware that you need to bind the `movie$` directly to the `rxLet` and get rid of the `async` pipe as well.

<details>
  <summary>Initial Suspense state</summary>

```html
<!--movie-search-page.component.html-->

<ng-container *rxLet="movies$; let movies; suspense: suspense; error: error; suspenseTrg: suspenseTrg$">

    <!-- the template-->
  
</ng-container>

<ng-template #suspense>
  <div class="loader"></div>
</ng-template>


```

</details>

Great, serve the application and take a look if the initial suspense state is displayed correctly.
You probably want to open your `devtools => Network` tab and hit `disable cache`

```bash
  ng serve
```

### Template Trigger

We still miss a crucial feature for our `suspense` state to be perfect. When performing a new search, we want to show
the user again the `suspense` template.
For this to work, we need to proactively give the `rxLet` Directive a hint that it should switch to the `suspense`
state.  

We do this by introducing a `suspenseTrg$: Subject<void>` in our `MovieSearchPageComponent`.

The `MovieSearchPageComponent` needs to call it's `next()` method whenever a new search is fired. This way we can switch to
the suspense template while we are waiting for the next result to be received.

Back in the template, use the `suspenseTrg: suspenseTrg$` input property of the `rxLet` directive to bind the subject to
the directive.

<details>
  <summary>Solution: Template Trigger</summary>

```ts

readonly suspenseTrg$ = new Subject<void>();

// in onInit

this.movies$ = this.activatedRoute.params.pipe(
        switchMap((params) => {
          // call the suspenseTrg when getting new route params
          this.suspenseTrg$.next();
          return this.movieService.searchMovies(params.query);
        })
);

```

```html
<!--movie-search-page.component.html-->

<ng-container *rxLet="movies$; let movies; rxSuspense: suspense; suspenseTrg: suspenseTrg$">

</ng-container>
```

</details>

Great, serve the application and take a look if the initial suspense state as well as the intermediate suspense state are
displayed correctly. You probably want to open your `devtools => Network` tab and hit `disable cache`.

```bash
ng serve
```

### Error Template

The only thing left is having a dedicated `error` template.

Inside `MovieSearchPageComponent`s template, define an `ng-template` with the name `error`.
Assign it to the `rxLet` Directives `error:` input property.

If you want, you can use the `<svg-icon name="error">` component for your error template.

<details>
  <summary>Solution: Error Template</summary>

```html
<!--movie-search-page.component.html-->

<ng-container *rxLet="movies$; let movies; error: error; suspense: suspense; suspenseTrg: suspenseTrg$">

</ng-container>

<ng-template #error>
  <h2>An error occurred</h2>
  <div>
    <svg-icon name="error" size="350px"></svg-icon></div>
</ng-template>
```

</details>

Great, serve the application and take a look if all the contextual states are
displayed correctly. You probably want to open your `devtools => Network` tab and hit `disable cache`.

For raising an error, navigate to the `MovieSearchComponent`, do a search, go to the `Network Tab` and select `Offline` in 
the `throttling` dropdown selection.

```bash
ng serve
```


## Bonus: MovieSearchControl

If you like, you can move strait to the `MovieSearchControlComponent` and apply the very same procedure in order to
display contextual states.

Keep in mind that you don't want to display any initial suspense state. Since an empty search shouldn't load anything
in this very case :).

Take a look at the [`startWith` operator function](https://rxjs.dev/api/operators/startWith)

<details>
    <summary>Hint for initial state</summary>

```ts
movies$ = this.searchTerm$.pipe(
    switchMap((term) => {
      // if term, trigger suspense state & return movieSearch with term
      // else return of([])
    }),
    startWith([])
  );
```

</details>
