using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Interview_Question_Generator.Models;

public partial class InterviewContext : DbContext
{
    public InterviewContext()
    {
    }

    public InterviewContext(DbContextOptions<InterviewContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AirequestLog> AirequestLogs { get; set; }

    public virtual DbSet<Feedback> Feedbacks { get; set; }

    public virtual DbSet<GeneratedQuestion> GeneratedQuestions { get; set; }

    public virtual DbSet<QuestionCategory> QuestionCategories { get; set; }

    public virtual DbSet<QuestionRequest> QuestionRequests { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Skill> Skills { get; set; }

    public virtual DbSet<TestSession> TestSessions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserSavedQuestion> UserSavedQuestions { get; set; }

    public virtual DbSet<UploadedMcqFile> UploadedMcqFiles { get; set; }


    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=LAPTOP-JG247EI5\\SQLEXPRESS02;Database=Interview;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AirequestLog>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__AIReques__5E5486481B8466AD");

            entity.Property(e => e.RequestTime).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.User).WithMany(p => p.AirequestLogs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__AIRequest__UserI__01142BA1");
        });

        modelBuilder.Entity<Feedback>(entity =>
        {
            entity.HasKey(e => e.FeedbackId).HasName("PK__Feedback__6A4BEDD66B75B9EF");

            entity.HasOne(d => d.Question).WithMany(p => p.Feedbacks)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Feedback__Questi__787EE5A0");

            entity.HasOne(d => d.User).WithMany(p => p.Feedbacks)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Feedback__UserId__778AC167");
        });

        modelBuilder.Entity<GeneratedQuestion>(entity =>
        {
            entity.HasKey(e => e.QuestionId).HasName("PK__Generate__0DC06FACAD492331");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Category).WithMany(p => p.GeneratedQuestions).HasConstraintName("FK__Generated__Categ__6FE99F9F");

            entity.HasOne(d => d.Request).WithMany(p => p.GeneratedQuestions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Generated__Reque__6EF57B66");
        });

        modelBuilder.Entity<QuestionCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Question__19093A0BCB86AF20");
        });

        modelBuilder.Entity<QuestionRequest>(entity =>
        {
            entity.HasKey(e => e.RequestId).HasName("PK__Question__33A8517AF4449BE9");

            entity.Property(e => e.RequestedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Skill).WithMany(p => p.QuestionRequests)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuestionR__Skill__6B24EA82");

            entity.HasOne(d => d.User).WithMany(p => p.QuestionRequests)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__QuestionR__UserI__6A30C649");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE1A22A60E9E");
        });

        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasKey(e => e.SkillId).HasName("PK__Skills__DFA09187FC76A23E");
        });

        modelBuilder.Entity<TestSession>(entity =>
        {
            entity.HasKey(e => e.SessionId).HasName("PK__TestSess__C9F49290322990AE");

            entity.Property(e => e.StartedAt).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.Skill).WithMany(p => p.TestSessions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TestSessi__Skill__7D439ABD");

            entity.HasOne(d => d.User).WithMany(p => p.TestSessions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__TestSessi__UserI__7C4F7684");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CC4C292A1E45");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Users__RoleId__60A75C0F");
        });

        modelBuilder.Entity<UserSavedQuestion>(entity =>
        {
            entity.HasKey(e => e.SaveId).HasName("PK__UserSave__1450D3A66C314662");

            entity.HasOne(d => d.Question).WithMany(p => p.UserSavedQuestions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserSaved__Quest__73BA3083");

            entity.HasOne(d => d.User).WithMany(p => p.UserSavedQuestions)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__UserSaved__UserI__72C60C4A");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);

}
