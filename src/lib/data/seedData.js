export const users = [
	{
		_id: '2e217e2e-ac09-4db3-8b96-d4aea8a790e7', // Admin
		full_name: 'Alice Thompson',
		role: 'admin',
		company_id: null, // Admins aren't tied to a company
		email: 'alice.thompson@example.com',
		phone_number: '123-456-7890',
		is_active: true,
		last_login: new Date(),
		email_verified: true,
		two_factor_enabled: false,
		created_at: new Date(),
		updated_at: new Date(),
		profile_picture_url: 'https://example.com/alice.jpg',
		preferences: {},
		notifications: []
	},
	{
		_id: '79c096ed-0c2d-44cc-a95c-5b69d7579f19', // Operations
		full_name: 'Bob Martinez',
		role: 'operations',
		company_id: null, // Ops handles cases for multiple clients
		email: 'bob.martinez@example.com',
		phone_number: '987-654-3210',
		is_active: true,
		last_login: new Date(),
		email_verified: true,
		two_factor_enabled: false,
		created_at: new Date(),
		updated_at: new Date(),
		profile_picture_url: 'https://example.com/bob.jpg',
		preferences: {},
		notifications: []
	},
	{
		_id: 'bfe67cf7-9cfc-44e3-8b28-be87c142d401', // Attorney
		full_name: 'Charlotte Davis',
		role: 'attorney',
		company_id: null, // Attorneys work on cases but don’t belong to a client
		email: 'charlotte.davis@example.com',
		phone_number: '456-789-1234',
		is_active: true,
		last_login: new Date(),
		email_verified: true,
		two_factor_enabled: false,
		created_at: new Date(),
		updated_at: new Date(),
		profile_picture_url: 'https://example.com/charlotte.jpg',
		preferences: {},
		notifications: []
	},
	{
		_id: '37e36360-d429-4965-9020-f67d423e6176', // Client 1 (Shared Company)
		full_name: 'Daniel Foster',
		role: 'client',
		company_id: '4e7fa22b-afa0-4a15-bd8c-620bc8d6e528', // Shared with Emily Parker
		email: 'daniel.foster@company.com',
		phone_number: '555-123-4567',
		is_active: true,
		last_login: new Date(),
		email_verified: true,
		two_factor_enabled: false,
		created_at: new Date(),
		updated_at: new Date(),
		profile_picture_url: 'https://example.com/daniel.jpg',
		preferences: {},
		notifications: []
	},
	{
		_id: '5053d038-1e13-409a-8e61-94fa1ce39da8', // Client 2 (Shared Company)
		full_name: 'Emily Parker',
		role: 'client',
		company_id: '4e7fa22b-afa0-4a15-bd8c-620bc8d6e528', // Shared with Daniel Foster
		email: 'emily.parker@company.com',
		phone_number: '555-234-5678',
		is_active: true,
		last_login: new Date(),
		email_verified: true,
		two_factor_enabled: false,
		created_at: new Date(),
		updated_at: new Date(),
		profile_picture_url: 'https://example.com/emily.jpg',
		preferences: {},
		notifications: []
	},
	{
		_id: '6fbc81fb-c8e3-4465-8178-103783bc18a0', // Client 3 (Separate Company)
		full_name: 'Franklin Hughes',
		role: 'client',
		company_id: '2885ff47-d39e-4038-bf90-da474bda15c5', // Unique company
		email: 'franklin.hughes@anotherco.com',
		phone_number: '555-345-6789',
		is_active: true,
		last_login: new Date(),
		email_verified: true,
		two_factor_enabled: false,
		created_at: new Date(),
		updated_at: new Date(),
		profile_picture_url: 'https://example.com/franklin.jpg',
		preferences: {},
		notifications: []
	}
];

export const clients = [
	{
		_id: '4e7fa22b-afa0-4a15-bd8c-620bc8d6e528', // Shared by Daniel Foster & Emily Parker
		legal_entity: 'Parker & Foster Holdings',
		internal_name: 'Parker-Foster',
		client_admin: '37e36360-d429-4965-9020-f67d423e6176', // Daniel Foster as the admin
		email: 'admin@parkerfoster.com',
		phone_number: '555-111-2222',
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true,
		mailing_address: {
			street: '123 Corporate Plaza',
			city: 'Los Angeles',
			state: 'CA',
			postalCode: '90012'
		},
		billing_address: {
			street: '123 Corporate Plaza',
			city: 'Los Angeles',
			state: 'CA',
			postalCode: '90012'
		},
		physical_address: {
			street: '123 Corporate Plaza',
			city: 'Los Angeles',
			state: 'CA',
			postalCode: '90012'
		},
		management_companies: [
			{
				_id: '909155a5-1300-4da4-b07b-a8c2b1dbd793',
				name: 'Westside Management Group',
				created_at: new Date(),
				updated_at: new Date(),
				users: ['37e36360-d429-4965-9020-f67d423e6176', '5053d038-1e13-409a-8e61-94fa1ce39da8'] // Daniel & Emily
			}
		],
		client_code: 'PFH-001',
		is_deleted: false
	},
	{
		_id: '2885ff47-d39e-4038-bf90-da474bda15c5', // Separate company (Franklin Hughes)
		legal_entity: 'Hughes Realty Group',
		internal_name: 'Hughes Realty',
		client_admin: '6fbc81fb-c8e3-4465-8178-103783bc18a0', // Franklin Hughes as the admin
		email: 'admin@hughesrealty.com',
		phone_number: '555-333-4444',
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true,
		mailing_address: {
			street: '789 Broadway Ave',
			city: 'New York',
			state: 'NY',
			postalCode: '10010'
		},
		billing_address: {
			street: '789 Broadway Ave',
			city: 'New York',
			state: 'NY',
			postalCode: '10010'
		},
		physical_address: {
			street: '789 Broadway Ave',
			city: 'New York',
			state: 'NY',
			postalCode: '10010'
		},
		management_companies: [
			{
				_id: 'ec052b37-4907-4e75-933f-ded0a5a7eafd',
				name: 'Broadway Management Co.',
				created_at: new Date(),
				updated_at: new Date(),
				users: ['6fbc81fb-c8e3-4465-8178-103783bc18a0'] // Franklin Hughes
			}
		],
		client_code: 'HRG-002',
		is_deleted: false
	},
	{
		_id: 'f62cd392-414b-4983-b6f7-95ed59104cb8', // Third distinct client
		legal_entity: 'Summit Residential Properties',
		internal_name: 'Summit Residences',
		client_admin: null, // No designated admin yet
		email: 'contact@summitres.com',
		phone_number: '555-555-5555',
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true,
		mailing_address: {
			street: '456 Mountain View Dr',
			city: 'Denver',
			state: 'CO',
			postalCode: '80202'
		},
		billing_address: {
			street: '456 Mountain View Dr',
			city: 'Denver',
			state: 'CO',
			postalCode: '80202'
		},
		physical_address: {
			street: '456 Mountain View Dr',
			city: 'Denver',
			state: 'CO',
			postalCode: '80202'
		},
		management_companies: [
			{
				_id: '8d810d57-347c-458a-b566-373c4e397b4c',
				name: 'Summit Property Management',
				created_at: new Date(),
				updated_at: new Date(),
				users: []
			}
		],
		client_code: 'SRP-003',
		is_deleted: false
	}
];

export const properties = [
	// Properties for Parker & Foster Holdings (cli-001)
	{
		_id: '94a0cf29-543a-49bc-b5fd-3e8e34fe4c0a',
		client_id: '4e7fa22b-afa0-4a15-bd8c-620bc8d6e528',
		property_code: 'PFH-1001',
		unit_count: 5,
		is_commercial: false,
		occupancy_status: 'occupied',
		address: {
			streetNumber: '221',
			streetName: 'Main Street',
			unitNumber: '',
			postalCode: '90001',
			city: 'Los Angeles',
			state: 'CA',
			jurisdiction: 'Los Angeles County',
			gateCode: '1234'
		},
		associated_tenants: [
			'8049f9c1-fe8e-4d0a-b2bf-27186830f028',
			'05795ded-d516-468c-b64a-a06c2e7d1111'
		], // Two tenants
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true,
		management_company: '909155a5-1300-4da4-b07b-a8c2b1dbd793'
	},
	{
		_id: 'c2964eac-2ef2-47b3-b366-4e280df31a23',
		client_id: '4e7fa22b-afa0-4a15-bd8c-620bc8d6e528',
		property_code: 'PFH-1002',
		unit_count: 10,
		is_commercial: true,
		occupancy_status: 'vacant',
		address: {
			streetNumber: '501',
			streetName: 'Sunset Blvd',
			unitNumber: '',
			postalCode: '90028',
			city: 'Los Angeles',
			state: 'CA',
			jurisdiction: 'Los Angeles County',
			gateCode: '5678'
		},
		associated_tenants: [],
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true,
		management_company: '909155a5-1300-4da4-b07b-a8c2b1dbd793'
	},

	// Properties for Hughes Realty Group (cli-002)
	{
		_id: '21cf91e2-a465-4e3b-99d0-39dc820256b9',
		client_id: '2885ff47-d39e-4038-bf90-da474bda15c5',
		property_code: 'HRG-2001',
		unit_count: 3,
		is_commercial: false,
		occupancy_status: 'occupied',
		address: {
			streetNumber: '789',
			streetName: 'Broadway Ave',
			unitNumber: '',
			postalCode: '10010',
			city: 'New York',
			state: 'NY',
			jurisdiction: 'New York County',
			gateCode: '4321'
		},
		associated_tenants: ['24380fa4-1649-4f43-a651-d43e25792caf'], // One tenant
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true,
		management_company: 'ec052b37-4907-4e75-933f-ded0a5a7eafd'
	},
	{
		_id: '49709ff6-b2ef-47d7-8788-696aa20e52e8',
		client_id: '2885ff47-d39e-4038-bf90-da474bda15c5',
		property_code: 'HRG-2002',
		unit_count: 20,
		is_commercial: true,
		occupancy_status: 'occupied',
		address: {
			streetNumber: '111',
			streetName: 'Wall Street',
			unitNumber: '',
			postalCode: '10005',
			city: 'New York',
			state: 'NY',
			jurisdiction: 'New York County',
			gateCode: ''
		},
		associated_tenants: [
			'4afc92df-5640-4d66-b9c3-c9e5f78bcd6b',
			'dd87d679-b37f-4082-b478-7e9cae2524be'
		], // Two tenants
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true,
		management_company: 'ec052b37-4907-4e75-933f-ded0a5a7eafd'
	},

	// Properties for Summit Residential Properties (cli-003)
	{
		_id: 'c794b501-3f9d-4a7c-8c4f-c19bf8aaa498',
		client_id: 'f62cd392-414b-4983-b6f7-95ed59104cb8',
		property_code: 'SRP-3001',
		unit_count: 8,
		is_commercial: false,
		occupancy_status: 'occupied',
		address: {
			streetNumber: '456',
			streetName: 'Mountain View Dr',
			unitNumber: '',
			postalCode: '80202',
			city: 'Denver',
			state: 'CO',
			jurisdiction: 'Denver County',
			gateCode: ''
		},
		associated_tenants: ['642976d2-34e8-4241-b450-bba98564e8bf'],
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true,
		management_company: '8d810d57-347c-458a-b566-373c4e397b4c'
	},
	{
		_id: 'f2a7bace-b171-4fcd-9e91-ec1d76be74c6',
		client_id: 'f62cd392-414b-4983-b6f7-95ed59104cb8',
		property_code: 'SRP-3002',
		unit_count: 15,
		is_commercial: false,
		occupancy_status: 'vacant',
		address: {
			streetNumber: '789',
			streetName: 'Green Valley Rd',
			unitNumber: '',
			postalCode: '80203',
			city: 'Denver',
			state: 'CO',
			jurisdiction: 'Denver County',
			gateCode: '9999'
		},
		associated_tenants: [],
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true,
		management_company: '8d810d57-347c-458a-b566-373c4e397b4c'
	}
];

export const tenants = [
	// Tenants for Parker & Foster Holdings (cli-001)
	{
		_id: '8049f9c1-fe8e-4d0a-b2bf-27186830f028',
		client_id: '4e7fa22b-afa0-4a15-bd8c-620bc8d6e528',
		tenant_code: 'TEN-1001',
		full_name: 'Olivia White',
		contact_info: {
			email: 'olivia.white@example.com',
			phone: '555-101-2020'
		},
		lease_start_date: new Date('2023-01-01'),
		lease_end_date: new Date('2024-01-01'),
		lease_status: 'active',
		lease_type: 'fixed-term',
		associated_properties: ['94a0cf29-543a-49bc-b5fd-3e8e34fe4c0a'],
		forwarding_address: {},
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true
	},
	{
		_id: '05795ded-d516-468c-b64a-a06c2e7d1111',
		client_id: '4e7fa22b-afa0-4a15-bd8c-620bc8d6e528',
		tenant_code: 'TEN-1002',
		full_name: 'Nathan Gray',
		contact_info: {
			email: 'nathan.gray@example.com',
			phone: '555-202-3030'
		},
		lease_start_date: new Date('2022-06-01'),
		lease_end_date: new Date('2023-06-01'),
		lease_status: 'expired',
		lease_type: 'fixed-term',
		associated_properties: ['94a0cf29-543a-49bc-b5fd-3e8e34fe4c0a'],
		forwarding_address: {
			streetNumber: '321',
			streetName: 'Ocean Ave',
			city: 'Los Angeles',
			state: 'CA',
			postalCode: '90002'
		},
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true
	},

	// Tenants for Hughes Realty Group (cli-002)
	{
		_id: '24380fa4-1649-4f43-a651-d43e25792caf',
		client_id: '2885ff47-d39e-4038-bf90-da474bda15c5',
		tenant_code: 'TEN-2001',
		full_name: 'Ethan Baker',
		contact_info: {
			email: 'ethan.baker@example.com',
			phone: '555-303-4040'
		},
		lease_start_date: new Date('2023-05-01'),
		lease_end_date: new Date('2024-05-01'),
		lease_status: 'active',
		lease_type: 'fixed-term',
		associated_properties: ['21cf91e2-a465-4e3b-99d0-39dc820256b9'],
		forwarding_address: {},
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true
	},
	{
		_id: '4afc92df-5640-4d66-b9c3-c9e5f78bcd6b',
		client_id: '2885ff47-d39e-4038-bf90-da474bda15c5',
		tenant_code: 'TEN-2002',
		full_name: 'Sophia Carter',
		contact_info: {
			email: 'sophia.carter@example.com',
			phone: '555-404-5050'
		},
		lease_start_date: new Date('2021-07-15'),
		lease_end_date: new Date('2023-07-15'),
		lease_status: 'terminated',
		lease_type: 'month-to-month',
		associated_properties: ['49709ff6-b2ef-47d7-8788-696aa20e52e8'],
		forwarding_address: {
			streetNumber: '789',
			streetName: 'Park Lane',
			city: 'Brooklyn',
			state: 'NY',
			postalCode: '11201'
		},
		created_at: new Date(),
		updated_at: new Date(),
		is_active: false
	},

	// Tenants for Summit Residential Properties (cli-003)
	{
		_id: '642976d2-34e8-4241-b450-bba98564e8bf',
		client_id: 'f62cd392-414b-4983-b6f7-95ed59104cb8',
		tenant_code: 'TEN-3001',
		full_name: 'Benjamin Scott',
		contact_info: {
			email: 'benjamin.scott@example.com',
			phone: '555-505-6060'
		},
		lease_start_date: new Date('2022-08-01'),
		lease_end_date: new Date('2023-08-01'),
		lease_status: 'expired',
		lease_type: 'fixed-term',
		associated_properties: ['c794b501-3f9d-4a7c-8c4f-c19bf8aaa498'],
		forwarding_address: {
			streetNumber: '123',
			streetName: 'Mountain View Dr',
			city: 'Denver',
			state: 'CO',
			postalCode: '80202'
		},
		created_at: new Date(),
		updated_at: new Date(),
		is_active: false
	}
];

export const caseRecords = [
	// Cases for Parker & Foster Holdings (cli-001)
	{
		_id: '34e7e82e-9bfb-4889-8a9b-471a3a5a28db',
		case_number: 'PFH-CASE-001',
		client_id: '4e7fa22b-afa0-4a15-bd8c-620bc8d6e528',
		type: 'filing',
		status: 'Demand Posted',
		sub_status: null,
		courtName: 'Los Angeles Superior Court',
		courtCaseNumber: null,
		courtDecision: null,
		property_id: '94a0cf29-543a-49bc-b5fd-3e8e34fe4c0a',
		tenant_id: '8049f9c1-fe8e-4d0a-b2bf-27186830f028',
		related_case_ids: [],
		related_case_documents: [],
		related_case_invoices: [],
		related_case_fees: [],
		related_case_messages: [],
		start_date: new Date('2024-01-10'),
		end_date: null,
		description: 'Tenant failed to pay rent for 3 months.',
		internal_notes: [
			{
				user_id: '79c096ed-0c2d-44cc-a95c-5b69d7579f19',
				date: new Date(),
				note: 'Filed notice of eviction.'
			}
		],
		assigned_attorney: 'bfe67cf7-9cfc-44e3-8b28-be87c142d401',
		assigned_operator: '79c096ed-0c2d-44cc-a95c-5b69d7579f19',
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true
	},
	{
		_id: 'a5ddd21e-6cda-4a2d-aa31-bb2aa76e492c',
		case_number: 'PFH-CASE-002',
		client_id: '4e7fa22b-afa0-4a15-bd8c-620bc8d6e528',
		type: 'filing',
		status: 'Writ',
		sub_status: 'Date Requested',
		courtName: 'Los Angeles Superior Court',
		courtCaseNumber: 'LAC-2024-00567',
		courtDecision: null,
		property_id: 'c2964eac-2ef2-47b3-b366-4e280df31a23',
		tenant_id: '05795ded-d516-468c-b64a-a06c2e7d1111',
		related_case_ids: [],
		related_case_documents: [],
		related_case_invoices: [],
		related_case_fees: [],
		related_case_messages: [],
		start_date: new Date('2024-02-15'),
		end_date: null,
		description: 'Tenant violated lease agreement.',
		internal_notes: [
			{
				user_id: '79c096ed-0c2d-44cc-a95c-5b69d7579f19',
				date: new Date(),
				note: 'Writ requested from court.'
			}
		],
		assigned_attorney: 'bfe67cf7-9cfc-44e3-8b28-be87c142d401',
		assigned_operator: '79c096ed-0c2d-44cc-a95c-5b69d7579f19',
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true
	},

	// Cases for Hughes Realty Group (cli-002)
	{
		_id: '59d5da57-5e59-4a6c-ac32-40ab8ab085f2',
		case_number: 'HRG-CASE-001',
		client_id: '2885ff47-d39e-4038-bf90-da474bda15c5',
		type: 'filing',
		status: 'Eviction',
		sub_status: 'To Be Scheduled',
		courtName: 'New York Civil Court',
		courtCaseNumber: 'NYC-2024-00712',
		courtDecision: null,
		property_id: '21cf91e2-a465-4e3b-99d0-39dc820256b9',
		tenant_id: '24380fa4-1649-4f43-a651-d43e25792caf',
		related_case_ids: [],
		related_case_documents: [],
		related_case_invoices: [],
		related_case_fees: [],
		related_case_messages: [],
		start_date: new Date('2024-02-01'),
		end_date: null,
		description: 'Tenant disputes rent increase, filed legal complaint.',
		internal_notes: [
			{
				user_id: '79c096ed-0c2d-44cc-a95c-5b69d7579f19',
				date: new Date(),
				note: 'Awaiting eviction scheduling.'
			}
		],
		assigned_attorney: 'bfe67cf7-9cfc-44e3-8b28-be87c142d401',
		assigned_operator: '79c096ed-0c2d-44cc-a95c-5b69d7579f19',
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true
	},

	// Cases for Summit Residential Properties (cli-003)
	{
		_id: '7f91b5b4-25cb-4fec-a7a3-ee9cd0f6cd7f',
		case_number: 'SRP-CASE-001',
		client_id: 'f62cd392-414b-4983-b6f7-95ed59104cb8',
		type: 'collection',
		status: 'Dismissed',
		sub_status: 'Dismissed – Paid',
		courtName: null,
		courtCaseNumber: null,
		courtDecision: 'Settlement reached',
		property_id: 'c794b501-3f9d-4a7c-8c4f-c19bf8aaa498',
		tenant_id: '642976d2-34e8-4241-b450-bba98564e8bf',
		related_case_ids: [],
		related_case_documents: [],
		related_case_invoices: [],
		related_case_fees: [],
		related_case_messages: [],
		start_date: new Date('2023-12-01'),
		end_date: new Date('2024-02-10'),
		description: 'Tenant moved out and paid outstanding balance.',
		internal_notes: [
			{
				user_id: '79c096ed-0c2d-44cc-a95c-5b69d7579f19',
				date: new Date(),
				note: 'Received final settlement payment.'
			}
		],
		assigned_attorney: null,
		assigned_operator: '79c096ed-0c2d-44cc-a95c-5b69d7579f19',
		created_at: new Date(),
		updated_at: new Date(),
		is_active: false
	}
];

export const documents = [
	// Documents for Parker & Foster Holdings (cli-001)
	{
		_id: '2218dbfb-0e53-41bc-b6e6-93fe94398f52',
		client_id: '4e7fa22b-afa0-4a15-bd8c-620bc8d6e528',
		case_id: '34e7e82e-9bfb-4889-8a9b-471a3a5a28db',
		type: 'Eviction Notice',
		name: 'Notice to Vacate - Olivia White',
		description: 'Legal notice served to tenant for non-payment.',
		file_path: '/documents/notice_vacate_olivia.pdf',
		file_url: 'https://example.com/documents/notice_vacate_olivia.pdf',
		file_size: 150000,
		file_type: 'application/pdf',
		uploaded_by: '79c096ed-0c2d-44cc-a95c-5b69d7579f19',
		uploaded_at: new Date(),
		updated_at: new Date(),
		tags: ['eviction', 'legal'],
		notes: 'Served on January 15, 2024.',
		is_confidential: true,
		is_deleted: false
	},
	{
		_id: 'b6c644a0-4b0d-4058-80a7-704c4f9557e4',
		client_id: '4e7fa22b-afa0-4a15-bd8c-620bc8d6e528',
		case_id: 'a5ddd21e-6cda-4a2d-aa31-bb2aa76e492c',
		type: 'Lease Agreement',
		name: 'Lease Agreement - Nathan Gray',
		description: 'Signed lease agreement between tenant and landlord.',
		file_path: '/documents/lease_nathan.pdf',
		file_url: 'https://example.com/documents/lease_nathan.pdf',
		file_size: 250000,
		file_type: 'application/pdf',
		uploaded_by: '79c096ed-0c2d-44cc-a95c-5b69d7579f19',
		uploaded_at: new Date(),
		updated_at: new Date(),
		tags: ['lease'],
		notes: 'Tenant vacated property on June 1, 2023.',
		is_confidential: false,
		is_deleted: false
	},

	// Documents for Hughes Realty Group (cli-002)
	{
		_id: 'c3cbc917-6d7a-45cf-831e-50c4f1249232',
		client_id: '2885ff47-d39e-4038-bf90-da474bda15c5',
		case_id: '59d5da57-5e59-4a6c-ac32-40ab8ab085f2',
		type: 'Court Filing',
		name: 'NYC Civil Court Complaint',
		description: 'Legal filing regarding rent dispute.',
		file_path: '/documents/nyc_complaint.pdf',
		file_url: 'https://example.com/documents/nyc_complaint.pdf',
		file_size: 180000,
		file_type: 'application/pdf',
		uploaded_by: 'bfe67cf7-9cfc-44e3-8b28-be87c142d401',
		uploaded_at: new Date(),
		updated_at: new Date(),
		tags: ['court', 'legal'],
		notes: 'Court date scheduled for April 10, 2024.',
		is_confidential: true,
		is_deleted: false
	},

	// Documents for Summit Residential Properties (cli-003)
	{
		_id: '1667af0e-8a46-443b-aad2-523629d6e134',
		client_id: 'f62cd392-414b-4983-b6f7-95ed59104cb8',
		case_id: '7f91b5b4-25cb-4fec-a7a3-ee9cd0f6cd7f',
		type: 'Payment Receipt',
		name: 'Final Settlement - Benjamin Scott',
		description: 'Receipt for final settlement payment.',
		file_path: '/documents/payment_settlement_benjamin.pdf',
		file_url: 'https://example.com/documents/payment_settlement_benjamin.pdf',
		file_size: 125000,
		file_type: 'application/pdf',
		uploaded_by: '79c096ed-0c2d-44cc-a95c-5b69d7579f19',
		uploaded_at: new Date(),
		updated_at: new Date(),
		tags: ['payment'],
		notes: 'Settlement payment received on February 10, 2024.',
		is_confidential: false,
		is_deleted: false
	}
];

export const invoices = [
	// Invoices for Parker & Foster Holdings (cli-001)
	{
		_id: 'f0bd2b47-9d27-4f9d-859c-05a5e6eaa57c',
		client_id: '4e7fa22b-afa0-4a15-bd8c-620bc8d6e528',
		case_id: '34e7e82e-9bfb-4889-8a9b-471a3a5a28db',
		invoice_number: 'INV-1001',
		invoice_date: new Date('2024-01-12'),
		due_date: new Date('2024-02-12'),
		amount: 2500.0,
		status: 'pending',
		description: 'Legal fees for eviction filing.',
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true,
		payment_details: {},
		notes: 'Fee includes court filing and attorney costs.',
		associated_fees: ['3a1c4b89-5d68-42a7-b6b7-c7a40e91b4f4']
	},
	{
		_id: '8137a54f-c78d-4ef2-b8c3-8918f402b3e5',
		client_id: '4e7fa22b-afa0-4a15-bd8c-620bc8d6e528',
		case_id: 'a5ddd21e-6cda-4a2d-aa31-bb2aa76e492c',
		invoice_number: 'INV-1002',
		invoice_date: new Date('2023-08-01'),
		due_date: new Date('2023-09-01'),
		amount: 1800.0,
		status: 'paid',
		description: 'Tenant settlement for property damages.',
		created_at: new Date(),
		updated_at: new Date(),
		is_active: false,
		payment_details: {
			payment_date: new Date('2023-08-15'),
			payment_method: 'wire transfer'
		},
		notes: 'Tenant agreed to a settlement.',
		associated_fees: []
	},

	// Invoices for Hughes Realty Group (cli-002)
	{
		_id: 'b3128c46-9121-4f08-b44a-7d8d45c93b2c',
		client_id: '2885ff47-d39e-4038-bf90-da474bda15c5',
		case_id: '59d5da57-5e59-4a6c-ac32-40ab8ab085f2',
		invoice_number: 'INV-2001',
		invoice_date: new Date('2024-03-01'),
		due_date: new Date('2024-04-01'),
		amount: 3200.0,
		status: 'overdue',
		description: 'Court filing fees and attorney expenses.',
		created_at: new Date(),
		updated_at: new Date(),
		is_active: true,
		payment_details: {},
		notes: 'Client has not responded to multiple reminders.',
		associated_fees: ['95a5dcb6-5acb-49df-98f3-1dcf7d4453a7']
	},

	// Invoices for Summit Residential Properties (cli-003)
	{
		_id: 'c4b9af48-1d90-4a9b-a2a8-2a3644cf9638',
		client_id: 'f62cd392-414b-4983-b6f7-95ed59104cb8',
		case_id: '7f91b5b4-25cb-4fec-a7a3-ee9cd0f6cd7f',
		invoice_number: 'INV-3001',
		invoice_date: new Date('2023-12-15'),
		due_date: new Date('2024-01-15'),
		amount: 2100.0,
		status: 'paid',
		description: 'Final rent collection from tenant settlement.',
		created_at: new Date(),
		updated_at: new Date(),
		is_active: false,
		payment_details: {
			payment_date: new Date('2024-01-10'),
			payment_method: 'credit card'
		},
		notes: 'Tenant paid full balance before court proceedings.',
		associated_fees: []
	}
];

export const fees = [
	// Fees for Parker & Foster Holdings (cli-001)
	{
		_id: '3a1c4b89-5d68-42a7-b6b7-c7a40e91b4f4',
		client_id: '4e7fa22b-afa0-4a15-bd8c-620bc8d6e528',
		case_id: '34e7e82e-9bfb-4889-8a9b-471a3a5a28db',
		type: 'Court Filing Fee',
		amount: 500.0,
		description: 'Court fee for eviction filing.',
		status: 'pending',
		created_at: new Date(),
		updated_at: new Date()
	},
	{
		_id: 'f73c7bc2-a9a7-4c5b-bb4b-91b683b829d5',
		client_id: '4e7fa22b-afa0-4a15-bd8c-620bc8d6e528',
		case_id: 'a5ddd21e-6cda-4a2d-aa31-bb2aa76e492c',
		type: 'Attorney Fee',
		amount: 300.0,
		description: 'Attorney fee for court representation.',
		status: 'paid',
		created_at: new Date(),
		updated_at: new Date()
	},

	// Fees for Hughes Realty Group (cli-002)
	{
		_id: '95a5dcb6-5acb-49df-98f3-1dcf7d4453a7',
		client_id: '2885ff47-d39e-4038-bf90-da474bda15c5',
		case_id: '59d5da57-5e59-4a6c-ac32-40ab8ab085f2',
		type: 'Attorney Fee',
		amount: 1000.0,
		description: 'Attorney fee for court representation.',
		status: 'overdue',
		created_at: new Date(),
		updated_at: new Date()
	},

	// Fees for Summit Residential Properties (cli-003)
	{
		_id: 'e9b4a212-7269-4e41-a6c3-8a5e2ebf472d',
		client_id: 'f62cd392-414b-4983-b6f7-95ed59104cb8',
		case_id: '7f91b5b4-25cb-4fec-a7a3-ee9cd0f6cd7f',
		type: 'Final Settlement Fee',
		amount: 600.0,
		description: 'Final settlement processing fee.',
		status: 'paid',
		created_at: new Date(),
		updated_at: new Date()
	}
];

export const messages = [
	// Messages for Parker & Foster Holdings (cli-001)
	{
		_id: 'afde6cb4-7993-4e80-8c26-bb92a66c76c9',
		case_id: '34e7e82e-9bfb-4889-8a9b-471a3a5a28db',
		sender_id: 'bfe67cf7-9cfc-44e3-8b28-be87c142d401', // Attorney
		recipient_ids: ['37e36360-d429-4965-9020-f67d423e6176'], // Client (Daniel Foster)
		message_type: 'text',
		content: 'Your eviction case has been filed. The tenant has 30 days to respond.',
		attachments: [],
		created_at: new Date(),
		updated_at: new Date(),
		is_read: false,
		read_by: [],
		is_active: true,
		is_deleted: false,
		visible_to_users: true
	},
	{
		_id: '7e8c7ac2-d6e5-4d56-8701-7f46b54f43d1',
		case_id: 'a5ddd21e-6cda-4a2d-aa31-bb2aa76e492c',
		sender_id: '79c096ed-0c2d-44cc-a95c-5b69d7579f19', // Ops
		recipient_ids: ['5053d038-1e13-409a-8e61-94fa1ce39da8'], // Client (Emily Parker)
		message_type: 'file',
		content: 'Attached is the signed settlement agreement.',
		attachments: [
			{
				file_name: 'settlement_agreement.pdf',
				file_url: 'https://example.com/documents/settlement_agreement.pdf',
				file_type: 'application/pdf',
				file_size: 240000
			}
		],
		created_at: new Date(),
		updated_at: new Date(),
		is_read: true,
		read_by: ['5053d038-1e13-409a-8e61-94fa1ce39da8'],
		is_active: true,
		is_deleted: false,
		visible_to_users: true
	},

	// Messages for Hughes Realty Group (cli-002)
	{
		_id: '3e76b71c-1733-4067-b5d8-5e3e4bfb0ea2',
		case_id: '59d5da57-5e59-4a6c-ac32-40ab8ab085f2',
		sender_id: 'bfe67cf7-9cfc-44e3-8b28-be87c142d401', // Attorney
		recipient_ids: ['6fbc81fb-c8e3-4465-8178-103783bc18a0'], // Client (Franklin Hughes)
		message_type: 'text',
		content: 'We have a court date set for April 10 regarding your tenant dispute.',
		attachments: [],
		created_at: new Date(),
		updated_at: new Date(),
		is_read: false,
		read_by: [],
		is_active: true,
		is_deleted: false,
		visible_to_users: true
	},

	// Messages for Summit Residential Properties (cli-003)
	{
		_id: '9f81c9a5-0fc4-4c3d-b249-44f62de56dcf',
		case_id: '7f91b5b4-25cb-4fec-a7a3-ee9cd0f6cd7f',
		sender_id: '79c096ed-0c2d-44cc-a95c-5b69d7579f19', // Ops
		recipient_ids: ['f62cd392-414b-4983-b6f7-95ed59104cb8'], // Client (Summit Residential)
		message_type: 'image',
		content: 'Attached are images of property damages.',
		attachments: [
			{
				file_name: 'damage_photos.jpg',
				file_url: 'https://example.com/documents/damage_photos.jpg',
				file_type: 'image/jpeg',
				file_size: 450000
			}
		],
		created_at: new Date(),
		updated_at: new Date(),
		is_read: false,
		read_by: [],
		is_active: true,
		is_deleted: false,
		visible_to_users: true
	}
];

export const activityLogs = [
	// Logs for Parker & Foster Holdings (cli-001)
	{
		_id: '60b8c9ee-37e6-4a1e-8aef-56c14a1e657c',
		user_id: '79c096ed-0c2d-44cc-a95c-5b69d7579f19', // Ops
		action_type: 'create',
		entity_type: 'caseRecord',
		entity_id: '34e7e82e-9bfb-4889-8a9b-471a3a5a28db',
		description: 'New eviction case filed for tenant Olivia White.',
		created_at: new Date()
	},
	{
		_id: 'b9f5b91d-2a77-4291-a8c4-1ea9c9b6cf6e',
		user_id: 'bfe67cf7-9cfc-44e3-8b28-be87c142d401', // Attorney
		action_type: 'update',
		entity_type: 'caseRecord',
		entity_id: 'a5ddd21e-6cda-4a2d-aa31-bb2aa76e492c',
		description: 'Writ request submitted to court.',
		created_at: new Date()
	},
	{
		_id: 'cb8712a7-7e71-43df-bbaf-16a7d0a834dd',
		user_id: '37e36360-d429-4965-9020-f67d423e6176', // Client
		action_type: 'update',
		entity_type: 'invoice',
		entity_id: 'f0bd2b47-9d27-4f9d-859c-05a5e6eaa57c',
		description: 'Client viewed invoice INV-1001.',
		created_at: new Date()
	},

	// Logs for Hughes Realty Group (cli-002)
	{
		_id: 'e8d7b351-9e1b-4813-b9c6-6a58a5f889db',
		user_id: 'bfe67cf7-9cfc-44e3-8b28-be87c142d401', // Attorney
		action_type: 'create',
		entity_type: 'caseRecord',
		entity_id: '59d5da57-5e59-4a6c-ac32-40ab8ab085f2',
		description: 'Tenant dispute case filed in NYC Civil Court.',
		created_at: new Date()
	},
	{
		_id: 'a2e5c20a-d0e2-4f69-975b-2bcb02d0a2b9',
		user_id: '6fbc81fb-c8e3-4465-8178-103783bc18a0', // Client (Franklin Hughes)
		action_type: 'delete',
		entity_type: 'message',
		entity_id: '3e76b71c-1733-4067-b5d8-5e3e4bfb0ea2',
		description: 'Client deleted a court date message from attorney.',
		created_at: new Date()
	},

	// Logs for Summit Residential Properties (cli-003)
	{
		_id: 'd4c36c74-25b1-4cf2-8c57-0e68a7123ebd',
		user_id: '79c096ed-0c2d-44cc-a95c-5b69d7579f19', // Ops
		action_type: 'create',
		entity_type: 'caseRecord',
		entity_id: '7f91b5b4-25cb-4fec-a7a3-ee9cd0f6cd7f',
		description: 'Final rent collection case opened.',
		created_at: new Date()
	},
	{
		_id: 'c17db5cd-3471-4e3a-b7f5-29e2df0f49c6',
		user_id: 'f62cd392-414b-4983-b6f7-95ed59104cb8', // Client (Summit Residences)
		action_type: 'update',
		entity_type: 'invoice',
		entity_id: 'c4b9af48-1d90-4a9b-a2a8-2a3644cf9638',
		description: 'Client marked invoice INV-3001 as paid.',
		created_at: new Date()
	}
];

export const seedData = {
	users,
	clients,
	properties,
	tenants,
	caseRecords,
	documents,
	invoices,
	fees,
	messages,
	activityLogs
};
