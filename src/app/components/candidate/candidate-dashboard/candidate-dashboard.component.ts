import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { Candidature } from 'src/app/models/Candidature';
import { Interview } from 'src/app/models/Interview';
import { CandidatureServiceService } from 'src/app/services/candidature-service.service';
import { InterviewServiceService } from 'src/app/services/interview-service.service';

@Component({
  selector: 'app-candidate-dashboard',
  templateUrl: './candidate-dashboard.component.html',
  styleUrls: ['./candidate-dashboard.component.css']
})
export class CandidateDashboardComponent implements OnInit {
  @ViewChild('candidaturesChart') candidaturesChart!: ElementRef;
  @ViewChild('interviewsChart') interviewsChart!: ElementRef;

  candidatures: Candidature[] = [];
  interviews: Interview[] = [];

  @Input() candidate: any;

  constructor(private candidatureService: CandidatureServiceService, private interviewService: InterviewServiceService) { }

  ngOnInit(): void {
    const userLoggedString = sessionStorage.getItem('userLogged');
    if (userLoggedString) {
      const userLogged = JSON.parse(userLoggedString);
      this.candidate = userLogged;
    }

    this.getCandidatures();
    this.getInterviews();
  }

  getCandidatures(): void {
    this.candidatureService.getAllCandidateCandidatures(this.candidate.idCand).subscribe(
      (candidatures: Candidature[]) => {
        this.candidatures = candidatures;
        this.createCandidaturesChart();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  getInterviews(): void {
    this.interviewService.getAllCandidateInterviews(this.candidate.idCand).subscribe(
      (interviews: Interview[]) => {
        this.interviews = interviews;
        this.createInterviewsChart();
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  calculateStatusCounts(): { [status: string]: number } {
    const statusCounts: { [status: string]: number } = {};
    for (const candidature of this.candidatures) {
      const status = candidature.status;
      if (statusCounts[status]) {
        statusCounts[status]++;
      } else {
        statusCounts[status] = 1;
      }
    }
    return statusCounts;
  }

  calculateInterviewCounts(): { [interview: string]: number } {
    const interviewCounts: { [interview: string]: number } = {};
    for (const interview of this.interviews) {
      const interviewType = interview.status;
      if (interviewCounts[interviewType]) {
        interviewCounts[interviewType]++;
      } else {
        interviewCounts[interviewType] = 1;
      }
    }
    return interviewCounts;
  }

  getStatusColor(): { [status: string]: string } {
    return {
      'reçu': 'rgba(255, 205, 86, 0.7)',       //  Yellow for 'reçu'
      'convoqué': 'rgba(0, 0, 255, 0.7)',  // Blue for 'convoqué'
      'embauché': 'rgba(0, 255, 0, 0.7)',    // Green for 'embauché'
      'encours': 'rgba(255, 165, 0, 0.7)',  // Orange for 'encours'
      'refusé': 'rgba(255, 0, 0, 0.7)'       // Red for 'refusé'
    };
  }

  getInterviewStatusColor(): { [status: string]: string } {
    return {
      'Planifié': 'rgba(255, 205, 86, 0.7)',       //  Yellow for 'reçu'
      'Reporté': 'rgba(0, 0, 255, 0.7)',  // Blue for 'convoqué'
      'Réussi': 'rgba(0, 255, 0, 0.7)',    // Green for 'embauché'
      'Annulé': 'rgba(255, 165, 0, 0.7)',  // Orange for 'encours'
      'Échoué': 'rgba(255, 0, 0, 0.7)'       // Red for 'refusé'
    };
  }

 
  createCandidaturesChart(): void {
    const statusCounts = this.calculateStatusCounts();
    const statusLabels = Object.keys(statusCounts);
    
    const statusColors = this.getStatusColor();
  
    const chartData: ChartData = {
      labels: statusLabels,
      datasets: [
        {
          label: 'Nombres de candidatures par status',
          data: statusLabels.map((status) => statusCounts[status]),
          backgroundColor: statusLabels.map((status) => statusColors[status]),
          borderWidth: 1,
          barPercentage: 0.4
        }
      ]
    };
  
    const chartOptions: ChartOptions<'bar'> = {
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            generateLabels: (chart) => {
              // Generate the default labels
              const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
              // Remove the fillStyle property from each label to remove the color
              labels.forEach(label => delete label.fillStyle);
              return labels;
            }
          }
        }
      }
    };
  
    const canvas = this.candidaturesChart.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: chartData as ChartData<'bar', number[], string>,
        options: chartOptions
      });
    }
  }

  createInterviewsChart(): void {
    const interviewCounts = this.calculateInterviewCounts();
    const interviewLabels = Object.keys(interviewCounts);
    
    const interviewStatusColors = this.getInterviewStatusColor();
  
    const chartData: ChartData = {
      labels: interviewLabels,
      datasets: [
        {
          label: 'Nombres d\'entretiens par type',
          data: interviewLabels.map((interview) => interviewCounts[interview]),
          backgroundColor: interviewLabels.map((interview) => interviewStatusColors[interview]),
          borderWidth: 1,
          barPercentage: 0.4
        }
      ]
    };
  
    const chartOptions: ChartOptions<'bar'> = {
      scales: {
        x: {
          beginAtZero: true
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            generateLabels: (chart) => {
              // Generate the default labels
              const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
              // Remove the fillStyle property from each label to remove the color
              labels.forEach(label => delete label.fillStyle);
              return labels;
            }
          }
        }
      }
    };
  
    const canvas = this.interviewsChart.nativeElement as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
  
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: chartData as ChartData<'bar', number[], string>,
        options: chartOptions
      });
    }
  }

}
