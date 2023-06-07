import { Company } from "./Company";

export class Recruiter {
    idRec!: number;
    recImagePath = "";
    recImage!: File;
    lName = "";
    fName = "";
    email = "";
    phone = "";
    age = "";
    address = "";
    career = "";
    pass = "";
    idCo!: number;
    company: Company = new Company; 
}