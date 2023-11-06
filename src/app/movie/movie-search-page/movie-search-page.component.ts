import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { MovieModel } from '../movie-model';
import { MovieService } from '../movie.service';
import { MovieListComponent } from '../movie-list/movie-list.component';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-movie-search-page',
    templateUrl: './movie-search-page.component.html',
    styleUrls: ['./movie-search-page.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MovieListComponent,
        AsyncPipe,
    ],
})
export class MovieSearchPageComponent implements OnInit {
  movies$!: Observable<MovieModel[]>;

  constructor(
    private movieService: MovieService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.movies$ = this.activatedRoute.params.pipe(
      switchMap((params) => {
        return this.movieService.searchMovies(params['query']);
      })
    );
  }
}
