export const seedData = {
	users: [
		{
			_id: 'user-001',
			fullName: 'Alice Johnson',
			email: 'alice@example.com',
			password: 'password123',
			role: 'admin',
			phone: '555-1234',
			company_id: 'company-001'
		},
		{
			_id: 'user-002',
			fullName: 'Bob Smith',
			email: 'bob@example.com',
			password: 'password123',
			role: 'client',
			phone: '555-6789',
			company_id: 'company-002'
		},
		{
			_id: 'user-003',
			fullName: 'Ethan Foster',
			email: 'ethan@example.com',
			password: 'password123',
			role: 'ops',
			phone: '555-8901',
			company_id: 'company-003'
		},
		{
			_id: 'user-004',
			fullName: 'Dana Lee',
			email: 'dana@example.com',
			password: 'password123',
			role: 'lawyer',
			phone: '555-3456',
			company_id: 'company-002'
		}
	],
	companies: [
		{
			_id: 'company-001',
			legalEntity: 'WiseFile',
			otherEntities: []
		},
		{
			_id: 'company-002',
			legalEntity: 'ABC Holdings LLC',
			otherEntities: ['ABC Property Management', 'ABC Asset Group']
		},
		{
			_id: 'company-003',
			legalEntity: 'XYZ Realty Group',
			otherEntities: ['XYZ Management Co.', 'XYZ Rental Solutions']
		}
	],
	caseDetails: [
		{
			_id: 'case-001',
			caseNumber: 'ABC123-001',
			company_id: 'company-002',
			caseType: 'filing',
			status: 'Demand Posted',
			subStatus: 'Pending Expiration',
			deleted: false,
			courtName: 'Maricopa County Civil Court',
			courtCaseNumber: 'MC-2025-00123',
			formattedAddress: '11523 W. Orange Blossom Ln., Avondale, AZ, 85253',
			newAddress: {
				streetNumber: '11523',
				streetName: 'W. Orange Blossom Ln.',
				unitNumber: '',
				postalCode: '85253',
				city: 'Avondale',
				state: 'AZ',
				jurisdiction: 'Maricopa County',
				gateCode: '1234'
			},
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
			fees: [
				{ type: 'Filing Fee', amount: 450, description: 'Fee for creating the filing' },
				{ type: 'Late Fee', amount: 100, description: 'Unpaid rent penalty' }
			],
			activityLog: [{ timestamp: '2025-02-28T12:30:00Z', user: 'Bob Smith', action: 'Filed case' }],
			internalNotes: [],
			relatedCases: ['case-002'] // Related by same propertyId & tenantCode
		},
		{
			_id: 'case-002',
			caseNumber: 'LMN789-003',
			company_id: 'company-002',
			caseType: 'filing',
			status: 'Eviction Service',
			subStatus: 'Notice Delivered',
			deleted: false,
			courtName: 'Maricopa County Civil Court',
			courtCaseNumber: 'MC-2025-00345',
			formattedAddress: '11523 W. Orange Blossom Ln., Avondale, AZ, 85253',
			newAddress: {
				streetNumber: '11523',
				streetName: 'W. Orange Blossom Ln.',
				unitNumber: '',
				postalCode: '85253',
				city: 'Avondale',
				state: 'AZ',
				jurisdiction: 'Maricopa County',
				gateCode: '1234'
			},
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
			fees: [
				{ type: 'Filing Fee', amount: 450, description: 'Fee for creating the filing' },
				{ type: 'Eviction Processing Fee', amount: 300, description: 'Eviction service fee' }
			],
			activityLog: [
				{
					timestamp: '2025-03-01T09:00:00Z',
					user: 'Admin',
					action: 'Updated sub-status to Notice Delivered'
				}
			],
			internalNotes: [],
			relatedCases: ['case-001'] // Related by same propertyId & tenantCode
		},
		{
			_id: 'case-003',
			caseNumber: 'PQR101-004',
			company_id: 'company-003',
			caseType: 'filing',
			status: 'Court Date',
			subStatus: 'Scheduled',
			deleted: false,
			courtName: 'Pima County Civil Court',
			courtCaseNumber: 'PC-2025-00456',
			formattedAddress: '4567 Maple Ave., Glendale, AZ, 85301',
			newAddress: {
				streetNumber: '4567',
				streetName: 'Maple Ave.',
				unitNumber: '',
				postalCode: '85301',
				city: 'Glendale',
				state: 'AZ',
				jurisdiction: 'Maricopa County',
				gateCode: '9876'
			},
			plaintiff: {
				name: 'XYZ Realty Group',
				managementCompany: 'XYZ Rental Solutions',
				propertyId: 'prop-004',
				primaryContact: 'Ethan Foster',
				primaryContactPhone: '555-8901',
				primaryContactEmail: 'ethan@example.com'
			},
			tenant: {
				address: '4567 Maple Ave., Glendale, AZ, 85301',
				tenantCode: 'T004',
				tenants: [{ firstName: 'Rachel', lastName: 'Green', tenantCode: 'T004' }]
			},
			fees: [
				{ type: 'Filing Fee', amount: 450, description: 'Fee for creating the filing' },
				{ type: 'Court Processing Fee', amount: 250, description: 'Court administrative cost' }
			],
			activityLog: [],
			internalNotes: [],
			relatedCases: [] // No related cases
		},
		{
			_id: 'case-004',
			caseNumber: 'STU505-005',
			company_id: 'company-002',
			caseType: 'collection',
			status: 'Dismissed – Paid',
			subStatus: 'Resolved',
			deleted: false,
			courtName: 'Pima County Civil Court',
			courtCaseNumber: 'PC-2025-00567',
			formattedAddress: '9012 Birch Rd., Tucson, AZ, 85710',
			newAddress: {
				streetNumber: '9012',
				streetName: 'Birch Rd.',
				unitNumber: 'Unit 5A',
				postalCode: '85710',
				city: 'Tucson',
				state: 'AZ',
				jurisdiction: 'Pima County',
				gateCode: ''
			},
			plaintiff: {
				name: 'ABC Holdings LLC',
				managementCompany: 'ABC Asset Group',
				propertyId: 'prop-005',
				primaryContact: 'Bob Smith',
				primaryContactPhone: '555-6789',
				primaryContactEmail: 'bob@example.com'
			},
			tenant: {
				address: '9012 Birch Rd., Tucson, AZ, 85710',
				tenantCode: 'T005',
				tenants: [{ firstName: 'David', lastName: 'Smith', tenantCode: 'T005' }]
			},
			fees: [{ type: 'Filing Fee', amount: 450, description: 'Fee for creating the filing' }],
			activityLog: [],
			internalNotes: [],
			relatedCases: [] // No related cases
		}
	]
};
