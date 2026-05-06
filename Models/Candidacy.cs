using System;

namespace SiteRCSInformatique.Models
{
    public class Candidacy
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string JobType { get; set; } = string.Empty; // stage or emploi
        public string Poste { get; set; } = string.Empty;
        public string CVPath { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
