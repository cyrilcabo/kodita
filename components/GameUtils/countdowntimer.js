import React from 'react';

const CountdownTimer = (props) => {
	const [counter, setCounter] = React.useState(props.counter);
	
	React.useEffect(() => {
		counter > 0 && setTimeout(() => setCounter(counter-1), 1000);
	}, [counter]);
	
	return (
		<React.Fragment> {counter} </React.Fragment>
	);
}

export default CountdownTimer;