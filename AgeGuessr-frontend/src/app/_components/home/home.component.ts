import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  AIGameMode: boolean = false;

  constructor(private router: Router) {
  }

  goToPVP() {
    this.router.navigate(['game-vs-player']);
  }

  goToPVAI(difficulty: string) {
    this.router.navigate([`/game-vs-ai/${difficulty}`]);
  }

  aiGameModeToggle() {
    this.AIGameMode = true;
  }

  cancelAIGameMode() {
    this.AIGameMode = false;
  }
}
