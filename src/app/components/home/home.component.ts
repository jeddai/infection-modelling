import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';
import { DecimalPipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  date: string;
  region: string;

  Math = Math;
  regions: Regions = environment.regions;
  percentDetectedByMedicalVisit: number = environment.percentDetectedByMedicalVisit;
  percentInfectedMedicalVisitsTested: number = environment.percentInfectedMedicalVisitsTested;
  percentInfectedSeekingMedicalTreatment: number = environment.percentInfectedSeekingMedicalTreatment;
  daysInfectionToOnset: number = environment.daysInfectionToOnset;
  daysOnsetToPositive: number = environment.daysOnsetToPositive;
  percentDailyGrowth: number = environment.percentDailyGrowth;
  daysOnsetToDeath: number = environment.daysOnsetToDeath;
  percentInfectedFatality: number = environment.percentInfectedFatality;

  constructor(private numberPipe: DecimalPipe, private percentPipe: PercentPipe) {}

  ngOnInit(): void {
    this.region = Object.keys(this.regions)[0];
    this.date = Object.keys(this.regions[this.region])[0];
    console.log(this.region, this.date);
  }

  get casesDetectedByMedicalVisit(): number {
    return this.regions[this.region][this.date].reportedConfirmedCases * this.percentDetectedByMedicalVisit;
  }

  get medicalVisitsWithVirus(): number {
    return this.casesDetectedByMedicalVisit / this.percentInfectedMedicalVisitsTested;
  }

  get infectedWithConfirmedCases(): number {
    return this.medicalVisitsWithVirus / this.percentInfectedSeekingMedicalTreatment;
  }

  get daysInfectedToPositive(): number {
    return this.daysInfectionToOnset + this.daysOnsetToPositive;
  }

  get estimatedInfectedOnDate(): number {
    return this.infectedWithConfirmedCases * Math.pow(1 + this.percentDailyGrowth, this.daysInfectedToPositive);
  }

  get infectedPerConfirmedMultiplier(): number {
    return this.estimatedInfectedOnDate / this.regions[this.region][this.date].reportedConfirmedCases;
  }

  get daysInfectedToDeath(): number {
    return this.daysInfectionToOnset + this.daysOnsetToDeath;
  }

  get infectedWithConfirmedDeaths(): number {
    return this.infectedWithConfirmedCases * Math.pow(1 + this.percentDailyGrowth, this.daysInfectedToPositive - this.daysInfectedToDeath);
  }

  get minDeaths(): number {
    return this.estimatedInfectedOnDate * this.percentInfectedFatality;
  }

  get tiles(): GridTile[] {
    return [{
      content: [{
        header: `Date of confirmed cases report`,
        value: this.date
      }, {
        header: `Confirmed cases reported on ${this.date}`,
        value: this.regions[this.region][this.date].reportedConfirmedCases
      }, {
        header: `Fatalities reported on ${this.date}`,
        value: this.regions[this.region][this.date].reportedFatalities
      }]
    }, {
      content: [{
        header: `Percent cases detected by medical visit`,
        value: this.percentPipe.transform(this.percentDetectedByMedicalVisit),
        tooltip: 'Test'
      }, {
        header: `Number cases detected by medical visit`,
        value: this.numberPipe.transform(Math.floor(this.casesDetectedByMedicalVisit), '.0')
      }]
    }, {
      content: [{
        header: `Percent medical visits with virus that have been tested`,
        value: this.percentPipe.transform(this.percentInfectedMedicalVisitsTested)
      }, {
        header: `Number medical visits with virus`,
        value: Math.floor(this.medicalVisitsWithVirus)
      }]
    }, {
      content: [{
        header: `Percent infected that seek medical treatment`,
        value: this.percentPipe.transform(this.percentInfectedSeekingMedicalTreatment)
      }, {
        header: `Number infected when confirmed cases were infected`,
        value: Math.floor(this.infectedWithConfirmedCases)
      }]
    }, {
      content: [{
        header: `Days between infection and onset of symptoms`,
        value: this.daysInfectionToOnset
      }, {
        header: `Days between onser and positive diagnosis`,
        value: this.daysOnsetToPositive
      }, {
        header: `Days between infection and positive diagnosis`,
        value: this.daysInfectedToPositive
      }]
    }, {
      content: [{
        header: `Percent daily growth rate`,
        value: this.percentDailyGrowth * 100 + '%'
      }, {
        header: `Estimated infected in ${this.region} on ${this.date} per ${this.regions[this.region][this.date].reportedConfirmedCases} reported cases`,
        value: this.numberPipe.transform(Math.floor(this.estimatedInfectedOnDate), '.0')
      }, {
        header: `Estimated infected per confirmed case`,
        value: Math.floor(this.infectedPerConfirmedMultiplier)
      }]
    }, {
      content: [{
        header: `Days between onset of symptoms and death`,
        value: this.daysOnsetToDeath
      }, {
        header: `Days between infection and death`,
        value: this.daysInfectedToDeath
      }]
    }, {
      content: [{
        header: `Estimated number infected in ${this.region} on Feb 21, 2020`,
        value: Math.floor(this.infectedWithConfirmedDeaths)
      }, {
        header: `Fatality rate`,
        value: this.percentInfectedFatality * 100 + '%'
      }]
    }, {
      content: [{
        header: `Estimated minimum number ${this.region} deaths based on ${this.numberPipe.transform(Math.floor(this.estimatedInfectedOnDate), '.0')}`,
        value: Math.floor(this.minDeaths)
      }]
    }];
  }
}

interface Regions {
  [key: string]: Dates
}

interface Dates {
  [key: string]: {
    reportedConfirmedCases: number;
    reportedFatalities: number;
  }
}

interface GridTile {
  content: {
    header: string,
    value: any,
    tooltip?: string
  }[];
}
