using System;

namespace SiteRCSInformatique.Models
{
    public class ContactMessage
    {
        public int Id { get; set; }
        public string Nom_complet { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Objet { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
