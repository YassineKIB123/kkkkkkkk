import os
import zipfile
import shutil
import time

start = time.time()
root_dir = r"D:\T3 codes\kkkkkkkk-main"
output_zip = r"D:\T3 codes\kkkkkkkk-main-packed.zip"
default_zip = r"D:\T3 codes\kkkkkkkk-main.zip"

excluded_dirs = {"node_modules", ".git", ".next"}

file_count = 0
total_uncompressed = 0

with zipfile.ZipFile(output_zip, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if d not in excluded_dirs]
        for f in filenames:
            if f.endswith(".zip"):
                continue
            full_path = os.path.join(dirpath, f)
            arcname = os.path.relpath(full_path, os.path.dirname(root_dir))
            zf.write(full_path, arcname)
            file_count += 1
            total_uncompressed += os.path.getsize(full_path)

elapsed = time.time() - start
zip_size = os.path.getsize(output_zip)

# Synchronize to default zip name as well
shutil.copy2(output_zip, default_zip)

print(f"Files packed: {file_count}")
print(f"Uncompressed: {total_uncompressed / (1024*1024):.2f} MB")
print(f"Compressed zip size: {zip_size / (1024*1024):.2f} MB")
print(f"Time taken: {elapsed:.2f} seconds")
print(f"Created: {output_zip} and updated {default_zip}")
