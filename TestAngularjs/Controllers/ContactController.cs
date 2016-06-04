using BusinessLogic;
using BusinessLogic.Models;
using Model;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Web.Http;

namespace TestAngularjs.Controllers
{
    public class ContactController : ApiController
    {
        private ContactService contactService = new ContactService();

        // GET: api/Contact
        [HttpGet]
        public PageListModel Get(int page, int itemsPerPage, string sortBy, bool reverse, string search)
        {
            return contactService.GetContacts(page, itemsPerPage, sortBy, reverse, search);
        }

        // GET: api/Contact/5
        public Contact Get(int id)
        {
            return contactService.Find(id);
        }

        [HttpGet]
        [Route("api/Contact/EmailAvailable")]
        public IHttpActionResult EmailAvailable(int id, string email)
        {
            var isExisted = contactService.IsEmailExisted(id, email);
            return Ok(!isExisted);
        }

        // POST: api/Contact
        public IHttpActionResult Post(Contact contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            contactService.Save(contact);
            return Ok();
        }

        // PUT: api/Contact/5
        public IHttpActionResult Put(int id, Contact contact)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != contact.Id)
            {
                return BadRequest();
            }

            contactService.Update(contact);

            return Ok();
        }

        // DELETE: api/Contact/5
        public IHttpActionResult Delete(int id)
        {
            contactService.Delete(id);

            return Ok();
        }

        [HttpDelete]
        public IHttpActionResult Delete([FromUri] int[] ids)
        {
            contactService.Delete(ids);
            return Ok();
        }

        private bool ContactExists(int id)
        {
            return contactService.Find(id) != null;
        }
    }
}

