using FluentValidation;
using Interview_Question_Generator.Models;

namespace Interview_Question_Generator.Validators
{
    public class QuestionCategoryValidator: AbstractValidator<QuestionCategoryDto>
    {
        public QuestionCategoryValidator() {

            RuleFor(x => x.CategoryName)
                .Cascade(CascadeMode.Stop)
                .NotEmpty().WithMessage("Category name is required")
                .MaximumLength(50).WithMessage("Category name must not exceed 50 characters")
                .Matches("^[a-zA-Z0-9 ]+$")
                .WithMessage("Category name can contain only letters, numbers and spaces");

        }
    }
}
