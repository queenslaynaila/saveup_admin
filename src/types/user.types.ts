export type LoginData = {
  phone_number: string;
  pin: string;
};

export type IdType = "National" | "Passport";

export type UserRole = 'Admin'| 'Standard' | 'Moderator';

export type Gender = "Male"| "Female"

export interface User {
  id: number
  id_type: IdType
  id_number: string
  country: string
  role: UserRole
  gender: Gender
  pin: string
  full_name: string
  phone_number: string
  created_at: string
}