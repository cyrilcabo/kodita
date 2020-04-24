import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import GroupIcon from '@material-ui/icons/Group';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';

import UtilIcon from '../GameUtils/utilicon';

import makeStyles from '@material-ui/core/styles/makeStyles';

import React from 'react';

const useStyle = makeStyles({
	fullWidth: {
		width: "100%",
		
	},
	playerDead: {
		backgroundColor:  "gray",
		"&> div.MuiListItemText-root>p.MuiListItemText-secondary": {
			color: "#a01818",
		}
	},
	playerStyle: {
		"& div.MuiListItemText-root>p.MuiListItemText-secondary": {
			color: "#d8c400",
		},
	},
	playerDeadText: {
		color: "#a01818",
	},
	playerActive: {
		backgroundColor: "#0f8033",
	}
})

const PlayersList = (props) => {
	const classes = useStyle();
	
	const players = props.players.map((player) => {
		const playerStyle = player.isDead ?classes.playerDead :classes.playerStyle;
		const playerActive = player.isTurn ?classes.playerActive :"";
		const playerText = (props.hasStarted)
			?player.isDead ?"DEAD" :`Coins: ${player.coins}`
			: "";
		return (
			<React.Fragment key={player.id}>
				<ListItem className={[playerStyle, playerActive].join(" ")}>
					<ListItemIcon>
						<Avatar> {player.name[0]} </Avatar>
					</ListItemIcon>
					<ListItemText
						primary={player.name}
						secondary={playerText}
					/>
					{
						props.hasStarted
							? !player.isDead
								?[...[{action: 'UNKNOWN'}, {action: 'UNKNOWN'}].splice(player.deadCards.length), ...player.deadCards].map(card => {
									return <UtilIcon name={card.action} size="medium" />
								})
								:<UtilIcon name={"DEAD"} size="medium" />
							:""
					}
				</ListItem>
				<Divider component={"li"} />
			</React.Fragment>
		);
	});
	return (
		<div className={classes.fullWidth}>
			<div className={classes.fullWidth} style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
				<IconButton disabled>
					<GroupIcon style={{color: "#3f51b5"}} />
				</IconButton>
				<h3> Players </h3>
				<IconButton disabled>
					<PlayArrowIcon style={{color: "#d8c400"}}/>
				</IconButton>
			</div>
			<Divider />
			<List className={classes.fullWidth}>
				{players}
			</List>
		</div>
	);
}

export default PlayersList;