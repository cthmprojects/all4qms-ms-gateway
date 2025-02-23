import InstitutionalItem from './institutional-item';

type InstitutionalMissionProps = {
  onChanged: (newValue: string) => void;
  value: string;
};

const InstitutionalMission = ({ onChanged, value }: InstitutionalMissionProps) => {
  return <InstitutionalItem label="Missão" onChanged={onChanged} placeholder="Missão" value={value} />;
};

export default InstitutionalMission;
