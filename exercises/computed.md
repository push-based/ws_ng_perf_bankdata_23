# Computed

Here we will use Angular's rxjs-interop utils and the `computed` function to adopt signals in our codebase.

## Goal

Refactor the genres menu to signals. Use `computed` to detect genre changes.

## Genres List Skeleton

Create a `computed` that tells if the `genres` are still loading or not.
While genres are loading, let's display a loading indicator.

Transform `genres` into a signal by using the `toSignal` api.

Don't forget to also pass an `initialValue` in the `toSignal` because we are working with an asynchronous rxjs observable.


<details>
  <summary>AppShellComponent</summary>

```ts
// src/app/app-shell/app-shell.component.ts

import { toSignal } from '@angular/core/rxjs-interop';

readonly genres = toSignal(this.movieService.getGenres(), { initialValue: [] });
// ...
```

</details>

Also apply changes to the template

<details>
  <summary>AppShellComponent Template</summary>

```html
<!-- src/app/app-shell/app-shell.component.html -->

<!-- use the signal in favour of the async pipe -->
<h3 class="navigation--headline">Genres</h3>
<a
  *ngFor="let genre of genres()"
>
```

</details>

Now create the `genresLoading` computed that should be true as long there are no genres loaded.

<details>
  <summary>AppShellComponent</summary>

```ts
// src/app/app-shell/app-shell.component.ts

import { computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

genres = toSignal(this.movieService.getGenres());
genresLoading = computed(() => this.genres().length === 0);
```

</details>

Use `genresLoading()` in the template to show the loader template or the actual genres listing

<details>
  <summary>AppShellComponent Template</summary>

```html
<!-- src/app/app-shell/app-shell.component.html -->

<!-- use the computed in the template -->

<ng-container *ngIf="!genresLoading(); else: elseTmpl">
  <!-- list rendering -->
</ng-container>

<ng-template #elseTmpl>
  <div>Genres loading...</div>
</ng-template>
```

</details>
