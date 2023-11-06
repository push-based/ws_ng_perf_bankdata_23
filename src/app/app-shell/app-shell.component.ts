import { NavigationEnd, Router, RouterLinkActive, RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged, filter, map } from 'rxjs';
import { MovieService } from '../movie/movie.service';
import { DarkModeToggleComponent } from '../ui/component/dark-mode-toggle/dark-mode-toggle.component';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../ui/component/search-bar/search-bar.component';
import { HamburgerButtonComponent } from '../ui/component/hamburger-button/hamburger-button.component';
import { NgFor, AsyncPipe } from '@angular/common';
import { FastSvgComponent } from '@push-based/ngx-fast-svg';
import { SideDrawerComponent } from '../ui/component/side-drawer/side-drawer.component';

@Component({
  selector: 'app-shell',
  templateUrl: './app-shell.component.html',
  styleUrls: ['./app-shell.component.scss'],
  standalone: true,
  imports: [
    SideDrawerComponent,
    RouterLinkActive,
    RouterLink,
    FastSvgComponent,
    NgFor,
    HamburgerButtonComponent,
    SearchBarComponent,
    FormsModule,
    DarkModeToggleComponent,
    AsyncPipe,
  ],
})
export class AppShellComponent implements OnInit {
  sideDrawerOpen = false;

  private _searchValue = '';
  set searchValue(value: string) {
    this._searchValue = value;
    this.router.navigate(['search', value]);
  }
  get searchValue(): string {
    return this._searchValue;
  }
  readonly genres$ = this.movieService.getGenres();

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd && this.sideDrawerOpen),
        map((e) => (e as NavigationEnd).urlAfterRedirects),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.sideDrawerOpen = false;
      });
  }
}
