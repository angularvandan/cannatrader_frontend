export class User {
    user!: {
        id: string;
        name: string;
        email: string;
        phone_no: string;
        avatar: string;
        health_license: string;
        is_company: boolean;
        is_verified: boolean;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    };
    token!: string;
}