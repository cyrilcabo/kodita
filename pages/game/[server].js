import io from 'socket.io-client';
import Router from 'next/router';
import React from 'react';
import fetch from 'isomorphic-unfetch';

import ActionDispatcher from '../../components/Actions/actionsdispatcher';
import PlayersList from '../../components/Players/playerslist';
import ActionBoard from '../../components/ActionBoard/actionboard';
import Layout from '../../components/layout';

import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Hidden from '@material-ui/core/Hidden';

import GroupIcon from '@material-ui/icons/Group';
import GamesIcon from '@material-ui/icons/Games';

import CountdownTimer from '../../components/GameUtils/countdowntimer';

import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyle = makeStyles(theme => ({
	root: {
		height: '85%', 
		width: '100%', 
		display: 'flex', 
		position: 'relative',
		justifyContent: 'center',
		[theme.breakpoints.down('sm')]: {
			height: '100%',
		}
	},
	playerlist: {
		height: "100%", 
		width: '25%', 
		display: 'flex', 
		justifyContent: 'center', 
		backgroundColor: '#393a3a',
		[theme.breakpoints.down('sm')]: {
			display: 'none',
		}
	},
	actionboard: {
		height: "100%", 
		width: "45%", 
		display: 'flex',
		justifyContent: 'center',
		[theme.breakpoints.down('sm')]: {
			width: '95%',
			height: '90%',
		},
		[theme.breakpoints.down('xs')]: {
			marginBottom: 100,
		}
	},
	actioncontrols: {
		height: '100%', 
		width: '25%', 
		backgroundColor: '#907272',
		'& > div': {
			height: '100%',
		},
		[theme.breakpoints.down('sm')]: {
			display: 'none',
		}
	},
	bottomcontrolscontainer: {
		width: '100%',
		height: '10%',
		position: 'absolute',
		bottom: -30,
		display: 'none',
		[theme.breakpoints.down('sm')]: {
			display: 'block',
		},
		[theme.breakpoints.down('xs')]: {
			position: 'fixed',
			bottom: 0,
		},
	},
	bottomcontrols: {
		width: '100%',
		height: '100%',
		display: 'flex',
		justifyContent: 'center',
		backgroundColor: '#4c5062 !important',
	},
	bottomcontrolsbutton: {
		width: '14.28%',
		height: '100%',
	},
	navactionbuttons: {
		height: '100%', 
		'& > span.MuiButton-label': {
			display: 'flex', 
			flexDirection: 'column',
			'& > button.MuiButtonBase-root': {
				padding: 0,
				margin: 0,
			}
		}
	},
	drawer: {
		'& > div.MuiPaper-root': {
			height: '80%',
			'& > div': {
				height: '100%',
			}
		}
	}
}));

const GameServer = (props) => {
	const classes = useStyle();
	const useIo = () => {
		const socket = io('/gameservers', {
			transportOptions: {
				polling: {
					extraHeaders: {
						'playerID': props.playerID,
						'username': props.username,
					}
				}
			}
		});
		
		socket.on("joined", (state) => {
			setUser({...user, ...state.user});
			setActionQueue({...actionQueue, ...state.actionQueue});
			setGameState({...gameState, ...state.gameState});
		});
			
		socket.on("gamestarted", () => {
			setStarting(true);
			socketio.emit("gameinit");
		});
		
		socket.on("game_has_started", () => setStarting(false));
		
		socket.on("storeupdated", () => socket.emit("fetchstore"));
		
		socket.on("playerjoined", (state) => setGameState({...gameState, ...state}));
		
		socket.on("updatestore", (state) => {
			setUser({...user, ...state.user});
			setActionQueue({...actionQueue, ...state.actionQueue});
			setGameState({...gameState, ...state.gameState});
		});
		
		socket.on("CARD_REVEAL", (payload) => {
			setActionQueue({...payload.queue, queue: [...payload.queue.queue, {
				...payload.action,
				name: "CARD_REVEAL",
				payload: payload.payload,
			}]});
		});
		
		socket.on("CARD_PEEK", (payload) => {
			setActionQueue({...payload.queue, queue: [
				...payload.queue.queue,
				{
					...payload.action,
					name: "CARD_PEEK",
					payload: payload.payload,
				}
			]});
		});
		
		socket.on("counter_start", (counter) => setCounter({state: true, time: counter}));
		
		socket.on("counter_end", () => setCounter({state: false, time: null}));
		
		return socket;
	}
	const [socketio, setSocketIo] = React.useState(useIo);
	const [starting, setStarting] = React.useState(false);
	const [counter, setCounter] = React.useState({state: false, time: null});
	const [drawer, openDrawer] = React.useState({top: false, bottom: false});
	
	const toggleDrawer = (anchor) => openDrawer({...drawer, [anchor]: drawer[anchor] ?false :true});

	const [gameState, setGameState] = React.useState({
		host: "",
		hostName: "",
		bank: 0,
		deck: [],
		players: [],
		hasStarted: false,
		hasEnded: false,
		winner: null,
		round: 0,
	});
	
	const [user, setUser] = React.useState({
		id: "",
		name: "",
		coins: 0,
		cards: [],
		isTurn: false,
		isDead: false,
		deadCards: [],
	});
	
	const [actionQueue, setActionQueue] = React.useState({						
		turn: "",
		turnName: "",
		senderId: "",
		sender: "",
		type: "",
		payload: "",
		recepientId: "",
		recepient: "",
		ongoing: false,
		queue: [],
	});
	
	
	const server = (props.path) ?props.path :Router.query.server;
	
	const startGame = () => socketio.emit("startgame", gameState.id);
	
	const dispatchAction = (action, recepient) => {
		switch (action.name) {
			case "PICK_CARD":
			case "CHALLENGE":
			case "SHOW CARD":
			case "PASS":
				break;
			default: toggleDrawer("bottom");
		}
		socketio.emit("action", {
			...action,
			senderId: user.id, 
			sender: user.name,
			recepientId: recepient ?recepient.id :null,
			recepient: recepient ?recepient.name :null,
			isChallenged: false,
		});
	};
	
	const exitToLobby = () => {
		socketio.disconnect();
		Router.replace("/game");
	}
	
	return (
		<Layout isGame logout={exitToLobby} >
			<div className={classes.root}>
				<Grid xs={12} container item justify="space-around">
					<Paper className={classes.playerlist}>
						<PlayersList players={gameState.players} hasStarted={gameState.hasStarted} />
					</Paper>
					<div className={classes.actionboard}>
						<ActionBoard 
							ready={gameState.players.length > 1} 
							hasStarted={gameState.hasStarted} 
							hasEnded={gameState.hasEnded}
							round={gameState.round} 
							winner={gameState.winner} 
							actionQueue={actionQueue}
							counterIsRunning={counter.state}
							counter={counter.time}
							bank={gameState.bank}
							deck={gameState.deck}
							user={user}
							startGame={startGame}
							isHost={gameState.host === user.id}
							starting={starting}
							dispatchAction={dispatchAction}
						/>
					</div>	
					<Paper className={classes.actioncontrols}>
						<ActionDispatcher 
							actionQueue={actionQueue} 
							user={user} 
							players={gameState.players} 
							dispatchAction={dispatchAction}
							hasStarted={gameState.hasStarted}
						/>
					</Paper>
				</Grid>
				<div className={classes.bottomcontrolscontainer}>
					<Paper className={classes.bottomcontrols} square>
						<Grid item xs={12} container justify="center">
							<Grid item xs={4}>
								<Button fullWidth className={classes.navactionbuttons} onClick={toggleDrawer.bind(this, "top")}>
									<IconButton>
										<GroupIcon />
									</IconButton>
									Players
								</Button>
							</Grid>
							<Grid item xs={4}>
								<Button fullWidth className={classes.navactionbuttons} onClick={toggleDrawer.bind(this, "bottom")}>
									<IconButton>
										<GamesIcon />
									</IconButton>
									Actions
								</Button>
							</Grid>
						</Grid>
					</Paper>
				</div>
				<Hidden mdUp>
					<SwipeableDrawer
						anchor="top"
						open={drawer.top}
						onClose={toggleDrawer.bind(this, 'top')}
						onOpen={toggleDrawer.bind(this, 'top')}
					>
						<PlayersList players={gameState.players} hasStarted={gameState.hasStarted} />
					</SwipeableDrawer>
					<SwipeableDrawer
						anchor="bottom"
						open={drawer.bottom}
						onClose={toggleDrawer.bind(this, 'bottom')}
						onOpen={toggleDrawer.bind(this, 'bottom')}
						className={classes.drawer}
					>
						<ActionDispatcher 
							actionQueue={actionQueue} 
							user={user} 
							players={gameState.players} 
							dispatchAction={dispatchAction}
							hasStarted={gameState.hasStarted} 
						/>
					</SwipeableDrawer>
				</Hidden>
			</div>
		</Layout>
	);
}

GameServer.getInitialProps = async ({req, res}) => {
	let path, cookie=null;
	if (req) {
		cookie = {'Cookie': req.headers.cookie};
		path = req.params.server;
	}
	const user = await fetch('https://kodita.herokuapp.com/api/authenticateuser', {		
		'credentials': 'include',
		headers: {
			...cookie,
		}
	}).then(response => response.json());
	if (!user.success) {
		res.writeHead(301, {Location: '/'});
		res.end();
	}
	return {username: user.username, playerID: user.playerID, path: path};
}

export default GameServer;
