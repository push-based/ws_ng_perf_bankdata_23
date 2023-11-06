import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'list/:category',
    loadComponent: () =>
      import('./movie/movie-list-page/movie-list-page.component').then(
        (m) => m.MovieListPageComponent
      ),
  },
  {
    path: 'list/genre/:id',
    loadComponent: () =>
      import('./movie/movie-list-page/movie-list-page.component').then(
        (m) => m.MovieListPageComponent
      ),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./movie/movie-detail-page/movie-detail-page.component').then(
        (m) => m.MovieDetailPageComponent
      ),
  },
  {
    path: 'search/:query',
    loadComponent: () =>
      import('./movie/movie-search-page/movie-search-page.component').then(
        (m) => m.MovieSearchPageComponent
      ),
  },
  {
    path: 'my-movies',
    loadComponent: () =>
      import('./movie/my-movie-list/my-movie-list.component').then(
        (m) => m.MyMovieListComponent
      ),
  },
  {
    path: '',
    redirectTo: 'list/popular',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () => import('./not-found-page/not-found-page.component').then(
      (m) => m.NotFoundPageComponent
    )
  },
];

