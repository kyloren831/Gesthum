using GesthumServer.DTOs.Vacancies;
using GesthumServer.Models;
using GesthumServer.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GesthumServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VacanciesController : ControllerBase
    {
        private readonly IVacanciesServices service;

        public VacanciesController(IVacanciesServices service)
        {
            this.service = service;
        }
        [HttpGet]
        [Authorize]
        public IActionResult GetAllVacancies()
        {
            var vacancies = service.GetAllVacancies();
            return Ok(vacancies);

        }
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetVacancyById(int id)
        {
            var vacancy = await service.GetVacancyById(id);
            return Ok(vacancy);
        }
        [HttpPost]
        //[Authorize]
        public async Task<IActionResult> CreateVacancy([FromBody] PostVacancy vacant)
        {
            var createdVacancy = await service.CreateVacancy(vacant);
            return CreatedAtAction(nameof(GetVacancyById), new { id = createdVacancy.Id }, createdVacancy);
        }
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateVacancy(int id, [FromBody] PutVacancy updatedVacant)
        {
            if (id != updatedVacant.Id)
            {
                return BadRequest(new { Message = "ID in the URL does not match ID in the body." });
            }
            var updatedVacancy = await service.UpdateVacancy(id, updatedVacant);
            return Ok(updatedVacancy);
        }
        [HttpPatch("{id}/status")]
        [Authorize]
        public async Task<IActionResult> ChangeStatus(int id)
        {
           var result = await service.ChangeStatus(id);
           return Ok(new { Success = result });
        }
    }
}
