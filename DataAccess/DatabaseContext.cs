using Model;
using System.Data.Entity;

namespace DataAccess
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext()
           : base("DefaultConnection")
        {
        }

        public DbSet<Contact> Contacts { get; set; }
    }
}
