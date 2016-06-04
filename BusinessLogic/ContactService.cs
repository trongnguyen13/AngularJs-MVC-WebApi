using DataAccess;
using Model;
using System;
using System.Data.Entity;
using System.Linq.Dynamic;
using System.Linq;
using BusinessLogic.Models;
using System.Collections.Generic;

namespace BusinessLogic
{
    public class ContactService
    {
        private DatabaseContext db = new DatabaseContext();

        public IQueryable<Contact> GetAll()
        {
            return this.db.Contacts;
        }

        public PageListModel GetContacts(int page = 1, int itemsPerPage = 10, string sortBy = "Name", bool reverse = false, string search= null)
        {
            var contacts = this.db.Contacts.AsEnumerable();
            if (!string.IsNullOrEmpty(search))
            {
                search = search.ToLower();
                contacts = contacts.Where(x => x.Name.ToLower().Contains(search) || x.Email.ToLower().Contains(search)).ToList();
            }

            contacts = contacts.OrderBy(sortBy + (reverse ? " descending" : ""));
            var contactPaged = contacts.Skip((page - 1) * itemsPerPage).Take(itemsPerPage);

            return new PageListModel { TotalItems = contacts.Count(), Contacts = contactPaged };
        }

        public Contact Find(int id)
        {
            return this.db.Contacts.Find(id);
        }

        public void Save(Contact contact)
        {
            contact.CreatedDate = DateTime.Now;
            contact.ModifiedDate = DateTime.Now;

            this.db.Contacts.Add(contact);
            this.db.SaveChanges();
        }

        public void Update(Contact contact)
        {
            var c = this.Find(contact.Id);

            c.Address = contact.Address;
            c.Email = contact.Email;
            c.Name = contact.Name;
            c.Phone = contact.Phone;
            c.ModifiedDate = DateTime.Now;

            db.Entry(c).State = EntityState.Modified;
            db.SaveChanges();
        }

        public void Delete(int id)
        {
            Contact contact = this.Find(id);
            db.Contacts.Remove(contact);
            db.SaveChanges();
        }

        public void Delete(int[] ids)
        {
            foreach(var id in ids)
            {
                Contact contact = this.Find(id);
                db.Contacts.Remove(contact);
            }
            
            db.SaveChanges();
        }

        public bool IsEmailExisted(int id, string email)
        {
            if (id > 0)
            {
                return this.db.Contacts.Any(c => c.Email == email && c.Id != id);
            }

            return this.db.Contacts.Any(c => c.Email == email);
        }

        public void Dispose()
        {
            this.db.Dispose();
        }
    }
}
