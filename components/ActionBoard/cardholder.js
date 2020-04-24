import React from 'react';

import Button from '@material-ui/core/Button';
import UtilIcon from '../GameUtils/utilicon';

const CardHolder = (props) => {
	const [blink, toggleBlink] = React.useState("");
	const blinking = () => setInterval(() => {
		toggleBlink(blink ?"" :"0px 0px 10px red");
	}, 500);
	
	const [blinker, setBlinker] = React.useState(null);
	
	React.useEffect(() => {
		props.blink
			?setBlinker(setTimeout(() => {
				toggleBlink(blink ?"" :"0px 0px 10px red");
			}, 500))
			:toggleBlink("");
	}, [props.blink, blink]);
	
	return (
		<Button disabled={!props.blink} className={props.className} onClick={props.pickCard.bind(this, props.card)} style={{boxShadow: blink}}>
			<UtilIcon name={props.card.action} width="100%" height="100%" />
		</Button>
	);
}

export default CardHolder;