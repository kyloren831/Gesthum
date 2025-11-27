import { EvaluationsRepository } from "../../data/repositories/EvaluationsRepository";
import type { Evaluation } from "../entities/Evaluation";

export const createEvaluation = async (applicationId: number): Promise<Evaluation | undefined> => {
  const repo = new EvaluationsRepository();
  return await repo.createEvaluationForApplication(applicationId);
};

export const getEvaluationByApplicationId = async (applicationId: number): Promise<Evaluation | undefined> => {
  const repo = new EvaluationsRepository();
  return await repo.getEvaluationByApplicationId(applicationId);
};