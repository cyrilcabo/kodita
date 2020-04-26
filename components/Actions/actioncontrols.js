import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

import UtilIcon from '../GameUtils/utilicon';

import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyle = makeStyles(theme => ({
	actionList: {
		height: '55%',
		[theme.breakpoints.down('sm')]: {
			height: '65%',
		}
	}
}));

const ActionControls = (props) => {
	const [actionName, setActionName] = React.useState('INCOME');
	
	const actionsDisplay = (name, icon) => {
		 const actions = [...props.attackActions, ...props.defenseActions].filter((action) => action.name === name).map((action, aIndex) => {
			 const targetPlayers = (action.type === "HAS_RECEPIENT" && action.purpose==="ATTACK") 
					?props.players.filter(player => player.id !== props.user.id).map((player, pIndex) => {
						const details = <span> {action.details} {player.name}</span>;
						return <ListItem button disabled={!action.state || player.isDead} key={pIndex} onClick={(action.state && !player.isDead) ?props.dispatchAction.bind(this, action, player) :() => null}>
							<ListItemIcon> <UtilIcon name={action.name} size="medium" isRound /> </ListItemIcon>
							<ListItemText primary={details} />
						</ListItem>
					})
					:[];
			 const title = action.fee 
						?<span> {action.name} <span style={{color: 'red'}}> COST: {action.fee} </span></span>
						:action.name;
			 return <React.Fragment key={aIndex}>
				 <ListItem 
					button={!targetPlayers.length} 
					disabled={!action.state} 
					onClick={action.state
						?action.type==="HAS_RECEPIENT" && action.purpose !=="ATTACK" 
							?props.dispatchAction.bind(this, action, {id: props.actionQueue.senderId, name: props.actionQueue.sender})
							:props.dispatchAction.bind(this, action, null)
						:() => null
					}
							
				>	
					<ListItemIcon> <UtilIcon name={action.name} size="medium" isRound /> </ListItemIcon>
					<ListItemText primary={title} secondary={action.details} />
				</ListItem>
				<List style={{paddingLeft: '3em'}}>
					{targetPlayers}
				</List>
			</React.Fragment>
		 })
		 return actions;
	}
	const controls = ["AMBASSADOR", "CAPTAIN", "INQUISITOR", "KODITA", "DUKE", "INCOME", "FOREIGN AID", "ASSASSIN", "CONTESSA"].map(action => {
		return <Grid item>
			<IconButton onClick={setActionName.bind(this, action)}>
				<Grid container justify="center" alignItems="center" direction="column">
					<UtilIcon name={action} size="medium" isRound={true} />
				</Grid>
			</IconButton>
		</Grid>
	});
	return (
		<div style={{width: '100%', height: '100%'}}>
			<div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
				<h3> Actions </h3>
			</div>
			<Divider />
			<Grid container item xs={12} justify="center">
				{controls}
			</Grid>
			<Divider />
			<div style={{height: '55%', overflowY: 'auto'}}>
				<List style={{height: '100%'}}>
					{actionsDisplay(actionName)}
				</List>
			</div>
		</div> 
	);
}

export default ActionControls;
