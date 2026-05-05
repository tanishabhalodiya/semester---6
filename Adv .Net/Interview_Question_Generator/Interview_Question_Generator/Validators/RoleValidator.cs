using FluentValidation;
using Interview_Question_Generator.Models;

namespace Interview_Question_Generator.Validators
{
    public class RoleValidator : AbstractValidator<RoleDto>
    {
        public RoleValidator() {

            RuleFor(x => x.RoleName)
                .NotEmpty().WithMessage("Role name is required")
                .MaximumLength(20).WithMessage("Role name must not exceed 20 characters")
                .Matches("^[a-zA-Z ]+$").WithMessage("Role name can contain only letters");

        }
    }
}
