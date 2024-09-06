import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Game } from 'src/app/_models/game';
import { LeaderboardEntry } from 'src/app/_models/leaderboard';
import { GameService } from 'src/app/_services/game.service';
import { FilterPipe } from '../shared/filter.pipe';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
  providers: [FilterPipe] // Add FilterPipe to the providers
})
export class LeaderboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['username', 'gamesWon', 'gamesLost', 'totalGames', 'winrate'];
  dataSource: MatTableDataSource<LeaderboardEntry>;
  initialData: any;
  isLoadingResults = true;
  searchValue: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private gameService: GameService, private filterPipe: FilterPipe) {
    this.dataSource = new MatTableDataSource<LeaderboardEntry>([]);
  }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(games => {
      this.calculateLeaderboard(games);
      this.isLoadingResults = false;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  calculateLeaderboard(games: Game[]): void {
    const userStats: { [key: string]: { won: number; lost: number } } = {};

    games.forEach(game => {
      if (game.winner) {
        if (!userStats[game.winner]) {
          userStats[game.winner] = { won: 0, lost: 0 };
        }
        userStats[game.winner].won += 1;
      }

      if (game.username1 && game.winner !== game.username1) {
        if (!userStats[game.username1]) {
          userStats[game.username1] = { won: 0, lost: 0 };
        }
        userStats[game.username1].lost += 1;
      }

      if (game.username2 && game.winner !== game.username2) {
        if (!userStats[game.username2]) {
          userStats[game.username2] = { won: 0, lost: 0 };
        }
        userStats[game.username2].lost += 1;
      }
    });

    const leaderboard = Object.keys(userStats).map(username => {
      const stats = userStats[username];
      const totalGames = stats.won + stats.lost;
      const winrate = totalGames > 0 ? (stats.won / totalGames) * 100 : 0;
      return {
        username,
        gamesWon: stats.won,
        gamesLost: stats.lost,
        winrate: parseFloat(winrate.toFixed(2)),
        totalGames
      };
    });

    this.dataSource.data = leaderboard.sort((a, b) => b.winrate - a.winrate);
    this.initialData = leaderboard.sort((a, b) => b.winrate - a.winrate);
  }

  applyFilter() {
    if (this.searchValue) {
      this.dataSource.data = this.filterPipe.transform(this.dataSource.data, 'username', this.searchValue);
    } else {
      this.dataSource.data = this.initialData;
    }
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  onSearchChange(searchValue: string) {
    this.searchValue = searchValue;
    this.applyFilter();
  }
}
