import InstitutionalItem from './institutional-item';

type InstitutionalPolicyProps = {
  onChanged: (newValue: string) => void;
  value: string;
};

const InstitutionalPolicy = ({ onChanged, value }: InstitutionalPolicyProps) => {
  return <InstitutionalItem label="Política de Qualidade" onChanged={onChanged} placeholder="Política de Qualidade" value={value} />;
};

export default InstitutionalPolicy;
