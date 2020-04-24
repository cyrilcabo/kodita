import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import React from 'react';

import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyle = makeStyles({
	root: {
		height: '100%',
		'& > div.MuiGrid-root > form.MuiPaper-root': {
			height: '100%',
		},
		paddingLeft: 5,
		display: 'flex',
	}
});

const Search = (props) => {
	const classes = useStyle();
	const [search, setSearch] = React.useState("");
	
	const handleSearch = (e) => {
		if (e.target.value.length > 15) return false;
		setSearch(e.target.value);
	}
	
	const searchRooms = () => {
		props.searchRoom(search);
	}
	
	const resetSearch = () => {
		setSearch("");
		props.refreshList();
	}
	
	return (
		<Grid xs={12} item  container>
			<Grid item xs={12} md={10}>
				<Paper  onSubmit={(e) => {e.preventDefault(); searchRooms();}} className={classes.root} id="container" component="form">
					<InputBase onChange={handleSearch} value={search} style={{height: '100%', flex: 1}} fullWidth placeholder="Search games" />
						{search.length
							?<IconButton onClick={resetSearch}>
								<CloseIcon />
							</IconButton>
							:""
						}
				</Paper>
			</Grid>
			<Grid item xs={12} md={2}>
				<Button color="default" variant="contained" fullWidth style={{height: '100%', padding: 2}} onClick={searchRooms} >
					SEARCH
				</Button>
			</Grid>
		</Grid>
	);
}

export default Search;