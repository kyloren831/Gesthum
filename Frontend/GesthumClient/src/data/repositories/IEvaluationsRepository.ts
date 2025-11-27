import type { Evaluation } from "../../core/entities/Evaluation";

export interface IEvaluationsRepository {
  createEvaluationForApplication(applicationId: number): Promise<Evaluation | undefined>;
  getEvaluationByApplicationId(applicationId: number): Promise<Evaluation | undefined>;
}