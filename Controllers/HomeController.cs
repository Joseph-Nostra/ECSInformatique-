using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using SiteRCSInformatique.Models;
using SiteRCSInformatique.Data;
using Microsoft.EntityFrameworkCore;

namespace SiteRCSInformatique.Controllers;

public class HomeController : Controller
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SubmitContact(ContactMessage contactMessage)
    {
        if (ModelState.IsValid)
        {
            try
            {
                contactMessage.CreatedAt = DateTime.Now;
                _context.ContactMessages.Add(contactMessage);
                await _context.SaveChangesAsync();
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        return Json(new { success = false });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SubmitCandidacy(Candidacy candidacy, IFormFile? CV)
    {
        if (ModelState.IsValid)
        {
            try
            {
                if (CV != null && CV.Length > 0)
                {
                    string uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "cvs");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(CV.FileName);
                    string filePath = Path.Combine(uploadsFolder, uniqueFileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await CV.CopyToAsync(fileStream);
                    }

                    candidacy.CVPath = "/uploads/cvs/" + uniqueFileName;
                }

                candidacy.CreatedAt = DateTime.Now;
                _context.Candidacies.Add(candidacy);
                await _context.SaveChangesAsync();
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        return Json(new { success = false });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> SubscribeNewsletter(string email)
    {
        if (!string.IsNullOrEmpty(email))
        {
            try
            {
                var existing = await _context.Newsletters.FirstOrDefaultAsync(n => n.Email == email);
                if (existing != null)
                {
                    return Json(new { success = true, message = "Déjà abonné !" });
                }

                var newsletter = new Newsletter { Email = email, SubscribedAt = DateTime.Now };
                _context.Newsletters.Add(newsletter);
                await _context.SaveChangesAsync();
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        return Json(new { success = false });
    }

    public IActionResult Privacy()
    {
        return View();
    }

    public IActionResult Offers()
    {
        return View();
    }

    public IActionResult Candidature()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
