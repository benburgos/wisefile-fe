import { error } from '@sveltejs/kit';

export function load({ params }) {
	// Extract case ID from URL
	const caseId = params.id;

	// Mock case data
	const cases = [
		{
			id: 'abc123-001',
			fileName: 'ABC123-001',
			fileType: 'Filing',
			status: 'Open',
			subStatus: 'Awaiting Payment',
			address: '123 Main St',
			tenant: 'John Doe',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440002',
			attorneyName: 'Jane Smith',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440001',
			assignedTo: 'Michael Johnson',
			clientId: 'ABC123'
		},
		{
			id: 'abc123-002',
			fileName: 'ABC123-002',
			fileType: 'Filing',
			status: 'Closed',
			subStatus: 'Resolved - Paid',
			address: '456 Elm St',
			tenant: 'David Green',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440002',
			attorneyName: 'Jane Smith',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440003',
			assignedTo: 'Sarah Williams',
			clientId: 'ABC123'
		},
		{
			id: 'abc123-003',
			fileName: 'ABC123-003',
			fileType: 'Case',
			status: 'Pending',
			subStatus: 'Under Review',
			address: '789 Maple St',
			tenant: 'Alice Brown',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440002',
			attorneyName: 'Jane Smith',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440004',
			assignedTo: 'Liam Carter',
			clientId: 'ABC123'
		},
		{
			id: 'xyz789-001',
			fileName: 'XYZ789-001',
			fileType: 'Filing',
			status: 'Open',
			subStatus: 'Awaiting Court Date',
			address: '222 Oak St',
			tenant: 'Olivia Williams',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440005',
			attorneyName: 'Lisa Wilson',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440006',
			assignedTo: 'Emily Watson',
			clientId: 'XYZ789'
		},
		{
			id: 'xyz789-002',
			fileName: 'XYZ789-002',
			fileType: 'Case',
			status: 'Open',
			subStatus: 'Hearing Scheduled',
			address: '555 Pine St',
			tenant: 'Emma Thompson',
			attorney_uuid: '550e8400-e29b-41d4-a716-446655440006',
			attorneyName: 'Samantha Clark',
			ops_uuid: '550e8400-e29b-41d4-a716-446655440007',
			assignedTo: 'Kyle Thompson',
			clientId: 'XYZ789'
		}
	];

	// Find the case by ID
	const caseDetails = cases.find((c) => c.id === caseId);

	// If not found, return a 404 error
	if (!caseDetails) {
		throw error(404, `Case with ID ${caseId} not found.`);
	}

	// Return mock data
	return {
		caseDetails
	};
}
