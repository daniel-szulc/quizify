import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizCreatorComponentComponent } from './quiz-creator.component';

describe('QuizCreatorComponentComponent', () => {
  let component: QuizCreatorComponentComponent;
  let fixture: ComponentFixture<QuizCreatorComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizCreatorComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizCreatorComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
