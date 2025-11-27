using GesthumServer.DTOs.Applications;
using GesthumServer.Services;
using GesthumServer.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GesthumServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationsController : ControllerBase
    {
        private readonly IApplicationsServices applicationsServices;

        public ApplicationsController(IApplicationsServices applicationsServices)
        {
            this.applicationsServices = applicationsServices;
        }

        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateApplication([FromBody] PostApplicationDTO postApplicationDTO, CancellationToken cancellationToken = default)
        {
            var createdApplication = await applicationsServices.CreateApplication(postApplicationDTO);
            // Usar la acción que espera el id que realmente tenemos (vacantId)
            return CreatedAtAction(nameof(GetApplicationsByVacantId), new { vacantId = createdApplication.VacantId }, createdApplication);
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(typeof(List<GetApplicationDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAllApplications(CancellationToken cancellationToken = default)
        {
            var list = await applicationsServices.GetAllApplications();
            return Ok(list);
        }

        [HttpGet("{applicationId:int}")]
        [Authorize]
        [ProducesResponseType(typeof(Application), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetApplicationById([FromRoute] int applicationId, CancellationToken cancellationToken = default)
        {
            var application = await applicationsServices.GetApplicationById(applicationId);
            return Ok(application);
        }

        [HttpGet("employee/{employeeId:int}")]
        [Authorize]
        [ProducesResponseType(typeof(List<GetApplicationDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetApplicationsByEmployeeId([FromRoute] int employeeId, CancellationToken cancellationToken = default)
        {
            var apps = await applicationsServices.GetApplicationsByEmployeeId(employeeId);
            return Ok(apps);
        }

        [HttpGet("vacant/{vacantId:int}")]
        [Authorize]
        [ProducesResponseType(typeof(List<GetApplicationDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetApplicationsByVacantId([FromRoute] int vacantId, CancellationToken cancellationToken = default)
        {
            var apps = await applicationsServices.GetApplicationsByVacantId(vacantId);
            return Ok(apps);
        }

        [HttpDelete("{applicationId:int}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteApplication([FromRoute] int applicationId, CancellationToken cancellationToken = default)
        {
            await applicationsServices.DeleteApplication(applicationId);
            return NoContent();
        }
    }
}
