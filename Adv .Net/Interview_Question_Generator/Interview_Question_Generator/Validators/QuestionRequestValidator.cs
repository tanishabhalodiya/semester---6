using FluentValidation;
using Interview_Question_Generator.Models;

namespace Interview_Question_Generator.Validators
{
    public class QuestionRequestValidator : AbstractValidator<QuestionRequestDto>
    {
        public QuestionRequestValidator()
        {

            RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage("UserId must be valid");

            RuleFor(x => x.SkillId)
                .GreaterThan(0).WithMessage("SkillId must be valid");

            RuleFor(x => x.Difficulty)
                .MaximumLength(20).WithMessage("Difficulty must not exceed 20 characters")
                .When(x => !string.IsNullOrEmpty(x.Difficulty))
                .WithMessage("Difficulty must be Easy, Medium, or Hard");

            RuleFor(x => x.Experience)
                .MaximumLength(30).WithMessage("Experience must not exceed 30 characters")
                .When(x => !string.IsNullOrEmpty(x.Experience));

        }
    }
}
