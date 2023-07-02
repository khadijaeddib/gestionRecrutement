import { Candidature } from './Candidature';
import { Interview } from './Interview';

export interface CandidatureWithInterviews extends Candidature {
  interviews: Interview[];
}
