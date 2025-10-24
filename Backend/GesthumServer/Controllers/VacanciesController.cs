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
            try
            {
                var vacancies = service.GetAllVacancies();
                return Ok(vacancies);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetVacancyById(int id)
        {
            try
            {
                var vacancy = await service.GetVacancyById(id);
                return Ok(vacancy);
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(new { Message = knfEx.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }

        }
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateVacancy([FromBody] PostVacancy vacant)
        {
            try
            {
                var createdVacancy = await service.CreateVacancy(vacant);
                return CreatedAtAction(nameof(GetVacancyById), new { id = createdVacancy.Id }, createdVacancy);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateVacancy(int id, [FromBody] PutVacancy updatedVacant)
        {
            if(id != updatedVacant.Id)
            {
                return BadRequest(new { Message = "ID in the URL does not match ID in the body." });
            }
            try
            {
                var updatedVacancy = await service.UpdateVacancy(id, updatedVacant);
                return Ok(updatedVacancy);
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(new { Message = knfEx.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }
        [HttpPatch("{id}/status")]
        [Authorize]
        public async Task<IActionResult> ChangeStatus(int id)
        {
            try
            {
                var result = await service.ChangeStatus(id);
                return Ok(new { Success = result });
            }
            catch (KeyNotFoundException knfEx)
            {
                return NotFound(new { Message = knfEx.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = ex.Message });
            }
        }
    }
}
