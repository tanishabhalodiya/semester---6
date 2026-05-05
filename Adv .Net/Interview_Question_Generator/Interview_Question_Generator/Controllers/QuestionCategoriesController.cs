using Interview_Question_Generator.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Interview_Question_Generator.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionCategoriesController : ControllerBase
    {
        private readonly InterviewContext _db;
        public QuestionCategoriesController(InterviewContext db)
        {
            _db = db;
        }

        // GET: api/questioncategories
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var categories = await _db.QuestionCategories.ToListAsync();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error getting question categories", error = ex.Message });
            }
        }

        // Post: api/questioncategories
        [HttpPost]
        public async Task<IActionResult> Create(QuestionCategoryDto categoryDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                var category = new QuestionCategory
                {
                    CategoryName = categoryDto.CategoryName
                };
                _db.QuestionCategories.Add(category);
                await _db.SaveChangesAsync();
                return CreatedAtAction(nameof(GetAll), new { id = category.CategoryId }, category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating question category", error = ex.Message });
            }
        }

        // DELETE: api/questioncategories/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var category = await _db.QuestionCategories.FindAsync(id);
                if (category == null)
                    return NotFound(new { message = "Question category not found" });
                _db.QuestionCategories.Remove(category);
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error deleting question category", error = ex.Message });
            }
        }

        //PUT : api/questioncategories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, QuestionCategoryDto categoryDto)
        {
            try
            {
                var category = await _db.QuestionCategories.FindAsync(id);
                if (category == null)
                    return NotFound(new { message = "Question category not found" });
                category.CategoryName = categoryDto.CategoryName;
                _db.QuestionCategories.Update(category);
                await _db.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error updating question category", error = ex.Message });
            }
        }

    }
}
