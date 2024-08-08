export interface UserDetails {
    id: string;
    name: string;
    email: string;
    phone_no: string;
    avatar: string;
    is_company: boolean;
    is_verified: boolean;
    role: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class User {
    user!:UserDetails;
    token!: string;
}