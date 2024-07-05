import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePvaiComponent } from './game-pvai.component';

describe('GamePvaiComponent', () => {
  let component: GamePvaiComponent;
  let fixture: ComponentFixture<GamePvaiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GamePvaiComponent]
    });
    fixture = TestBed.createComponent(GamePvaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
