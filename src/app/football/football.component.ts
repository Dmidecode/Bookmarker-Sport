import { Component, OnInit, ViewChild, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';
import { PageEvent } from '@angular/material';
import { SportService } from '../services/sport.service';
import { REGION } from '../shared/shared';

@Component({
  selector: 'bm-football',
  templateUrl: './football.component.html',
  styleUrls: ['./football.component.css']
})
export class FootballComponent implements OnInit, OnDestroy {

  @Input() data: any;

  displayedColumns: string[] = [
    'sport',
    'home_team',
    'visitor_team',
    'max_bet_home_display',
    'max_bet_visitor_display',
    'max_bet_draw_display',
    'total_bet',
    'earnings',
    'countdown'];
  dataSource: MatTableDataSource<object>;
  @ViewChild(MatSort) sort: MatSort;

  pageIndex = 0;
  pageSize = 20;
  pageSizeOptions = [1, 2, 5, 20, 50];

  pageEvent: PageEvent;
  moneyToWin: number = 1000;

  reloadTable: number = 0;
  regionLength: number;

  intervalSport: any;
  constructor(private sportService: SportService, private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    this.regionLength = Object.keys(REGION).length;
    this.reloadTable = this.regionLength;
    this.loadData(0, this.pageSize);
    this.dataSource.sort = this.sort;
    this.intervalSport = setInterval(() => {
      this.onReload();
    }, 60000);

  }

  ngOnDestroy(): void {
    if (this.intervalSport) {
      clearInterval(this.intervalSport);
    }
  }

  loadData(pageIndex: number, pageSize: number) {
    this.dataSource = new MatTableDataSource<object>(this.data.slice(pageIndex, pageIndex + pageSize));
  }

  onPageChange(event) {
    this.pageSize = event.pageSize;
    this.loadData(event.pageIndex, event.pageSize);
  }

  onReload() {
    this.data = [];
    this.reloadTable = 0;
    for (let region in REGION) {
      this.sportService.getOddGroup('UPCOMING', region).subscribe((data: any) => {
        this.data = [...this.data, ...data];
        this.reloadTable += 1;
        this.onReloadResult(this.moneyToWin);
        this.loadData(0, this.pageSize);
      });
    }
  }

  onReloadResult(money: number) {
    this.moneyToWin = money;
    this.data.forEach(res => {
      if (res.amount_bet_home > 0) {
        this.sportService.setBetByOddHome(res, money);
      }

      if (res.amount_bet_visitor > 0) {
        this.sportService.setBetByOddVisitor(res, money);
      }

      if (res.amount_bet_draw > 0) {
        this.sportService.setBetByOddDraw(res, money);
      }

      res.total_bet = Math.round((res.amount_bet_home + res.amount_bet_visitor + res.amount_bet_draw) * 100) / 100;
      res.earnings = Math.round((money - res.total_bet) * 100) / 100;
    });
  }

  checkDateCss(date): string {
    let res: string = 'green';
    let today = new Date();
    var diff = (date.getTime() - today.getTime()) / 1000;
    diff /= 60;
    if (date.getTime() < today.getTime()) {
      res = 'red';
    }
    else if (Math.round(diff) < 30) {
      res = 'orange';
    }

    return res;
  }
}
