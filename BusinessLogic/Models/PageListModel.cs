using Model;
using System.Collections.Generic;

namespace BusinessLogic.Models
{
    public class PageListModel
    {
        public int TotalItems { get; set; }

        public IEnumerable<Contact> Contacts { get; set; }
    }
}
