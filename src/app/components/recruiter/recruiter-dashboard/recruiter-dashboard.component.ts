import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Candidature } from 'src/app/models/Candidature';
import { CandidateServiceService } from 'src/app/services/candidate-service.service';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { InterviewServiceService } from 'src/app/services/interview-service.service';
import { OfferServiceService } from 'src/app/services/offer-service.service';

import { Chart, BarController, BarElement, LinearScale, CategoryScale, ChartData, ChartOptions, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, PieController, ArcElement, Tooltip, Legend);


@Component({
  selector: 'app-recruiter-dashboard',
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.css']
})
export class RecruiterDashboardComponent implements OnInit {
  candidatures: Candidature[] = [];

  // @ViewChild('applicationsPerOfferChart') applicationsPerOfferChart: any;
  // @ViewChild('applicationsPerCandidateChart') applicationsPerCandidateChart!: ElementRef;
  @ViewChild('applicationStatusDistributionChart') applicationStatusDistributionChart!: ElementRef<HTMLCanvasElement>;

  @ViewChild('applicationsPerOfferChart') applicationsPerOfferChart!: ElementRef<HTMLCanvasElement>;

  @ViewChild('applicationsPerCandidateChart') applicationsPerCandidateChart!: ElementRef<HTMLCanvasElement>;


  @Input() recruiter: any;
  
  constructor(private candidatureService: CandidatureServiceService, private candidateService: CandidateServiceService, private offerService: OfferServiceService, private interviewService: InterviewServiceService, private elementRef: ElementRef) { }

  async ngOnInit(): Promise<void> {
    const userLoggedString = sessionStorage.getItem('userLogged');
    if (userLoggedString) {
      const userLogged = JSON.parse(userLoggedString);
      this.recruiter = userLogged;
    }

    if (this.recruiter) {
      await this.getAllCandidatures();
    }    

    if (this.candidatures.length > 0) {
      this.createApplicationsPerOfferChart();
      this.createApplicationsPerCandidateChart();
      this.createApplicationStatusDistributionChart();
    }
  }

  populateCandidates(): void {
    for (const candidature of this.candidatures) {
      this.candidateService.getAllRecruiterCandidates(this.recruiter.idRec).subscribe(
        (candidate) => {
          candidature.candidate = candidate;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  populateOffers(): void {
    for (const candidature of this.candidatures) {
      this.offerService.getRecruiterOffers(this.recruiter.idRec).subscribe(
        (offer) => {
          candidature.offer = offer;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  async getAllCandidatures(): Promise<void> {
    const candidatures = await this.candidatureService
      .getAllRecruiterCandidatures(this.recruiter.idRec)
      .toPromise();
    this.candidatures = candidatures;
    this.populateCandidates();
    this.populateOffers();
    
    if (this.candidatures.length > 0) {
      this.createApplicationsPerOfferChart();
      this.createApplicationsPerCandidateChart();
      this.createApplicationStatusDistributionChart();
    }
  }

  createApplicationsPerOfferChart(): void {
    // Détruire le graphique existant s'il existe
  if (this.applicationsPerOfferChart && this.applicationsPerOfferChart.nativeElement) {
    const chartElement = this.applicationsPerOfferChart.nativeElement;
    const chart = Chart.getChart(chartElement);
    if (chart) {
      chart.destroy();
    }
  }

    const offers = this.candidatures.map((candidature) => candidature.offer?.idOffer);
    const uniqueOffers = Array.from(new Set(offers));
    const applicationsPerOffer = uniqueOffers.map((offerId) =>
      this.candidatures.filter((candidature) => candidature.offer?.idOffer === offerId).length
    );
    const chartData: ChartData = {
      labels: uniqueOffers.map((offerId) => `Offer ${offerId}`),
      datasets: [
        {
          label: 'Candidatures par offre',
          data: applicationsPerOffer,
          backgroundColor: 'rgba(49, 77, 157, 0.7)',
          borderColor: '#314d9d',
          borderWidth: 1,
          barPercentage: 0.4
        }
      ]
    };
    const chartOptions: ChartOptions<'bar'> = {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    };
    new Chart(this.applicationsPerOfferChart.nativeElement, {
      type: 'bar',
      data: chartData as ChartData<'bar', number[], unknown>,
      options: chartOptions
    });
  }

  createApplicationsPerCandidateChart(): void {
    // Group the candidatures by their idCand property
    const candidaturesPerCandidate = this.candidatures.reduce((acc, candidature) => {
      if (!acc[candidature.idCand]) {
        acc[candidature.idCand] = [];
      }
      acc[candidature.idCand].push(candidature);
      return acc;
    }, {} as Record<number, Candidature[]>);
  
    // Count the number of candidatures for each candidate
    const data = Object.values(candidaturesPerCandidate).map(candidatures => candidatures.length);
  
    // Get the labels for the chart
    const labels = Object.keys(candidaturesPerCandidate).map(idCand => `Candidate ${idCand}`);
    const chartData: ChartData = {
      labels,
      datasets: [
        {
          label: 'Candidatures par candidat',
          data,
          backgroundColor: 'rgba(0, 175, 55, 0.7)',
          borderColor: '#00AF37',
          borderWidth: 1,
          barPercentage: 0.4
        }
      ]
    };
    const chartOptions: ChartOptions<'bar'> = {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0 // Display only whole numbers on the y-axis
          }
        }
      }
    };
    if (this.applicationsPerCandidateChart) {
      new Chart(this.applicationsPerCandidateChart.nativeElement, {
        type: 'bar',
        data: chartData as ChartData<'bar', number[], unknown>,
        options: chartOptions
      });
    }
  }
  
  createApplicationStatusDistributionChart(): void {
    // Group the candidatures by their status property
    const candidaturesPerStatus = this.candidatures.reduce((acc, candidature) => {
      if (!acc[candidature.status]) {
        acc[candidature.status] = [];
      }
      acc[candidature.status].push(candidature);
      return acc;
    }, {} as Record<string, Candidature[]>);
  
    // Count the number of candidatures for each status
    const data = Object.values(candidaturesPerStatus).map(candidatures => candidatures.length);
  
    // Get the labels for the chart
    const labels = Object.keys(candidaturesPerStatus);
  
    // Create an array of colors for each status
    const backgroundColors = labels.map(status => {
      switch (status) {
        case 'reçu':
          return '#FFCE26';
        case 'encours':
          return '#FD7238';
        case 'convoqué':
          return '#314d9d';
        case 'embauché':
          return '#00AF37';
        case 'refusé':
          return '#DB504A';
        default:
          return '#999';
      }
    });
  
    const chartData: ChartData = {
      labels,
      datasets: [
        {
          label: 'Distribution des statuts de candidature',
          data,
          backgroundColor: backgroundColors,
          borderWidth: 1,
          barPercentage: 0.4
        }
      ]
    };
  
    const chartOptions: ChartOptions<'pie'> = {};
  
    if (this.applicationStatusDistributionChart) {
      new Chart(this.applicationStatusDistributionChart.nativeElement, {
        type: 'pie',
        data: chartData as ChartData<'pie', number[], unknown>,
        options: chartOptions
      });
    }
  }

}
