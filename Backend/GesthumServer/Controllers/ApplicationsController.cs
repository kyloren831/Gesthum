using GesthumServer.DTOs.Applications;
using GesthumServer.Services;
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
        public async Task<IActionResult> CreateApplication([FromBody] PostApplicationDTO postApplicationDTO)
        {
            var createdApplication = await applicationsServices.CreateApplication(postApplicationDTO);
            return CreatedAtAction(nameof(CreateApplication), new { id = createdApplication.Id }, createdApplication);
        }
    }
}
