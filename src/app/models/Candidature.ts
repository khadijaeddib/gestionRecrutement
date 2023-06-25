import { Candidate } from "./Candidate";
import { Offer } from "./Offer";

export class Candidature {
    idCandidature!: number;
    status = "";
    dateCand!: Date;
    motivation = "";
    idCand!: number;
    candidate: Candidate = new Candidate;
    idOffer!: number;
    offer: Offer = new Offer;
}
