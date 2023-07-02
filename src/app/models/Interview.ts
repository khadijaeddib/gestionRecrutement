import { Candidature } from "./Candidature";

export class Interview {
    idInterview!: number;
    status = "";
    interviewDate!: Date;
    address = "";
    interviewFormat = "";
    idCandidature!: number;
    candidature: Candidature = new Candidature;
}
