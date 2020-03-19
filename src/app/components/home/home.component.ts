import { Component, OnInit } from '@angular/core';
import { environment } from './../../../environments/environment';
import { DecimalPipe, PercentPipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { ContentItem, Regions } from '../../models';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  Math = Math;
  regions: Regions = environment.regions;
  editing = false;
  open: boolean[] = [];

  form = new FormGroup({});

  get region(): string {
    return this.form.value.region;
  }

  get date(): string {
    return this.form.value.date;
  }

  get reportedConfirmedCases(): number {
    return this.form.value.reportedConfirmedCases;
  }

  get reportedFatalities(): number {
    return this.form.value.reportedFatalities;
  }

  get percentDetectedByMedicalVisit(): number {
    return this.form.value.percentDetectedByMedicalVisit;
  }

  get percentInfectedMedicalVisitsTested(): number {
    return this.form.value.percentInfectedMedicalVisitsTested;
  }

  get percentInfectedSeekingMedicalTreatment(): number {
    return this.form.value.percentInfectedSeekingMedicalTreatment;
  }

  get daysInfectionToOnset(): number {
    return this.form.value.daysInfectionToOnset;
  }

  get daysOnsetToPositive(): number {
    return this.form.value.daysOnsetToPositive;
  }

  get percentDailyGrowth(): number {
    return this.form.value.percentDailyGrowth;
  }

  get daysOnsetToDeath(): number {
    return this.form.value.daysOnsetToDeath;
  }

  get percentInfectedFatality(): number {
    return this.form.value.percentInfectedFatality;
  }

  get casesDetectedByMedicalVisit(): number {
    return this.reportedConfirmedCases * this.percentDetectedByMedicalVisit;
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
    return this.estimatedInfectedOnDate / this.reportedConfirmedCases;
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

  get possibleRegions(): string[] {
    return Object.keys(this.regions);
  }

  get possibleDates(): string[] {
    return Object.keys(this.regions[this.region]);
  }

  get tiles(): ContentItem[] {
    if (Object.keys(this.form.controls || {}).length === 0) {
      return [];
    }
    else {
      return [{
        header: `Date of confirmed cases report`,
        value: this.date
      }, {
        header: `Confirmed cases reported on ${this.date}`,
        value: this.reportedConfirmedCases
      }, {
        header: `Fatalities reported on ${this.date}`,
        value: this.reportedFatalities
      }, {
        header: `Percent of cases detected by medical visit`,
        value: this.percentPipe.transform(this.percentDetectedByMedicalVisit),
        description: `For each region this will be different. In South Korea, they are performing enormous levels of proactive testing.|
        In Italy, they are overwhelmed and behind on testing, most if not all of confirmed cases are detected via hospital visit.|
        In the US the same appears true. Few if any proactive testing done on non NBA players, or politicians.|
        This model attempts to find the number of infected per case confirmed via medical visit.|
        Cases found through proactive community testing (like South Korea is doing) will be expected to be among the Infected estimated by this model, so are excluded.`
      }, {
        header: `Number of cases detected by medical visit`,
        value: this.numberPipe.transform(Math.floor(this.casesDetectedByMedicalVisit), '.0')
      }, {
        header: `Percent of medical visits with virus that have been tested`,
        value: this.percentPipe.transform(this.percentInfectedMedicalVisitsTested),
        description: `Each region will have a different level of people being tested who should be.|
        Many Western countries are still recommending that people should not be tested unless they meet overly strict conditions. So we know that many folks who are sick enough to visit the hospital are simply not being recorded.|
        We know there is also a slight overlap with the proactive testing in the group refused testing, because some folks who go to doctor or hospital are not really ill enough to be part of the next input, which is the portion of infected who develop symptoms severe enough to seek medical treatment.|
        If only half the people who visit their doctor or hospital with the virus have been tested and appear as a confirmed case, then the number of infected people seeking medical care is double the confirmed cases found through medical visits.`
      }, {
        header: `Number of medical visits with virus`,
        value: Math.floor(this.medicalVisitsWithVirus)
      }, {
        header: `Percent of infected that seek medical treatment`,
        value: this.percentPipe.transform(this.percentInfectedSeekingMedicalTreatment),
        description: `80.9% of confirmed cases presented as mild flu-like symptoms according to this study of 72,000 cases in China<sup>1</sup>.|
        That would mean 19.1% of cases experienced only mild symptoms and would likely not seek medical treatment.|
        However, it's possible that the sample of 72,000 was weighted somewhat by those who already sought care. And if that is true, then there would be many more asymptomatic and/or even milder cases.|
        In which case the number of infected that would seek care would be even lower.|
        Because the higher the percentage that seek care, means the lower number of infected per confirmed case, the 19.1% estimate should be seen as the highly conservative end of estimates.|
        If you assume that people in Wuhan and Hubei avoided the hospital unless they really needed it (a fair assumption), then you should use a lower estimate here.|
        To model the number of people who are infected, we must estimate the number of infections that develop symptoms severe enough to seek medical treatment.|
        If 20% of the infected visit their doctor or hospital, then we expect there to be 5x the number of infections per medical visit with the virus. If only 10% do, then we expect to see 10x.`,
        references: [{
          name: 'Chinese study of 72k cases',
          link: 'http://weekly.chinacdc.cn/en/article/id/e53946e2-c6c4-41e9-9a9b-fea8db1a8f51'
        }]
      }, {
        header: `Number of infected when confirmed cases were infected`,
        value: Math.floor(this.infectedWithConfirmedCases)
      }, {
        header: `Days between infection and onset of symptoms`,
        value: this.daysInfectionToOnset,
        description: `A median 5 day incubation period was found by a study of Chinese cases with identifiable exposure outside Hubei province<sup>1</sup>. It found that 50% of the cases incubated between 4.5 and 5.8 days before onset of symptoms, and 97.5% of cases incubated 8.2 to 15.6 days before onset of symptoms.|
        That's a bit wooly those 95% confidence intervals, but suffice it to say that about half the infections incubate in 5 days before onset of symptoms, and almost all within 12 days.|
        The number of days of incubation between when a confirmed case became infected and their first onset of symptoms.|
        This combined with the days between symptom onset and positive test result reported will give us an estimate for the number of days earlier that the Confirmed Cases became infected.`,
        references: [{
          name: 'Study incubation period of cases with identifiable exposure',
          link: 'https://annals.org/aim/fullarticle/2762808/incubation-period-coronavirus-disease-2019-covid-19-from-publicly-reported'
        }]
      }, {
        header: `Days between onset and positive diagnosis`,
        value: this.daysOnsetToPositive,
        description: `In China, they mapped onset of symptoms (beginning of cough or fever) for each confirmed case in a Chinese study of 72,000 confirmed cases<sup>1</sup>.|
        They found a 12 day delay between when the final major shutdown of Wuhan occurred and the rate of confirmed cases began to slow.|
        Interestingly the rate of symptom onset occurred almost on the day that the lockdown was implemented.|
        We know there is an incubation period, and that the onset of cough/fever symptoms is not immediate upon infection, so we know that some portion of that immediate flattening effect was due to social distancing measures implemented before the complete lockdown.|
        But the key factor for this data-point was the difference between the peaks (whatever the cause of the slowing).|
        The number of days between when a confirmed case first notices symptoms and when their positive result is reported.|
        For example, a person might begin to have symptoms, then start to feel really sick, then sick enough to go to hospital, then get tested, then (depending on the testing) not get a test back for 2-48h, then have their case reported as Confirmed either that day or the next.|
        This combined with the days between infection and symptom onset will give us an estimate for the number of days earlier that the Confirmed Cases became infected.`,
        references: [{
          name: 'Chinese study of 72k cases',
          link: 'http://weekly.chinacdc.cn/en/article/id/e53946e2-c6c4-41e9-9a9b-fea8db1a8f51'
        }]
      }, {
        header: `Days between infection and positive diagnosis`,
        value: this.daysInfectedToPositive,
        description: `Factoring incubation and delay between onset of symptoms and Confirmed case reporting, there is conservatively 17 days between Infection and Positive Result Reported.|
        If it takes 5-12 days between infection and onset of symptoms<sup>1</sup>, and it takes 12 days between peak onset of symptoms and peak confirmed cases<sup>2</sup>, it is not unreasonable to expect at least 17 days between infection and detection.|
        And that's using the 5 day incubation period, which half the cases were longer than.`,
        references: [{
          name: 'Study incubation period of cases with identifiable exposure',
          link: 'https://annals.org/aim/fullarticle/2762808/incubation-period-coronavirus-disease-2019-covid-19-from-publicly-reported'
        }, {
          name: 'Chinese study of 72k cases',
          link: 'http://weekly.chinacdc.cn/en/article/id/e53946e2-c6c4-41e9-9a9b-fea8db1a8f51'
        }]
      }, {
        header: `Percent daily growth rate`,
        value: this.percentDailyGrowth * 100 + '%',
        description: `There has been a 22.5% daily growth rate of worldwide confirmed cases outside China and South Korea (where the curve has flattened) between March 1 and March 14. This according to the Worldometer Coronavirus tracker<sup>1</sup>.|
        The growth of confirmed cases should be equal to the growth rate of confirmed infections, presuming major worldwide testing within those countries has not changed significantly from a primarily medically seeking detection method to a more proactive method as seen in South Korea.|
        As of March 15, countries outside South Korea and China have not managed to flatten their exponential curve rate, so this 22.5% daily growth figure should be fairly accurate.|
        Recall from the "Notes & Rationale" comment on the "Days Between Infection and Positive Result Returned", that there is most likely a 17 day delay between the social distancing measures and the effect on the reported cases. So we do not expect to see the social distancing measures Italy, France, Spain, etc have recently implemented to have had an effect on their growth curve. And indeed we have not.|`,
        references: [{
          name: 'Worldometer Coronavirus tracker',
          link: 'https://www.worldometers.info/coronavirus/'
        }]
      }, {
        header: `Estimated infected in ${this.region} on ${this.date} per ${this.reportedConfirmedCases} reported cases`,
        value: this.numberPipe.transform(Math.floor(this.estimatedInfectedOnDate), '.0')
      }, {
        header: `Estimated infected per confirmed case`,
        value: Math.floor(this.infectedPerConfirmedMultiplier)
      }, {
        header: `Days between onset of symptoms and death`,
        value: this.daysOnsetToDeath,
        description: `18 days found between onset of symptoms for fatal cases and death in this study of 32 fatal cases where onset of symptoms was traced <sup>1</sup>. It found a median of 11 days for fatal cases between onset of symptoms and admission to ICU. Also found a median of 7 days for fatal cases between admission to ICU and death.|
        A median of 17.1 days and mean of 20.2 days was found between onset of symptoms and death for 259 fatal cases in this study of nearly 12,000 cases in China<sup>2</sup>.`,
        references: [{
          name: 'Study of 32 fatal cases in China',
          link: 'https://www.thelancet.com/journals/lanres/article/PIIS2213-2600(20)30079-5/fulltext'
        }, {
          name: 'Study of  ~12,000 cases resulting in 259 deaths in China',
          link: 'https://www.mdpi.com/2077-0383/9/2/538/htm'
        }]
      }, {
        header: `Days between infection and death`,
        value: this.daysInfectedToDeath
      }, {
        header: `Estimated number of infected in ${this.region} on Feb 21, 2020`,
        value: Math.floor(this.infectedWithConfirmedDeaths),
        description: `This fatality rate for all infected (as opposed to the ~2.5% fatality rate for all Confirmed Cases) aligns closely with the 0.91% fatality rate seen in South Korea<sup>1</sup>, which is the only nation performing universal testing, and is expected to have a Confirmed Cases that closely matches the actual number infected.`,
        references: []
      }, {
        header: `Fatality rate`,
        value: this.percentInfectedFatality * 100 + '%',
        description: `If it takes about 23 days to die from this virus, then we cannot compare today's deaths with the number of today's infected that this model predicts.|
        Instead we must model how many this model predicts were infected 23 days ago.`
      }, {
        header: `Estimated minimum number ${this.region} deaths based on ${this.numberPipe.transform(Math.floor(this.estimatedInfectedOnDate), '.0')}`,
        value: Math.floor(this.minDeaths),
        description: `Based on the fatality rate of the known deaths per the total infections estimated by this model on the date when the fatalaties became infected (default 23 days ago).`
      }];
    }
  }

  getDescription(desc: string): string {
    let resulting = '';

    desc.split('|').forEach(line => {
      resulting += `<p>${line}</p>`
    });

    return resulting;
  }

  scrollTo(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  initializeForm(event?: MatSelectChange) {
    const region = this.region || Object.keys(this.regions)[0];
    const date = this.date || Object.keys(this.regions[region])[0];

    this.form = new FormGroup({
      region: new FormControl(region),
      date: new FormControl(date),
      reportedConfirmedCases: new FormControl(this.regions[region][date].reportedConfirmedCases),
      reportedFatalities: new FormControl(this.regions[region][date].reportedFatalities),
      percentDetectedByMedicalVisit: new FormControl(environment.percentDetectedByMedicalVisit),
      percentInfectedMedicalVisitsTested: new FormControl(environment.percentInfectedMedicalVisitsTested),
      percentInfectedSeekingMedicalTreatment: new FormControl(environment.percentInfectedSeekingMedicalTreatment),
      daysInfectionToOnset: new FormControl(environment.daysInfectionToOnset),
      daysOnsetToPositive: new FormControl(environment.daysOnsetToPositive),
      percentDailyGrowth: new FormControl(environment.percentDailyGrowth),
      daysOnsetToDeath: new FormControl(environment.daysOnsetToDeath),
      percentInfectedFatality: new FormControl(environment.percentInfectedFatality)
    });
  }

  constructor(private numberPipe: DecimalPipe, private percentPipe: PercentPipe) {}

  ngOnInit(): void {
    this.initializeForm();
  }
}
