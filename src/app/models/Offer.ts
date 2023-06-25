import { Recruiter } from "./Recruiter";

export class Offer {
    idOffer!: number;
    title = "";
    diploma = "";
    studyDegree = "";
    businessSector = "";
    expYears = "";
    contractType = "";
    city = "";
    availability = "";
    hiredNum!: number;
    salary!: number;
    description = "";
    missions : string[] = [];
    skills : string[] = [];
    languages : string[] = [];
    pubDate!: Date;
    endDate!: Date;
    idRec!: number;
    recruiter: Recruiter = new Recruiter;
}

