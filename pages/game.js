import io from 'socket.io-client';

import Router from 'next/router';
import React from 'react';
import fetch from 'isomorphic-unfetch';
import InfiniteScroll from 'react-infinite-scroll-component';

import Layout from '../components/layout';
import Search from '../components/GameLobby/search';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyle = makeStyles(theme => ({
	root: {
		height: '85vh',
		width: '100%',
	},
	lobbycontainer: {
		height: '100%',
		width: '98%',
		paddingLeft: '0% 1% 0% 1%',
		paddingTop: '2%',
	},
	playersin: {
		color: 'white',
		border: '1px solid black',
		backgroundColor: 'black',
		marginRight: 10,
	},
	inlobby: {
		color: 'white',
		backgroundColor: 'green',
		padding: 1,
	},
	started: {
		color: 'white',
		backgroundColor: 'red',
		padding: 1,
	},
	searchbar: {
		height: '10%',
		[theme.breakpoints.down('sm')]: {
			height: '20%',
		}
	},
	container: {
		height: '80%',
		[theme.breakpoints.down('sm')]: {
			height: '90%',
		}
	},
	gamelist: {
		height: '80%',
		overflowY: 'auto',
		[theme.breakpoints.down('sm')]: {
			height: '60%',
		}
	}
}));

const Game = (props) => {
	const classes = useStyle();
	const useIo = () => {
		const socket = io('/gamelobby', {
			transportOptions: {
				polling: {
					extraHeaders: {
						'playerID': props.playerID,
						'username': props.username,
					}
				}
			}
		});	
		
		socket.on("gamecreated", (id) => Router.push("/game/"+id));
		
		socket.on("gamesfetched", (newrooms) => {
			setRooms([...rooms, ...newrooms.rooms]);
			setRoomLobby({...roomLobby, hasMore: newrooms.hasMore});
		});
		
		socket.on("rooms_searched", rooms => {
			setRooms(rooms);
			setSearched(true);
		});
		
		return socket;
	}
	const [socketio, setSocketIo] = React.useState(useIo);
	
	React.useEffect(() => {
		socketio.emit('fetchgames', 0);
	}, []);
	
	const [name, setName] = React.useState("");
	const [searched, setSearched] = React.useState(false);
	const [rooms, setRooms] = React.useState([]);
	const [roomLobby, setRoomLobby] = React.useState({
		index: 0,
		hasMore: false,
	});
	
	const fetchNext = () => {
		socketio.emit('fetchgames', roomLobby.index+10);
		setRoomLobby({...roomLobby, index: roomLobby.index+10});
	}
	
	const newGame = () => {
		socketio.emit("creategame");
	}
	
	const refreshList = () => {
		setSearched(false);
		socketio.emit('fetchgames', roomLobby.index);
	}
	
	const searchRoom = (room) => {
		socketio.emit('searchroom', room);
	}
	
	const gameRooms = rooms.map((room) => {
		return <React.Fragment>
			<ListItem>
				<ListItemText
					primary={room.hostName}
					secondary={<span>
						<span className={classes.playersin}> Players: {room.players.length}/6 </span>
						<span className={room.hasStarted ?classes.started :classes.inlobby}> {room.hasStarted ?'Playing' :'In Lobby'} </span>
					</span>}
				/>
				<Button 
					color="secondary" 
					variant="contained" 
					disabled={room.hasStarted || room.players.length >= 6} 
					onClick={() => Router.push('/game/'+room.id)}
				>
					Join
				</Button>
			</ListItem>
			<Divider style={{width: '100%', backgroundColor: 'black', height: 1}} />
		</React.Fragment>
	})
	return (
		<Layout>
			<div className={classes.root}>
				<Grid xs={12} justify="center" alignItems="center" container style={{height: '100%'}}>
					<Grid item xs={12} md={8} container justify="center" className={classes.container}>
						<Paper className={classes.lobbycontainer}>
							<Grid item xs={12} className={classes.searchbar} container>
								<Search refreshList={refreshList} searchRoom={searchRoom} />
							</Grid>
							<Grid item xs={12} className={classes.gamelist}>
								{searched
									?gameRooms.length
										?<List style={{width: '100%', height: '100%'}}>
											{gameRooms}
										</List>
										:<div style={{textAlign: 'center', width: '100%'}}>
											<h4> No games matched with your query! </h4>
										</div>
								
									:<InfiniteScroll
										dataLength={gameRooms.length}
										next={fetchNext}
										hasMore={roomLobby.hasMore}
										loader={<h4 style={{textAlign: "center", color: "white"}}> Loading more items... </h4>}
										endMessage={""}
										style={{
											width: "100%",
											height: '100%',
											textAlign: 'center',
										}}
									>
										{gameRooms.length
											?<List style={{width: '100%'}}>
												{gameRooms}
											</List>
											:<h4> No games are available as of the moment! </h4>
										}
									</InfiniteScroll>
								}
								</Grid>
							<Divider />
							<Grid item xs={12} container justify="space-around" style={{height: '10%'}}>
								<Grid item xs={12} md={4}>
									<Button color="primary" variant="contained" fullWidth onClick={newGame}>
										Create Game
									</Button>
								</Grid>
								<Grid item xs={12} md={4}>
									<Button color="textPrimary" variant="contained" fullWidth onClick={refreshList}>
										Refresh list
									</Button>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</Grid>
			</div>
		</Layout>
	);
}

Game.getInitialProps = async ({req, res}) => {
	const cookie = (req) ?{'Cookie': req.headers.cookie} :null;
	const user = await fetch('https://kodita.herokuapp.com/api/authenticateuser', {
		'credentials': 'include',
		headers: {
			...cookie,
		}
	}).then(response => response.json());
	return {username: user.username, playerID: user.playerID};
}

export default Game;