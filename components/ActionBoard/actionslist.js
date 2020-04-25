import React from 'react';
import UtilIcon from '../GameUtils/utilicon';

import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyle = makeStyles({
	actionName: {
		fontSize: '1.5em',
	},
	name: {
		fontSize: '1em',
	},
	duke: {
		color: '#433129',
	},
	assassin: {
		color: '#f50057',
	},
	captain: {
		color: '#ee5619',
	},
	ambassador: {
		color: '#3f51b5',
	},
	inquisitor: {
		color: '#5e5407',
	},
	contessa: {
		color: '#125811',
	},
	kodita: {
		color: '#ffcb04',
	},
	challenge: {
		color: '#510a34',
	},
	foreignaid: {
		color: '#66333a',
	},
	income: {
		color: '#372b2d',
	},
	unknown: {
		color: '#85091d',
	},
	sender: {
		color: '#0f7789',
	},
	recepient: {
		color: '#5e0414',
	},
})

const ActionsList = (props) => {
	const classes = useStyle();
	const actionToReadable = (action) => {
		const type = action.purpose ==="ATTACK";
		const name = (style) => <span className={[classes.actionName, style].join(" ")}> {action.name} </span>;
		const recepient = <span className={[classes.recepient, classes.name].join(' ')}> {action.recepient} </span>;
		const icon = <UtilIcon name={action.name} size="small"/>;
		switch (action.name) {
			case "DUKE":
				return type ?<span>{icon} {name(classes.duke)}, and will take 3 coins from the bank!</span>
							:<span>{icon} {name(classes.duke)}, and will block the FOREIGN AID!</span>
			case "ASSASSIN":
				return <span>{icon} {name(classes.assassin)}, and will assassinate {recepient}!</span>
			case "CAPTAIN":
				return type ?<span>{icon} {name(classes.captain)}, and will steal 2 coins from {recepient}!</span>
							:<span>{icon} {name(classes.captain)}, and will block the steal!</span>;
			case "AMBASSADOR":
				return type ?<span>{icon} {name(classes.ambassador)}, and will exchange a card from deck!</span>
							:<span>{icon} {name(classes.ambassador)}, and will block the steal!</span>;
			case "INQUISITOR":
				const payload = (action.variant === "SHOW") 
						?"to show one card!" 
						:action.variant === "PEEK"
							?"will draw a card from deck, and decide if he'll take it."
							:"to exchange a card from deck!";
				return type ?<span>{icon} {name(classes.inquisitor)} and will force {recepient} {payload}</span>
							:<span>{icon} {name(classes.inquisitor)}, and will block the steal!</span>;
			case "CARD_REVEAL":
				return <span><span>shown his card:</span><p><UtilIcon name={action.payload.action} width={'5em'} height={'5em'} /></p></span>;
			case "CARD_PEEK":
				return <span><span>drawn a card:</span><p><UtilIcon name={action.payload.action} width={'5em'} height={'5em'} /></p></span>;
			case "CONTESSA":
				return <span>{icon} {name(classes.contessa)}, and will block the assassination attempt!</span>;
			case "KODITA":
				return <span>paid 7 coins and will {icon} {name(classes.kodita)} {recepient}!!</span>;
			case "CHALLENGE":
				return <span>called a {icon} {name(classes.challenge)} on {recepient}!</span>;
			case "FOREIGN AID":
				return <span>asked for {icon} {name(classes.foreignaid)}, and will take 2 coins from bank!</span>;
			case "INCOME":
				return <span className={classes.income}>decided to play safe, and takes {icon} 1 coin from bank!</span>;
			case "SHOW CARD":
				return <span>the card all along! {recepient}, sacrifice a card or I'll kill it for you.</span>;
			case "PASS":
				const previousAction = props.actionQueue[props.actionQueue.length-2];
				return previousAction.name === "INQUISITOR" && previousAction.variant === "PEEK"  
					?<span>passed! He's not going to take the card!</span>
					:<span>passed! He's not up to the challenge! </span>;
			case "PICK_CARD":
				return (action.variant === "IS_KILL")
						?<span><span>decided to kill</span><p><UtilIcon name={action.payload.action} width={'5em'} height={'5em'} /></p></span>
						:(action.variant === "PEEK_CARD")
							?<span>drawn and picked a card from deck!</span>
							:(action.variant==="CARD_REVEAL")
								?<span>has been forced to show his card!</span>
								:(props.actionQueue[props.actionQueue.length-2].name === "AMBASSADOR")
									?<span>drawn a card from deck!</span>
									:<span>has been forced to draw a new card!</span>
			default: {
				return <p className={classes.unknown}>dispatched an unknown action! </p>;
			}
		}
	}
	
	const actions = props.actionQueue.map((action) => {
		const sender = <span className={[classes.sender, classes.name].join(' ')}> {action.sender} </span>;
		return <div style={{width: '100%', textAlign: 'center'}} key={action.id}>
			<h3 style={{color: '#656a72', margin: 10}}> {sender} has {actionToReadable(action)} </h3>
		</div>
	})
	
	return (
		<React.Fragment>
			{actions}
		</React.Fragment>
	);
}

export default ActionsList;