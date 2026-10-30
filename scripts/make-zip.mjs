import { execSync } from 'child_process';

console.log('Packing project archives (full and light)...');
execSync('python scripts/pack-full.py', { stdio: 'inherit' });
execSync('python scripts/pack-light.py', { stdio: 'inherit' });
console.log('All archives updated successfully.');
