export interface UserRow {
    id: string;
    email: string;
    userName: string;
    passwordHash: string;
    fullName: string;
    headline: string | null;
    bio: string | null;
    about: string | null;
    location: string | null;
    cvUrl: string | null;
}
