import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  Subscription,
  concatMap,
  interval,
  map,
  take,
  tap,
  toArray,
} from 'rxjs';
import { Game } from 'src/app/_models/game';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { GameService } from 'src/app/_services/game.service';

@Component({
  selector: 'app-game-pvai',
  templateUrl: './game-pvai.component.html',
  styleUrls: ['./game-pvai.component.scss'],
})
export class GamePvaiComponent implements OnInit, OnDestroy {
  difficulty: string = 'easy';
  isDisabled = true;
  game: Game = {
    gameId: null,
    username1: '',
    username2: null,
    is_pvp: false,
    is_pvai: true,
    image: {
      id: null,
      realAge: null,
      imgPath: '',
    },
    user1_answer: null,
    user2_answer: null,
    ai_answer: null,
    tip_ai: '',
    winner: null,
  };
  user: User | undefined;
  userAnswer: number = 10000;
  realAge: number = 0;
  winner: string = '';
  imgPath: string = '';
  aiAnswer: number = 0;

  progressbarValue = 100;
  curSec: number = 0;
  gameStarted = false;
  gameFinished = false;
  subscription1: Subscription = new Subscription();
  subscription2: Subscription = new Subscription();

  rndInt = Math.floor(Math.random() * 22) + 1;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription1 = this.createRouteParamObservable()
      .pipe(
        concatMap(() => this.createGameObservable())
      )
      .subscribe(
        () => {
          this.isDisabled=false;
        },
        (error) => {
          console.error('Error in initial observable chain:', error);
        }
      );
  }

  startGame(seconds: number) {
    this.gameStarted = true;
    this.subscription2 = this.createTimerObservable(seconds)
      .pipe(
        concatMap(() => this.createGuessAgeObservable())
      )
      .subscribe(
        () => {
          console.log('Guess age observable has been subscribed after timer observable.');
        },
        (error) => {
          console.error('Error in timer observable chain:', error);
        }
      );
  }

  createRouteParamObservable(): Observable<any> {
    return this.route.paramMap.pipe(tap(((params) => {
      const difficultyParam = params.get('difficulty');
      if (difficultyParam) {
        this.difficulty = difficultyParam;
      }
      console.log("intra in route");
    })),
      take(1)
    );
  }

  createGameObservable(): Observable<any> {
    const user_id = this.authService.getCurrentUser().user_id;
    return this.authService.getUserByID(user_id).pipe(
      tap((data) => {
        this.game.image!.imgPath = 'imagine-ai-' + this.rndInt + '.jpg';
        this.game.username1 = data.username;
        this.game.tip_ai = this.difficulty;
        console.log("intra in get user by id");
      }),
      take(1)
    );
  }

  createTimerObservable(seconds: number): Observable<any> {
    this.curSec = seconds;
    const timer$ = interval(1000).pipe(
      take(seconds),
      map((sec) => {
        this.progressbarValue = 100 - (sec * 100) / seconds;
        this.curSec = seconds - sec;

        if (this.curSec === 0) {
          this.subscription2.unsubscribe();
        }
      }),
      toArray()
    );
    return timer$;
  }

  createGuessAgeObservable(): Observable<any> {
    console.log(this.game);
    this.game.user1_answer = this.userAnswer;
    return this.gameService.guessAgeAI(this.game).pipe(tap(((response) => {
      if (response.image) {
        this.realAge = response.image.realAge!;
      }
      this.winner = response.winner!;
      this.gameFinished = true;
    })),
    take(1));
  }

  submitAnswer() {
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
    if (this.game) {
      this.game.user1_answer = this.userAnswer;
      this.gameService.guessAgeAI(this.game).subscribe((response) => {
        if (response.image) {
          this.realAge = response.image.realAge!;
        }
        this.winner = response.winner!;
        this.aiAnswer = response.ai_answer!;
        this.gameFinished = true;
      });
    }
  }

  goHome() {
    this.router.navigate(['home']);
  }

  ngOnDestroy(): void {
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    }
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
  }
}
