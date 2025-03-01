export const seedData = {
	users: [
		{
			_id: 'user-001',
			firstName: 'Alice',
			lastName: 'Johnson',
			fullName: 'Alice Johnson',
			email: 'alice@example.com',
			phoneNumber: '555-1234',
			role: 'admin',
			company_id: 'company-001'
		},
		{
			_id: 'user-002',
			firstName: 'Bob',
			lastName: 'Smith',
			fullName: 'Bob Smith',
			email: 'bob@example.com',
			phoneNumber: '555-5678',
			role: 'client',
			company_id: 'company-002'
		},
		{
			_id: 'user-003',
			firstName: 'Charlie',
			lastName: 'Davis',
			fullName: 'Charlie Davis',
			email: 'charlie@example.com',
			phoneNumber: '555-6789',
			role: 'ops',
			company_id: 'company-001'
		},
		{
			_id: 'user-004',
			firstName: 'Diane',
			lastName: 'Evans',
			fullName: 'Diane Evans',
			email: 'diane@example.com',
			phoneNumber: '555-7890',
			role: 'lawyer',
			company_id: 'company-003'
		},
		{
			_id: 'user-005',
			firstName: 'Ethan',
			lastName: 'Foster',
			fullName: 'Ethan Foster',
			email: 'ethan@example.com',
			phoneNumber: '555-8901',
			role: 'client',
			company_id: 'company-003'
		}
	],

	companies: [
		{
			_id: 'company-001',
			name: 'WiseFile',
			prefix: 'WF',
			legalEntity: 'WiseFile Inc.',
			otherEntities: ['WiseFile Inc.']
		},
		{
			_id: 'company-002',
			name: 'ABC Holdings LLC',
			prefix: 'ABC',
			legalEntity: 'ABC Holdings LLC',
			otherEntities: ['ABC Holdings LLC', 'ABC Property Management', 'ABC Asset Group']
		},
		{
			_id: 'company-003',
			name: 'XYZ Realty Group',
			prefix: 'XYZ',
			legalEntity: 'XYZ Realty Group',
			otherEntities: ['XYZ Realty Group', 'XYZ Management Co.', 'XYZ Rental Solutions']
		}
	],

	caseDetails: [
		{
			_id: 'case-001',
			caseNumber: 'ABC123-001',
			company_id: 'company-002',
			caseType: 'filing',
			addressId: 'addr-001',
			formattedAddress: '11523 W. Orange Blossom Ln., Avondale, AZ, 85253',
			plaintiff: {
				name: 'ABC Holdings LLC',
				managementCompany: 'ABC Property Management',
				propertyId: 'prop-001',
				primaryContact: 'Bob Smith',
				primaryContactPhone: '555-6789',
				primaryContactEmail: 'bob@example.com'
			},
			tenant: {
				address: '11523 W. Orange Blossom Ln., Avondale, AZ, 85253',
				tenantCode: 'T001',
				tenants: [{ firstName: 'John', lastName: 'Doe', tenantCode: 'T001' }]
			},
			rentFeesClaims: {
				baseRent: 1200,
				monthsUnpaid: 2,
				lateFee: 100,
				miscDebts: [{ type: 'Utility Bill', amount: 200 }]
			},
			documents: { lease: {}, ledger: {}, demand: {}, ownershipDeed: {}, additionalDocs: [] },
			acknowledgment: { rentalReliefConfirmed: false, statementsConfirmed: false }
		},
		{
			_id: 'case-002',
			caseNumber: 'XYZ456-002',
			company_id: 'company-003',
			caseType: 'filing',
			addressId: 'addr-002',
			formattedAddress: '2025 E. Main St., Phoenix, AZ, 85004',
			plaintiff: {
				name: 'XYZ Realty Group',
				managementCompany: 'XYZ Management Co.',
				propertyId: 'prop-002',
				primaryContact: 'Ethan Foster',
				primaryContactPhone: '555-8901',
				primaryContactEmail: 'ethan@example.com'
			},
			tenant: {
				address: '2025 E. Main St., Phoenix, AZ, 85004',
				tenantCode: 'T002',
				tenants: [{ firstName: 'Sara', lastName: 'Lee', tenantCode: 'T002' }]
			},
			rentFeesClaims: {
				baseRent: 1500,
				monthsUnpaid: 3,
				lateFee: 120,
				miscDebts: [{ type: 'Damages', amount: 500 }]
			},
			documents: { lease: {}, ledger: {}, demand: {}, ownershipDeed: {}, additionalDocs: [] },
			acknowledgment: { rentalReliefConfirmed: false, statementsConfirmed: false }
		},
		{
			_id: 'case-003',
			caseNumber: 'ABC789-003',
			company_id: 'company-002',
			caseType: 'collection',
			addressId: 'addr-003',
			formattedAddress: '3300 N. 7th Ave., Mesa, AZ, 85201',
			plaintiff: {
				name: 'ABC Holdings LLC',
				managementCompany: 'ABC Asset Group',
				propertyId: 'prop-003',
				primaryContact: 'Bob Smith',
				primaryContactPhone: '555-6789',
				primaryContactEmail: 'bob@example.com'
			},
			tenant: {
				address: '3300 N. 7th Ave., Mesa, AZ, 85201',
				tenantCode: 'T003',
				tenants: [{ firstName: 'Michael', lastName: 'Brown', tenantCode: 'T003' }]
			},
			rentFeesClaims: {
				baseRent: 900,
				monthsUnpaid: 1,
				lateFee: 75,
				miscDebts: [{ type: 'Parking Violation', amount: 100 }]
			},
			documents: { lease: {}, ledger: {}, demand: {}, ownershipDeed: {}, additionalDocs: [] },
			acknowledgment: { rentalReliefConfirmed: false, statementsConfirmed: false }
		},
		{
			_id: 'case-004',
			caseNumber: 'XYZ101-004',
			company_id: 'company-003',
			caseType: 'filing',
			addressId: 'addr-004',
			formattedAddress: '789 S. Central Ave., Tempe, AZ, 85281',
			plaintiff: {
				name: 'XYZ Realty Group',
				managementCompany: 'XYZ Rental Solutions',
				propertyId: 'prop-004',
				primaryContact: 'Ethan Foster',
				primaryContactPhone: '555-8901',
				primaryContactEmail: 'ethan@example.com'
			},
			tenant: {
				address: '789 S. Central Ave., Tempe, AZ, 85281',
				tenantCode: 'T004',
				tenants: [{ firstName: 'Rachel', lastName: 'Green', tenantCode: 'T004' }]
			},
			rentFeesClaims: {
				baseRent: 1700,
				monthsUnpaid: 4,
				lateFee: 150,
				miscDebts: [{ type: 'Pest Control', amount: 80 }]
			},
			documents: { lease: {}, ledger: {}, demand: {}, ownershipDeed: {}, additionalDocs: [] },
			acknowledgment: { rentalReliefConfirmed: false, statementsConfirmed: false }
		}
	]
};
