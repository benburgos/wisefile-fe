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
			status: 'Open',
			subStatus: 'Pending Review',
			deleted: false,
			formattedAddress: '11523 W. Orange Blossom Ln., Avondale, AZ, 85253',
			newAddress: {
				streetNumber: '11523',
				streetName: 'W. Orange Blossom Ln.',
				unitNumber: '',
				postalCode: '85253',
				city: 'Avondale',
				state: 'AZ',
				jurisdiction: 'Maricopa County',
				gateCode: ''
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
			rentFeesClaims: {
				baseRent: 1200,
				monthsUnpaid: 2,
				lateFee: 100,
				miscDebts: [{ type: 'Utility Bill', amount: 200 }]
			}
		},
		{
			_id: 'case-002',
			caseNumber: 'XYZ456-002',
			company_id: 'company-003',
			caseType: 'filing',
			status: 'Open',
			subStatus: 'Awaiting Payment',
			deleted: false,
			formattedAddress: '2025 E. Main St., Phoenix, AZ, 85004',
			newAddress: {
				streetNumber: '2025',
				streetName: 'E. Main St.',
				unitNumber: '',
				postalCode: '85004',
				city: 'Phoenix',
				state: 'AZ',
				jurisdiction: 'Maricopa County',
				gateCode: ''
			},
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
			fees: [
				{ type: 'Filing Fee', amount: 450, description: 'Fee for creating the filing' },
				{ type: 'Damages', amount: 500, description: 'Property damage fees' }
			],
			rentFeesClaims: {
				baseRent: 1500,
				monthsUnpaid: 3,
				lateFee: 120,
				miscDebts: [{ type: 'Damages', amount: 500 }]
			}
		}
	]
};
