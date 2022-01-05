export interface RequestLoginModel {
    user: string;
    password: string;
}

export interface ResponseLoginModel {
    id: number;
    user: string;
    name: string;
    token: string;
    idstatus: number;
    status: string;
}