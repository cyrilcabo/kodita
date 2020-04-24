export const attackActionsSrc = [
	{
		name: "DUKE",
		details: "Steal 3 coins",
		variant: null,
		type: "IS_OPEN",
		purpose: "ATTACK",
		fee: null, 
		state: false,
	},
	{
		name: "ASSASSIN",
		details: "Assassinate",
		variant: null,
		type: "HAS_RECEPIENT",
		purpose: "ATTACK",
		fee: 3,
		state: false,
		
	},
	{
		name: "AMBASSADOR",
		details: "Exchange card from deck",
		variant: null,
		type: "IS_OPEN",
		purpose: "ATTACK",
		fee: null, 
		state: false,
	},
	{
		name: "CAPTAIN",
		details: "Steal 2 coins from:",
		variant: null,
		type: "HAS_RECEPIENT",
		purpose: "ATTACK",
		fee: null, 
		state: false,
	},
	{
		name: "INQUISITOR",
		details: "Show card of:",
		variant: "SHOW",
		type: "HAS_RECEPIENT",
		purpose: "ATTACK",
		fee: null, 
		state: false,
	},
	{
		name: "INQUISITOR",
		details: "Force to redraw card:",
		variant: "DRAW",
		type: "HAS_RECEPIENT",
		purpose: "ATTACK",
		fee: null, 
		state: false,
	},
	{
		name: "INQUISITOR",
		details: "Draw a card, and optionally take it.",
		variant: "PEEK",
		type: null,
		purpose: "ATTACK",
		fee: null,
		state: false,
	},
	{
		name: "INCOME",
		details: "Take 1 coin from bank",
		variant: null,
		type: null,
		purpose: "ATTACK",
		fee: null, 
		state: false,
	},
	{
		name: "FOREIGN AID",
		details: "Take 2 coins from bank",
		variant: "FOREIGN_AID",
		type: "IS_OPEN",
		purpose: "ATTACK",
		fee: null, 
		state: false,
	},
	{
		name: "KODITA",
		details: "Kodita",
		variant: null,
		type: "HAS_RECEPIENT",
		purpose: "ATTACK",
		fee: 7,
		state: false,
	},
];
export const defenseActionsSrc = [
	{
		name: "DUKE",
		details: "Block foreign aid:",
		variant: null,
		type: "HAS_RECEPIENT",
		purpose: "DEFENSE",
		fee: null, 
		state: false,
	},
	{
		name: "CONTESSA",
		details: "Block assassination",
		variant: null,
		type: "HAS_RECEPIENT",
		purpose: "DEFENSE",
		fee: null, 
		state: false,
	},
	{
		name: "CAPTAIN",
		details: "Block steal",
		variant: null,
		type: "HAS_RECEPIENT",
		purpose: "DEFENSE",
		fee: null, 
		state: false,
	},
	{
		name: "AMBASSADOR",
		details: "Block steal",
		variant: null,
		type: "HAS_RECEPIENT",
		purpose: "DEFENSE",
		fee: null, 
		state: false,
	},
	{
		name: "INQUISITOR",
		details: "Block steal",
		variant: "BLOCK",
		type: "HAS_RECEPIENT",
		purpose: "DEFENSE",
		fee: null, 
		state: false,
	}
];