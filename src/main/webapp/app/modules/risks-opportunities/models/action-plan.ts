export type ActionPlanSummary = {
  actionDescription: string;
  actionDate: Date;
  responsibleId: number;
  verifyAction: boolean;
  actionVerificationDate: Date;
  actionVerifierId: number;
};

export type ActionPlanImplementation = {
  implementationDate: Date;
  implementationResponsibleId: number;
  implemented: boolean;
  implementationDescription: string;
};

export type ActionPlanEfficacy = {
  efficacyVerificationDate: Date;
  efficacyResponsibleId: number;
  efficacyVerified: boolean;
  efficacyDescription: string;
};
