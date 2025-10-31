using GesthumServer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GesthumServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IAdminServices adminServices;
        private readonly IEmployeesServices employeesServices;

        public UsersController(IAdminServices adminServices, IEmployeesServices employeesServices)
        {
            this.adminServices = adminServices;
            this.employeesServices = employeesServices;
        }

        [HttpGet("{id}/admin")]
        [Authorize]
        public async Task<IActionResult> Get(int id)
        {
             var admin = await adminServices.GetAdminById(id);
             return Ok(admin);
        }
        [HttpGet("{id}/employee")]
        [Authorize]
        public async Task<IActionResult> GetEmployee(int id)
        {
            var employee = await employeesServices.GetEmployeeById(id);
            return Ok(employee);
        }
        [HttpPatch("{id}/admin")]
        [Authorize]
        public async Task<IActionResult> UpdatePhoto(int id, [FromBody] string photoUrl)
        {
            await adminServices.UpdateAdminPhoto(id, photoUrl);
            return Ok(new { Message = "Admin photo updated successfully" });
        }
        [HttpPatch("{id}/employee")]
        [Authorize]
        public async Task<IActionResult> UpdateEmployeePhoto(int id, [FromBody] string photoUrl)
        {
           await employeesServices.UpdateEmployeePhoto(id, photoUrl);
           return Ok(new { Message = "Employee photo updated successfully" });
        }
    }
}
