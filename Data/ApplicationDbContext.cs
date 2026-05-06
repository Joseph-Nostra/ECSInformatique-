using Microsoft.EntityFrameworkCore;
using SiteRCSInformatique.Models;

namespace SiteRCSInformatique.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<ContactMessage> ContactMessages { get; set; } = default!;
        public DbSet<Candidacy> Candidacies { get; set; } = default!;
        public DbSet<Newsletter> Newsletters { get; set; } = default!;
    }
}
