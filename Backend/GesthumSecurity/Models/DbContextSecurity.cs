using Microsoft.EntityFrameworkCore;

namespace GesthumSecurity.Models
{
    public class DbContextSecurity : DbContext
    {
        public DbContextSecurity(DbContextOptions<DbContextSecurity> options) : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
    }
}
