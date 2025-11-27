using GesthumServer.Models;
using GesthumServer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GesthumServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EvaluationsController : ControllerBase
    {
        private readonly IEvaluationServices evaluationServices;

        public EvaluationsController(IEvaluationServices evaluationServices)
        {
            this.evaluationServices = evaluationServices;
        }

        [HttpPost("{applicationId}")]
        public async Task<IActionResult> CreateEvaluation(int applicationId)
        {
            var evaluation = await evaluationServices.CreateEvaluationForApplicationAsync(applicationId);
            return Ok(evaluation);
        }

        [HttpGet("application/{applicationId:int}")]
        [Authorize]
        [ProducesResponseType(typeof(Evaluation), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetEvaluationByApplicationId([FromRoute] int applicationId)
        {
            var evaluation = await evaluationServices.GetEvaluationByApplicationId(applicationId);
            return Ok(evaluation);
        }
    }
}
