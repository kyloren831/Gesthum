using GesthumServer.Services;
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
    }
}
