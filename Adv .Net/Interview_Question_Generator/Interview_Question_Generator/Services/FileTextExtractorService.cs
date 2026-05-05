using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Drawing;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;

namespace Interview_Question_Generator.Services
{
    public class FileTextExtractorService
    {
        public async Task<string> ExtractText(IFormFile file)
        {
            using var stream = file.OpenReadStream();

            // PDF
            if (file.FileName.EndsWith(".pdf"))
            {
                using var pdf = PdfDocument.Open(stream);
                return string.Join("\n",
                    pdf.GetPages().Select(p => p.Text)
                );
            }

            // PPT / PPTX
            if (file.FileName.EndsWith(".ppt") || file.FileName.EndsWith(".pptx"))
            {
                using var ppt = PresentationDocument.Open(stream, false);

                return string.Join("\n",
                    ppt.PresentationPart!
                       .SlideParts
                       .SelectMany(s => s.Slide.Descendants<Text>())
                       .Select(t => t.Text)
                );
            }

            throw new Exception("Unsupported file type");
        }
    }
}