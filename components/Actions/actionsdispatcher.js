import ActionControls from './actioncontrols';
import {attackActionsSrc, defenseActionsSrc} from './actions';

const ActionDispatcher = (props) => {
	
	const {user, actionQueue, players, dispatchAction, hasStarted} = props;
	
	const attackActions = attackActionsSrc.map((action) => {
		action.state = true;
		
		if (action.name === "ASSASSIN" && user.coins < 3) action.state = false;
		if (action.name === "KODITA" && user.coins < 7) action.state = false;
		
		if ((actionQueue.turn === user.id && actionQueue.queue.length >= 1) || actionQueue.turn !== user.id || !hasStarted) action.state = false;
		
		return action;
	});
	
	const defenseActions = defenseActionsSrc.map((action) => {
		if ((actionQueue.recepientId !== user.id && actionQueue.type !== "IS_OPEN") || (actionQueue.turn === user.id && actionQueue.queue.length < 1) || !hasStarted) {
			action.state = false;
		} else {
			if (actionQueue.type === "IS_OPEN") {
				if (actionQueue.name==="FOREIGN AID" && action.name==="DUKE") {
					action.state = true;
				}
			} else if (actionQueue.type === "HAS_RECEPIENT" && actionQueue.recepientId === user.id) {
				switch (actionQueue.name) {
					 case "ASSASSIN":
						if (action.name==="CONTESSA") action.state = true;
						break;
					case "CAPTAIN":
						if (actionQueue.purpose === "ATTACK") {
							if (action.name === "CAPTAIN" || action.name === "AMBASSADOR" || action.name === "INQUISITOR") action.state = true;
						}
						break;
					default: break;
				}
			}
		}
		return action;
	});
	return <ActionControls 
				attackActions={attackActions} 
				defenseActions={defenseActions} 
				dispatchAction={dispatchAction} 
				players={players} 
				actionQueue={actionQueue} 
				user={user}
				hasStarted={hasStarted}
			/>
		
}

export default ActionDispatcher;