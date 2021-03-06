import Head from 'next/head';

import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import UtilIcon from './GameUtils/utilicon';

import React from 'react';

//Styles
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyle = makeStyles(theme => ({
	root: {
		height: '100vh',
		[theme.breakpoints.down('sm')]: {
			height: 668,
		},
		[theme.breakpoints.down('xs')]: {
			height: 568,
		}
	},
}));

const Layout = (props) => {
	const classes = useStyle();
	const navbar = <AppBar position="sticky" style={{marginBottom: 10, height: '10%', backgroundColor: '#4c5062'}}>
		<Container>
			<Toolbar stlye={{display: 'flex'}}>
				<IconButton edge="start">
					<UtilIcon name="KODITA" size="small" />
				</IconButton>
				<Typography component={'h6'} style={{flex: 1}}>
					Kodita
				</Typography>
				{props.isGame
					?<IconButton edge="end" onClick={props.logout}>
						<ExitToAppIcon />
					</IconButton>
					:""
				}
			</Toolbar>
		</Container>
	</AppBar>
	
	return (
		<React.Fragment>
			<Head>
				<title> Kodita </title>
			</Head>
			{props.disableNav
				?""
				:navbar
			}
			<div className={classes.root}>
				{props.children}
			</div>
			<style global jsx>{`
				body {
					background-color: #a54a44;
					height: 100%;
					margin: 0;
					
				}
			`}</style>
		</React.Fragment>
	);
}

export default Layout;
