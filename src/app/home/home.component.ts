import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { KeyValue } from '@angular/common';
import { SportService } from '../services/sport.service';
import { REGION } from '../shared/shared';

@Component({
  selector: 'bm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  regionCompleted: boolean = false;
  rechercheGroupActive: boolean = true;
  // rechercheResultatActive: boolean = true;
  rechercheResultatActive: number = 0;
  secondFormGroup: FormGroup;
  groupSport: Map<string, string> = new Map();

  region: string;
  group: string;
  groupDisplay: string;
  resultats: Array<any> = [];
  regionLength: number;
  constructor(private http: HttpClient, private sportService: SportService) { }

  ngOnInit() {
    this.regionLength = Object.keys(REGION).length;
    for (let region in REGION) {
      this.sportService.getOddGroup('UPCOMING', region).subscribe((data: any) => {
        this.resultats = [...this.resultats, ...data];
        this.rechercheResultatActive += 1;
      });
    }
  }

  // selectRegion(region: string, regionDisplay: string) {
  //   this.region = region;
  //   this.rechercheGroupActive = true;
  //   this.regionCompleted = true;
  //   this.rechercheResultatActive = true;

  //   this.groupDisplay = regionDisplay;
  //   for (let region in Object.keys(REGION)) {
  //     this.sportService.getOddGroup('UPCOMING', region).subscribe((data: any) => {
  //       console.log(data);
  //       this.resultats = [...this.resultats, data];
  //       this.rechercheResultatActive = false;
  //     });
  //   }

    // this.http.get(`https://api.the-odds-api.com/v3/odds?sport=UPCOMING&region=${region}&mkt=h2h&apiKey=${apiKey}`)
    //   .subscribe((data: any) => {
    //     console.log(data);

    //     // console.log('Remaining requests', data.headers['x-requests-remaining'])
    //     // console.log('Used requests', data.headers['x-requests-used'])
    //     for (let sport of data.data) {
    //       if (!this.groupSport.has(sport.sport_key)) {
    //         this.groupSport.set(sport.sport_key, sport.sport_nice);
    //       }
    //     }

    //     this.rechercheGroupActive = false;
    //   });
  // }

  sortByKey = (a: KeyValue<string, string>, b: KeyValue<string, string>): number => {
    return a.value.localeCompare(b.value);
  }

  // selectGroup(group: string, groupDisplay: string) {
  //   this.rechercheResultatActive = true;
  //   this.group = group;
  //   this.groupDisplay = groupDisplay;
  //   this.sportService.getOddGroup(this.group, this.region).subscribe((data: any) => {
  //     console.log(data);
  //     this.resultats = data;
  //     this.rechercheResultatActive = false;
  //   });
  // }
}
