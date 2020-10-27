import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const apiKey: string = 'a288fdcac49204d45d765c4b9ed2e71b';
const defaultBet: number = 1000;

@Injectable({
  providedIn: 'root'
})
export class SportService {

  group: string;
  region: string;

  constructor(private http: HttpClient) { }

  getOddGroup(group, region) {
    this.group = group;
    this.region = region;
    return this.http.get(`https://api.the-odds-api.com/v3/odds?sport=${group}&region=${this.region}&mkt=h2h&apiKey=${apiKey}`)
      .pipe(
        map((results: any) => {
          let res = [];
          results.data.forEach(match => {
            var item = {
              match: match.teams.join(' / '),
              home_team: match.home_team,
              sport: match.sport_nice,
              countdown: new Date(match.commence_time * 1000),
              visitor_team: '',
              max_bet_home: 0,
              max_bet_visitor: 0,
              max_bet_draw: 0,
              max_bet_home_display: '',
              max_bet_visitor_display: '',
              max_bet_draw_display: '',
              max_bet_home_site: '',
              max_bet_visitor_site: '',
              max_bet_draw_site: '',
              amount_bet_home: 0,
              amount_bet_visitor: 0,
              amount_bet_draw: 0,
              total_bet: 0,
              earnings: 0,
            }

            match.teams.forEach(team => {
              if (team.localeCompare(item.home_team) != 0) {
                item.visitor_team = team;
              }
            })

            match.sites.forEach(site => {
              this.calculBetByOddHome(site.odds.h2h[0], site.site_nice, item);
              this.calculBetByOddVisitor(site.odds.h2h[1], site.site_nice, item);
              this.calculBetByOddDraw(site.odds.h2h[2], site.site_nice, item);
            });

            item.total_bet = Math.round((item.amount_bet_home + item.amount_bet_visitor + item.amount_bet_draw) * 100) / 100;
            item.earnings = Math.round((defaultBet - item.total_bet) * 100) / 100;

            let surebet = 0;
            if (item.max_bet_home > 0) {
              surebet += (1 / item.max_bet_home);
            }
            if (item.max_bet_visitor > 0) {
              surebet += (1 / item.max_bet_visitor);
            }
            if (item.max_bet_draw > 0) {
              surebet += (1 / item.max_bet_draw);
            }

            if (surebet > 0 && surebet < 1) {
              res.push(item);
            }
          });

          return res;
        })
      )
  }

  calculBetByOddHome(siteOdd: number, siteName: string, item) {
    if (siteOdd > item.max_bet_home) {
      item.max_bet_home = siteOdd;
      item.amount_bet_home = Math.round(defaultBet / item.max_bet_home * 100) / 100;
      item.max_bet_home_site = siteName;
      item.max_bet_home_display = `Bet ${item.amount_bet_home} for ${item.home_team} on ${item.max_bet_home_site}`;
    }
    else if (siteOdd == item.max_bet_home) {
      item.max_bet_home_site += ` and ${siteName}`;
      item.max_bet_home_display += item.max_bet_home_site;
    }
  }

  calculBetByOddVisitor(siteOdd: number, siteName: string, item) {
    if (siteOdd > item.max_bet_visitor) {
      item.max_bet_visitor = siteOdd;
      item.amount_bet_visitor = Math.round(defaultBet / item.max_bet_visitor * 100) / 100;
      item.max_bet_visitor_site = siteName;
      item.max_bet_visitor_display = `Bet ${item.amount_bet_visitor} for ${item.visitor_team} on ${item.max_bet_visitor_site}`;
    }
    else if (siteOdd == item.max_bet_visitor) {
      item.max_bet_visitor_site += ` and ${siteName}`;
      item.max_bet_visitor_display += item.max_bet_visitor_site;
    }
  }

  calculBetByOddDraw(siteOdd: number, siteName: string, item) {
    if (siteOdd > item.max_bet_draw) {
      item.max_bet_draw = siteOdd;
      item.amount_bet_draw = Math.round(defaultBet / item.max_bet_draw * 100) / 100;
      item.max_bet_draw_site = siteName;
      item.max_bet_draw_display = `Bet ${item.amount_bet_draw} for a draw on ${item.max_bet_draw_site}`;
    }
    else if (siteOdd == item.max_bet_draw) {
      item.max_bet_draw_site += ` and ${siteName}`;
      item.max_bet_draw_display += item.max_bet_draw_site;
    }
  }

  setBetByOddHome(item, money: number) {
    item.amount_bet_home = Math.round(money / item.max_bet_home * 100) / 100;
    item.max_bet_home_display = `Bet ${item.amount_bet_home} for ${item.home_team} on ${item.max_bet_home_site}`;
  }

  setBetByOddVisitor(item, money: number) {
    item.amount_bet_visitor = Math.round(money / item.max_bet_visitor * 100) / 100;
    item.max_bet_visitor_display = `Bet ${item.amount_bet_visitor} for ${item.visitor_team} on ${item.max_bet_visitor_site}`;
  }

  setBetByOddDraw(item, money: number) {
    item.amount_bet_draw = Math.round(money / item.max_bet_draw * 100) / 100;
    item.max_bet_draw_display = `Bet ${item.amount_bet_draw} for a draw on ${item.max_bet_draw_site}`;
  }
}
