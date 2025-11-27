import type { Evaluation } from "../../core/entities/Evaluation";
import type { IEvaluationsRepository } from "./IEvaluationsRepository";
import { createEvaluationForApplication, getEvaluationByApplicationId } from "../datasources/evaluationsApi";

export class EvaluationsRepository implements IEvaluationsRepository {
  async createEvaluationForApplication(applicationId: number): Promise<Evaluation | undefined> {
    return await createEvaluationForApplication(applicationId);
  }

  async getEvaluationByApplicationId(applicationId: number): Promise<Evaluation | undefined> {
    return await getEvaluationByApplicationId(applicationId);
  }
}