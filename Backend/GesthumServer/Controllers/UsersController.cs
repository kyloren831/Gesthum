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
            try
            {
                var admin = await adminServices.GetAdminById(id);
                return Ok(admin);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }
        [HttpGet("{id}/employee")]
        [Authorize]
        public async Task<IActionResult> GetEmployee(int id)
        {
            try
            {
                var employee = await employeesServices.GetEmployeeById(id);
                return Ok(employee);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }
    }
}
