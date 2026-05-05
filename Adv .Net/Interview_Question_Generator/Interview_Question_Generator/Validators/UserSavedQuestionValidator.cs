using FluentValidation;
using Interview_Question_Generator.Models;

namespace Interview_Question_Generator.Validators
{
    public class UserSavedQuestionValidator: AbstractValidator<UserSavedQuestionDto>
    {
        public UserSavedQuestionValidator()
        {
            RuleFor(x => x.UserId)
                .GreaterThan(0).WithMessage("UserId must be valid");
            RuleFor(x => x.QuestionId)
                .GreaterThan(0).WithMessage("QuestionId must be valid");
        }
    }
}
