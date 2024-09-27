import InstitutionalItem from './institutional-item';

type InstitutionalVisionProps = {
  onChanged: (newValue: string) => void;
  value: string;
};

const InstitutionalVision = ({ onChanged, value }: InstitutionalVisionProps) => {
  return <InstitutionalItem label="Visão" onChanged={onChanged} placeholder="Visão" value={value} />;
};

export default InstitutionalVision;
