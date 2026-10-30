import os
import zipfile
import re

root_dir = r"D:\T3 codes\kkkkkkkk-main"
output_zip = r"D:\T3 codes\kkkkkkkk-main-ai-light.zip"

excluded_dirs = {"node_modules", ".git", ".next"}

# For out directory, we keep:
# - sitemap.xml, robots.txt, ads.txt, sw.js, _headers, manifest.webmanifest
# - all core pages (index, about, contact, pricing, privacy, terms)
# - tools/*.html
# - blog/*.html
# - core indexed SEO pages
# - static js/css bundles
core_seo_slugs = {
    "pdf-to-word", "word-to-pdf", "pdf-to-excel", "excel-to-pdf",
    "pdf-to-powerpoint", "powerpoint-to-pdf", "jpg-to-pdf", "pdf-to-jpg",
    "png-to-pdf", "pdf-to-png", "pdf-to-text", "text-to-pdf",
    "compress-pdf-under-100kb", "compress-pdf-under-200kb", "compress-pdf-under-1mb"
}

def should_include_out_file(rel_out_path):
    # rel_out_path is relative to out/ e.g. "sitemap.xml", "tools/edit-pdf.html", etc.
    p = rel_out_path.replace("\\", "/")
    
    # Exclude internal Next.js RSC payload .txt files
    if p.endswith(".txt") and not p == "robots.txt" and not p == "ads.txt":
        return False
        
    # Always include root config / seo files
    if p in {"sitemap.xml", "sitemap-main.xml", "robots.txt", "ads.txt", "sw.js", "_headers", "manifest.webmanifest", "index.html", "about.html", "contact.html", "pricing.html", "privacy.html", "terms.html", "_not-found.html"}:
        return True
        
    # Include tool pages
    if p.startswith("tools/") or p.startswith("blog/"):
        return True
        
    # Include core seo landing pages (html only)
    stem = os.path.splitext(p)[0]
    if stem in core_seo_slugs:
        return True
        
    # Include static assets (js, css, fonts)
    if p.startswith("_next/static/"):
        return True
        
    return False

file_count = 0
total_uncompressed = 0

with zipfile.ZipFile(output_zip, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if d not in excluded_dirs]
        for f in filenames:
            if f.endswith(".zip"):
                continue
            full_path = os.path.join(dirpath, f)
            rel_to_root = os.path.relpath(full_path, root_dir).replace("\\", "/")
            
            # Check if this file is in out/
            if rel_to_root.startswith("out/"):
                rel_out = rel_to_root[4:]
                if not should_include_out_file(rel_out):
                    continue
            
            arcname = os.path.relpath(full_path, os.path.dirname(root_dir))
            zf.write(full_path, arcname)
            file_count += 1
            total_uncompressed += os.path.getsize(full_path)

zip_size = os.path.getsize(output_zip)
print(f"Files packed: {file_count}")
print(f"Uncompressed: {total_uncompressed / (1024*1024):.2f} MB")
print(f"Compressed zip size: {zip_size / (1024*1024):.2f} MB")
