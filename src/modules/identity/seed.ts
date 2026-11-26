export type Role = 'athlete' | 'facility_manager' | 'sports_administration';
export interface SeedUser { id: string; role: Role; displayName: string; }
export const seedUsers: readonly SeedUser[] = [
 {id:'athlete-demo',role:'athlete',displayName:'Demo Athlete'},
 {id:'manager-demo',role:'facility_manager',displayName:'Demo Facility Manager'},
 {id:'admin-demo',role:'sports_administration',displayName:'Demo Sports Administration'},
];
