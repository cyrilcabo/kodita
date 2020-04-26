// server.js
const { parse } = require('url')
const next = require('next')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const {session} = require('next-session');

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev: false })
const handler = nextApp.getRequestHandler()

const uniqueID = require('./utils/uid.js');

let gameservers = [];

function createGame(host, callback) {
	const gameID = uniqueID();	
	gameservers.push({
		id: gameID,
		players: [],
		host: host.id,
		hostName: host.name,
		deck: [],
		round: 0,
		hasStarted: false,
		hasEnded: false,
		winner: "",
		bank: 0,
		actionQueue: {						
			turn: null,
			turnName: null,
			senderId: "",
			sender: "",
			type: "",
			payload: "",
			recepientId: "",
			recepient: "",
			ongoing: false,
			queue: [],
		},
	});
	return callback(gameID);
}


function joinGame(id, playerId, name) {
	let success = false;
	for (let game of gameservers) {
		if (game.id === id) {
			if (game.players.length < 6) {
				for (let players of game.players) {
					if (playerId === players.id) return success;
				}
				game.players.push({
					id: playerId,
					name: name,
					coins: 0,
					cards: [],
					deadCards: [],
					isTurn: false,
					isDead: false,
				});
				success = true;
			}
		}
	}
	return success;
}

function gameStart (id, callback) {
	for (let game of gameservers) {
		if (game.id === id) {
			//Populates deck with random cards
			const populateDeck = () => {
				let deck = new Array(18);
				for (let i = 0; i < deck.length; i+=6) {
					const cards = ["Duke", "Captain", "Inquisitor", "Assassin", "Contessa", "Ambassador"];
					for (let a = i; a < i+6; a++) {
						const card = cards.splice(Math.floor(Math.abs(Math.random()*cards.length)), 1)[0];
						deck[a] = {
							name: card,
							action: card.toUpperCase(), 
							id: uniqueID(),
						};
					}
				}
				return deck;
			}
			
			const deck = populateDeck();
			const drawCard = () => Math.floor(Math.abs(Math.random()*deck.length));
			const turn = game.players[Math.floor(Math.abs(Math.random()*game.players.length))];
			
			Object.assign(game, {
				players: game.players.map((player) => {
					return {
						...player,
						cards: [deck.splice(drawCard(), 1)[0], deck.splice(drawCard(), 1)[0]],
						coins: 2,
						isTurn: (turn === player.id),
					}
				}),
				bank: 50,
				hasStarted: true,
				deck: deck,
				round: 1,
				actionQueue: {						
					turn: turn.id,
					turnName: turn.name,
					senderId: "",
					sender: "",
					type: "",
					payload: "",
					recepientId: "",
					recepient: "",
					ongoing: false,
					queue: [],
				},
			});
		}
	}
}


function moderator(room, actionArray, sender, recepient, FEE, variant) { 
	gameservers.forEach((server) => {
		if (server.id === room) {
			for (let action of actionArray) {
				let INCOME = 0, drawRecepient = recepient;
				switch (action.name) {
					case "PASS":
						break;
					case "CONTESSA":
						break;
					case "ASSASSIN_FEE":
						INCOME = -3;
					case "INCOME":
						INCOME = action.name==="INCOME" ?1 :INCOME;
					case "FOREIGN AID":
						INCOME = action.name==="FOREIGN AID" ?2 :INCOME;
					case "DUKE":
						if (action.name==="DUKE" && action.purpose==="DEFENSE") break;
						INCOME = action.name==="DUKE" ?3 :INCOME;
						Object.assign(server, {
							players: server.players.map(player => {
								if (player.id === sender) player.coins += INCOME;
								return player;
							}),
							bank: server.bank-INCOME,
						});
						break;
					case "CAPTAIN":
						if (action.purpose === "DEFENSE") break;
						Object.assign(server, {
							players: server.players.map(player => {
								if (player.id === sender) player.coins = (server.players.find(p => p.id === recepient).coins-2 < 0)
									?server.players.find(p => p.id === recepient).coins === 1 ?player.coins+1 :player.coins+0
									:player.coins+2
								if (player.id === recepient) player.coins = (player.coins-2 < 0) ?0  :player.coins-2;
								return player;
							}),
						});
						break;
					case "KODITA":
					case "ASSASSIN":
					case "CARD_KILLED":
						Object.assign(server, {
							players: server.players.map(player => {
								if (player.id === recepient) {
									const deadCardIndex = player.cards.findIndex(card => card.id === action.payload.id);
									const deadCard = player.cards.splice(deadCardIndex, 1);
									player.deadCards = [...player.deadCards, ...deadCard];
									if (!player.cards.length) player.isDead = true;
								}
								if (player.id === sender) {
									player.coins = FEE ?(player.coins-FEE < 0) ?0 :player.coins-FEE :player.coins;
								}
								return player;
							}),
							bank: FEE ?server.bank+FEE :server.bank,
						});
						break;
					case "AMBASSADOR":
						if (!action.payload) break;
					case "CARD_DRAW":
						if (variant === "SHOW CARD") drawRecepient = sender;
					case "INQUISITOR":
						if (variant === "SHOW" || action.purpose === "DEFENSE") break;
						let cardIndex = Math.floor(Math.abs(Math.random()*server.deck.length))
						if (variant === "PEEK" || action.name === "DRAW") {
							if (!action.payload) break;
							if (variant === "PEEK") { 
								cardIndex = server.deck.findIndex(card => card.id === action.payload[0].id);
							}
						}
						let cardToPlayer = server.deck.splice(cardIndex, 1);
						let cardToDeck = [];
						Object.assign(server, {
							players: server.players.map(player => {
								if (player.id === drawRecepient) {
									const payload = variant === "PEEK" ?action.payload[1] :action.payload;
									const payloadIndex = player.cards.findIndex(card => payload.id === card.id);
									cardToDeck = player.cards.splice(payloadIndex, 1);
									if (payloadIndex) player.cards = [...player.cards, ...cardToPlayer];
									else player.cards = [...cardToPlayer, ...player.cards];
								}
								return player;
							}),
							deck: [...server.deck, ...cardToDeck],
						});
						break;
					default: break;
				}
			}
			const indexOfTurn = server.players.findIndex(player => player.id===server.actionQueue.turn);
			const alive = server.players.filter(player => !player.isDead);
			const aliveIndex = alive.findIndex(alive => alive.id===server.actionQueue.turn);
			const findNext = () => {
				if (alive.length <= 1) return 0;
				if (aliveIndex >= alive.length-1 || (aliveIndex === -1 && indexOfTurn > alive.length-1)) return alive[0];
				if (aliveIndex === -1 && indexOfTurn <= alive.length-1) return alive[indexOfTurn];
				if (aliveIndex < alive.length-1) return alive[aliveIndex+1];
			}
			const nextTurn = findNext();
			const test = findNext();
			Object.assign(server, {
				round: server.round+1,
				actionQueue: {		
					turn: nextTurn.id,
					turnName: nextTurn.name,
					senderId: "",
					sender: "",
					name: "",
					type: "",
					payload: "",
					recepientId: "",
					recepient: "",
					ongoing: false,
					queue: [],
				},
				hasEnded: alive.length === 1 || server.players.length < 2, 
				winner: alive.length === 1 && alive[0], 
			});
		}
	});
}

function storeupdate(roomId, userid) {
	let store = {};
	gameservers.forEach(server => {
		if (server.id === roomId) {
			const user = server.players.find(player => player.id === userid);
			const {actionQueue, ...gameState} = server;
			Object.assign(store, {
				gameState: {
					...gameState,
					deck: server.deck.length,
					players: server.players.map(player => ({
						id: player.id,
						name: player.name,
						coins: player.coins,
						isDead: player.isDead,
						deadCards: player.deadCards,
						isTurn: server.actionQueue.turn === player.id,
					})),
				},
				actionQueue: {
					...server.actionQueue,
				},
				user: {
					...user,
					isTurn: server.actionQueue.turn === user.id,
				},
			});
		}
	});
	return store;
}

const gameRooms = io.of('/gameservers');

const gameLobby = io.of('/gamelobby');

gameLobby.on('connection', (socket) => {
	const {username, playerid} = socket.request.headers;
	
	socket.on("creategame", () => {
		createGame({id: playerid, name: username}, (id) => {
			gameLobby.to(socket.id).emit("gamecreated", id);
		});
	});
	
	socket.on('fetchgames', (index) => {
		const rooms = gameservers.slice(index, 10);
		gameLobby.to(socket.id).emit('gamesfetched', {rooms: rooms, hasMore: !(rooms.length < 10)});
	});
	
	socket.on('searchroom', name => {
		const rooms = gameservers.filter(server => server.hostName.toLowerCase() === name.toLowerCase());
		gameLobby.to(socket.id).emit('rooms_searched', rooms);
	})
});


gameRooms.on('connection', (socket) => {
	
	const room_name = parse(socket.request.headers.referer, true).pathname.slice(6);
	const {username, playerid} = socket.request.headers;
	
	socket.use((packet, next) => {
		if (packet[0] === "action") {
			gameservers.forEach((server) => {
				if (server.id === room_name) {
					if (!server.hasStarted) return false;
					server.players.forEach((player) => {
						if (player.id === playerid) {
							const {recepientId, senderId, name, type, purpose, turn, queue, variant} = server.actionQueue;
							const action = packet[1];
							if (action.senderId === senderId && ((name !== "INQUISITOR" && variant !== "PEEK") && name !== "AMBASSADOR")) return false;
							if (action.purpose === "DEFENSE") {
								if ((recepientId !== player.id && type !== "IS_OPEN") || (turn === player.id && queue.length < 1)) {
									return false;
								} else {
									if (type === "IS_OPEN") {
										if (name==="FOREIGN AID" && action.name==="DUKE") {
											return next();
										} else if (((name==="INQUISITOR" && variant === "PEEK") || name=="DUKE" || name==="AMBASSADOR") && action.name==="CHALLENGE") {
											return next();
										} else if ((name==="INQUISITOR" && variant === "PEEK") && action.name === "PASS" && action.senderId === senderId) {
											return next();
										}
									} else {
										if (action.name === "CHALLENGE") return next();
										switch (name) {
											 case "ASSASSIN":
												if (action.name==="CONTESSA") return next();
												break;
											case "CAPTAIN":
												if (purpose === "ATTACK") {
													if (action.name === "CAPTAIN" || action.name === "AMBASSADOR" || action.name === "INQUISITOR") {
														return next();
													}
												}
												break;
											case "CHALLENGE":
												if (action.name === "SHOW CARD" && player.cards.find(card => card.action===queue[queue.length-2].name)) return next();
												if (action.name === "PASS") return next();
												if (action.name === "CHALLENGE") return false;
												break;
											case "KODITA":
											case "SHOW CARD":
												if (action.name === "CHALLENGE") return false;
												break;
											default: return false;
										}
									}
								}
							} else if (action.purpose === "ATTACK") {
								if (action.name === "ASSASSIN" && player.coins < 3) return false;
								if (action.name === "KODITA" && player.coins < 7) return false;
								if ((turn === playerid && queue.length >= 1) || turn !== playerid) return false;
								if (queue.length >= 1) return false;
								if (action.type === "HAS_RECEPIENT" && !action.recepient) return false;
								return next();
							} else if (action.name === "PICK_CARD") {
								return next();
							} else {
								return false;
							}
						}
					});
				};
			});
		} else {
			return next();
		}
	});
	
	socket.join(room_name, () => {
		joinGame(room_name, playerid, username);
		const store = storeupdate(room_name, playerid);
		gameRooms.in(room_name).emit('playerjoined', store.gameState);
		gameRooms.to(socket.id).emit('joined', store);
	});
	
	
	socket.on("startgame", (id) => {
		gameservers.forEach(server => {	
			if(server.id===id) {
				if (server.players.length > 1) {
					gameRooms.in(room_name).emit("counter_start", 5);
					gameStart(id);
					gameRooms.in(room_name).emit("gamestarted");
				}
			}
		});
	});
	
	socket.on("gameinit", () => {
		setTimeout(() => {
			const store = storeupdate(room_name, playerid); 	
			gameRooms.in(room_name).emit("counter_end");
			gameRooms.in(room_name).emit("game_has_started");
			gameRooms.to(socket.id).emit('updatestore', store);
		}, 5000);
	});
	
	socket.on("fetchstore", () => {
		const store = storeupdate(room_name, playerid);
		gameRooms.to(socket.id).emit("updatestore", store);
	});
	
	socket.on("action", (action) => {
		gameservers.forEach((server) => {
			if (server.id === room_name) {
				if (action.name === "INQUISITOR" && action.variant === "SHOW") action.socketrecepient = socket.id;
				action.id = uniqueID();
				Object.assign(server, {
					actionQueue: {
						...server.actionQueue,
						...action,
						ongoing: true,
						queue: [...server.actionQueue.queue, action],
					}
				});
				
				switch (action.name) {
					case "AMBASSADOR":
					case "INQUISITOR":
					case "CAPTAIN":
					case "DUKE":
						if (action.purpose !== "DEFENSE") break;
					case "CHALLENGE":
					case "PICK_CARD":
					case "CARD_KILLED":
					case "PASS":
					case "SHOW CARD":
					case "CONTESSA":
						server.actionQueue.queue[server.actionQueue.queue.length-2].isChallenged = true;
						gameRooms.in(room_name).emit("counter_end");
						break;
					default: break;
				}
				
				function cardKilled (cardToKill, cardToDraw, sender, recepient, killFee, inquisitor) {
					gameRooms.in(room_name).emit('counter_start', 5);
					const killAction = cardToKill ?[{name: 'CARD_KILLED', payload: cardToKill}] :[];
					const drawAction = cardToDraw ?[{name: 'CARD_DRAW', payload: cardToDraw}] :[];
					setTimeout(() => {
						moderator(room_name, [
							...killAction,
							...drawAction,
						], sender, recepient, killFee, inquisitor ?inquisitor :null);
						gameRooms.in(room_name).emit('counter_end');
						gameRooms.in(room_name).emit("storeupdated");
					}, 5000);
				}
				if (action.name === "INQUISITOR" && action.variant === "PEEK") {
					const payload = server.deck[Math.floor(Math.abs(Math.random()*server.deck.length))];
					setTimeout(() => gameRooms.to(socket.id).emit("CARD_PEEK", {
						queue: server.actionQueue, 
						action: action, 
						payload: payload
					}), 500);
				}
				
				if (action.name === "INCOME" || action.name === "PASS") {
					let newAction, newSender, newRecepient, FEE = null;
					gameRooms.in(room_name).emit("counter_start", 5);
					setTimeout(() => {
						if (action.name === "PASS") {
							const previousAction = server.actionQueue.queue[server.actionQueue.queue.length-2];
							if (previousAction.name === "INQUISITOR" && previousAction.variant === "PEEK" && previousAction.senderId === playerid) {
								newAction = {name: "PASS"};
							} else {
								const challengerAction = server.actionQueue.queue[server.actionQueue.queue.length-3];
								switch (challengerAction.name) {
									case "CONTESSA":
									case "CAPTAIN":
									case "INQUISITOR":
									case "DUKE":
									case "ASSASSIN":
										if (challengerAction.name === "ASSASSIN") {
											FEE = 3;
											newAction = {name: "ASSASSIN_FEE"};
										}
									case "AMBASSADOR":
										if (challengerAction.purpose === "DEFENSE") {
											newAction = server.actionQueue.queue[server.actionQueue.queue.length-4];
											newSender = newAction.senderId;
											newRecepient = newAction.recepientId;
											if (newAction.name === "ASSASSIN") {
												newAction.payload = server.players.find(p => p.id===newRecepient).cards[0];
												FEE = 3;
											}
										}
										break;
									default: break;
								}
							}
						};
						moderator(room_name, [newAction ?newAction :action], newSender ?newSender :action.senderId, newRecepient ?newRecepient :action.recepientId, FEE);
						const store = storeupdate(room_name, playerid);
						gameRooms.in(room_name).emit("counter_end");
						gameRooms.in(room_name).emit("storeupdated");
					}, 5000);
					
				} else if (action.name === "PICK_CARD") {
					const actionInitiator = server.actionQueue.queue[server.actionQueue.queue.length-2];
					switch(actionInitiator.name) {
						case "SHOW CARD":
							cardKilled(action.payload,
								server.players.find(p => p.id===actionInitiator.senderId).cards.find(card => card.action===server.actionQueue.queue[server.actionQueue.queue.length-4].name), 
								actionInitiator.senderId, 
								actionInitiator.recepientId,
								null,
								"SHOW CARD");
							break;
						case "KODITA":
						case "ASSASSIN":
							const FEE = (actionInitiator.name === "ASSASSIN") ?3 :7;
							cardKilled(action.payload, null, actionInitiator.senderId, actionInitiator.recepientId, FEE);
							break;
						case "AMBASSADOR":
							cardKilled(null, action.payload, null, action.senderId);
							break;
						case "INQUISITOR":
							if (actionInitiator.variant === "SHOW") {
								setTimeout(() => gameRooms.to(actionInitiator.socketrecepient).emit("CARD_REVEAL", {
									queue: server.actionQueue, 
									action: action,
									payload: action.payload,
								}), 500);
							}
							let payload = (actionInitiator.variant === "SHOW") ?null :action.payload;
							const inquisitor = actionInitiator.variant;
							cardKilled(null, payload, null, action.senderId, null, inquisitor);
							break;
						default: break;
					}
				} else {
					gameRooms.in(room_name).emit("counter_start", 15);
					setTimeout(() => {
						const queueEntry = server.actionQueue.queue.find(queue => queue.id===action.id);
						if (server.actionQueue.queue.length && queueEntry !== undefined && !queueEntry.isChallenged) {
							gameRooms.in(room_name).emit("counter_end");
							if (action.name === "SHOW CARD" || action.name === "KODITA" || action.name === "ASSASSIN" || ((action.name === "INQUISITOR") && action.purpose !== "DEFENSE")) {
								let actionName, actionVariant, actionSender, actionRecepient, FEE, cardToDraw;
								const cardToKill = (action.name === "INQUISITOR" && action.variant !== "SHOW")
									?null
									:server.players.find(player => player.id === action.recepientId).cards[0];
								switch (action.name) {	
									case "KODITA":
									case "ASSASSIN":
										FEE = action.name === "ASSASSIN" ?3 :7;
									case "SHOW CARD":
										actionSender = {name: action.recepient, id: action.recepientId};
										actionName = "PICK_CARD";
										actionVariant = "IS_KILL";
										if (action.name==="SHOW CARD") {
											cardToDraw = server.players.find(p => p.id===action.senderId).cards.find(card => card.action === server.actionQueue.queue[server.actionQueue.queue.length-3].name);
										}
										break;
									case "INQUISITOR":
										actionSender = {name: action.sender, id: action.senderId};
										actionRecepient = {name: action.recepient, id: action.recepientId};
										actionName = "INQUISITOR";
										actionVariant = action.variant;
										if (action.variant === "DRAW") {
											actionName = "PICK_CARD";
											actionVariant = "DRAW";
											cardToDraw = server.players.find(player => player.id === action.recepientId).cards[0];
										} else if (action.variant === "PEEK") {
											actionName = "PASS";
										} else {
											actionName = "PICK_CARD";
											actionVariant = "CARD_REVEAL";
											setTimeout(() => gameRooms.to(action.socketrecepient).emit("CARD_REVEAL", {
												queue: server.actionQueue, 
												action: action,
												payload: cardToKill,
											}), 500);
										}
										break;
									default: break;
								}
								const newAction = {
										sender: actionSender.name,
										senderId: actionSender.id,
										recepientId: actionRecepient ?actionRecepient.id :null,
										recepient: actionRecepient ?actionRecepient.name :null,
										name: actionName,
										variant: actionVariant,
										payload: cardToKill,
								};
								Object.assign(server, {
									actionQueue: {
										...server.actionQueue,
										...newAction,
										queue: [...server.actionQueue.queue, newAction],
									}
								});
								gameRooms.in(room_name).emit("storeupdated");
								cardKilled(
									(actionName === "PICK_CARD" && actionVariant === "CARD_REVEAL") ?null :cardToKill,
									cardToDraw ?cardToDraw :action.payload, 
									action.senderId, action.recepientId, 
									FEE, 
									actionVariant
								);
							} else {
								const previousAction = server.actionQueue.queue[server.actionQueue.queue.length-2];
								const actionInitiator = server.actionQueue.queue[server.actionQueue.queue.length-3];
								let sender = action.senderId, recepient = action.recepientId, FEE = null;
								if (queueEntry.name === "CHALLENGE") {
									action.name = "PASS";
									switch (previousAction.name) {
										case "ASSASSIN":
											action.name = "ASSASSIN_FEE";
											sender = previousAction.senderId;
											break;
										case "DUKE":
										case "CAPTAIN":
										case "AMBASSADOR":
										case "INQUISITOR":
											if (previousAction.purpose !== "DEFENSE") break;
										case "CONTESSA":
											action = actionInitiator;
											if (actionInitiator.name === "ASSASSIN") {
												action.payload = server.players.find(p => p.id===recepient).cards[0];
												FEE = 3;
											}
											break;
										default: break;
									}
								}
								moderator(room_name, [action], sender, recepient, FEE);
								gameRooms.in(room_name).emit("storeupdated");
							}
						}
					}, 15000);
				}
			}
		});
		gameRooms.in(room_name).emit("storeupdated");
	});
	
	socket.on("disconnect", () => {
		gameservers.forEach((server, index) => {
			if (server.id === room_name) {
				if (playerid === server.host) { 
					const leavingHostIndex = server.players.findIndex(player => player.id===playerid);
					const nextHost = (leavingHostIndex === server.players.length-1)
						?server.players[0]
						:server.players[leavingHostIndex+1];
						if (nextHost) {
							Object.assign(server, {
								host: nextHost.id,
								hostName: nextHost.name,
							});
						}
				}
				Object.assign(server, {
					players: server.players.filter(player => player.id !== playerid),
				});
				if (playerid === server.actionQueue.turn || playerid === server.actionQueue.senderId) 
					moderator(room_name, [{name: "PASS"}]);
				gameRooms.in(room_name).emit("storeupdated");
				if (server.players.length === 0) {
					gameservers.splice(index, 1);
				}
			}
		});
	});
});

nextApp.prepare().then(() => {
	
	app.use(express.static('public'));
	app.use(session({name: "kodita"}));
	
	app.get('/game/:server', (req, res) => {
		if (!req.session.playerID) res.redirect('/');
		else if (!gameservers.find(server => server.id===req.params.server) || gameservers.find(server => server.id===req.params.server).hasStarted || gameservers.find(server => server.id===req.params.server).players.length >= 6) 
			res.redirect("/game");
		else return handler(req, res);
	});
	
	app.get('/api/login', (req, res) => {
		const name = (req.query.name.length > 15)
			?req.query.name.slice(0, 14)
			:req.query.name;
		req.session.username = name;
		req.session.playerID = uniqueID();
		if (req.session.username)
			res.json({status: "user registered", name: req.session.username});
		else
			res.json({status: "err occured", name: null});
	});
	
	app.get('/api/authenticateuser', (req, res) => {
		const {username, playerID} = req.session;
		if (req.session.username) 
			res.json({username: username, playerID: playerID, success: true});
		else
			res.json({username: null, playerID: null, success: false});
	});
	
	app.get('/game', (req, res) => {
		if (!req.session.playerID) res.redirect('/');
		else return handler(req, res);
	});
	
    app.get('*', (req, res) => {
		return handler(req, res);
	});
	
	server.listen(process.env.PORT || 3000, err => {
		if (err) throw err
		console.log('> Ready on http://localhost:3000')
  })
});