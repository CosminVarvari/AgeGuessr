import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Game } from 'src/app/_models/game';
import { AuthService } from 'src/app/_services/auth.service';
import { GameService } from 'src/app/_services/game.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit, AfterViewInit {
  games: Game[] = [];
  currentUser: any;
  dataSource: MatTableDataSource<Game>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private authService: AuthService, private gameService: GameService) {
    this.dataSource = new MatTableDataSource<Game>([]);
  }

  ngOnInit(): void {
    const user_id = this.authService.getCurrentUser().user_id;
    this.authService.getUserByID(user_id).subscribe(data => {
      this.currentUser = data;
      this.loadUserGames();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadUserGames() {
    this.gameService.getGames().subscribe(games => {
      this.games = games.filter(game => game.username1 === this.currentUser.username || game.username2 === this.currentUser.username);
      this.dataSource.data = this.games;
    });
  }
}