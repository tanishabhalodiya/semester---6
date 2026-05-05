using FluentValidation;
using Interview_Question_Generator.Models;

namespace Interview_Question_Generator.Validators
{
    public class FeedbackValidator : AbstractValidator<FeedbackDto>
    {
        public FeedbackValidator() { 
            
            RuleFor(x => x.QuestionId)
                .GreaterThan(0).WithMessage("Question ID must be a positive integer");

            RuleFor(x => x.UserId).
                GreaterThan(0).WithMessage("User ID must be a positive integer");

            RuleFor(x => x.Rating)
                .InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5");

            RuleFor(x => x.Comment)
                .MaximumLength(255).WithMessage("Comment must not exceed 255 characters");

        }
    }
}
