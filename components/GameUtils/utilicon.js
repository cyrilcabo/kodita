import {
	AmbassadorIcon,
	CaptainIcon,
	ChallengeIcon,
	DukeIcon,
	BlockIcon,
	InquisitorIcon,
	AssassinIcon,
	IncomeIcon,
	KoditaIcon,
	ForeignAidIcon,
	DeadIcon,
	WinnerIcon,
	UnknownIcon
} from '../actionicons';

const UtilIcon = (props) => {
	const {name, size, isRound} = props;
	
	let width, height;
	
	switch (size) {
		case "small":
			width = "1.5rem"; height = "1.5rem";
			break;
		case "medium":
			width = "2.5rem"; height = "2.5rem";
			break;
		case "large":
			width = "3.5rem"; height = "3.5rem";
			break;
		default:
			width = props.width; height = props.height;
			break;
	}
	
	switch (name) {
		case "AMBASSADOR":
			return <AmbassadorIcon width={width} height={height} isRound={isRound}/>;
		case "CAPTAIN":
			return <CaptainIcon width={width} height={height} isRound={isRound} />;
		case "INQUISITOR":
			return <InquisitorIcon width={width} height={height} isRound={isRound} />;
		case "CONTESSA":
			return <BlockIcon width={width} height={height} isRound={isRound} />
		case "ASSASSIN":
			return <AssassinIcon width={width} height={height} isRound={isRound} />;
		case "DUKE":
			return <DukeIcon width={width} height={height} isRound={isRound} />;
		case "INCOME":
			return <IncomeIcon width={width} height={height} isRound={isRound} />;
		case "KODITA":
			return <KoditaIcon width={width} height={height} isRound={isRound} />;
		case "CHALLENGE":
			return <ChallengeIcon width={width} height={height} isRound={isRound} />;
		case "FOREIGN AID":
			return <ForeignAidIcon width={width} height={height} isRound={isRound} />;
		case "DEAD":
			return <DeadIcon width={width} height={height} isRound={isRound} />;
		case "WINNER":
			return <WinnerIcon width={width} height={height} isRound={isRound} />;
		case "UNKNOWN":
			return <UnknownIcon width={width} height={height} isRound={isRound} />;
		default: return null;
	}
}

export default UtilIcon;