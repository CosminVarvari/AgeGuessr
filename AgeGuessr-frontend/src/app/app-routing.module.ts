import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './_components/welcome/welcome.component';
import { HomeComponent } from './_components/home/home.component';
import { 
  AuthGuardService as AuthGuard 
} from './_guards/auth-guard.service';
import { GamePvpComponent } from './_components/games/game-pvp/game-pvp.component';
import { GamePvaiComponent } from './_components/games/game-pvai/game-pvai.component';
import { LeaderboardComponent } from './_components/leaderboard/leaderboard.component';
import { HistoryComponent } from './_components/history/history.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  { path: 'game-vs-player', component: GamePvpComponent, canActivate: [AuthGuard]},
  { path: 'game-vs-ai/:difficulty', component: GamePvaiComponent, canActivate: [AuthGuard]},
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard]},
  { path: 'history', component: HistoryComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'welcome', pathMatch: 'full'},
  { path: '', redirectTo: 'welcome',  pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
