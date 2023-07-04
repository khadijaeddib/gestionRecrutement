import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Candidature } from 'src/app/models/Candidature';
import { CandidatureWithInterviews } from 'src/app/models/CandidatureWithInterviews';
import { CandidateServiceService } from 'src/app/services/candidate-service.service';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { OfferServiceService } from 'src/app/services/offer-service.service';
import 'chartjs-adapter-moment';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, ChartData, ChartOptions, registerables, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import { Interview } from 'src/app/models/Interview';
import { InterviewServiceService } from 'src/app/services/interview-service.service';
Chart.register(BarController, BarElement, LinearScale, CategoryScale, PieController, ArcElement, Tooltip, Legend);


interface ClassColors {
  [key: string]: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  candidatures: Candidature[] = [];

  pageSize: number = 5; 

  classColors: ClassColors = {
    reçu: 'reçu',
    encours: 'encours',
    convoqué: 'convoqué',
    embauché: 'embauché',
    refusé: 'refusé'
  };

  interviewSchedulingChart!: ElementRef;

  @ViewChild('applicationsPerOfferChart') applicationsPerOfferChart: any;
  @ViewChild('responseTimeChart') responseTimeChart: any;

  @ViewChild('applicationsPerCandidateChart') applicationsPerCandidateChart!: ElementRef;
  @ViewChild('applicationStatusDistributionChart') applicationStatusDistributionChart!: ElementRef;

  constructor(private candidatureService: CandidatureServiceService, private candidateService: CandidateServiceService, private offerService: OfferServiceService, private interviewService: InterviewServiceService, private elementRef: ElementRef) { }

  async ngOnInit(): Promise<void> {
    await this.getAllCandidatures();
    this.interviewSchedulingChart = this.elementRef.nativeElement.querySelector('#interviewSchedulingChart');
    this.createApplicationsPerOfferChart();
    this.createApplicationsPerCandidateChart();
    this.createApplicationStatusDistributionChart();
  }
  
  public createImgPath = (serverPath: string) => { 
    return `https://localhost:7217/Content/Candidate/Images/${serverPath}`; 
  }

  populateCandidates(): void {
    for (const candidature of this.candidatures) {
      this.candidateService.getCandidate(candidature.idCand).subscribe(
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
      this.offerService.getOffer(candidature.idOffer).subscribe(
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
      .getAllCandidatures(this.pageSize)
      .toPromise();
    this.candidatures = candidatures;
    this.populateCandidates();
    this.populateOffers();
  }
  
  createApplicationsPerOfferChart(): void {
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
          borderWidth: 1
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
          borderWidth: 1
        }
      ]
    };
    const chartOptions: ChartOptions<'bar'> = {
      scales: {
        y: {
          beginAtZero: true
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
          borderWidth: 1
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
