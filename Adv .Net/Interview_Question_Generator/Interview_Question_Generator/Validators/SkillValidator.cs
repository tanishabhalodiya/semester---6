using FluentValidation;
using Interview_Question_Generator.Models;

namespace Interview_Question_Generator.Validators
{
    public class SkillValidator : AbstractValidator<SkillDto>
    {
        public SkillValidator()
        {
            RuleFor(x => x.SkillName)
                .NotEmpty().WithMessage("SkillName is required")
                .MaximumLength(50).WithMessage("SkillName must not exceed 50 characters");
        }
    }
}
