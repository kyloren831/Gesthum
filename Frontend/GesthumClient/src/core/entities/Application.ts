export interface Application {
    id: string;
    vacancyId: number;
    employeeId: string;
    applicationDate: string;
    status: 'Pending' | 'Passed' | 'Failed';
}