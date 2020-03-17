export const environment = {
  production: true,
  regions: {
    'US': {
      'March 16, 2020': {
        reportedConfirmedCases: 4663,
        reportedFatalities: 86
      },
      'March 15, 2020': {
        reportedConfirmedCases: 3752,
        reportedFatalities: 68
      }
    }
  },
  percentDetectedByMedicalVisit: .9,
  percentInfectedMedicalVisitsTested: .75,
  percentInfectedSeekingMedicalTreatment: .15,
  daysInfectionToOnset: 5,
  daysOnsetToPositive: 12,
  percentDailyGrowth: .225,
  daysOnsetToDeath: 18,
  percentInfectedFatality: .0077
};
