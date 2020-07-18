import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemText';

import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';

import UtilIcon from './GameUtils/utilicon';

import {attackActionsSrc, defenseActionsSrc} from './Actions/actions';

const useStyle = makeStyles({
	root: {
		height: '100%',
		width: '96%',
		overflowY: 'auto',
		paddingLeft: '2%',
		paddingRight: '2%',
	},
	summaryContainer: {
		'& > p': {
			textAlign: "justify"
		}
	},
	listItemContainer: {
		'& > div.MuiListItemText-root': {
			flex: "none",
			marginRight: 20,
		}
	},
	footer: {
		marginTop: 20,
		textAlign: 'center',
	}
})

const About = () => {
	const classes = useStyle();
	const attackActions = attackActionsSrc.map((action, i) => {
		return <React.Fragment key={i}>
			<ListItem className={classes.listItemContainer}>
				<ListItemIcon>
					<UtilIcon name={action.name} size="large" />
				</ListItemIcon>
				<ListItemText primary={action.name} secondary={action.details} />
			</ListItem>
		</React.Fragment>
	});
	const defenseActions = defenseActionsSrc.map((action, i) => {
		return <React.Fragment key={i}>
			<ListItem className={classes.listItemContainer}>
				<ListItemIcon>
					<UtilIcon name={action.name} size="large" />
				</ListItemIcon>
				<ListItemText primary={action.name} secondary={action.details} />
			</ListItem>
		</React.Fragment>
	})
	return (
		<Paper className={classes.root}>
			<div style={{textAlign: 'center'}}>
				<h3> About </h3>
			</div>
			<h4> Game summary: </h4>
			<Divider />
			<div className={classes.summaryContainer}>
				<p> 
					Kodita is a game of bluff. To master this game, you have to be a good liar. Well, besides the need to have
					heavy planning and good strategy... and being a good liar. 
				</p>
				<p>
					In Kodita, there are 6 main cards, each possessing actions that can be utilized to defeat your enemies. 
					Each card has 3 copies, making the deck have a total of 18 cards. A maximum of 6 players are allowed to 
					play the game. At the start of the game, each player is randomly given two cards, leaving 6 cards in the deck.
				</p>
				<p>
					To play the game, you can use any of the actions that the 6 cards have, regardless if you have the card or not.
					However, whenever another player notices that you are lying, he can challenge your action, and at which you have
					the option to back-out from the challenge. However, if a challenge is called upon you, and you actually have the
					card, you can show this card, leaving the player who challenged you lose one card. If a player loses both if its
					two cards, he is considered dead, and is out of the game. Successfully luring your enemy into challenging you, when 
					in fact, you had the card, is only one of the three ways you can make an enemy lose a card. The other two, involves 
					spending coins, therefore, you must also include in your strategy, on how you would effectively gain coins.
				</p>
				<p>
					In addition to the actions of the 6 cards, there are 3 more that you can do, to improve your game plan, and hopefully
					defeat your opponents. First is the INCOME: this is the safest move of all, it is the true definition of <i>"slowly but
					surely"</i>. With INCOME, you can take one coin from the bank, and no one can interrupt your move. Next is the FOREIGN AID: 
					with the FOREIGN AID, you can take two coins from the bank, but with the risk of being blocked by a DUKE card. Then finally, 
					the KODITA, this action instantly kills your opponent's card, at the cost of 7 coins.
				</p>
				<p>
					By effectively utilizing each actions, and successfuly fooling your enemies, you will be hailed as the KODITA MASTER (Which 
					easily translates to you being a fraud). Conquer your enemy, and be the last man standing!
				</p>
			</div>
			<Divider />
			<h4> List of Actions </h4>
			<div>
				<List>
					<ListSubheader>
						<h5> Attack Actions </h5>
					</ListSubheader>
					{attackActions}
				</List>
				<Divider />
				<List>
					<ListSubheader>
						<h5> Defense Actions </h5>
					</ListSubheader>
					{defenseActions}
				</List>
			</div>
			<Divider />
				<p> Icons used in this game were taken from <a href="https://game-icons.net">game-icons.net</a> </p>
			<Divider />
			<div className={classes.footer}>
				Developed by AlphaDevelopment. All rights reserved 2020.
			</div>
		</Paper>
	);
}

export default About;
