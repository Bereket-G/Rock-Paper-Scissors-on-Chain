export default [
	{
		'constant': true,
		'inputs': [
			{
				'name': '_c1',
				'type': 'uint8',
			},
			{
				'name': '_c2',
				'type': 'uint8',
			},
		],
		'name': 'win',
		'outputs': [
			{
				'name': 'w',
				'type': 'bool',
			},
		],
		'payable': false,
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'constant': false,
		'inputs': [],
		'name': 'j2Timeout',
		'outputs': [],
		'payable': false,
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'constant': true,
		'inputs': [],
		'name': 'stake',
		'outputs': [
			{
				'name': '',
				'type': 'uint256',
			},
		],
		'payable': false,
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'constant': true,
		'inputs': [],
		'name': 'c2',
		'outputs': [
			{
				'name': '',
				'type': 'uint8',
			},
		],
		'payable': false,
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'constant': true,
		'inputs': [],
		'name': 'c1Hash',
		'outputs': [
			{
				'name': '',
				'type': 'bytes32',
			},
		],
		'payable': false,
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'constant': false,
		'inputs': [
			{
				'name': '_c2',
				'type': 'uint8',
			},
		],
		'name': 'play',
		'outputs': [],
		'payable': true,
		'stateMutability': 'payable',
		'type': 'function',
	},
	{
		'constant': true,
		'inputs': [],
		'name': 'j2',
		'outputs': [
			{
				'name': '',
				'type': 'address',
			},
		],
		'payable': false,
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'constant': true,
		'inputs': [],
		'name': 'lastAction',
		'outputs': [
			{
				'name': '',
				'type': 'uint256',
			},
		],
		'payable': false,
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'constant': false,
		'inputs': [
			{
				'name': '_c1',
				'type': 'uint8',
			},
			{
				'name': '_salt',
				'type': 'uint256',
			},
		],
		'name': 'solve',
		'outputs': [],
		'payable': false,
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'constant': true,
		'inputs': [],
		'name': 'j1',
		'outputs': [
			{
				'name': '',
				'type': 'address',
			},
		],
		'payable': false,
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'constant': false,
		'inputs': [],
		'name': 'j1Timeout',
		'outputs': [],
		'payable': false,
		'stateMutability': 'nonpayable',
		'type': 'function',
	},
	{
		'constant': true,
		'inputs': [],
		'name': 'TIMEOUT',
		'outputs': [
			{
				'name': '',
				'type': 'uint256',
			},
		],
		'payable': false,
		'stateMutability': 'view',
		'type': 'function',
	},
	{
		'inputs': [
			{
				'name': '_c1Hash',
				'type': 'bytes32',
			},
			{
				'name': '_j2',
				'type': 'address',
			},
		],
		'payable': true,
		'stateMutability': 'payable',
		'type': 'constructor',
	},
]
