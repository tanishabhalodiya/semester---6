using Interview_Question_Generator.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Interview_Question_Generator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsController : ControllerBase
    {
        private readonly InterviewContext _db;
        public SkillsController(InterviewContext db)
        {
            _db = db;
        }

        // GET: api/skills
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var skills = await _db.Skills.ToListAsync();
                return Ok(skills);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting skills", error = ex.Message });
            }
        }

        // GET: api/skills/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var skill = await _db.Skills.FindAsync(id);
                if (skill == null)
                    return NotFound(new { message = "Skill not found" });
                return Ok(skill);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting skill", error = ex.Message });
            }
        }

        // POST: api/skills
        [HttpPost]
        public async Task<IActionResult> Create(SkillDto skillDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var skill = new Skill
                {
                    SkillName = skillDto.SkillName
                };
                _db.Skills.Add(skill);
                await _db.SaveChangesAsync();
                return CreatedAtAction(nameof(GetById), new { id = skill.SkillId }, skill);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating skill", error = ex.Message });
            }
        }


        //Update skills
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, SkillDto skillDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var skill = await _db.Skills.FindAsync(id);

                if (skill == null)
                    return NotFound(new { message = "Skill not found" });
                skill.SkillName = skillDto.SkillName;
                _db.Skills.Update(skill);
                await _db.SaveChangesAsync();
                return Ok(new { message = "Skill updated successfully", skill });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating skill", error = ex.Message });
            }
        }

        //delete Skills
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var skill = await _db.Skills.FindAsync(id);
                if (skill == null)
                    return NotFound(new { message = "Skill not found" });
                _db.Skills.Remove(skill);
                await _db.SaveChangesAsync();
                return Ok(new { message = "Skill deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting skill", error = ex.Message });
            }
        }
    }
}
