using FluentValidation;
using Interview_Question_Generator.Models;

namespace Interview_Question_Generator.Validators
{
    public class GeneratedQuestionValidator : AbstractValidator<GeneratedQuestionDto>
    {
        public GeneratedQuestionValidator() { 
            
            RuleFor(x => x.RequestId)
                .GreaterThan(0).WithMessage("Request ID must be a positive integer");
            RuleFor(x => x.RequestId)
             .GreaterThan(0).WithMessage("Request ID must be a positive integer");

            RuleFor(x => x.QuestionText)
                .NotEmpty().WithMessage("Question text is required")
                .MaximumLength(2000).WithMessage("Question text must not exceed 2000 characters");


        }
    }
}
