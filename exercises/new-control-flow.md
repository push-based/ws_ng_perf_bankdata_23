# New Control Flow

In this exercise we start to introduce the new control flow blocks into our codebase.

We will replace directive based control flow (`*ngIf`, `*ngFor`) with the new @-syntax control flow (`@if`, `@for`) and ensure our app renders correctly after the refactoring.

## Goal

Refactor `MovieSearchPage` and `MovieListComponent` and introduce the new control flow.

## Using `@if`

Go to `movie-search-page.component.html` and replace the `*ngIf` in the `movie-list` component with the new `@if` and `@else` syntax.

<details>
  <summary>MovieSearchPage</summary>

```html
<!-- app/movie/movie-search-page/movie-search-page.component.html-->

<!-- BEFORE -->
<movie-list
  *ngIf="movies.length > 0; else: elseTmpl"
  [movies]="movies">
</movie-list>
<ng-template #elseTmpl>
  <div>Sorry, nothing found bra!</div>
</ng-template>

<!-- AFTER -->
@if (movies.length > 0) {
  <movie-list [movies]="movies"></movie-list>
} @else {
  <div>Sorry, nothing found bra!</div>
}
```
</details>

## Using `@if` + `async` pipe

Our `movie-list` component is wrapped by another `ng-container` with `*ngIf` that uses the `async` pipe, let's refactor it to use the new `@if` too. 

Because `<ng-container>` helps us to wrap multiple things together, it is not needed anymore because the `@if` block serves now as a container.

> NOTE: Please don't forget about the `as` in the new `@if` block, it needs to be in a separate expression, so we can use the `;` before it. 

```angular2html
Example:
<div *ngIf="data$ | async as data"></div>
@if(data$ | async; as data) {}
```

<details>
  <summary>MovieSearchPage</summary>

```html
<!-- app/movie/movie-search-page/movie-search-page.component.html-->

<!--BEFORE-->
<ng-container *ngIf="(movies$ | async) as movies; else: loader">
  <!-- <movie-list> here removed for brevity -->
</ng-container>
<ng-template #loader>
  <div class="loader"></div>
</ng-template>

<!--AFTER-->
@if (movies$ | async; as movies) {
    <!-- <movie-list> here removed for brevity -->
} @else {
    <div class="loader"></div>
} 
```

</details>

As we will see, the `<ng-container>` and `<ng-template>` are not needed anymore with the new control flow blocks.

## Using `@for`

Go to `movie-list.component.html` and replace `*ngFor` with the new `@for` block.

The new `@for` block makes `track` required. You can either pass the item itself or the `$index` variable.

> NOTE: The new `@for` block doesn't need the `let` keyword, like the `*ngFor` directive does. 

<details>
  <summary>MovieListComponent</summary>

```html
<!-- app/movie/movie-list/movie-list.component.html-->

<!-- BEFORE -->
<movie-card
  (selected)="navToDetail($event)"
  [movie]="movie"
  *ngFor="let movie of movies">
</movie-card>

<!-- AFTER -->
@for (movie of movies; track $index) {
  <movie-card
    (selected)="navToDetail($event)"
    [movie]="movie">
  </movie-card>
}
```
</details>

## Migration schematics

While we can refactor everything manually by hand, Angular also has provided some schematics, that can do all this work automatically for us.

In order to run the schematics, open the terminal, go to the project folder and run this command: 

```bash
ng generate @angular/core:control-flow
```

> NOTE: The schematics are still in developer preview, meaning that they may introduce bugs in your codebase, so please make sure the migration has refactored everything correctly.

<details>
  <summary>Your git changes list will look something like this</summary>

  ![git-changes-after-schematics.png](images%2Fcontrol-flow%2Fgit-changes-after-schematics.png)

  There are cases that the schematics won't replace (yet), for example. 

  `movie-detail-page.component.html`

  ![not-updated-control-flow.png](images%2Fcontrol-flow%2Fnot-updated-control-flow.png)

</details>
