using FluentValidation;
using Interview_Question_Generator.Models;

namespace Interview_Question_Generator.Validators
{
    public class TestSessionValidator: AbstractValidator<TestSessionDto>
    {
        public TestSessionValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage("UserId must be valid");
            RuleFor(x => x.SkillId)
                .GreaterThan(0).WithMessage("SkillId must be valid");
        }
    }
}
