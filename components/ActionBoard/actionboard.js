import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

import UtilIcon from '../GameUtils/utilicon';
import CountdownTimer from '../GameUtils/countdowntimer';

import ActionsList from './actionslist';
import CardHolder from './cardholder';

import makeStyles from '@material-ui/core/styles/makeStyles';

import React from 'react';

const useStyle = makeStyles(theme => ({
	root: {
		width: '100%',
		height: '100%',
	},
	header: {
		height: '10%',
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	body: {
		height: '60%',
		width: '100%',
		display: 'flex',
		justifyContent: 'flex-start',
		flexDirection: 'column',
		alignItems: 'center',
		overflowY: 'auto',
	}, 
	footer: { 
		height: '30%', 
		width: '100%',
		display: 'flex',
	},
	gameState: {
		height: '100%',
		width: '30%',
	},
	challengeActions: {
		margin: 10,
		width: '30%',
	},
	cardHolder: {
		[theme.breakpoints.down('sm')]: {
			padding: 6,
		}
	},
	card: {
		height: '100%',
		width: '100%',
		[theme.breakpoints.down('sm')]: {
			width: '80%',
			heightt: '80%',
		},
	},
	control2: {
		flexDirection: 'column',
		[theme.breakpoints.down('xs')]: {
			justifyContent: 'center',
			flexDirection: 'row',
		}
	},
	controlbuttons: {
		[theme.breakpoints.down('xs')]: {
			margin: 5,
			padding: 5,
		}
	}
}));

const ActionBoard = (props) => {
	const classes = useStyle();
	const {actionQueue, user} = props;
	const [cardDrawing, setCardDrawing] = React.useState(false);
	const [cardToPlayer, setCardToPlayer] = React.useState({});
	const [hideButton, setHideButton] = React.useState(false);
	
	const startButton = () => {
		props.startGame();
		setHideButton(true);
	}
	
	const display = props.hasStarted
			?props.hasEnded
				? <h4> Game has ended! Winner is {props.winner.name} </h4>
				:<ActionsList actionQueue={actionQueue.queue} />
			:props.starting
				?<h4> Game is starting... </h4>
				:props.ready
					?<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}> 
						<h4> Players ready, start now! </h4>
						{props.isHost ?<Button style={{display: hideButton ?"none" :"block"}} disabled={!props.ready} onClick={startButton} variant="outlined" color="secondary"> START GAME </Button> :""}
					</div>
					:<h4> Welcome, players! Waiting for others...</h4>
	const actionCards = () => {
		if (actionQueue.name === "CHALLENGE" && actionQueue.recepientId === user.id) {
			const disabled = (user.cards.find(card => card.action===actionQueue.queue[actionQueue.queue.length-2].name) && actionQueue.recepientId === user.id)
					?false
					:true;
			return [
				<Button color="primary" variant="contained" disabled={disabled} onClick={props.dispatchAction.bind(this, {
					name: "SHOW CARD",
					details: "Show your card",
					variant: null,
					type: "HAS_RECEPIENT",
					purpose: "DEFENSE",
					fee: null,
					payload: user.cards.find(card => card.action===actionQueue.queue[actionQueue.queue.length-2].name),
				}, {id: actionQueue.senderId, name: actionQueue.sender})}> Show Card </Button>,
				<Button color="secondary" variant="contained" onClick={props.dispatchAction.bind(this, {
					name: "PASS",
					details: "Cancel attack",
					variant: null,
					type: null,
					purpose: "DEFENSE",
					fee: null,
				}, null)}> Pass </Button>,
			];
		} else if (!user.isDead && ((actionQueue.type === "IS_OPEN" && (actionQueue.name === "DUKE" || actionQueue.name === "AMBASSADOR" || (actionQueue.name === "INQUISITOR" && actionQueue.variant === "PEEK")))&& actionQueue.turn !== user.id) || (actionQueue.type === "HAS_RECEPIENT" && actionQueue.name !== "KODITA" && actionQueue.recepientId === user.id && actionQueue.name !== "PICK_CARD") && actionQueue.name !== "SHOW CARD" && actionQueue.name !== "CHALLENGE") {
			return <Button color="secondary" variant="contained" onClick={props.dispatchAction.bind(this, {
				name: "CHALLENGE",
				details: "Call a bluff",
				variant: null,
				type: "HAS_RECEPIENT",
				purpose: "DEFENSE",
				fee: null, 
			}, {id: actionQueue.senderId, name: actionQueue.sender})}> Challenge </Button>
		} else if (actionQueue.queue.length && actionQueue.queue[actionQueue.queue.length-1].name === "CARD_PEEK") {
			return [
				<Button 
					color="secondary" 
					variant="contained" 
					disabled={cardDrawing} 
					onClick={cardDraw.bind(this, actionQueue.queue[actionQueue.queue.length-1].payload)}
				> Pick Card </Button>,
				<Button color="secondary" variant="contained" onClick={props.dispatchAction.bind(this, {
					name: "PASS",
					details: "Cancel attack",
					variant: null,
					type: null,
					purpose: "DEFENSE",
					fee: null,
				}, null)}> Pass </Button>
			];
		} else {
			return <Button color="secondary" variant="contained" disabled> Challenge </Button>
		}
	}
	const blink = (((actionQueue.name === "SHOW CARD" || actionQueue.name === "KODITA" || actionQueue.name === "ASSASSIN" || (actionQueue.name === "INQUISITOR" && (actionQueue.variant === "SHOW" || actionQueue.variant==="DRAW"))) && actionQueue.recepientId === user.id) || cardDrawing || (actionQueue.name === "AMBASSADOR" && actionQueue.purpose === "ATTACK" && actionQueue && actionQueue.senderId === user.id)) ?true :false;
	
	const cardDraw = (card) => {
		setCardDrawing(true);
		setCardToPlayer(card);
	}
	
	const pickCard = (card) => {
		let cards = [];
		if (cardDrawing) cards = [cardToPlayer, card]; 
		const variant = (actionQueue.name === "INQUISITOR")
			?(actionQueue.variant==="SHOW")
				?"CARD_REVEAL"
				:(actionQueue.variant==="PEEK")
					?"PEEK_CARD"
					:"DRAW_CARD"
			:(actionQueue.name === "AMBASSADOR")
				?"AMBASSADOR"
				:"IS_KILL";
		props.dispatchAction({
			name: "PICK_CARD",
			variant: variant,
			payload: cardDrawing ?cards :card,
		}, {id: actionQueue.recepientId, name: actionQueue.recepient});
		
		setCardDrawing(false);
	}
	return (
		<Paper className={classes.root}>
			<div className={classes.header}> 
				<span style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}> 
					<span>Turn: </span>
					<span> {actionQueue.turnName} </span>
				</span>
				<h3> {props.counterIsRunning ?<CountdownTimer counter={props.counter} /> :0} </h3>
				<h4> Round: {props.round} </h4>
			</div>
			<Divider style={{width: '100%'}}/>
			<div className={classes.body}>
				{display}
			</div>
			<Divider />
			<div className={classes.footer}>
				<Grid item container xs={4} alignItems="center" justify="center">
					<Grid item xs={12} className={classes.control2} container justify="center" alignItems="center">
						<Grid item> Bank: </Grid>
						<Grid item> {props.bank} </Grid>
					</Grid>
					<Grid item xs={12} className={classes.control2} container justify="center" alignItems="center">
						<Grid item> Deck: </Grid>
						<Grid item> {props.deck} </Grid>
					</Grid>
					<Grid item xs={12} className={classes.control2} container justify="center" alignItems="center">
						<Grid item> Your coins: </Grid>
						<Grid item> {user.coins} </Grid>
					</Grid>
				</Grid>
				<Divider variant="vertical" />
				<Grid item xs={8} container justify="center">
					<Grid item xs={12} sm={5} container alignItems="center" justify="center" className={classes.control2} spacing={1}>
						{actionCards()}
					</Grid>
					<Grid item xs={12} sm={7} container alignItems="center" direction="column" justify="center">
						<Grid item>
							Your cards: 
						</Grid>
						<Grid item container justify="center">
							{user.cards.length
								?user.cards.map(card => {
									return <Grid item xs={3} sm={4} md={5}>
										<CardHolder className={classes.cardHolder} pickCard={pickCard} blink={blink} card={card} />
									</Grid>;
								})
								:props.hasStarted
									?<span style={{color: 'red', style: '2em'}}> You're dead! </span>
									:""
							}
						</Grid>
					</Grid>
				</Grid>
			</div>
		</Paper>
	);
}

export default ActionBoard;
