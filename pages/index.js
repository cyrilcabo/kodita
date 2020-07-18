import fetch from 'isomorphic-unfetch';

import Layout from '../components/layout';
import About from '../components/about';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import InfoIcon from '@material-ui/icons/Info';
import UtilIcon from '../components/GameUtils/utilicon';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Router from 'next/router';

const useStyle = makeStyles(theme => ({
	root: {
		height: '100%',
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	logincontainer: {
		height: '80%',
		padding: 20,
	},
	formcontrols: {
		height: '8vh',
	},
	mainIcon: {
		height: 200,
		[theme.breakpoints.down('sm')]: {
			height: 150,
		}
	}
}));

const Index = (props) => {
	const classes = useStyle();
	const [name, setName] = React.useState(props.username ?props.username :"");
	const [about, setAbout] = React.useState(false);
	
	const handleName = (e) => {
		if (e.target.value.length > 15) return false;
		setName(e.target.value);
	}
	
	const login = async () => {
		if (name.length >= 5) {
			if (!props.username) await fetch(`https://kodita.herokuapp.com/api/login?name=${name}`);
			Router.push('/game');
		} 
	}
	
	const handleAbout = () => setAbout(about ?false :true);
	
	return (
		<Layout disableNav>
			<div className={classes.root}>
				<Grid item xs={11} md={7} style={{height: '100%',}} alignItems="center" container>
					<Paper className={classes.logincontainer}>	
						<Grid container justify="center" alignItems="center" item xs={12}>
							<Grid item container xs={10} direction="column" alignItems="center">
								<UtilIcon name="KODITA" style={{borderRadius: '10%'}} className={classes.mainIcon} />
								<Typography component={'h2'} style={{fontSize: '4em'}} > Kodita </Typography>
							</Grid>
							<Divider />
							<Grid xs={10} md={8} item spacing={1} container >
								<Grid item xs={12}>
									<TextField 
										fullWidth 
										value={name} 
										variant="outlined" 
										color="secondary" 
										onChange={handleName} 
										label="Name" 
										className={classes.formcontrols}
										style={{paddingBottom: 4}}
									/>
								</Grid>
								<Grid item xs={12}>
									<Button fullWidth onClick={login} disabled={name.length < 5} variant="outlined" color="secondary" className={classes.formcontrols}>
										Play <PlayArrowIcon />
									</Button>
								</Grid>
								<Grid item xs={12}>
									<Button fullWidth variant="contained" color="primary" className={classes.formcontrols} onClick={handleAbout}>
										About <InfoIcon />
									</Button>
									<Modal
										open={about}
										onClose={handleAbout}
										style={{
											width: '80vw',
											height: '80vh',
											margin: 'auto',
										}}
									>
										<div style={{height: '100%', width: '100%'}}>	
											<About />
										</div>
									</Modal>
								</Grid>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
			</div>
		</Layout>
	);
}

Index.getInitialProps = async ({req}) => {
	const cookie = req ?{'Cookie': req.headers.cookie} :null;
	const result = await fetch('https://kodita.herokuapp.com/api/authenticateuser', {
		'credentials': 'include',
		'headers': {
			...cookie,
		}
	}).then(data => data.json());
	return {username: result.username};
}

export default Index;
