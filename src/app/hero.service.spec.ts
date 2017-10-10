import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { Hero } from './hero';
import { HeroService } from './hero.service';

const makeHeroesData = () => [
  { id: 1, name: 'Windstorm' },
  { id: 2, name: 'Bombasto' },
  { id: 3, name: 'Magneta' },
  { id: 4, name: 'Tornado' }
] as Hero[]; // a function that returns heroes data.

const heroesData = [
  { id: 1, name: 'Windstorm' },
  { id: 2, name: 'Bombasto' },
  { id: 3, name: 'Magneta' },
  { id: 4, name: 'Tornado' }
] as Hero[]; // a const heroes data.

const heroData = { id: 1, name: 'Windstorm' } as Hero; // a const hero data.

////////  Tests  /////////////
describe('HeroService (mockBackend)', () => {

  beforeEach( async(() => { // We wrap it in async, because we want to compile modules and external files (like HTML, CSS) asynchronously.
    TestBed.configureTestingModule({ // TestBed configures modules, as in our AppModule, but for this test only.
      imports: [ HttpModule ],
      providers: [
        HeroService,
        { provide: XHRBackend, useClass: MockBackend } // We don't have a backend here, so we 'mock' one for this service.
      ]
    })
    .compileComponents();
  }));

  it('can instantiate service when inject service',
    inject([HeroService], (service: HeroService) => { // one way of 'injecting' HeroService for us to test.
      expect(service instanceof HeroService).toBe(true);
  }));

  it('can instantiate service with "new"',
    inject([Http], (http: Http) => {
      expect(http).not.toBeNull('http should be provided');
      let service = new HeroService(http); // another way of creating HeroService for us to test.
      expect(service instanceof HeroService).toBe(true, 'new service should be ok');
  }));

  it('can provide the mockBackend as XHRBackend',
    inject([XHRBackend], (backend: MockBackend) => { // a way of providing a mock backend that produces http responses.
      expect(backend).not.toBeNull('backend should be provided');
  }));

  describe('when getHeroes', () => {
      let backend: MockBackend;
      let service: HeroService;

      let fakeHeroes: Hero[];
      let response: Response;

      let anotherWayOfFakeHeroes: Hero[];
      let anotherWayOfResponse: Response;

      beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
        backend = be;
        service = new HeroService(http);

        fakeHeroes = makeHeroesData(); // one way of loading heroes data.
        // what is inside is the mocked JSON response, made by us. This should match the real JSON responses from the backend.
        let options = new ResponseOptions({status: 200, body: fakeHeroes});
        response = new Response(options);

        anotherWayOfFakeHeroes = heroesData; // another way of loading heroes data.
        anotherWayOfResponse = new Response(new ResponseOptions({status: 200, body: anotherWayOfFakeHeroes}));
      }));

      it('should have expected fake heroes (then)', async(inject([], () => {
        // subscribe the backend to a response.
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

        service.getHeroes()
          .then(heroes => {
            console.log(heroes);
            expect(heroes.length).toBe(fakeHeroes.length,
              'should have expected no. of heroes');
          });
      })));

      it('should have expected fake heroes with this as well', async(inject([], () => {
        // subscribe the backend to a response created in a different way.
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(anotherWayOfResponse));

        service.getHeroes()
          .then(heroes => {
            console.log(heroes);
            expect(heroes.length).toBe(fakeHeroes.length,
              'should have expected no. of heroes');
          });
      })));

      it('should be OK returning no heroes', async(inject([], () => {
        // make a mock empty response
        let resp = new Response(new ResponseOptions({status: 200, body: []}));
        // subscribe the backend to this response.
        backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

        service.getHeroes()
          .then(heroes => {
            expect(heroes.length).toBe(0, 'should have no heroes');
          })
      })));
  });

  describe('when getHeroes with another HeroService', () => {
    let backend: MockBackend;
    let service: HeroService;
    let fakeHeroes: Hero[];
    let response: Response;

    beforeEach(inject([HeroService, XHRBackend], (hs: HeroService, be: MockBackend) => {
      backend = be;
      service = hs; // this is another way of 'injecting' or making the hero service for the test.
      fakeHeroes = heroesData;
      let options = new ResponseOptions({status: 200, body: fakeHeroes});
      response = new Response(options);
    }));

    it('should have expected fake heroes (then)', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      // We're going to do this test again, using another way of making the hero service for the test.
      service.getHeroes()
        .then(heroes => {
          console.log(heroes);
          expect(heroes.length).toBe(fakeHeroes.length,
            'should have expected no. of heroes');
        });
    })));

    it('should be OK returning no heroes', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: []}));
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

      // This should also work.
      service.getHeroes()
        .then(heroes => {
          expect(heroes.length).toBe(0, 'should have no heroes');
        })
    })));
  });

  describe('when getHero', () => {
    let backend: MockBackend;
    let service: HeroService;
    let fakeHero: Hero;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new HeroService(http);
      fakeHero = heroData;
      let options = new ResponseOptions({status: 200, body: fakeHero});
      response = new Response(options);
    }));

    it('should have expected fake heroes (then)', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

      service.getHero(fakeHero.id)
        .then(hero => {
          console.log(hero);
          expect(hero.id).toBe(fakeHero.id,
            'should have the hero id');
        });
    })));

    // you can test other scenarios, like when there is a bad status, or an empty hero object, etc.
  });
});
