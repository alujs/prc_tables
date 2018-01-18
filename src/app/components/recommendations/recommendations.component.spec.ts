import { ComponentFixture, TestBed, async } from '@angular/core/testing'
import { By }              from '@angular/platform-browser'
import { DebugElement }    from '@angular/core'
import { RecommendationsComponent } from './recommendations.component'
import { StoreService, RequestService, RecDetailsData } from '../../services'
import { BehaviorSubject } from 'rxjs'

const mockStore = new BehaviorSubject({
  scrollTo: '1BR',
  filters: ['STD'],
  RecDetails: RecDetailsData
})

const storeStub = {
  get( str )  {
    return mockStore.pluck(str).filter(Boolean)
  }
}

const requestStub = {
  fetchAndSeed() {
    return mockStore.pluck('RecDetails').filter(Boolean)
  }
}


describe('RecommendationsComponent ', () => {

  let comp:    RecommendationsComponent;
  let fixture: ComponentFixture<RecommendationsComponent>;
  let de:      DebugElement;
  let el:      HTMLElement;
  let storeService;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ RecommendationsComponent ],
      providers:    [ 
        {provide: StoreService, useValue: storeStub },
        {provide: RequestService, useValue: requestStub }
       ]
    })
    .compileComponents()

    fixture = TestBed.createComponent(RecommendationsComponent);
    comp    = fixture.componentInstance;
    storeService = TestBed.get(StoreService);
 
    de = fixture.debugElement.query(By.css('tbody'));
    el = de.nativeElement;

  });

  it('should do something', () => {
    fixture.detectChanges();
    const content = el;

    console.log('This is the content', content)
    expect('hi').toContain('hi');
  });
});