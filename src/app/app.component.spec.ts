import { TestBed, ComponentFixture, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { AppModule }    from './app.module';
import {DebugElement} from "@angular/core";
import {By} from "@angular/platform-browser";

let comp:    AppComponent;
let fixture: ComponentFixture<AppComponent>;

describe('AppComponent', () => {
  beforeEach(async(() => { // We wrap it in async, because we want to compile modules and external files (like HTML) asynchronously.
    TestBed.configureTestingModule({ // TestBed configures modules, as in our AppModule, but for this test only.
    	imports: [ AppModule ]
    }).compileComponents()
    .then(() => {
      // We create a component to test using the TestBed.
    	fixture = TestBed.createComponent(AppComponent);
    	// And get the actual instance itself to do different things that we can test.
    	comp = fixture.componentInstance;
    });
  }));

  it('can instantiate it', () => {
    // this means that the created component instance is not null.
    expect(comp).not.toBeNull();
  });

  it('should create the app', async(() => {
    expect(comp).toBeTruthy();
  }));

  it(`should have as title 'Tour of Heroes'`, async(() => {
    // this tests the title property of the component instance.
    expect(comp.title).toEqual('Tour of Heroes');
  }));

  it('should render title in a h1 tag', async(() => {
    // detectChanges gets the title in the HTML view.
    fixture.detectChanges();
    // we find the element to observe, using a CSS selector 'h1'
    let de: DebugElement = fixture.debugElement.query(By.css('h1'));
    // get the HTML element
    let el: HTMLElement = de.nativeElement;
    // we observe the textContent of the HTML element.
    expect(el.textContent).toContain('Tour of Heroes');

    // this is another way of doing the same test.
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Tour of Heroes');
  }));
});
