using GesthumServer.DTOs.Resumes;
using GesthumServer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GesthumServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumesController : ControllerBase
    {
        private readonly IResumesServices resumesServices;

        public ResumesController(IResumesServices resumesServices)
        {
            this.resumesServices = resumesServices;
        }
        // Create a new resume
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateResume([FromBody] PostResume resume)
        {
           var createdResume = await resumesServices.CreateResume(resume);
           return CreatedAtAction("GetResumeByEmployeeId", "Resumes", new { employeeId = createdResume.EmployeeId }, createdResume);
        }
        // Get resume by employee ID
        [HttpGet("{employeeId}")]
        [Authorize]
        public async Task<IActionResult> GetResumeByEmployeeId(int employeeId)
        {
           var resume = await resumesServices.GetResumeByEmployeeId(employeeId);
           return Ok(resume);
        }
        // Update resume by ID
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateResume(int id, [FromBody] PostResume updatedResume)
        {
           var resume = await resumesServices.UpdateResume(id, updatedResume);
           return Ok(resume);
        }
        // Delete resume by employee ID
        [HttpDelete("{employeeId}")]
        [Authorize]
        public async Task<IActionResult> DeleteResumeByEmployeeId(int employeeId)
        {
           await resumesServices.DeleteResumeByEmployeeId(employeeId);
           return NoContent();
        }

        // Nuevo: Delete resume por resume Id
        [HttpDelete("id/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteResumeById(int id)
        {
           await resumesServices.DeleteResumeById(id);
           return NoContent();
        }
    }
}
